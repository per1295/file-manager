import type { Theme, Cursor, DarkTheme } from "./data-types";

export function getRandomId(countOfSymbols: number) {
    const mul = +[ 1, ...Array.from({ length: countOfSymbols }).map(() => 0) ].join("");
    return +(Math.random() * mul).toFixed();
}

export function getDateTime(dateValue?: number | string) {
    const date = dateValue ? new Date(dateValue) : new Date();

    const year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    second = date.getSeconds();

    return `${year}-${month}-${day} ${hours}:${minutes}:${second}`;
}

export function changeTheme(nowTheme: Theme) {
    const allElems = document.querySelectorAll("*");
    
    allElems.forEach(elem => {
        if ( elem instanceof HTMLElement ) {
            const cursor = elem.dataset.cursor as Cursor;
            const darkTheme = elem.dataset.darkTheme as DarkTheme;
            const isIgnored = elem.dataset.theme === "ignore";

            switch(nowTheme) {
                case "light":
                    if ( !isIgnored && !elem.classList.contains("light-theme") ) {
                        elem.classList.remove(darkTheme === "section" ? "dark-theme-section" : "dark-theme")
                        elem.classList.add("light-theme");

                        switch(cursor) {
                            case "pointer":
                                elem.classList.remove("cursor-pointer-dark");
                                elem.classList.add("cursor-pointer-light");
                                break;
                            case "grabbing":
                                elem.classList.remove("cursor-grabbing-dark");
                                elem.classList.add("cursor-grabbing-light");
                                break;
                            default:
                                elem.classList.remove("cursor-default-dark");
                                elem.classList.add("cursor-default-light");
                                break;
                        }
                    }
                    break;
                case "dark":
                    if (
                        !isIgnored
                        &&
                        !elem.classList.contains(darkTheme === "section" ? "dark-theme-section" : "dark-theme")
                    ) {
                        elem.classList.remove("light-theme")
                        elem.classList.add(darkTheme === "section" ? "dark-theme-section" : "dark-theme");

                        switch(cursor) {
                            case "pointer":
                                elem.classList.remove("cursor-pointer-light");
                                elem.classList.add("cursor-pointer-dark");
                                break;
                            case "grabbing":
                                elem.classList.remove("cursor-grabbing-light");
                                elem.classList.add("cursor-grabbing-dark");
                                break;
                            default:
                                elem.classList.remove("cursor-default-light");
                                elem.classList.add("cursor-default-dark");
                                break;
                        }
                    }
                    break;
            }
        }
    });
}