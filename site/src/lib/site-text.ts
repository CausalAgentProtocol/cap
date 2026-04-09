import MarkdownIt from "markdown-it";

export const plainTextMarkdown = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: true
});

export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function truncateDescription(value: string, maxLength = 160): string {
  if (value.length <= maxLength) {
    return value;
  }

  const slice = value.slice(0, maxLength + 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cutoff = lastSpace > Math.floor(maxLength * 0.6) ? lastSpace : maxLength;
  return `${slice.slice(0, cutoff).trimEnd()}...`;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

export function markdownToPlainText(markdownSource: string): string {
  const html = plainTextMarkdown.render(markdownSource);

  return collapseWhitespace(
    decodeHtmlEntities(
      html
        .replace(/<pre[\s\S]*?<\/pre>/g, " ")
        .replace(/<code[^>]*>/g, " ")
        .replace(/<\/code>/g, " ")
        .replace(/<[^>]+>/g, " ")
    )
  );
}

export function buildPageDescription(markdownSource: string, fallbackTitle: string): string {
  const plainText = markdownToPlainText(markdownSource);
  const withoutTitle = plainText.startsWith(fallbackTitle)
    ? plainText.slice(fallbackTitle.length).trim()
    : plainText;
  const candidate = withoutTitle || plainText || fallbackTitle;
  return truncateDescription(candidate);
}
