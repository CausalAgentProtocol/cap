let dropdownGlobalsBound = false;

export function initSpecVersionDropdown() {
  bindDropdownGlobals();

  document.querySelectorAll("[data-spec-version-dropdown]").forEach((root) => {
    if (!(root instanceof HTMLElement) || root.dataset.specVersionBound === "true") {
      return;
    }

    const toggle = root.querySelector("[data-spec-version-toggle]");
    const menu = root.querySelector("[data-spec-version-menu]");

    if (!(toggle instanceof HTMLButtonElement) || !(menu instanceof HTMLElement)) {
      return;
    }

    root.dataset.specVersionBound = "true";

    toggle.addEventListener("click", () => {
      setDropdownOpen(root, root.dataset.open !== "true");
    });

    menu.querySelectorAll("[data-spec-version-link]").forEach((item) => {
      item.addEventListener("click", () => {
        setDropdownOpen(root, false);
      });
    });
  });
}

function bindDropdownGlobals() {
  if (dropdownGlobalsBound) {
    return;
  }

  dropdownGlobalsBound = true;

  document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-spec-version-dropdown][data-open='true']").forEach((root) => {
      if (!(root instanceof HTMLElement) || root.contains(event.target)) {
        return;
      }

      setDropdownOpen(root, false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    document.querySelectorAll("[data-spec-version-dropdown][data-open='true']").forEach((root) => {
      if (!(root instanceof HTMLElement)) {
        return;
      }

      setDropdownOpen(root, false);
      const toggle = root.querySelector("[data-spec-version-toggle]");

      if (toggle instanceof HTMLButtonElement) {
        toggle.focus();
      }
    });
  });
}

function setDropdownOpen(root: HTMLElement, isOpen: boolean) {
  root.dataset.open = isOpen ? "true" : "false";

  const toggle = root.querySelector("[data-spec-version-toggle]");
  const menu = root.querySelector("[data-spec-version-menu]");

  if (toggle instanceof HTMLButtonElement) {
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  if (menu instanceof HTMLElement) {
    menu.hidden = !isOpen;
  }
}
