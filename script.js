const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main > section[id]");
const accentToggle = document.querySelector(".accent-toggle");
const accentMenu = document.querySelector(".accent-menu");
const tiltCards = document.querySelectorAll(".profile-card, .info-profile-card");

if (tiltCards.length && matchMedia("(hover: hover) and (pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const resetProfileCard = (card) => {
    card.style.setProperty("--pc-rotate-x", "0deg");
    card.style.setProperty("--pc-rotate-y", "0deg");
    card.style.setProperty("--pc-shift-x", "0px");
    card.style.setProperty("--pc-shift-y", "0px");
    card.style.setProperty("--pc-pointer-x", "50%");
    card.style.setProperty("--pc-pointer-y", "50%");
    card.style.setProperty("--pc-active", "0");
  };

  tiltCards.forEach((card) => {
    const tiltStrength = card.classList.contains("info-profile-card") ? 4 : 12;

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateX = (0.5 - y) * tiltStrength;
      const rotateY = (x - 0.5) * tiltStrength;

      card.style.setProperty("--pc-rotate-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--pc-rotate-y", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--pc-shift-x", `${((x - 0.5) * 8).toFixed(2)}px`);
      card.style.setProperty("--pc-shift-y", `${((y - 0.5) * 8).toFixed(2)}px`);
      card.style.setProperty("--pc-pointer-x", `${(x * 100).toFixed(2)}%`);
      card.style.setProperty("--pc-pointer-y", `${(y * 100).toFixed(2)}%`);
      card.style.setProperty("--pc-active", "1");
    });

    card.addEventListener("pointerleave", () => resetProfileCard(card));
  });
}

const setMenuOpen = (isOpen) => {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  navigation.classList.toggle("is-open", isOpen);
};

const activateSection = (sectionId) => {
  const activeSection = [...sections].find((section) => section.id === sectionId);
  if (!activeSection) {
    return;
  }

  sections.forEach((section) => {
    const isActive = section === activeSection;
    section.classList.toggle("is-current", isActive);
    section.setAttribute("aria-hidden", String(!isActive));
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  setMenuOpen(false);
};

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

accentToggle.addEventListener("click", () => {
  const isExpanded = accentToggle.getAttribute("aria-expanded") === "true";
  accentToggle.setAttribute("aria-expanded", String(!isExpanded));
  accentMenu.hidden = isExpanded;
});

document.querySelectorAll(".accent-swatch").forEach((swatch) => {
  swatch.addEventListener("click", () => {
    const accent = swatch.dataset.accent;
    document.body.style.setProperty("--accent", accent);
    document.body.style.setProperty("--accent-light", `color-mix(in srgb, ${accent} 60%, white)`);
    document.querySelector(".accent-swatch.is-selected")?.classList.remove("is-selected");
    swatch.classList.add("is-selected");
    accentMenu.hidden = true;
    accentToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".accent-picker")) {
    accentMenu.hidden = true;
    accentToggle.setAttribute("aria-expanded", "false");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href").slice(1);
    if (targetId === "main") {
      event.preventDefault();
      document.querySelector("#main").focus();
      return;
    }

    if (![...sections].some((section) => section.id === targetId)) {
      return;
    }

    event.preventDefault();
    activateSection(targetId);
    if (window.location.hash !== `#${targetId}`) {
      window.history.pushState(null, "", `#${targetId}`);
    }
  });
});

window.addEventListener("popstate", () => {
  activateSection(window.location.hash.slice(1) || "home");
});

activateSection(window.location.hash.slice(1) || "home");
