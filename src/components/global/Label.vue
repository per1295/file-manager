<template>
    <label
        :for="htmlFor"
        class="custom-label"
        :class="[className, theme === 'light' ? 'cursor-default-light' : 'cursor-default-dark']"
    >
        <slot></slot>
    </label>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    defineProps({
        htmlFor: {
            type: String as PropType<string>,
            required: true
        },
        className: {
            type: String as PropType<string>
        }
    });
</script>

<style lang="scss">
    .custom-label {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        text-align: center;
        color: #695C5C;
    }
</style>