/* ====================================
   LANGUAGE SYSTEM
   Kiyan Rahmati Portfolio
==================================== */

(function () {
    "use strict";

    const STORAGE_KEY = "kiyan-language";

    const DEFAULT_LANGUAGE = "en";


    /* --------------------------------
       Get Current Language
    -------------------------------- */

    function getLanguage() {
        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (
            saved === "fa" ||
            saved === "en"
        ) {
            return saved;
        }

        return DEFAULT_LANGUAGE;
    }


    /* --------------------------------
       Apply Language
    -------------------------------- */

    function applyLanguage(language) {

        if (
            language !== "fa" &&
            language !== "en"
        ) {
            language = DEFAULT_LANGUAGE;
        }

        const html =
            document.documentElement;

        const isPersian =
            language === "fa";


        /* Direction */

        html.lang = language;

        html.dir =
            isPersian
                ? "rtl"
                : "ltr";


        /* Language Attribute */

        html.dataset.language =
            language;


        /* --------------------------------
           Translate Text Elements
        -------------------------------- */

        document
            .querySelectorAll(
                "[data-fa][data-en]"
            )
            .forEach((element) => {

                const value =
                    isPersian
                        ? element.dataset.fa
                        : element.dataset.en;

                if (
                    value === undefined
                ) {
                    return;
                }

                element.textContent =
                    value;
            });


        /* --------------------------------
           Translate Placeholders
        -------------------------------- */

        document
            .querySelectorAll(
                "[data-placeholder-fa][data-placeholder-en]"
            )
            .forEach((element) => {

                const placeholder =
                    isPersian
                        ? element.dataset
                            .placeholderFa
                        : element.dataset
                            .placeholderEn;

                element.placeholder =
                    placeholder;
            });


        /* --------------------------------
           Translate HTML Content
        -------------------------------- */

        document
            .querySelectorAll(
                "[data-html-fa][data-html-en]"
            )
            .forEach((element) => {

                const value =
                    isPersian
                        ? element.dataset.htmlFa
                        : element.dataset.htmlEn;

                element.innerHTML =
                    value;
            });


        /* --------------------------------
           Update Language Buttons
        -------------------------------- */

        document
            .querySelectorAll(
                "[data-language-toggle]"
            )
            .forEach((button) => {

                button.textContent =
                    isPersian
                        ? "EN"
                        : "FA";

                button.setAttribute(
                    "aria-label",
                    isPersian
                        ? "Switch to English"
                        : "تغییر زبان به فارسی"
                );

                button.setAttribute(
                    "title",
                    isPersian
                        ? "Switch to English"
                        : "تغییر زبان به فارسی"
                );
            });


        /* --------------------------------
           Dispatch Event
        -------------------------------- */

        document.dispatchEvent(
            new CustomEvent(
                "languageChanged",
                {
                    detail: {
                        language
                    }
                }
            )
        );
    }


    /* --------------------------------
       Set Language
    -------------------------------- */

    function setLanguage(language) {

        if (
            language !== "fa" &&
            language !== "en"
        ) {
            return;
        }

        localStorage.setItem(
            STORAGE_KEY,
            language
        );

        applyLanguage(language);
    }


    /* --------------------------------
       Toggle Language
    -------------------------------- */

    function toggleLanguage() {

        const current =
            getLanguage();

        const next =
            current === "fa"
                ? "en"
                : "fa";

        setLanguage(next);
    }


    /* --------------------------------
       Dynamic Content Support
    -------------------------------- */

    function refreshLanguage() {

        applyLanguage(
            getLanguage()
        );
    }


    /* --------------------------------
       Initialize
    -------------------------------- */

    function initLanguage() {

        /* Apply saved language */

        applyLanguage(
            getLanguage()
        );


        /* Language button */

        document.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        "[data-language-toggle]"
                    );

                if (!button) {
                    return;
                }

                toggleLanguage();
            }
        );
    }


    /* --------------------------------
       Public API
    -------------------------------- */

    window.KiyanLanguage = {

        get: getLanguage,

        set: setLanguage,

        toggle: toggleLanguage,

        refresh: refreshLanguage
    };


    /* --------------------------------
       Start
    -------------------------------- */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initLanguage
        );

    } else {

        initLanguage();
    }

})();