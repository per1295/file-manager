<template>
    <transition name="description">
        <span
            v-if="isNotificationFullOpen"
            class="notification-description"
            :class="theme === 'light' ? [ 'light-theme' ] : [ 'dark-theme' ]"
        >
            {{ description }}
        </span>
    </transition>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    defineProps({
        isNotificationFullOpen: {
            type: Boolean as PropType<boolean>,
            required: true
        },
        description: {
            type: String as PropType<string>,
            required: true
        }
    });
</script>

<style lang="scss">
    .notification-description {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
    }

    .description-enter-active, .description-leave-active {
        transition: all .35s ease !important;
    }

    .description-enter-from, .description-leave-to {
        transform: translateX(-10px);
        opacity: 0;
    }
</style>