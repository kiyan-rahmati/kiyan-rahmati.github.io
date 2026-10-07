/* ====================================
   SEARCH SYSTEM
   Kiyan Rahmati Portfolio
==================================== */

(function () {
    "use strict";


    /* --------------------------------
       Elements
    -------------------------------- */

    let overlay = null;
    let input = null;
    let results = null;
    let closeButton = null;


    /* --------------------------------
       Detect Root Path
    -------------------------------- */

    function getRootPrefix() {
        const path =
            window.location.pathname;

        if (
            path.includes("/pages/")
        ) {
            return "../../";
        }

        return "./";
    }


    /* --------------------------------
       Search Data
    -------------------------------- */

    const searchItems = [
        {
            title: "Home",
            fa: "خانه",
            en: "Home",
            url: ""
        },
        {
            title: "Projects",
            fa: "پروژه‌ها",
            en: "Projects",
            url: "pages/projects/"
        },
        {
            title: "Articles",
            fa: "مقالات",
            en: "Articles",
            url: "pages/articles/"
        },
        {
            title: "About",
            fa: "درباره من",
            en: "About",
            url: "pages/about/"
        },
        {
            title: "Contact",
            fa: "ارتباط با من",
            en: "Contact",
            url: "pages/contact/"
        },
        {
            title: "HTML5",
            fa: "HTML5",
            en: "HTML5",
            url: "pages/projects/"
        },
        {
            title: "CSS3",
            fa: "CSS3",
            en: "CSS3",
            url: "pages/projects/"
        },
        {
            title: "JavaScript",
            fa: "جاوااسکریپت",
            en: "JavaScript",
            url: "pages/projects/"
        },
        {
            title: "Vue.js",
            fa: "ویو جی‌اس",
            en: "Vue.js",
            url: "pages/projects/"
        },
        {
            title: "React",
            fa: "ری‌اکت",
            en: "React",
            url: "pages/projects/"
        },
        {
            title: "PHP",
            fa: "پی‌اچ‌پی",
            en: "PHP",
            url: "pages/projects/"
        },
        {
            title: "Laravel",
            fa: "لاراول",
            en: "Laravel",
            url: "pages/projects/"
        },
        {
            title: "SQL",
            fa: "اس‌کیو‌ال",
            en: "SQL",
            url: "pages/projects/"
        },
        {
            title: "MySQL",
            fa: "مای‌اس‌کیو‌ال",
            en: "MySQL",
            url: "pages/projects/"
        }
    ];


    /* --------------------------------
       Escape HTML
    -------------------------------- */

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /* --------------------------------
       Get Search Language
    -------------------------------- */

    function getCurrentLanguage() {

        return (
            window.KiyanLanguage &&
            window.KiyanLanguage.get()
        ) || "en";
    }


    /* --------------------------------
       Search
    -------------------------------- */

    function performSearch(query) {

        if (!results) {
            return;
        }

        const language =
            getCurrentLanguage();

        const cleanQuery =
            query.trim().toLowerCase();


        /* Empty Search */

        if (!cleanQuery) {

            results.innerHTML = `
                <div class="empty-state">
                    ${
                        language === "fa"
                            ? "برای جستجو چیزی بنویسید."
                            : "Start typing to search."
                    }
                </div>
            `;

            return;
        }


        /* Find Results */

        const matches =
            searchItems.filter((item) => {

                const title =
                    language === "fa"
                        ? item.fa
                        : item.en;

                return (
                    title
                        .toLowerCase()
                        .includes(cleanQuery)
                    ||
                    item.en
                        .toLowerCase()
                        .includes(cleanQuery)
                    ||
                    item.fa
                        .toLowerCase()
                        .includes(cleanQuery)
                );
            });


        /* No Results */

        if (!matches.length) {

            results.innerHTML = `
                <div class="empty-state">
                    ${
                        language === "fa"
                            ? `نتیجه‌ای برای «${escapeHTML(query)}» پیدا نشد.`
                            : `No results found for "${escapeHTML(query)}".`
                    }
                </div>
            `;

            return;
        }


        /* Render Results */

        results.innerHTML =
            matches
                .slice(0, 8)
                .map((item) => {

                    const title =
                        language === "fa"
                            ? item.fa
                            : item.en;

                    const prefix =
                        getRootPrefix();

                    return `
                        <a
                            class="search-result"
                            href="${prefix}${item.url}"
                        >
                            <span class="search-result-icon">
                                →
                            </span>

                            <span>
                                ${escapeHTML(title)}
                            </span>
                        </a>
                    `;
                })
                .join("");
    }


    /* --------------------------------
       Open Search
    -------------------------------- */

    function openSearch() {

        if (!overlay) {
            return;
        }

        overlay.classList.add("open");

        document.body.classList.add(
            "no-scroll"
        );

        setTimeout(() => {

            if (input) {
                input.focus();
                input.select();
            }

        }, 50);

        performSearch("");
    }


    /* --------------------------------
       Close Search
    -------------------------------- */

    function closeSearch() {

        if (!overlay) {
            return;
        }

        overlay.classList.remove(
            "open"
        );

        document.body.classList.remove(
            "no-scroll"
        );

        if (input) {
            input.value = "";
        }
    }


    /* --------------------------------
       Create Search Result Style
    -------------------------------- */

    function injectStyles() {

        if (
            document.getElementById(
                "search-result-styles"
            )
        ) {
            return;
        }

        const style =
            document.createElement("style");

        style.id =
            "search-result-styles";

        style.textContent = `
            .search-results {
                display: flex;
                flex-direction: column;
                gap: 7px;
                margin-top: 15px;
            }

            .search-result {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 13px 14px;
                color: var(--text-secondary);
                background: var(--surface-2);
                border: 1px solid var(--border);
                border-radius: var(--radius-md);
                transition:
                    color .2s ease,
                    border-color .2s ease,
                    transform .2s ease;
            }

            .search-result:hover {
                color: var(--text);
                border-color: var(--purple);
                transform: translateX(3px);
            }

            .search-result-icon {
                width: 30px;
                height: 30px;
                display: grid;
                place-items: center;
                flex-shrink: 0;
                color: var(--purple-light);
                background: var(--surface);
                border-radius: 8px;
                font-family: var(--font-mono);
            }
        `;

        document.head.appendChild(style);
    }


    /* --------------------------------
       Find Elements
    -------------------------------- */

    function findElements() {

        overlay =
            document.getElementById(
                "searchOverlay"
            );

        if (!overlay) {
            return false;
        }

        input =
            overlay.querySelector(
                ".search-input"
            );

        results =
            overlay.querySelector(
                ".search-results"
            );

        closeButton =
            overlay.querySelector(
                "[data-search-close]"
            );

        return true;
    }


    /* --------------------------------
       Keyboard Shortcuts
    -------------------------------- */

    function setupKeyboard() {

        document.addEventListener(
            "keydown",
            function (event) {

                /* Ctrl + K / Cmd + K */

                if (
                    (event.ctrlKey ||
                        event.metaKey) &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    openSearch();

                    return;
                }


                /* Escape */

                if (
                    event.key === "Escape" &&
                    overlay &&
                    overlay.classList.contains(
                        "open"
                    )
                ) {

                    closeSearch();
                }
            }
        );
    }


    /* --------------------------------
       Events
    -------------------------------- */

    function setupEvents() {

        document.addEventListener(
            "click",
            function (event) {

                /* Open button */

                const openButton =
                    event.target.closest(
                        "[data-search-open]"
                    );

                if (openButton) {
                    openSearch();
                    return;
                }


                /* Close button */

                const close =
                    event.target.closest(
                        "[data-search-close]"
                    );

                if (close) {
                    closeSearch();
                    return;
                }


                /* Click outside */

                if (
                    event.target === overlay
                ) {
                    closeSearch();
                }
            }
        );


        /* Search input */

        if (input) {

            input.addEventListener(
                "input",
                function () {

                    performSearch(
                        input.value
                    );
                }
            );
        }


        /* Language changed */

        document.addEventListener(
            "languageChanged",
            function () {

                if (
                    overlay &&
                    overlay.classList.contains(
                        "open"
                    )
                ) {

                    performSearch(
                        input
                            ? input.value
                            : ""
                    );
                }
            }
        );
    }


    /* --------------------------------
       Initialize
    -------------------------------- */

    function initSearch() {

        if (!findElements()) {
            return;
        }

        injectStyles();

        setupKeyboard();

        setupEvents();
    }


    /* --------------------------------
       Public API
    -------------------------------- */

    window.KiyanSearch = {
        open: openSearch,
        close: closeSearch,
        search: performSearch
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
            initSearch
        );

    } else {

        initSearch();
    }

})();