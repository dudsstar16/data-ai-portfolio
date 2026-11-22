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

  const dialog = document.querySelector("#case-dialog");
  const caseTitle = document.querySelector("#case-title");
  const caseBody = document.querySelector("#case-body");
  let activeProject;
  let opener;

  function updateUrl(id) {
    const url = new URL(location.href);
    if (id) url.searchParams.set("project", id);
    else url.searchParams.delete("project");
    history.replaceState(history.state, "", url);
  }

  function openCase(project, trigger) {
    activeProject = project.id;
    opener = trigger;
    caseTitle.textContent = project.title;
    caseBody.replaceChildren(element("p", "project-label", project.categoryLabel));
    const study = project.presentation.caseStudy;
    const items = [
      ["Problema", study.challenge],
      ["Abordagem", study.approach],
      ["Tecnologias", project.technologies.join(", ")],
      ["Evidências", study.evidence],
      ["Entregáveis", study.deliverables]
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
    caseBody.append(tablist, panel, projectLink(project));
    updateUrl(project.id);
    if (!dialog.open) dialog.showModal();
  }
  dialog.querySelector("[data-close-case]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => {
    if (dialog.open) return;
    if (new URL(location.href).searchParams.get("project") === activeProject) updateUrl();
    opener?.focus();
  });

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
    if (project.presentation?.featured && project.presentation.caseStudy) {
      const button = element("button", "project-link", "Explorar case");
      button.type = "button";
      button.setAttribute("aria-label", "Explorar case: " + project.title);
      button.addEventListener("click", () => openCase(project, button));
      card.append(button);
    } else {
      card.append(projectLink(project));
    }
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
    const highlights = ordered.filter(project => project.presentation?.featured).sort((a, b) => a.presentation.featuredOrder - b.presentation.featuredOrder);
    const others = ordered.filter(project => !project.presentation?.featured);
    featured.replaceChildren(...highlights.map(projectCard));
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
    const id = new URL(location.href).searchParams.get("project");
    const selected = highlights.find(project => project.id === id);
    if (selected) openCase(selected, document.getElementById("project-" + id)?.querySelector("button"));
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
  if (hero) import("./sculpture.js").then(({ mountSculpture }) => mountSculpture(hero)).catch(() => {});
})();
