<template>
    <footer class="file-manager-footer" data-dark-theme="section">
        <router-link
            :to="{ name: 'sign_up' }"
            data-cursor="pointer"
            class="footer-link"
            :class="[ theme === 'light' ? [ 'light-theme', 'cursor-pointer-light' ] : [ 'dark-theme', 'cursor-pointer-dark' ] ]"
            @pointerenter="overElement($event, 'footer-link-active')"
            @pointerleave="overElement($event, 'footer-link-active')"
        >
            Sign up
        </router-link>
        <router-link
            :to="{ name: 'login' }"
            data-cursor="pointer"
            class="footer-link"
            :class="theme === 'light' ? [ 'light-theme', 'cursor-pointer-light' ] : [ 'dark-theme', 'cursor-pointer-dark' ]"
            @pointerenter="overElement($event, 'footer-link-active')"
            @pointerleave="overElement($event, 'footer-link-active')"
        >
            Login
        </router-link>
    </footer>
</template>

<script setup lang="ts">
    import { overElement } from '../../functions';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);
</script>

<style lang="scss">
    .file-manager-footer {
        width: calc(90%);
        height: 72px;
        border: 1px solid #4D4D4D;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: space-evenly;

        .footer-link {
            font-family: 'Poppins';
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 36px;
            text-align: center;
            text-decoration: none;
            transition: color .25s ease-out;
        }

        .footer-link-active {
            color: #1877F2;
        }
    }
</style>