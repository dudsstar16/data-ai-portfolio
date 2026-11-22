(() => {
  const root = document.documentElement;
  const theme = document.querySelector("#theme-toggle");
  const applyTheme = value => {
    root.dataset.theme = value;
    theme.setAttribute("aria-pressed", String(value === "dark"));
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", value === "dark" ? "#1e1618" : "#fcfaf6");
  };
  let preference;
  try { preference = localStorage.getItem("portfolio-theme"); } catch {}
  applyTheme(preference === "dark" ? "dark" : "light");
  theme.hidden = false;
  theme.addEventListener("click", () => {
    const value = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(value);
    try { localStorage.setItem("portfolio-theme", value); } catch {}
  });

  const menu = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#nav-links");
  menu.hidden = false;
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menu.textContent = open ? "×" : "☰";
  }
  menu.addEventListener("click", () => setMenu(menu.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  const chapters = [...nav.querySelectorAll("a")].map(link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  }));
  const navShell = document.querySelector(".nav-shell");
  const progress = document.querySelector(".chapter-progress span");
  let chapterFrame = 0;
  function updateChapter() {
    chapterFrame = 0;
    const readingLine = navShell.offsetHeight + window.innerHeight * 0.23;
    let active = chapters[0];
    for (const chapter of chapters) {
      if (chapter.section.getBoundingClientRect().top <= readingLine) active = chapter;
    }
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollRange > 0 && window.scrollY >= scrollRange - 2) active = chapters.at(-1);
    for (const chapter of chapters) {
      if (chapter === active) chapter.link.setAttribute("aria-current", "location");
      else chapter.link.removeAttribute("aria-current");
    }
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, scrollRange ? window.scrollY / scrollRange : 0))})`;
  }
  function scheduleChapterUpdate() {
    if (!chapterFrame) chapterFrame = requestAnimationFrame(updateChapter);
  }
  addEventListener("scroll", scheduleChapterUpdate, { passive: true });
  addEventListener("resize", scheduleChapterUpdate);
  scheduleChapterUpdate();
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menu.focus();
    }
  });

  const resume = document.querySelector("#resume-dialog");
  document.querySelectorAll("[data-open-resume]").forEach(button => {
    button.hidden = false;
    button.addEventListener("click", event => {
      event.preventDefault();
      resume.showModal();
    });
  });
  document.querySelector("[data-close-resume]").addEventListener("click", () => resume.close());
  resume.addEventListener("click", event => { if (event.target === resume) resume.close(); });
  const skillFilters = [...document.querySelectorAll("[data-filter]")];
  document.querySelector(".stack-controls").hidden = false;
  skillFilters.forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === "all"));
    button.addEventListener("click", () => {
      skillFilters.forEach(item => {
        item.classList.toggle("active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      let visible = 0;
      document.querySelectorAll(".skill").forEach(skill => {
        skill.hidden = button.dataset.filter !== "all" && skill.dataset.category !== button.dataset.filter;
        if (!skill.hidden) visible++;
      });
      const count = document.querySelector("#stack-count");
      if (count) count.textContent = visible;
    });
  });

  const contactForm = document.querySelector("#contact-form");
  contactForm.hidden = false;
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent("Contato pelo portfólio — " + data.get("name"));
    const body = encodeURIComponent("Nome: " + data.get("name") + "\nE-mail: " + data.get("email") + "\n\n" + data.get("message"));
    window.location.href = "mailto:eduardareisworkspace@gmail.com?subject=" + subject + "&body=" + body;
  });

  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content != null) node.textContent = content;
    return node;
  }

  function projectLink(project) {
    const link = element("a", "project-link", project.linkLabel || "Ver projeto");
    try {
      const url = new URL(project.url);
      if (url.protocol === "https:") link.href = url.href;
    } catch {}
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  const explorer = document.querySelector("#case-explorer");
  const selector = document.querySelector("#case-selector");
  const caseTitle = document.querySelector("#featured-case-title");
  const caseCategory = document.querySelector("#case-category");
  const caseBody = document.querySelector("#featured-case-body");

  function updateUrl(id) {
    const url = new URL(location.href);
    if (id) url.searchParams.set("project", id);
    else url.searchParams.delete("project");
    history.replaceState(history.state, "", url);
  }

  function renderCase(project) {
    caseTitle.textContent = project.title;
    caseCategory.textContent = project.categoryLabel;
    const study = project.presentation.caseStudy;
    const items = [
      ["Desafio", study.challenge],
      ["Abordagem", study.approach],
      ["Entrega", [study.deliverables, study.evidence].filter(Boolean).join("\n\n")]
    ].filter(([, value]) => value);
    const tablist = element("div", "case-tabs");
    tablist.setAttribute("role", "tablist");
    tablist.setAttribute("aria-label", "Detalhes do case");
    const panel = element("div", "case-panel");
    panel.setAttribute("role", "tabpanel");
    panel.id = "case-panel";
    panel.tabIndex = 0;
    const tabs = items.map(([label], index) => {
      const button = element("button", "filter", label);
      button.type = "button";
      button.id = "case-tab-" + index;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", panel.id);
      button.addEventListener("click", () => activate(index));
      tablist.append(button);
      return button;
    });
    function activate(index, focus = false) {
      tabs.forEach((tab, i) => {
        tab.setAttribute("aria-selected", String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
      });
      panel.setAttribute("aria-labelledby", tabs[index].id);
      panel.textContent = items[index][1];
      if (focus) tabs[index].focus();
    }
    tablist.addEventListener("keydown", event => {
      const index = tabs.indexOf(event.target);
      if (index < 0) return;
      const targets = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: tabs.length - 1 };
      if (!Object.hasOwn(targets, event.key)) return;
      event.preventDefault();
      activate((targets[event.key] + tabs.length) % tabs.length, true);
    });
    activate(0);
    const tags = element("div", "tags");
    tags.append(...project.technologies.map(technology => element("span", "tag", technology)));
    caseBody.replaceChildren(tablist, panel, tags, projectLink(project));
  }

  function projectCard(project) {
    const card = element("article", "project");
    card.id = "project-" + project.id;
    card.dataset.projectId = project.id;
    card.dataset.category = project.category;
    if (project.image) {
      const art = element("div", "project-art");
      const image = element("img");
      image.src = project.image;
      image.alt = project.imageAlt;
      image.loading = "lazy";
      art.append(image);
      card.append(art);
    }
    card.append(element("p", "project-label", project.categoryLabel), element("h3", "", project.title), element("p", "", project.summary));
    const tags = element("div", "tags");
    tags.append(...project.technologies.map(technology => element("span", "tag", technology)));
    card.append(tags);
    card.append(projectLink(project));
    return card;
  }

  async function catalog(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error("Catálogo indisponível");
    return response.json();
  }
  const featured = document.querySelector("#projects");
  const archive = document.querySelector("#project-archive");
  const filters = document.querySelector("#project-filters");
  catalog("./data/projects.json").then(({ projects }) => {
    const ordered = projects.filter(project => project.status === "published").sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 6);
    const highlights = ordered.filter(project => project.presentation?.featured && project.presentation.caseStudy)
      .sort((a, b) => a.presentation.featuredOrder - b.presentation.featuredOrder);
    const others = ordered.filter(project => !highlights.includes(project));
    if (highlights.length) {
      function select(project, record = false) {
        for (const control of selector.children) {
          control.setAttribute("aria-pressed", String(control.dataset.projectId === project.id));
        }
        renderCase(project);
        if (record) updateUrl(project.id);
        scheduleChapterUpdate();
      }
      selector.replaceChildren(...highlights.map(project => {
        const button = element("button", "case-option");
        button.type = "button";
        button.dataset.projectId = project.id;
        button.setAttribute("aria-controls", "featured-case-body");
        button.append(element("small", "", project.categoryLabel), element("span", "", project.title));
        button.addEventListener("click", () => select(project, true));
        return button;
      }));
      const id = new URL(location.href).searchParams.get("project");
      const selected = highlights.find(project => project.id === id);
      select(selected || highlights[0]);
      explorer.hidden = false;
      featured.hidden = true;
      if (selected && !location.hash) explorer.scrollIntoView({ behavior: "instant" });
    } else {
      featured.hidden = true;
    }
    archive.replaceChildren(...others.map(projectCard));
    const categories = new Map(others.map(project => [project.category, project.categoryLabel]));
    filters.replaceChildren();
    for (const [key, label] of [["all", "Todos"], ...categories]) {
      const button = element("button", "filter", label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(key === "all"));
      button.addEventListener("click", () => {
        for (const control of filters.children) control.setAttribute("aria-pressed", String(control === button));
        for (const card of archive.children) card.hidden = key !== "all" && card.dataset.category !== key;
      });
      filters.append(button);
    }
    filters.hidden = others.length < 2;
  }).catch(() => {
    if (!featured.querySelector("article")) featured.replaceChildren(element("p", "catalog-state", "Os projetos estão disponíveis no GitHub do portfólio."));
    if (!archive.querySelector("article")) archive.replaceChildren(element("p", "catalog-state", "Arquivo de projetos indisponível no momento."));
  });

  const certificateGrid = document.querySelector("#certificate-grid");
  catalog("./data/certificates.json").then(({ certificates }) => {
    const visible = certificates.filter(certificate => certificate.status === "published" && certificate.curation?.siteVisible !== false)
      .sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 8);
    certificateGrid.replaceChildren(...visible.map(certificate => {
      const item = element("article", "cert-item");
      item.dataset.certificateId = certificate.id;
      const date = element("time", "", certificate.displayDate);
      date.dateTime = certificate.date;
      const metadata = element("span", "", certificate.issuer + " · ");
      metadata.append(date);
      item.append(element("strong", "", certificate.title), metadata);
      return item;
    }));
  }).catch(() => certificateGrid.replaceChildren(element("p", "catalog-state", "Certificações indisponíveis no momento.")));

  const hero = document.querySelector("#data-sculpture");
  const interactiveArt = matchMedia("(min-width: 769px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  function loadSculpture() {
    if (!hero || !interactiveArt.matches) return;
    interactiveArt.removeEventListener("change", loadSculpture);
    import("./sculpture.js").then(({ mountSculpture }) => mountSculpture(hero)).catch(() => {});
  }
  interactiveArt.addEventListener("change", loadSculpture);
  loadSculpture();
})();
