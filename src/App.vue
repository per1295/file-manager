<template>
    <router-view v-slot="{ Component }">
        <transition
            :name="(route.meta.transitionName as string)"
            mode="out-in"
            :duration="
                route.meta.transitionName === 'file_manager'
                ?
                {
                    enter: 2600,
                    leave: 3350
                }
                :
                {
                    enter: 1000,
                    leave: 1000
                }
            "
        >
            <component :is="Component"/>
        </transition>
    </router-view>
</template>

<script setup lang="ts">
    import { RouterView } from "vue-router";
    import { useRoute } from "vue-router";
    import { watch, onBeforeMount, onMounted } from "vue";
    import useTheme from "../pinia/useTheme";
    import { storeToRefs } from "pinia";
    import { changeTheme } from "../functions";

    const route = useRoute();

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);
    const { initTheme } = themeStore;

    onBeforeMount(initTheme);

    onMounted(() => changeTheme(theme.value));

    watch(theme, (nowTheme) => changeTheme(nowTheme));
</script>

<style lang="scss">
    * {
        box-sizing: border-box;
        user-select: none;
    }

    body {
        margin: 0 auto;
        padding: 0;
    }

    input {
        outline: none;
        padding: 0;
        border: 0;
        margin: 0;
    }

    button {
        border: 0;
        outline: none;
    }

    .cursor-default-light {
        cursor: url("/cursor-default-light.svg"), default !important;
    }

    .cursor-default-dark {
        cursor: url("/cursor-default-dark.svg"), default !important;
    }

    .cursor-pointer-light {
        cursor: url("/cursor-pointer-light.svg"), pointer !important;
    }

    .cursor-pointer-dark {
        cursor: url("/cursor-pointer-dark.svg"), pointer !important;
    }

    .cursor-grabbing-light {
        cursor: url("/cursor-grabbing-light.svg"), grabbing !important;
    }

    .cursor-grabbing-dark {
        cursor: url("/cursor-grabbing-dark.svg"), grabbing !important;
    }

    div.light-theme, header.light-theme, main.light-theme,
    footer.light-theme, section.light-theme, article.light-theme {
        transition: background-color .35s ease;
        background-color: #FFFFFF;
    }

    input.light-theme {
        transition: color .35s ease;
        color: rgba(0, 0, 0, 0.7) !important;
    }

    div.dark-theme, header.dark-theme, main.dark-theme
    footer.dark-theme, section.dark-theme, article.dark-theme {
        transition: background-color .35s ease;
        background-color: #1D1D1D;
    }

    input.dark-theme {
        transition: color .35s ease;
        color: #FFFFFF !important;
    }

    div.dark-theme-section, header.dark-theme-section, main.dark-theme-section,
    footer.dark-theme-section, section.dark-theme-section, article.dark-theme-section {
        transition: background-color .35s ease;
        background-color: #262626;
    }

    h1.light-theme, h2.light-theme, h3.light-theme,
    h4.light-theme, h5.light-theme, p.light-theme,
    span.light-theme, a.light-theme {
        transition: color .35s ease;
        color: #1E1E1E;
    }

    h1.dark-theme, h2.dark-theme, h3.dark-theme,
    h4.dark-theme, h5.dark-theme, p.dark-theme,
    span.dark-theme, a.dark-theme {
        transition: color .35s ease;
        color: #FFFFFF;
    }

    label.light-theme, legend.light-theme {
        transition: color .35s ease;
        color: #695C5C;
    }

    label.dark-theme, legend.dark-theme {
        transition: color .35s ease;
        color: #FFFFFF;
    }

    .file-manager-enter-active .profile, .file-manager-leave-active .profile,
    .file-manager-enter-active .inventory, .file-manager-leave-active .inventory,
    .file-manager-enter-active .file-manager-footer, .file-manager-leave-active .file-manager-footer {
        transition: .5s ease !important;
    }

    .file-manager-enter-active .inventory, .file-manager-leave-active .inventory {
        transition: .5s ease .25s !important;
    }

    .file-manager-enter-active .file-manager-footer, .file-manager-leave-active .profile {
        transition: .5s ease .5s !important;
    }

    .file-manager-enter-from .profile, .file-manager-leave-to .profile {
        opacity: 0;
        transform: translate(-30px, -30px);
    }

    .file-manager-enter-from .inventory, .file-manager-leave-to .inventory {
        opacity: 0;
        transform: translate(30px, -30px);
    }

    .file-manager-enter-from .file-manager-footer, .file-manager-leave-to .file-manager-footer {
        opacity: 0;
        transform: translateY(30px);
    }

    .file-manager-enter-active .file-manager, .file-manager-leave-active .file-manager,
    .file-manager-enter-active .signUp-form, .file-manager-leave-active .signUp-form,
    .file-manager-enter-active .login-form, .file-manager-leave-active .login-form {
        transition: filter .35s ease !important;
    }

    .file-manager-leave-active .file-manager {
        transition: filter .35s ease .75s !important;
    }

    .file-manager-enter-from .file-manager, .file-manager-leave-to .file-manager,
    .file-manager-enter-from .signUp-form, .file-manager-leave-to .signUp-form,
    .file-manager-enter-from .login-form, .file-manager-leave-to .login-form {
        filter: blur(10px) grayscale(50%);
    }

    .base-transition-enter-active, .base-transition-leave-active {
        transition: filter 1s !important;
    }

    .base-transition-enter-from, .base-transition-leave-to {
        filter: blur(10px) grayscale(50%);
    }
</style>