/* portfolio.js
   Small enhancements:
   - Mobile nav toggle
   - Active nav highlighting while scrolling
   - Smooth count-up animation for stats
   - Contact form validation (empty submit + valid submit)
*/

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Footer year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const nav = $(".nav");
  const navToggle = $(".nav-toggle");
  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu when a link is clicked (mobile)
    $$(".nav__link", nav).forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Active nav highlighting
  const sections = ["home", "about", "projects", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = $$(".nav__link");

  function setActiveLink() {
    const y = window.scrollY + 120;
    let activeId = "home";

    for (const s of sections) {
      if (s.offsetTop <= y) activeId = s.id;
    }

    navLinks.forEach((a) => {
      const target = (a.getAttribute("href") || "").replace("#", "");
      a.classList.toggle("is-active", target === activeId);
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // Count-up stats (runs when About section is near viewport)
  const statNums = $$(".stat__num");
  let statsStarted = false;

  function animateCount(el, to) {
    const durationMs = 900;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const t = Math.min(1, (now - start) / durationMs);
      const value = Math.round(from + (to - from) * t);
      el.textContent = String(value);
      if (t < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function tryStartStats() {
    if (statsStarted) return;
    const about = document.getElementById("about");
    if (!about) return;

    const rect = about.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.75) {
      statsStarted = true;
      statNums.forEach((el) => {
        const to = Number(el.getAttribute("data-count") || "0");
        animateCount(el, to);
      });
      window.removeEventListener("scroll", tryStartStats);
    }
  }

  window.addEventListener("scroll", tryStartStats, { passive: true });
  tryStartStats();

  // Contact form validation
  const form = $("#contactForm");
  if (form) {
    const name = $("#name");
    const email = $("#email");
    const message = $("#message");
    const status = $("#formStatus");

    const nameError = $("#nameError");
    const emailError = $("#emailError");
    const messageError = $("#messageError");

    function setError(el, errEl, msg) {
      if (!el || !errEl) return;
      errEl.textContent = msg || "";
      el.setAttribute("aria-invalid", msg ? "true" : "false");
    }

    function isEmail(val) {
      // Simple, practical email check for assignments (not full RFC validation)
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(val || "").trim());
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const n = String(name?.value || "").trim();
      const em = String(email?.value || "").trim();
      const msg = String(message?.value || "").trim();

      let ok = true;

      if (!n) { setError(name, nameError, "Please enter your name."); ok = false; }
      else setError(name, nameError, "");

      if (!em) { setError(email, emailError, "Please enter your email."); ok = false; }
      else if (!isEmail(em)) { setError(email, emailError, "Please enter a valid email."); ok = false; }
      else setError(email, emailError, "");

      if (!msg) { setError(message, messageError, "Please enter a message."); ok = false; }
      else setError(message, messageError, "");

      if (!status) return;

      if (!ok) {
        status.textContent = "Form not submitted — please fix the highlighted fields.";
        return;
      }

      // Success (assignment demo)
      status.textContent = "✅ Thanks! Your message was submitted successfully (demo).";
      form.reset();
      setError(name, nameError, "");
      setError(email, emailError, "");
      setError(message, messageError, "");
    });
  }
})();
