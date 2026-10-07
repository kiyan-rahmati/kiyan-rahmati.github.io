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


    /* =====================================================
       MOBILE NAVIGATION
    ===================================================== */

    function initMobileNavigation() {

        const navbar = document.querySelector(".navbar");
        const menuButton = document.querySelector(".mobile-menu-btn");

        if (!navbar || !menuButton) {
            return;
        }


        menuButton.addEventListener("click", function () {

            const isOpen =
                navbar.classList.toggle("mobile-open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen
                    ? "Close menu"
                    : "Open menu"
            );

        });


        document
            .querySelectorAll(".nav-links a")
            .forEach(function (link) {

                link.addEventListener("click", function () {

                    navbar.classList.remove(
                        "mobile-open"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuButton.setAttribute(
                        "aria-label",
                        "Open menu"
                    );

                });

            });

    }


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    function getCurrentPage() {

        const path =
            window.location.pathname
                .toLowerCase();

        if (
            path.includes("/projects/")
        ) {
            return "projects";
        }

        if (
            path.includes("/articles/")
        ) {
            return "articles";
        }

        if (
            path.includes("/about/")
        ) {
            return "about";
        }

        if (
            path.includes("/contact/")
        ) {
            return "contact";
        }

        return "home";
    }


    function setActiveNavigation() {

        const currentPage =
            getCurrentPage();

        document
            .querySelectorAll(".nav-links a[data-page]")
            .forEach(function (link) {

                const page =
                    link.dataset.page;

                const isActive =
                    page === currentPage;

                link.classList.toggle(
                    "active",
                    isActive
                );

                if (isActive) {

                    link.setAttribute(
                        "aria-current",
                        "page"
                    );

                } else {

                    link.removeAttribute(
                        "aria-current"
                    );

                }

            });

    }


    /* =====================================================
       SKILLS
    ===================================================== */

    let skillsData = [];


    async function loadSkills() {

        const container =
            document.querySelector("#skillsGrid");

        if (!container) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${getRootPrefix()}data/skills.json`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "Failed to load skills"
                );
            }


            skillsData =
                await response.json();


            renderSkills();

        } catch (error) {

            console.error(
                "Skills loading error:",
                error
            );


            container.innerHTML = `
                <div class="empty-state">
                    <strong>
                        ${
                            getLanguage() === "fa"
                                ? "مهارت‌ها بارگذاری نشدند."
                                : "Skills could not be loaded."
                        }
                    </strong>
                </div>
            `;

        }

    }


    function renderSkills() {

        const container =
            document.querySelector("#skillsGrid");

        if (
            !container ||
            !Array.isArray(skillsData)
        ) {
            return;
        }


        if (!skillsData.length) {

            container.innerHTML = `
                <div class="empty-state">
                    <strong>
                        ${
                            getLanguage() === "fa"
                                ? "مهارتی ثبت نشده است."
                                : "No skills available."
                        }
                    </strong>
                </div>
            `;

            return;
        }


        container.innerHTML =
            skillsData
                .map(function (skill) {

                    /*
                     * Supports both:
                     * "HTML5"
                     *
                     * and:
                     * {
                     *   name: "HTML5",
                     *   category: "Frontend",
                     *   level: "Advanced"
                     * }
                     */

                    const name =
                        typeof skill === "string"
                            ? skill
                            : skill.name;

                    const category =
                        typeof skill === "object"
                            ? skill.category
                            : "";

                    const level =
                        typeof skill === "object"
                            ? skill.level
                            : "";


                    return `
                        <div class="skill">

                            <div class="skill-name">
                                ${escapeHTML(name)}
                            </div>

                            ${
                                category
                                    ? `
                                        <span class="skill-category">
                                            ${escapeHTML(category)}
                                        </span>
                                      `
                                    : ""
                            }

                            ${
                                level
                                    ? `
                                        <span class="skill-level">
                                            ${escapeHTML(level)}
                                        </span>
                                      `
                                    : ""
                            }

                        </div>
                    `;

                })
                .join("");

    }


    /* =====================================================
       TESTIMONIALS
    ===================================================== */

    let testimonialsData = [];


    async function loadTestimonials() {

        const container =
            document.querySelector(
                "#testimonialsGrid"
            );

        if (!container) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${getRootPrefix()}data/testimonials.json`,
                    {
                        cache: "no-store"
                    }
                );


            if (!response.ok) {
                throw new Error(
                    "Failed to load testimonials"
                );
            }


            testimonialsData =
                await response.json();


            renderTestimonials();

        } catch (error) {

            console.error(
                "Testimonials loading error:",
                error
            );


            container.innerHTML = `
                <div class="empty-state">
                    <strong>
                        ${
                            getLanguage() === "fa"
                                ? "نظرات در دسترس نیستند."
                                : "Testimonials are unavailable."
                        }
                    </strong>
                </div>
            `;

        }

    }


    function renderTestimonials() {

        const container =
            document.querySelector(
                "#testimonialsGrid"
            );

        if (
            !container ||
            !Array.isArray(testimonialsData)
        ) {
            return;
        }


        if (!testimonialsData.length) {

            container.innerHTML = `
                <div class="empty-state">
                    <strong>
                        ${
                            getLanguage() === "fa"
                                ? "هنوز نظری ثبت نشده است."
                                : "No testimonials yet."
                        }
                    </strong>
                </div>
            `;

            return;
        }


        const lang =
            getLanguage();


        container.innerHTML =
            testimonialsData
                .map(function (item) {

                    const name =
                        item.name || "Anonymous";

                    const role =
                        lang === "fa"
                            ? item.role_fa
                            : item.role_en;

                    const text =
                        lang === "fa"
                            ? item.text_fa
                            : item.text_en;


                    const avatar =
                        item.avatar
                            ? `
                                <img
                                    src="${escapeHTML(item.avatar)}"
                                    alt="${escapeHTML(name)}"
                                    class="testimonial-avatar"
                                >
                              `
                            : `
                                <div class="testimonial-avatar">
                                    ${escapeHTML(
                                        name
                                            .charAt(0)
                                            .toUpperCase()
                                    )}
                                </div>
                              `;


                    return `
                        <article class="testimonial-card">

                            <div class="testimonial-quote">
                                “
                            </div>

                            <p class="testimonial-text">
                                ${escapeHTML(text)}
                            </p>

                            <div class="testimonial-author">

                                ${avatar}

                                <div>

                                    <strong>
                                        ${escapeHTML(name)}
                                    </strong>

                                    <small>
                                        ${escapeHTML(role)}
                                    </small>

                                </div>

                            </div>

                        </article>
                    `;

                })
                .join("");

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    function initContactForm() {

        const form =
            document.querySelector("#contactForm");

        const notice =
            document.querySelector(
                "#contactFormNotice"
            );


        if (!form || !notice) {
            return;
        }


        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    form.elements.name?.value.trim();

                const email =
                    form.elements.email?.value.trim();

                const subject =
                    form.elements.subject?.value.trim();

                const message =
                    form.elements.message?.value.trim();


                if (
                    !name ||
                    !email ||
                    !subject ||
                    !message
                ) {

                    notice.textContent =
                        getLanguage() === "fa"
                            ? "لطفاً همه فیلدها را کامل کنید."
                            : "Please complete all fields.";

                    return;
                }


                /*
                 * GitHub Pages is static and cannot process
                 * form submissions by itself.
                 *
                 * For now we only validate the form.
                 * A form service or backend can be connected later.
                 */


                notice.textContent =
                    getLanguage() === "fa"
                        ? "فرم آماده است؛ در مرحله بعد سرویس ارسال پیام را به آن متصل می‌کنیم."
                        : "The form is ready. A message delivery service can be connected next.";


                console.log(
                    "Contact form data:",
                    {
                        name,
                        email,
                        subject,
                        message
                    }
                );

            }
        );

    }


    /* =====================================================
       SCROLL TO TOP
    ===================================================== */

    function initScrollToTop() {

        document
            .querySelectorAll("[data-scroll-top]")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });

                    }
                );

            });

    }


    /* =====================================================
       SMOOTH INTERNAL LINKS
    ===================================================== */

    function initSmoothLinks() {

        document
            .querySelectorAll(
                'a[href^="#"]'
            )
            .forEach(function (link) {

                link.addEventListener(
                    "click",
                    function (event) {

                        const targetId =
                            link.getAttribute("href");

                        if (
                            !targetId ||
                            targetId === "#"
                        ) {
                            return;
                        }


                        const target =
                            document.querySelector(
                                targetId
                            );


                        if (!target) {
                            return;
                        }


                        event.preventDefault();


                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }
                );

            });

    }


    /* =====================================================
       LANGUAGE CHANGE
    ===================================================== */

    document.addEventListener(
        "languageChanged",
        function () {

            renderSkills();

            renderTestimonials();

        }
    );


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.KiyanApp = {

        loadSkills,
        renderSkills,

        loadTestimonials,
        renderTestimonials,

        initContactForm,

        getCurrentPage

    };


    /* =====================================================
       INITIALIZE
    ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initMobileNavigation();

            setActiveNavigation();

            loadSkills();

            loadTestimonials();

            initContactForm();

            initScrollToTop();

            initSmoothLinks();

        }
    );

})();