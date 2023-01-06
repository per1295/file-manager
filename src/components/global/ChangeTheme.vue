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