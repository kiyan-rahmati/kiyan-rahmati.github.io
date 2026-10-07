/* ====================================
   PORTFOLIO LOADER
   Kiyan Rahmati
==================================== */

(function () {
    "use strict";


    /* --------------------------------
       Configuration
    -------------------------------- */

    const LOADER_DURATION = 1800;
    const FADE_DURATION = 700;


    /* --------------------------------
       Helpers
    -------------------------------- */

    function getRootPrefix() {
        return window.location.pathname.includes("/pages/")
            ? "../../"
            : "./";
    }


    function getLanguage() {
        const saved =
            localStorage.getItem("kiyan-language");

        return saved === "fa"
            ? "fa"
            : "en";
    }


    /* --------------------------------
       Apply Loader Language
    -------------------------------- */

    function applyLoaderLanguage() {
        const message =
            document.querySelector(
                "#portfolioLoader .loader-message"
            );

        if (!message) {
            return;
        }

        const language =
            getLanguage();

        message.textContent =
            language === "fa"
                ? message.dataset.fa
                : message.dataset.en;

        message.setAttribute(
            "dir",
            language === "fa"
                ? "rtl"
                : "ltr"
        );
    }


    /* --------------------------------
       Hide Loader
    -------------------------------- */

    function hideLoader() {
        const loader =
            document.getElementById(
                "portfolioLoader"
            );

        if (!loader) {
            return;
        }

        loader.classList.add(
            "loader-hide"
        );

        setTimeout(function () {

            if (loader.parentNode) {
                loader.parentNode.removeChild(
                    loader
                );
            }

        }, FADE_DURATION);
    }


    /* --------------------------------
       Load HTML
    -------------------------------- */

    async function loadLoader() {

        const root =
            document.getElementById(
                "loader-root"
            );

        if (!root) {
            return;
        }


        try {

            const prefix =
                getRootPrefix();


            const response =
                await fetch(
                    `${prefix}components/loader/loader.html`
                );


            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status}`
                );
            }


            const html =
                await response.text();


            root.innerHTML =
                html;


            applyLoaderLanguage();


            /*
             * Allow the loader to appear
             * before starting the timer.
             */

            requestAnimationFrame(
                function () {

                    setTimeout(
                        hideLoader,
                        LOADER_DURATION
                    );

                }
            );


        } catch (error) {

            console.error(
                "Loader could not be loaded:",
                error
            );

            /*
             * If the loader fails,
             * don't block the website.
             */

            root.innerHTML = "";
        }
    }


    /* --------------------------------
       Language Changes
    -------------------------------- */

    document.addEventListener(
        "languageChanged",
        function () {
            applyLoaderLanguage();
        }
    );


    /* --------------------------------
       Start
    -------------------------------- */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadLoader
        );

    } else {

        loadLoader();
    }

})();