(() => {
  const script = document.currentScript;
  const basePath = script?.dataset.basePath || "";
  const route = (path) => `${basePath}${path}/`.replace(/\/{2,}/g, "/");

  const menuTrigger = document.querySelector(".stitch-menu-trigger");
  if (menuTrigger) {
    menuTrigger.addEventListener("click", () => {
      if (document.querySelector("#mobile-navigation")) return;
      const priorOverflow = document.body.style.overflow;
      const panel = document.createElement("div");
      panel.className = "stitch-mobile-panel";
      panel.id = "mobile-navigation";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-label", "Mobile navigation");
      const top = document.createElement("div");
      top.className = "stitch-mobile-panel__top";
      const wordmark = document.createElement("span");
      wordmark.textContent = "KHANTRAST";
      const close = document.createElement("button");
      close.type = "button";
      close.textContent = "Close ×";
      close.setAttribute("aria-label", "Close navigation");
      const closeMenu = () => {
        panel.remove();
        document.body.style.overflow = priorOverflow;
        menuTrigger.setAttribute("aria-expanded", "false");
        menuTrigger.focus();
      };
      close.addEventListener("click", closeMenu);
      top.append(wordmark, close);
      const nav = document.createElement("nav");
      nav.setAttribute("aria-label", "Mobile navigation");
      document.querySelectorAll(".stitch-desktop-nav a").forEach((source, i) => {
        const anchor = source.cloneNode(true);
        const number = document.createElement("span");
        number.textContent = String(i + 1).padStart(2, "0");
        anchor.prepend(number);
        nav.append(anchor);
      });
      const contact = document.createElement("a");
      contact.className = "stitch-button";
      contact.href = route("/contact");
      contact.textContent = "Let’s talk growth →";
      panel.append(top, nav, contact);
      document.body.append(panel);
      document.body.style.overflow = "hidden";
      menuTrigger.setAttribute("aria-expanded", "true");
      close.focus();
      panel.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeMenu();
        if (event.key !== "Tab") return;
        const targets = [...panel.querySelectorAll("button, a[href]")];
        const first = targets[0];
        const last = targets[targets.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      });
    });
  }

  const filters = [...document.querySelectorAll(".st-filter button")];
  const cards = [...document.querySelectorAll(".st-work-archive .st-work-card")];
  filters.forEach((button) => button.addEventListener("click", () => {
    const active = button.textContent.trim();
    filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    cards.forEach((card, i) => {
      card.hidden = active !== "All" && !card.dataset.categories.split("|").includes(active);
      card.classList.toggle("st-work-card--featured", active === "All" && i === 0);
      if (!card.hidden) card.classList.add("is-revealed");
    });
  }));

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.02, rootMargin: "0px 0px -24px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => {
      element.classList.add("reveal-pending");
      observer.observe(element);
    });
  }

  const form = document.querySelector(".inquiry-form-v2");
  if (!form) return;
  const status = document.querySelector("#form-status");
  const draft = document.querySelector("#inquiry-draft");
  const copy = document.querySelector(".st-copy-inquiry");
  const buildInquiry = () => {
    const values = new FormData(form);
    const details = [
      ["Name", values.get("name")], ["Email", values.get("email")],
      ["Food brand / group", values.get("company")], ["Website", values.get("website") || "Not provided"],
      ["Locations", values.get("locations")], ["Markets", values.get("markets")],
      ["Growth plans", values.get("expansion")], ["Monthly investment", values.get("investment")],
      ["Timeline", values.get("timeline")], ["Services", values.getAll("services").join(", ") || "Not selected"],
      ["What needs to change", values.get("context")],
    ];
    return { subject: `Khantrast Media inquiry — ${values.get("company") || "Food brand"}`, body: details.map(([label,value]) => `${label}: ${value}`).join("\n\n") };
  };
  const showDraft = (inquiry) => {
    if (!draft) return;
    draft.value = `To: info@khantrastmedia.com\nSubject: ${inquiry.subject}\n\n${inquiry.body}`;
    draft.hidden = false;
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (new FormData(form).get("companyFax")) return;
    const inquiry = buildInquiry();
    showDraft(inquiry);
    if (status) status.textContent = "Your email draft is ready. Send it from your email app to complete the inquiry. You can also copy the draft below.";
    window.location.href = `mailto:info@khantrastmedia.com?subject=${encodeURIComponent(inquiry.subject)}&body=${encodeURIComponent(inquiry.body)}`;
  });
  copy?.addEventListener("click", async () => {
    if (!form.reportValidity()) return;
    const inquiry = buildInquiry();
    showDraft(inquiry);
    try {
      await navigator.clipboard.writeText(draft.value);
      if (status) status.textContent = "Inquiry copied. Paste it into an email to info@khantrastmedia.com and send when ready.";
    } catch {
      draft.focus(); draft.select();
      if (status) status.textContent = "Select and copy your draft below, then email it to info@khantrastmedia.com.";
    }
  });
})();
