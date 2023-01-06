import { defineStore } from "pinia";
import { ref } from "vue";
import type { Theme } from "../data-types";

export default defineStore("theme", () => {
    const theme = ref<Theme>("light");

    const setLightTheme = () => {
        localStorage.setItem("theme", "light");
        theme.value = "light";
    }

    const setDarkTheme = () => {
        localStorage.setItem("theme", "dark");
        theme.value = "dark";
    }

    const initTheme = () => {
        const localStorageTheme = localStorage.getItem("theme") as Theme;

        if ( localStorageTheme ) {
            theme.value = localStorageTheme
        }
    }

    return {
        theme,
        setLightTheme,
        setDarkTheme,
        initTheme
    }
});