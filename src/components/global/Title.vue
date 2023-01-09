<template>
    <slot
        name="title"
        :className="['custom-title', theme === 'light' ? 'light-theme' : 'dark-theme']"
    ></slot>
    <slot
        name="subtitle"
        :className="['custom-subtitle', theme === 'light' ? 'light-theme' : 'dark-theme']"
    ></slot>
</template>

<script setup lang="ts">
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);
</script>

<style lang="scss">
    .custom-title {
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        text-align: center;
        color: #000000;

        @media screen and (max-width: 425px) {
            max-width: 80%;
            text-align: center;
        }
    }

    .custom-subtitle {
        margin-top: 7px;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 19px;
        color: #343434;

        @media screen and (max-width: 425px) {
            max-width: 80%;
            text-align: center;
        }
    }
</style>