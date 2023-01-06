<template>
    <button
        type="submit"
        class="custom-button"
        :class="[className, theme === 'light' ? 'cursor-pointer-light' : 'cursor-pointer-dark']"
        @pointerenter="overElement($event, 'custom-button-active')"
        @pointerleave="overElement($event, 'custom-button-active')"
        data-cursor="pointer"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import { overElement } from '../../functions';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    defineProps({
        className: {
            type: String as PropType<string>
        }
    });

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);
</script>

<style lang="scss">
    .custom-button {
        width: 312px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0E64D2;
        border-radius: 5px;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: rgba(255, 255, 255, 0.9);
        transition: background-color .25s ease-in-out;
    }

    .custom-button-active {
        background-color: #1877F2;
    }
</style>