<template>
    <span class="form-bottom">
        <slot
            name="main"
            :className="['form-bottom-main', theme === 'light' ? 'light-theme' : 'dark-theme']"
        ></slot>
        <slot
            name="link"
            :className="['form-bottom-link', theme === 'light' ? 'cursor-pointer-light' : 'cursor-pointer-dark']"
            data-cursor="pointer"
        ></slot>
    </span>
</template>

<script setup lang="ts">
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);
</script>

<style lang="scss">
    .form-bottom {
        margin-top: 35px;

        @media screen and (max-width: 425px) {
            text-align: center;
            max-width: 80%;
        }

        .form-bottom-main {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
        }

        .form-bottom-link {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            text-decoration-line: underline;
            color: #2F89FC;
            margin-left: 10px;
        }
    }
</style>