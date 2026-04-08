export function attachCodeCopyButtons() {
  document.querySelectorAll(".prose .code-copy-button").forEach((button) => {
    if (!(button instanceof HTMLButtonElement) || button.dataset.codeCopyBound === "true") {
      return;
    }

    const shell = button.closest(".code-block-shell");
    const pre = shell instanceof HTMLElement ? shell.querySelector("pre") : null;

    if (!(pre instanceof HTMLElement)) {
      return;
    }

    button.dataset.codeCopyBound = "true";

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
