(function () {
    "use strict";


    /* =====================================================
       HELPERS
    ===================================================== */

    function getLanguage() {
        return window.KiyanLanguage
            ? window.KiyanLanguage.get()
            : (localStorage.getItem("kiyan-language") || "en");
    }


    function getRootPrefix() {
        return window.location.pathname.includes("/pages/")
            ? "../../"
            : "./";
    }


    function escapeHTML(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getCurrentPath() {
        return window.location.pathname
            .toLowerCase();
    }


    /* =====================================================
       PROJECTS PAGE
    ===================================================== */

    let projectSearchQuery = "";
    let projectSortType = "updated";


    function initProjectsPage() {

        const grid =
            document.querySelector("#projectsGrid");

        if (!grid) {
            return;
        }


        const searchInput =
            document.querySelector("#projectSearch");

        const sortSelect =
            document.querySelector("#projectSort");


        if (searchInput) {

            searchInput.addEventListener(
                "input",
                function () {

                    projectSearchQuery =
                        this.value.trim();

                    renderProjects();

                }
            );

        }


        if (sortSelect) {

            sortSelect.addEventListener(
                "change",
                function () {

                    projectSortType =
                        this.value;

                    renderProjects();

                }
            );

        }


        document.addEventListener(
            "githubLoaded",
            function () {

                renderProjects();

            }
        );


        document.addEventListener(
            "githubError",
            function () {

                showProjectError();

            }
        );


        /*
         * github.js may already have loaded before
         * pages.js initializes, so check immediately.
         */

        if (
            window.KiyanGitHub &&
            window.KiyanGitHub.get().length
        ) {

            renderProjects();

        }

    }


    function renderProjects() {

        const grid =
            document.querySelector("#projectsGrid");


        if (
            !grid ||
            !window.KiyanGitHub
        ) {
            return;
        }


        let repositories =
            window.KiyanGitHub.get();


        if (!repositories.length) {

            grid.innerHTML = `
                <div class="loading">
                    ${
                        getLanguage() === "fa"
                            ? "در حال دریافت پروژه‌ها..."
                            : "Loading projects..."
                    }
                </div>
            `;

            return;
        }


        /*
         * Search
         */

        if (projectSearchQuery) {

            repositories =
                window.KiyanGitHub.search(
                    projectSearchQuery
                );

        }


        /*
         * Sort
         */

        repositories =
            [...repositories].sort(
                function (a, b) {

                    switch (projectSortType) {

                        case "stars":
                            return (
                                (b.stars || 0) -
                                (a.stars || 0)
                            );


                        case "name":
                            return a.name.localeCompare(
                                b.name
                            );


                        case "created":
                            return (
                                new Date(b.createdAt) -
                                new Date(a.createdAt)
                            );


                        case "updated":
                        default:
                            return (
                                new Date(b.updatedAt) -
                                new Date(a.updatedAt)
                            );

                    }

                }
            );


        if (!repositories.length) {

            grid.innerHTML = `
                <div class="empty-state">

                    <strong>
                        ${
                            getLanguage() === "fa"
                                ? "پروژه‌ای پیدا نشد."
                                : "No projects found."
                        }
                    </strong>

                </div>
            `;

            return;
        }


        /*
         * github.js already contains the main
         * project-card renderer.
         */

        window.KiyanGitHub.renderAll(
            repositories
        );

    }


    function showProjectError() {

        const grid =
            document.querySelector("#projectsGrid");

        if (!grid) {
            return;
        }


        grid.innerHTML = `
            <div class="empty-state">

                <strong>
                    ${
                        getLanguage() === "fa"
                            ? "دریافت پروژه‌ها از GitHub با مشکل مواجه شد."
                            : "Could not load projects from GitHub."
                    }
                </strong>

                <p>
                    ${
                        getLanguage() === "fa"
                            ? "لطفاً صفحه را دوباره باز کنید."
                            : "Please try refreshing the page."
                    }
                </p>

            </div>
        `;

    }


    /* =====================================================
       ARTICLES
    ===================================================== */

    let articlesData = [];


    async function loadArticles() {

        try {

            const response =
                await fetch(
                    `${getRootPrefix()}data/articles.json`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "Failed to load articles"
                );
            }


            articlesData =
                await response.json();


            renderArticles();

            renderArticlePreview();

        } catch (error) {

            console.error(
                "Articles loading error:",
                error
            );


            showArticlesError();

        }

    }


    function renderArticles() {

        const grid =
            document.querySelector("#articlesGrid");

        if (!grid) {
            return;
        }


        if (!articlesData.length) {

            grid.innerHTML = `
                <div class="empty-state">

                    <strong>
                        ${
                            getLanguage() === "fa"
                                ? "هنوز مقاله‌ای منتشر نشده است."
                                : "No articles published yet."
                        }
                    </strong>

                </div>
            `;

            return;
        }


        const lang =
            getLanguage();


        grid.innerHTML =
            articlesData
                .map(function (article) {

                    const title =
                        lang === "fa"
                            ? article.title_fa
                            : article.title_en;

                    const excerpt =
                        lang === "fa"
                            ? article.excerpt_fa
                            : article.excerpt_en;

                    const readText =
                        lang === "fa"
                            ? "ادامه مطلب ←"
                            : "Read article →";


                    return `
                        <article class="article-card">

                            <div class="article-date">
                                ${escapeHTML(
                                    formatDate(article.date)
                                )}
                            </div>

                            <h3>
                                ${escapeHTML(title)}
                            </h3>

                            <p>
                                ${escapeHTML(excerpt)}
                            </p>

                            <a
                                class="article-read"
                                href="${escapeHTML(
                                    article.url || "#"
                                )}"
                            >
                                ${readText}
                            </a>

                        </article>
                    `;

                })
                .join("");

    }


    function renderArticlePreview() {

        const container =
            document.querySelector(
                "#articlePreview"
            );

        if (!container) {
            return;
        }


        const lang =
            getLanguage();


        const preview =
            articlesData.slice(0, 3);


        if (!preview.length) {

            container.innerHTML = `
                <div class="empty-state">
                    ${
                        lang === "fa"
                            ? "مقاله‌ای برای نمایش وجود ندارد."
                            : "No articles to display."
                    }
                </div>
            `;

            return;
        }


        container.innerHTML =
            preview
                .map(function (article) {

                    const title =
                        lang === "fa"
                            ? article.title_fa
                            : article.title_en;

                    const excerpt =
                        lang === "fa"
                            ? article.excerpt_fa
                            : article.excerpt_en;


                    return `
                        <article class="article-card">

                            <div class="article-date">
                                ${escapeHTML(
                                    formatDate(article.date)
                                )}
                            </div>

                            <h3>
                                ${escapeHTML(title)}
                            </h3>

                            <p>
                                ${escapeHTML(excerpt)}
                            </p>

                            <a
                                class="article-read"
                                href="${escapeHTML(
                                    article.url || "#"
                                )}"
                            >
                                ${
                                    lang === "fa"
                                        ? "ادامه مطلب ←"
                                        : "Read article →"
                                }
                            </a>

                        </article>
                    `;

                })
                .join("");

    }


    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(dateString);


        if (Number.isNaN(date.getTime())) {
            return dateString;
        }


        const lang =
            getLanguage();


        if (lang === "fa") {

            return new Intl.DateTimeFormat(
                "fa-IR",
                {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                }
            ).format(date);

        }


        return new Intl.DateTimeFormat(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        ).format(date);

    }


    function showArticlesError() {

        const grid =
            document.querySelector(
                "#articlesGrid"
            );

        if (!grid) {
            return;
        }


        grid.innerHTML = `
            <div class="empty-state">

                <strong>
                    ${
                        getLanguage() === "fa"
                            ? "مقالات بارگذاری نشدند."
                            : "Articles could not be loaded."
                    }
                </strong>

            </div>
        `;

    }


    /* =====================================================
       LANGUAGE CHANGE
    ===================================================== */

    document.addEventListener(
        "languageChanged",
        function () {

            renderArticles();

            renderArticlePreview();

            renderProjects();

        }
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.KiyanPages = {

        loadArticles,

        renderArticles,

        renderArticlePreview,

        renderProjects,

        getArticles: function () {
            return articlesData;
        }

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            const path =
                getCurrentPath();


            /*
             * Projects
             */

            if (
                path.includes("/pages/projects/")
            ) {

                initProjectsPage();

            }


            /*
             * Articles
             */

            if (
                path.includes("/pages/articles/") ||
                document.querySelector("#articlePreview")
            ) {

                loadArticles();

            }

        }
    );

})();