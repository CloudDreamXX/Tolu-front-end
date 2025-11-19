import { ISessionResult } from "entities/coach";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { Button, Input } from "shared/ui";
import { ConversationItemActions } from "./conversationItem-actions";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { smartRender } from "features/chat/ui/message-bubble/lib";
import { OnlyTextEditor } from "./cards-text-editor";

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

export const SKIP_TAGS = new Set(["SCRIPT", "NOSCRIPT", "IFRAME"]);
export const NO_INLINE_EDIT_TAGS = new Set(["CODE", "PRE"]);

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

interface ConversationItemProps {
  pair: ISessionResult;
  index: number;
  compareIndex: number | null;
  mobilePage: 1 | 2;
  isEditing: boolean;
  selectedDocumentId: string;
  editedTitle: string;
  editedQuery: string;
  editedContent: string;
  ratingsMap: Record<string, { rating: number; comment: string }>;
  conversation: ISessionResult[];
  onStatusComplete: (status: any, contentId: string) => Promise<void>;
  onCompareToggle: (index: number) => void;
  onEditToggle: (pair: ISessionResult, document: any) => void;
  onSaveEdit: (contentId: string, content?: string) => Promise<void>;
  onCancelEdit: () => void;
  setMobilePage: (page: 1 | 2) => void;
  setSelectedDocumentId: (id: string) => void;
  setIsBadResponseOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsMoveOpen: (open: boolean) => void;
  setIsMarkAsOpen: (open: boolean) => void;
  setEditedTitle: (title: string) => void;
  setEditedQuery: (query: string) => void;
  setEditedContent: (content: string) => void;
  handleDublicateClick: (id: string) => Promise<void>;
  handleMarkAsClick: () => void;
  handleDeleteContent: (id: string) => void;
  onMarkAsFinalHandler: (contentId?: string | undefined) => Promise<void>;
  onRestoreOriginalFormat: () => void;
  setStatusPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  pair,
  index,
  compareIndex,
  mobilePage,
  isEditing,
  selectedDocumentId,
  editedTitle,
  // editedContent,
  ratingsMap,
  conversation,
  onStatusComplete,
  onCompareToggle,
  onEditToggle,
  onSaveEdit,
  onCancelEdit,
  setMobilePage,
  setSelectedDocumentId,
  setIsBadResponseOpen,
  setIsDeleteOpen,
  setIsMoveOpen,
  setIsMarkAsOpen,
  setEditedTitle,
  setEditedContent,
  handleDublicateClick,
  handleMarkAsClick,
  handleDeleteContent,
  onMarkAsFinalHandler,
  onRestoreOriginalFormat,
  setStatusPopup,
}) => {
  const [renderedContent, setRenderedContent] = useState<JSX.Element | null>(
    null
  );
  const [sanitizedContent, setSanitizedContent] = useState<string>("");

  const [isInteractive, setIsInteractive] = useState(false);
  const [cardEdits, setCardEdits] = useState<CardChunk[]>([]);
  const [savedScripts, setSavedScripts] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    if (isEditing) {
      const interactive = isInteractiveContent(pair.content);
      setIsInteractive(interactive);

      const { contentWithoutScripts, scripts } = extractScripts(pair.content);
      setSavedScripts(scripts);

      if (interactive) {
        const cards = parseCardsFromHTML(contentWithoutScripts);
        setCardEdits(cards);
      } else {
        setSanitizedContent(contentWithoutScripts);
      }
    } else {
      setCardEdits([]);
      setSavedScripts([]);
      setIsInteractive(false);
    }
  }, [isEditing, pair.content]);

  useEffect(() => {
    const appended: HTMLScriptElement[] = [];
    let cancelled = false;

    smartRender(pair.content).then((node) => {
      if (cancelled) return;

      const element = React.isValidElement(node) ? node : <div>{node}</div>;

      const html =
        element.props?.dangerouslySetInnerHTML?.__html ??
        (typeof element.props?.children === "string"
          ? element.props.children
          : "");

      setRenderedContent(
        <div
          className="prose-sm prose max-w-none richtext"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );

      const container = document.createElement("div");
      container.innerHTML = html;
      const scripts = container.querySelectorAll("script");

      scripts.forEach((oldScript) => {
        if (oldScript.textContent) {
          try {
            (0, eval)(oldScript.textContent);
          } catch (err) {
            console.error("Error evaluating inline script:", err);
          }
        }

        if (oldScript.src) {
          const newScript = document.createElement("script");
          newScript.src = oldScript.src;
          newScript.async = false;
          document.body.appendChild(newScript);
          appended.push(newScript);
        }
      });
    });

    return () => {
      cancelled = true;
      appended.forEach((s) => s.remove());
    };
  }, [pair.content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector(
        ".prose, .richtext, .conversation-content"
      );
      if (!container) return;

      container
        .querySelectorAll<HTMLFormElement>('form[id^="quiz-"]')
        .forEach((form) => {
          const radios = form.querySelectorAll<HTMLInputElement>(
            'input[type="radio"]'
          );
          const submitBtn = form.querySelector<HTMLButtonElement>(
            'button[id$="-submit"]'
          );
          const quizNum = form.id.replace("quiz-", "");
          const nextBtn = container.querySelector<HTMLButtonElement>(
            `#next-quiz-${quizNum}`
          );

          if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
          }
          if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = "0.5";
          }

          radios.forEach((r) =>
            r.addEventListener("change", () => {
              if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
              }
            })
          );

          if (submitBtn) {
            submitBtn.addEventListener("click", () => {
              submitBtn.disabled = true;
              submitBtn.style.opacity = "0.5";
              if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.style.opacity = "1";
              }
            });
          }
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [renderedContent]);

  const renderCompareView = () => (
    <div className="flex-row block gap-4 md:flex">
      <div className="block md:hidden">
        {mobilePage === 1 && (
          <div className="p-6 flex flex-col gap-[16px]">
            <div className="prose-sm prose max-w-none">
              {isHtmlContent(conversation[index - 1].content) ? (
                parse(conversation[index - 1].content)
              ) : (
                <div className="whitespace-pre-wrap">
                  {conversation[index - 1].content}
                </div>
              )}
            </div>

            <div className="flex justify-center items-center gap-[8px] text-[#1C63DB]">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => setMobilePage(1)}
                disabled={mobilePage === 1}
              >
                <span>
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
                </span>
              </Button>

              <div className="text-[16px] font-[500]">{mobilePage}/2</div>

              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => setMobilePage(2)}
              >
                <span className="block transform rotate-180">
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
                </span>
              </Button>
            </div>

            <Button
              variant="brightblue"
              className="self-center w-fit"
              onClick={() =>
                onStatusComplete("Ready for Review", conversation[index - 1].id)
              }
            >
              Confirm and Mark as Ready for Review
            </Button>
          </div>
        )}

        {mobilePage === 2 && (
          <div className="p-6 flex flex-col gap-[16px]">
            <div className="prose-sm prose max-w-none richtext">
              {isHtmlContent(pair.content) ? (
                parse(pair.content)
              ) : (
                <div className="whitespace-pre-wrap">{pair.content}</div>
              )}
            </div>

            <div className="flex justify-center items-center gap-[8px] text-[#1C63DB]">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => setMobilePage(1)}
              >
                <span>
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
                </span>
              </Button>

              <div className="text-[16px] font-[500]">{mobilePage}/2</div>

              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => setMobilePage(2)}
                disabled={mobilePage === 2}
              >
                <span className="block transform rotate-180">
                  <MaterialIcon
                    iconName="keyboard_arrow_left"
                    className="text-blue-600"
                  />
                </span>
              </Button>
            </div>

            <Button
              variant="brightblue"
              className="self-center w-fit"
              onClick={() => onStatusComplete("Ready for Review", pair.id)}
            >
              Confirm and Mark as Ready for Review
            </Button>
          </div>
        )}
      </div>

      <div className="flex-row w-full gap-4">
        <div className="flex-1 p-6 flex flex-col gap-[64px]">
          {isHtmlContent(conversation[index - 1].content) ? (
            <div className="prose-sm prose max-w-none">
              {parse(conversation[index - 1].content)}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">
              {conversation[index - 1].content}
            </div>
          )}
          <Button
            variant="brightblue"
            className="self-center w-fit"
            onClick={() =>
              onStatusComplete("Ready for Review", conversation[index - 1].id)
            }
          >
            Confirm and Mark as Ready for Review
          </Button>
        </div>

        <div className="flex-1 p-6 flex flex-col gap-[64px]">
          {isHtmlContent(pair.content) ? (
            <div className="prose-sm prose max-w-none">
              {parse(pair.content)}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{pair.content}</div>
          )}
          <Button
            variant="brightblue"
            className="self-center w-fit"
            onClick={() => onStatusComplete("Ready for Review", pair.id)}
          >
            Confirm and Mark as Ready for Review
          </Button>
        </div>
      </div>
    </div>
  );

  const handleEditorChange = (e: { htmlValue: any }) => {
    const formattedContent = e.htmlValue;
    setEditedContent(formattedContent);
  };

  const updateCardHtmlAt = (idx: number, nextHtml: string) => {
    setCardEdits((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, outerHTML: nextHtml } : c))
    );
  };

  const cleanHiddenStyles = (html: string) =>
    html.replace(/display\s*:\s*none\s*;?/gi, "");

  const [isAddingCard, setIsAddingCard] = useState(false);

  const renderEditView = () => {
    if (isInteractive) {
      return (
        <div className="flex flex-col gap-4 w-full min-w-0">
          <div className="flex gap-2 overflow-x-auto w-full items-center flex-wrap">
            {cardEdits.map((card, i) => (
              <Button
                key={i}
                variant={i === activeCard ? "brightblue" : "light-blue"}
                onClick={() => {
                  setActiveCard(i);
                  setIsAddingCard(false);
                }}
              >
                {card.id}
              </Button>
            ))}
            <Button
              variant="light-blue"
              onClick={() => {
                setCardEdits((prev) => {
                  let prefix = "card";
                  let separator = "";
                  let maxNumber = 0;

                  for (const c of prev) {
                    const match = c.id.match(/^(card)([-_]?)(\d+)/i);
                    if (match) {
                      prefix = match[1];
                      separator = match[2];
                      const num = parseInt(match[3], 10);
                      if (!isNaN(num) && num > maxNumber) maxNumber = num;
                    }
                  }

                  const nextNumber = maxNumber;
                  const nextId = `${prefix}${separator}${nextNumber}`;

                  const newCardHtml = `<div id="${nextId}" class="card" style="display:none;"><p><br/></p></div>`;

                  const updated = [
                    ...prev,
                    { id: nextId, outerHTML: newCardHtml },
                  ];

                  setActiveCard(updated.length - 1);
                  setIsAddingCard(true);

                  return updated;
                });
              }}
            >
              + Add Card
            </Button>
          </div>

          {isAddingCard ? (
            <div className="editor-wrap w-full max-w-full min-w-0 bg-white border border-[#008FF6] rounded-[16px] overflow-hidden">
              <Editor
                value={cleanHiddenStyles(
                  (() => {
                    const temp = document.createElement("div");
                    temp.innerHTML = cardEdits[activeCard]?.outerHTML || "";
                    const clone = temp.firstElementChild?.cloneNode(
                      true
                    ) as HTMLElement | null;

                    const nav = clone?.querySelector(
                      ".card-nav"
                    ) as HTMLElement | null;
                    if (nav) nav.style.display = "block";

                    return clone?.innerHTML || "<p><br/></p>";
                  })()
                )}
                onTextChange={(e) => {
                  const htmlValue = e.htmlValue || "";
                  updateCardHtmlAt(activeCard, htmlValue);
                }}
                style={{ width: "100%" }}
                className="w-full max-w-full min-w-0 bg-white p-3 min-h-[400px] h-fit"
                modules={{
                  toolbar: [
                    [{ header: "1" }, { header: "2" }, { font: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ align: [] }],
                    ["bold", "italic", "underline", "strike"],
                    ["link"],
                    [{ color: [] }, { background: [] }],
                  ],
                  clipboard: {
                    matchVisual: false,
                  },
                }}
                formats={[
                  "header",
                  "font",
                  "size",
                  "bold",
                  "italic",
                  "underline",
                  "strike",
                  "list",
                  "indent",
                  "link",
                  "image",
                  "align",
                  "color",
                  "background",
                  "br",
                ]}
              />

              <div className="flex justify-end gap-2 mt-2 p-[12px]">
                <Button
                  variant="light-blue"
                  onClick={() => {
                    setCardEdits((prev) => prev.slice(0, -1));
                    setIsAddingCard(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="brightblue"
                  onClick={() => {
                    setCardEdits((prev) => {
                      if (prev.length === 0) return prev;

                      const updated = [...prev];
                      const prevIndex = updated.length - 2;
                      const newIndex = updated.length - 1;
                      const prevCard = updated[prevIndex];
                      const newCard = updated[newIndex];

                      let prefix = "card";
                      let separator = "";
                      let maxNumber = 0;

                      for (const c of updated) {
                        const match = c.id.match(/^(card)([-_]?)(\d+)/i);
                        if (match) {
                          prefix = match[1];
                          separator = match[2];
                          const num = parseInt(match[3], 10);
                          if (!isNaN(num) && num > maxNumber) maxNumber = num;
                        }
                      }

                      const nextNumber = maxNumber + 1;
                      const nextId = `${prefix}${separator}${nextNumber}`;

                      if (prevCard) {
                        const tempPrev = document.createElement("div");
                        tempPrev.innerHTML = prevCard.outerHTML;
                        const elPrev =
                          tempPrev.firstElementChild as HTMLElement | null;

                        if (elPrev) {
                          elPrev.querySelector(".next-btn")?.remove();

                          const nextBtn = document.createElement("button");
                          nextBtn.textContent = "Next";
                          nextBtn.setAttribute("class", "next-btn");
                          nextBtn.setAttribute(
                            "onclick",
                            `showCard(${nextNumber})`
                          );
                          Object.assign(nextBtn.style, {
                            padding: "8px 18px",
                            background: "#007acc",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "16px",
                            cursor: "pointer",
                          });

                          const navContainer =
                            (elPrev.querySelector(
                              ".card-nav"
                            ) as HTMLElement | null) ||
                            (elPrev.querySelector(
                              'div[style*="text-align:left"][style*="margin-top:24px"]'
                            ) as HTMLElement | null) ||
                            (elPrev.querySelector(
                              'div[style*="display:flex"][style*="justify-content:space-between"][style*="margin-top:24px"]'
                            ) as HTMLElement | null) ||
                            (elPrev.querySelector(
                              'div[style*="display:flex"][style*="justify-content:flex-start"][style*="margin-top:24px"]'
                            ) as HTMLElement | null);

                          if (navContainer) {
                            Object.assign(navContainer.style, {
                              display: "flex",
                              justifyContent: "space-between",
                              marginTop: "24px",
                            });
                            navContainer.appendChild(nextBtn);
                          } else {
                            nextBtn.style.marginLeft = "20px";
                            nextBtn.style.marginTop = "20px";
                            elPrev.appendChild(nextBtn);
                          }

                          updated[prevIndex] = {
                            ...prevCard,
                            outerHTML: elPrev.outerHTML,
                          };
                        }
                      }

                      const tempNew = document.createElement("div");
                      tempNew.innerHTML = newCard.outerHTML;
                      const elNew =
                        tempNew.firstElementChild as HTMLElement | null;

                      if (elNew) {
                        const fullHtml = newCard.outerHTML
                          .replace(/<p><br><\/p>/g, "<p><br/></p>")
                          .replace(/<\/p>\s*<p>/g, "</p><p>");

                        const divWrapper = document.createElement("div");
                        divWrapper.innerHTML = fullHtml;

                        const navContainer = document.createElement("div");
                        navContainer.classList.add("card-nav");
                        Object.assign(navContainer.style, {
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: "24px",
                        });

                        const prevBtn = document.createElement("button");
                        prevBtn.textContent = "Previous";
                        prevBtn.setAttribute("class", "prev-btn");
                        prevBtn.setAttribute(
                          "onclick",
                          `showCard(${nextNumber - 1})`
                        );
                        Object.assign(prevBtn.style, {
                          padding: "8px 18px",
                          background: "#007acc",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "16px",
                          cursor: "pointer",
                        });

                        navContainer.appendChild(prevBtn);
                        divWrapper.appendChild(navContainer);

                        const normalizedHTML = `<div id="${nextId}" class="card" style="display:none;">${divWrapper.innerHTML}</div>`;

                        updated[newIndex] = {
                          ...newCard,
                          id: nextId,
                          outerHTML: normalizedHTML,
                        };
                      }

                      return updated;
                    });

                    setIsAddingCard(false);
                  }}
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <OnlyTextEditor
              html={cleanHiddenStyles(cardEdits[activeCard]?.outerHTML || "")}
              onChange={(nextHtml) => updateCardHtmlAt(activeCard, nextHtml)}
            />
          )}

          {isEditing && (
            <div className="flex flex-col flex-col-reverse md:flex-row flex-wrap md:justify-end gap-2">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="text-[#1C63DB] text-[16px] px-4 py-2"
                onClick={onCancelEdit}
              >
                Cancel
              </Button>

              <Button
                className="px-4 py-2"
                variant="light-blue"
                onClick={onRestoreOriginalFormat}
              >
                Restore original format
              </Button>

              <Button
                variant="brightblue"
                className="text-[16px] px-4 py-2"
                onClick={() => {
                  const visibleCards = cardEdits.map((c, i) => {
                    const temp = document.createElement("div");
                    temp.innerHTML = c.outerHTML;
                    const el = temp.firstElementChild as HTMLElement | null;

                    if (!el) return c;

                    el.style.display = i === 0 ? "block" : "none";

                    const htmlWithSpaces = el.outerHTML
                      .replace(/<p><\/p>/g, "<p><br/></p>")
                      .replace(/<p><br><\/p>/g, "<p><br/></p>");

                    return { ...c, outerHTML: htmlWithSpaces };
                  });

                  const finalHtml = reconstructHTML(visibleCards, savedScripts);
                  setEditedContent(finalHtml);
                  onSaveEdit(pair.id, finalHtml);
                }}
              >
                Save changes
              </Button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2 w-full min-w-0">
        <Input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title"
          className="text-xl font-bold w-full max-w-full min-w-0 box-border border border-[#008FF6] rounded-[16px] px-4 py-3 outline-none"
        />

        <div className="editor-wrap w-full max-w-full min-w-0 bg-white border border-[#008FF6] rounded-[16px] overflow-hidden">
          <Editor
            value={sanitizedContent}
            onTextChange={handleEditorChange}
            style={{ width: "100%" }}
            className="w-full max-w-full min-w-0 bg-white p-3 h-fit"
            modules={{
              toolbar: [
                [{ header: "1" }, { header: "2" }, { font: [] }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ align: [] }],
                ["bold", "italic", "underline", "strike"],
                ["link"],
                [{ color: [] }, { background: [] }],
              ],
            }}
            formats={[
              "header",
              "font",
              "size",
              "bold",
              "italic",
              "underline",
              "strike",
              "list",
              "indent",
              "link",
              "image",
              "align",
              "color",
              "background",
              "button",
            ]}
          />
        </div>

        {isEditing && (
          <div className="flex flex-col flex-col-reverse md:flex-row flex-wrap md:justify-end gap-2">
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="text-[#1C63DB] text-[16px] px-4 py-2"
              onClick={onCancelEdit}
            >
              Cancel
            </Button>
            <Button
              className="px-4 py-2"
              variant="light-blue"
              onClick={onRestoreOriginalFormat}
            >
              Restore original format
            </Button>
            <Button
              variant="brightblue"
              className="text-[16px] px-4 py-2"
              onClick={() => onSaveEdit(pair.id)}
            >
              Save changes
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div key={pair.id} className="flex flex-col gap-[24px]">
      {pair.query && (
        <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] w-full md:max-w-[563px] xl:max-w-[400px]">
          <p className="text-[16px] md:text-[18px] font-[500] text-[#1D1D1F]">
            {pair.query}
          </p>
        </div>
      )}

      {compareIndex === index && index > 0 && renderCompareView()}

      <div className="flex flex-col gap-4 mr-auto md:flex-row-reverse md:gap-2 md:gap-6">
        {compareIndex !== index && (
          <>
            {isEditing && selectedDocumentId === pair.id
              ? renderEditView()
              : renderedContent}
          </>
        )}
        <ConversationItemActions
          pair={pair}
          ratingsMap={ratingsMap}
          index={index}
          onCompareToggle={onCompareToggle}
          onEditToggle={onEditToggle}
          setSelectedDocumentId={setSelectedDocumentId}
          setIsBadResponseOpen={setIsBadResponseOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setIsMoveOpen={setIsMoveOpen}
          setIsMarkAsOpen={setIsMarkAsOpen}
          handleDublicateClick={handleDublicateClick}
          handleMarkAsClick={handleMarkAsClick}
          handleDelete={handleDeleteContent}
          compareIndex={compareIndex}
          onMarkAsFinalHandler={onMarkAsFinalHandler}
          setStatusPopup={setStatusPopup}
        />
      </div>
    </div>
  );
};
