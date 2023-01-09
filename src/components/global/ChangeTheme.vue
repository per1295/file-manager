<template>
    <div
        class="change-theme"
        :class="theme === 'light' ? [ 'cursor-pointer-light' ] : [ 'cursor-pointer-dark' ]"
        data-cursor="pointer"
        @click="click"
    >
        <transition :name="theme === 'light' ? 'theme-light' : 'theme-dark'" mode="out-in">
            <component :is="theme === 'light' ? ChangeThemeLightVue : ChangeThemeDarkVue" data-cursor="pointer"/>
        </transition>
    </div>
</template>

<script setup lang="ts">
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    import ChangeThemeLightVue from './ChangeThemeLight.vue';
    import ChangeThemeDarkVue from './ChangeThemeDark.vue';

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);
    const { setLightTheme, setDarkTheme } = themeStore;

    const click = () => theme.value === "light" ? setDarkTheme() : setLightTheme();
</script>

<style lang="scss">
    .change-theme {
        position: fixed;
        bottom: 20px;
        right: 0;
        border-top: 1px solid #4D4D4D;
        border-left: 1px solid #4D4D4D;
        border-bottom: 1px solid #4D4D4D;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
        z-index: 9999;
        overflow-x: hidden;

        @media screen and (max-width: 425px) {
            top: 20px;
            left: 0;
            right: auto;
            bottom: auto;
            max-width: 100px;
            max-height: 100px;
            width: 20vw;
            height: 20vw;
            border-left: none;
            border-right: 1px solid #4D4D4D;
            border-top-left-radius: unset;
            border-bottom-left-radius: unset;
            border-top-right-radius: 12px;
            border-bottom-right-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            > img {
                height: 100%;
                width: 100%;
            }
        }
    }

    .theme-light-enter-active, .theme-light-leave-active,
    .theme-dark-enter-active, .theme-dark-leave-active {
        transition: all .35s ease;
    }

    .theme-light-leave-to, .theme-dark-enter-from {
        transform: translateX(-20px);
        opacity: 0;
    }

    .theme-light-enter-from, .theme-dark-leave-to {
        transform: translateX(20px);
        opacity: 0;
    }
</style>