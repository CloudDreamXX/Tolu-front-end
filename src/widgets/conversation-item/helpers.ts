export const isHtmlContent = (content: string): boolean =>
  /<[^>]*>/.test(content);

export const extractScripts = (content: string) => {
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/gi;
  const scripts: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = scriptRegex.exec(content)) !== null) {
    scripts.push(match[1]);
  }
  const contentWithoutScripts = content.replace(scriptRegex, "");
  return { contentWithoutScripts, scripts };
};

export const hasInlineHandlers = (html: string) =>
  /\son(click|submit|change|input|keyup|keydown|load|mouseover|mouseout|touchstart|touchend)\s*=/i.test(
    html
  );

export const isInteractiveContent = (html: string) => {
  const { contentWithoutScripts, scripts } = extractScripts(html);
  return (
    scripts.length > 0 ||
    hasInlineHandlers(html) ||
    /\b(id|data-card)\s*=\s*["']card-\d+["']/i.test(html) ||
    /<(form|input|select|button|video|audio|canvas)\b/i.test(
      contentWithoutScripts
    )
  );
};

export type CardChunk = { id: string; outerHTML: string };

export const parseCardsFromHTML = (html: string): CardChunk[] => {
  const container = document.createElement("div");
  container.innerHTML = html;

  const cards = Array.from(
    container.querySelectorAll<HTMLElement>('[id^="card"], [data-card]')
  ).filter((el) =>
    /^card-?\d+$/i.test(el.id || el.getAttribute("data-card") || "")
  );

  if (cards.length === 0) {
    return [{ id: "card-0", outerHTML: container.innerHTML }];
  }

  return cards.map((el, idx) => ({
    id: el.id || el.getAttribute("data-card") || `card-${idx}`,
    outerHTML: el.outerHTML,
  }));
};

export const reconstructHTML = (
  cards: CardChunk[],
  scripts: string[]
): string => {
  const combined = cards.map((c) => c.outerHTML).join("\n");
  const scriptsBlock = scripts
    .map((code) => `<script>${code}</script>`)
    .join("\n");
  return `${combined}\n${scriptsBlock}`;
};

export type TextNodePath = number[];
export type TextEntry = { path: TextNodePath; text: string };

export const isMeaningfulText = (s: string) =>
  s && s.replace(/\s+/g, "").length > 0;

export const getDocumentFromHtml = (html: string) => {
  const parser = new DOMParser();
  return parser.parseFromString(
    `<div id="__root__">${html}</div>`,
    "text/html"
  );
};

export const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"]);
export const NO_INLINE_EDIT_TAGS = new Set([
  "CODE",
  "PRE",
  "INPUT",
  "BUTTON",
  "SELECT",
  "TEXTAREA",
]);

export const walkCollectTextNodes = (
  node: Node,
  path: number[] = [],
  acc: TextEntry[] = []
) => {
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as Element;

    if (SKIP_TAGS.has(el.tagName)) return acc;

    const inNoInline = NO_INLINE_EDIT_TAGS.has(el.tagName);
    const children = Array.from(el.childNodes);

    children.forEach((child, idx) => {
      const nextPath = [...path, idx];
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent ?? "";
        if (!inNoInline && isMeaningfulText(text)) {
          acc.push({ path: nextPath, text });
        }
      } else {
        walkCollectTextNodes(child, nextPath, acc);
      }
    });
  }
  return acc;
};

export const getNodeByPath = (root: Node, path: number[]) => {
  let cur: Node = root;
  for (const idx of path) {
    cur = (cur.childNodes[idx] as Node) ?? cur;
  }
  return cur;
};

export const applyTextReplacements = (doc: Document, entries: TextEntry[]) => {
  const root = doc.querySelector("#__root__")!;
  entries.forEach(({ path, text }) => {
    const target = getNodeByPath(root, path);
    if (target && target.nodeType === Node.TEXT_NODE) {
      target.textContent = text;
    }
  });
  return (root as HTMLElement).innerHTML;
};
