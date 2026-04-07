let anchorCopyBound = false;

export function bindAnchorCopyLinks() {
  if (anchorCopyBound) {
    return;
  }

  anchorCopyBound = true;

  document.addEventListener("click", (event) => {
    const trigger = event.target instanceof Element ? event.target.closest("[data-copy-link]") : null;

    if (!(trigger instanceof HTMLAnchorElement)) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    void copySectionLink(trigger);
  });
}

async function copySectionLink(trigger: HTMLAnchorElement) {
  const id = trigger.getAttribute("data-copy-id");

  if (!id) {
    return;
  }

  const url = new URL(window.location.href);
  url.hash = id;

  try {
    await navigator.clipboard.writeText(url.toString());
    trigger.classList.add("copied");
    window.setTimeout(() => trigger.classList.remove("copied"), 900);
  } catch {}
}
