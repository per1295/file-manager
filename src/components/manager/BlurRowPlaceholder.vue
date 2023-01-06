<template>
    <transition name="blur-placeholder" mode="out-in">
        <span
            v-if="watchProp" 
            class="blur-blaceholder-data"
            :class="theme === 'light' ? [ 'light-theme', 'cursor-default-light' ] : [ 'dark-theme', 'cursor-default-dark' ]"
        >
            {{ watchProp }}
        </span>
        <div
            v-else-if="typeof watchProp === 'undefined' ? !watchId : !watchProp"
            ref="blur"
            class="blur-row"
            data-theme="ignore"
            :style="{ width, height }"
        >
        </div>
    </transition>
</template>

<script setup lang="ts">
    import { PropType, onMounted, onBeforeUnmount, ref } from 'vue';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const timeout = ref<NodeJS.Timeout>();
    const percent = ref(0);
    const isToRight = ref(true);
    const blur = ref<HTMLDivElement>();

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    defineProps({
        width: {
            type: String as PropType<string>,
            required: true
        },
        height: {
            type: String as PropType<string>,
            required: true
        },
        watchProp: {
            type: String as PropType<string>
        },
        watchId: {
            type: String as PropType<string>,
            required: true
        }
    });

    onMounted(() => {
        const blurElem = blur.value;

        function change() {
            if ( blurElem ) {
                if ( percent.value >= 100 ) isToRight.value = false;
                else if ( percent.value <= 0 ) isToRight.value = true;

                if ( isToRight.value ) {
                    percent.value++;
                } else {
                    percent.value--;
                }

                blurElem.style.backgroundImage = `
                    linear-gradient(90deg, #3C3C3C 0%, #444444 ${percent.value}%, #333333 100%) 
                `;

                timeout.value = setTimeout(requestAnimationFrame, 50, change);
            }
        }

        timeout.value = setTimeout(requestAnimationFrame, 50, change);
    });

    onBeforeUnmount(() => {
        clearTimeout(timeout.value);
    });
</script>

<style lang="scss">
    .blur-row {
        background-image: linear-gradient(90deg, #3C3C3C 0%, #444444 51.04%, #333333 100%);
        border-radius: 8px;
    }

    .blur-placeholder-enter-active, .blur-placeholder-leave-active {
        transition: all .35s;
    }

    .blur-placeholder-enter-from, .blur-placeholder-leave-to {
        opacity: 0;
        filter: blur(10px);
    }

    .blur-blaceholder-data {
        max-width: 100%;
        overflow-x: hidden;
        text-overflow: ellipsis;
        text-align: center;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
    }
</style>