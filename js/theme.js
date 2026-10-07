/* ====================================
   THEME SYSTEM
   Kiyan Rahmati Portfolio
==================================== */

(function () {
    "use strict";

    const STORAGE_KEY = "kiyan-theme";

    /* --------------------------------
       Get Saved Theme
    -------------------------------- */

    function getSavedTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);

        if (savedTheme === "light" || savedTheme === "dark") {
            return savedTheme;
        }

        /* Use system preference */

        if (
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: light)"
            ).matches
        ) {
            return "light";
        }

        return "dark";
    }


    /* --------------------------------
       Apply Theme
    -------------------------------- */

    function applyTheme(theme) {
        const isLight = theme === "light";

        document.body.classList.toggle(
            "light",
            isLight
        );

        document.documentElement.dataset.theme =
            theme;

        updateThemeButtons(isLight);
    }


    /* --------------------------------
       Update Theme Buttons
    -------------------------------- */

    function updateThemeButtons(isLight) {
        const buttons =
            document.querySelectorAll(
                "[data-theme-toggle]"
            );

        buttons.forEach((button) => {

            const icon =
                button.querySelector(
                    "[data-theme-icon]"
                );

            const text =
                button.querySelector(
                    "[data-theme-text]"
                );

            if (icon) {
                icon.textContent =
                    isLight ? "☀" : "☾";
            }

            if (text) {
                text.textContent =
                    isLight
                        ? "Light"
                        : "Dark";
            }

            button.setAttribute(
                "aria-label",
                isLight
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );

            button.setAttribute(
                "title",
                isLight
                    ? "Switch to dark mode"
                    : "Switch to light mode"
            );
        });
    }


    /* --------------------------------
       Toggle Theme
    -------------------------------- */

    function toggleTheme() {
        const isLight =
            document.body.classList.contains(
                "light"
            );

        const nextTheme =
            isLight
                ? "dark"
                : "light";

        localStorage.setItem(
            STORAGE_KEY,
            nextTheme
        );

        applyTheme(nextTheme);
    }


    /* --------------------------------
       Initialize
    -------------------------------- */

    function initTheme() {

        const theme =
            getSavedTheme();

        applyTheme(theme);

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-theme-toggle]"
                    );

                if (!button) {
                    return;
                }

                toggleTheme();
            }
        );
    }


    /* --------------------------------
       Public API
    -------------------------------- */

    window.KiyanTheme = {
        get: getSavedTheme,
        set: function (theme) {

            if (
                theme !== "light" &&
                theme !== "dark"
            ) {
                return;
            }

            localStorage.setItem(
                STORAGE_KEY,
                theme
            );

            applyTheme(theme);
        },

        toggle: toggleTheme
    };


    /* --------------------------------
       Start
    -------------------------------- */

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initTheme
        );
    } else {
        initTheme();
    }

})();