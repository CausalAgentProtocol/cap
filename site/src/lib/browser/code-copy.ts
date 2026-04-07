const codeCopyIcon = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="11" height="11" rx="2"></rect>
    <path d="M6 15V6a2 2 0 0 1 2-2h9"></path>
  </svg>
`;

export function attachCodeCopyButtons() {
  document.querySelectorAll(".prose pre").forEach((pre) => {
    if (!(pre instanceof HTMLElement) || pre.dataset.codeCopyBound === "true") {
      return;
    }

    pre.dataset.codeCopyBound = "true";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "code-copy-button";
    button.innerHTML = codeCopyIcon;
    button.setAttribute("aria-label", "Copy code");
    button.setAttribute("title", "Copy code");

    button.addEventListener("click", async () => {
      const code = pre.querySelector("code");
      const source = code instanceof HTMLElement ? code.textContent ?? "" : pre.textContent ?? "";

      try {
        await copyTextWithFallback(source.trimEnd());
        button.dataset.state = "copied";
        button.setAttribute("aria-label", "Copied");
        button.setAttribute("title", "Copied");
      } catch {
        button.dataset.state = "failed";
        button.setAttribute("aria-label", "Copy failed");
        button.setAttribute("title", "Copy failed");
      }

      window.setTimeout(() => {
        button.dataset.state = "idle";
        button.setAttribute("aria-label", "Copy code");
        button.setAttribute("title", "Copy code");
      }, 1200);
    });

    pre.append(button);
  });
}

async function copyTextWithFallback(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}
