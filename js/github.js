(() => {
    "use strict";

    const GITHUB_USERNAME = "kiyan-rahmati";
    const GITHUB_API =
        `https://api.github.com/users/${GITHUB_USERNAME}/repos`;

    const PROFILE_REPO = "kiyan-rahmati.github.io";

    let repositories = [];
    let isLoading = false;
    let hasLoaded = false;


    /* =========================
       HELPERS
    ========================== */

    function escapeHTML(value = "") {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getLanguage() {
        return (
            document.documentElement.dataset.language ||
            localStorage.getItem("kiyan-language") ||
            "en"
        );
    }


    function t(en, fa) {
        return getLanguage() === "fa" ? fa : en;
    }


    function formatDate(date) {
        if (!date) return "";

        const locale =
            getLanguage() === "fa" ? "fa-IR" : "en-US";

        return new Intl.DateTimeFormat(locale, {
            year: "numeric",
            month: "short",
            day: "numeric"
        }).format(new Date(date));
    }


    /* =========================
       FETCH GITHUB
    ========================== */

    async function fetchRepositories() {

        if (isLoading) return repositories;

        isLoading = true;

        try {

            const response = await fetch(
                `${GITHUB_API}?per_page=100&sort=updated`,
                {
                    headers: {
                        Accept: "application/vnd.github+json"
                    }
                }
            );

            if (!response.ok) {
                throw new Error(
                    `GitHub API error: ${response.status}`
                );
            }

            const data = await response.json();


            repositories = data

                // Don't show forks
                .filter(repo => !repo.fork)

                // Don't show the portfolio repository
                .filter(repo => repo.name !== PROFILE_REPO)

                .map(repo => ({
                    id: repo.id,
                    name: repo.name,

                    displayName:
                        repo.name
                            .replace(/[-_]/g, " ")
                            .replace(/\b\w/g, char =>
                                char.toUpperCase()
                            ),

                    description:
                        repo.description || "",

                    htmlUrl:
                        repo.html_url,

                    homepage:
                        repo.homepage || "",

                    language:
                        repo.language || "Web",

                    topics:
                        Array.isArray(repo.topics)
                            ? repo.topics
                            : [],

                    stars:
                        repo.stargazers_count || 0,

                    forks:
                        repo.forks_count || 0,

                    updatedAt:
                        repo.updated_at,

                    createdAt:
                        repo.created_at,

                    archived:
                        repo.archived || false
                }));


            hasLoaded = true;

            updateRepoCount();

            document.dispatchEvent(
                new CustomEvent("githubLoaded", {
                    detail: repositories
                })
            );

            return repositories;

        } catch (error) {

            console.error(
                "GitHub repositories could not be loaded:",
                error
            );

            document.dispatchEvent(
                new CustomEvent("githubError", {
                    detail: error
                })
            );

            return [];

        } finally {

            isLoading = false;
        }
    }



    /* =========================
       REPOSITORY COUNT
    ========================== */

    function updateRepoCount() {

        const counter =
            document.getElementById("repoCount");

        if (!counter) return;

        counter.textContent =
            `${repositories.length}+`;
    }



    /* =========================
       SEARCH
    ========================== */

    function searchRepositories(query = "") {

        const normalized =
            query
                .trim()
                .toLowerCase();

        if (!normalized) {
            return [...repositories];
        }

        return repositories.filter(repo => {

            const searchableText = [

                repo.name,

                repo.displayName,

                repo.description,

                repo.language,

                ...repo.topics

            ]
                .join(" ")
                .toLowerCase();

            return searchableText.includes(
                normalized
            );
        });
    }



    /* =========================
       SORT
    ========================== */

    function sortRepositories(
        repos = repositories,
        sortType = "updated"
    ) {

        const result = [...repos];


        switch (sortType) {

            case "stars":

                return result.sort(
                    (a, b) =>
                        b.stars - a.stars
                );


            case "name":

                return result.sort(
                    (a, b) =>
                        a.displayName.localeCompare(
                            b.displayName
                        )
                );


            case "created":

                return result.sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );


            case "updated":

            default:

                return result.sort(
                    (a, b) =>
                        new Date(b.updatedAt) -
                        new Date(a.updatedAt)
                );
        }
    }



    /* =========================
       PROJECT CARD
    ========================== */

    function createProjectCard(repo) {

        const tags = [];

        if (repo.language) {
            tags.push(repo.language);
        }

        repo.topics
            .slice(0, 3)
            .forEach(topic => {
                if (
                    topic.toLowerCase() !==
                    repo.language.toLowerCase()
                ) {
                    tags.push(topic);
                }
            });


        const tagsHTML =
            tags.length
                ? `
                    <div class="project-tags">
                        ${tags
                            .map(tag => `
                                <span class="project-tag">
                                    ${escapeHTML(tag)}
                                </span>
                            `)
                            .join("")}
                    </div>
                  `
                : "";


        const demoButton =
            repo.homepage
                ? `
                    <a
                        href="${escapeHTML(repo.homepage)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link"
                    >
                        <span>
                            ${escapeHTML(
                                t("Live Demo", "دمو")
                            )}
                        </span>
                        <span>↗</span>
                    </a>
                  `
                : "";


        return `
            <article class="project-card hover-lift">

                <div class="project-card-top">

                    <div class="project-icon">
                        &lt;/&gt;
                    </div>

                    <div class="project-meta">

                        <span class="project-language">
                            ${escapeHTML(repo.language)}
                        </span>

                        ${
                            repo.archived
                                ? `
                                    <span class="project-archived">
                                        ${escapeHTML(
                                            t(
                                                "Archived",
                                                "آرشیو شده"
                                            )
                                        )}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>


                <h3 class="project-title">
                    ${escapeHTML(repo.displayName)}
                </h3>


                <p class="project-description">

                    ${
                        escapeHTML(
                            repo.description ||
                            t(
                                "No description available for this repository.",
                                "توضیحی برای این پروژه ثبت نشده است."
                            )
                        )
                    }

                </p>


                ${tagsHTML}


                <div class="project-footer">

                    <div class="project-stats">

                        <span title="Stars">
                            ★ ${repo.stars}
                        </span>

                        <span title="Forks">
                            ⑂ ${repo.forks}
                        </span>

                    </div>


                    <div class="project-links">

                        <a
                            href="${escapeHTML(repo.htmlUrl)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="project-link"
                        >
                            <span>GitHub</span>
                            <span>↗</span>
                        </a>

                        ${demoButton}

                    </div>

                </div>

            </article>
        `;
    }



    /* =========================
       RENDER
    ========================== */

    function renderProjects(
        target,
        repos = repositories
    ) {

        if (!target) return;

        if (!repos.length) {

            target.innerHTML = `
                <div class="empty-state">

                    <div class="empty-state-icon">
                        &lt;/&gt;
                    </div>

                    <h3>
                        ${escapeHTML(
                            t(
                                "No projects found",
                                "پروژه‌ای پیدا نشد"
                            )
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            t(
                                "Try another search term.",
                                "عبارت دیگری را جستجو کنید."
                            )
                        )}
                    </p>

                </div>
            `;

            return;
        }


        target.innerHTML =
            repos
                .map(createProjectCard)
                .join("");
    }



    /* =========================
       HOME
    ========================== */

    function renderFeaturedProjects(
        targetId = "featuredProjects"
    ) {

        const target =
            document.getElementById(targetId);

        if (!target) return;


        const featured =
            sortRepositories(
                repositories,
                "updated"
            ).slice(0, 6);


        renderProjects(
            target,
            featured
        );
    }



    /* =========================
       PROJECTS PAGE
    ========================== */

    function renderAllProjects(
        repos = repositories,
        targetId = "projectsGrid"
    ) {

        const target =
            document.getElementById(targetId);

        if (!target) return;

        renderProjects(
            target,
            repos
        );
    }



    /* =========================
       REFRESH
    ========================== */

    async function refresh() {

        hasLoaded = false;

        repositories = [];

        updateRepoCount();

        return fetchRepositories();
    }



    /* =========================
       PUBLIC API
    ========================== */

    window.KiyanGitHub = {

        load: fetchRepositories,

        get: () =>
            [...repositories],

        search:
            searchRepositories,

        sort:
            sortRepositories,

        renderFeatured:
            renderFeaturedProjects,

        renderAll:
            renderAllProjects,

        refresh:

            refresh,

        isLoaded:
            () => hasLoaded
    };



    /* =========================
       LANGUAGE CHANGE
    ========================== */

    document.addEventListener(
        "languageChanged",
        () => {

            if (!hasLoaded) return;

            renderFeaturedProjects();

            const projectsGrid =
                document.getElementById(
                    "projectsGrid"
                );

            if (projectsGrid) {

                renderAllProjects();
            }
        }
    );



    /* =========================
       INIT
    ========================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            fetchRepositories();
        }
    );

})();