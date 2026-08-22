(() => {
  const script = document.currentScript;
  const basePath = script?.dataset.basePath || "";
  const route = (path) => `${basePath}${path}`;

  const menuTrigger = document.querySelector(".stitch-menu-trigger");
  if (menuTrigger) {
    const links = [
      ["01", "Work", "/work"],
      ["02", "Services", "/services"],
      ["03", "For food brands", "/who-we-build-for"],
      ["04", "How we work", "/how-we-work"],
      ["05", "About", "/about"],
      ["06", "Insights", "/insights"],
    ];

    const closeMenu = (panel) => {
      panel.remove();
      document.body.style.overflow = "";
      menuTrigger.setAttribute("aria-expanded", "false");
      menuTrigger.focus();
    };

    menuTrigger.addEventListener("click", () => {
      const panel = document.createElement("div");
      panel.className = "stitch-mobile-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-label", "Site navigation");

      const top = document.createElement("div");
      top.className = "stitch-mobile-panel__top";
      const wordmark = document.createElement("span");
      wordmark.textContent = "KHANTRAST";
      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "Close ×";
      close.addEventListener("click", () => closeMenu(panel));
      top.append(wordmark, close);

      const nav = document.createElement("nav");
      nav.setAttribute("aria-label", "Mobile navigation");
      for (const [number, label, path] of links) {
        const anchor = document.createElement("a");
        anchor.href = route(path);
        const index = document.createElement("span");
        index.textContent = number;
        anchor.append(index, document.createTextNode(label));
        nav.append(anchor);
      }

      const contact = document.createElement("a");
      contact.className = "stitch-button";
      contact.href = route("/contact");
      contact.textContent = "Start a project →";
      panel.append(top, nav, contact);
      document.body.append(panel);
      document.body.style.overflow = "hidden";
      menuTrigger.setAttribute("aria-expanded", "true");
      close.focus();

      panel.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu(panel);
      });
    });
  }

  const form = document.querySelector(".inquiry-form-v2");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const services = values.getAll("services").join(", ") || "Not selected";
      const details = [
        ["Name", values.get("name")],
        ["Email", values.get("email")],
        ["Food brand / group", values.get("company")],
        ["Website", values.get("website") || "Not provided"],
        ["Locations", values.get("locations")],
        ["Markets", values.get("markets")],
        ["Expansion plan", values.get("expansion")],
        ["Monthly investment", values.get("investment")],
        ["Timeline", values.get("timeline")],
        ["Services", services],
        ["What needs to change", values.get("context")],
      ];
      const company = values.get("company") || "Food brand";
      const subject = encodeURIComponent(`Khantrast Media inquiry — ${company}`);
      const body = encodeURIComponent(details.map(([label, value]) => `${label}: ${value}`).join("\n\n"));
      const status = document.querySelector("#form-status");
      if (status) status.textContent = "Opening your email app with this inquiry…";
      window.location.href = `mailto:info@khantrastmedia.com?subject=${subject}&body=${body}`;
    });
  }
})();
