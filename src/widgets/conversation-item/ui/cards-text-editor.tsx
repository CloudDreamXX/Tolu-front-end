import React, { useMemo } from "react";
import { FC, useEffect, useRef } from "react";
import parse from "html-react-parser";
import {
    getDocumentFromHtml,
    walkCollectTextNodes,
    SKIP_TAGS,
    NO_INLINE_EDIT_TAGS,
    isMeaningfulText,
    applyTextReplacements,
} from "./conversation-item";

export const OnlyTextEditor: React.FC<{
    html: string;
    onChange: (nextHtml: string) => void;
}> = ({ html, onChange }) => {
    const doc = React.useMemo(() => getDocumentFromHtml(html), [html]);
    const root = React.useMemo(
        () => doc.body.querySelector("#__root__") as HTMLElement,
        [doc]
    );

    const entries = React.useMemo(() => {
        return walkCollectTextNodes(root);
    }, [root]);

    const renderedOnce = React.useMemo(() => {
        const clone = getDocumentFromHtml(html);
        const croot = clone.querySelector("#__root__") as HTMLElement;
        let i = 0;
        const replaceText = (node: Node) => {
            if (node.nodeType !== Node.ELEMENT_NODE) return;
            const el = node as Element;
            if (SKIP_TAGS.has(el.tagName)) return;
            const inNoInline = NO_INLINE_EDIT_TAGS.has(el.tagName);

            Array.from(el.childNodes).forEach((child) => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const text = child.textContent ?? "";
                    if (!inNoInline && isMeaningfulText(text)) {
                        const marker = clone.createElement("span");
                        marker.setAttribute("data-editable-index", String(i++));
                        marker.textContent = text;
                        child.parentNode?.replaceChild(marker, child);
                    }
                } else {
                    replaceText(child);
                }
            });
        };
        replaceText(croot);
        return croot.innerHTML;
    }, [html]);

    const Visual = useMemo(() => {
        return parse(renderedOnce, {
            replace: (domNode: any) => {
                const idxAttr = domNode?.attribs?.["data-editable-index"];
                if (idxAttr !== undefined) {
                    const idx = Number(idxAttr);

                    const innerText =
                        domNode.children && domNode.children[0]?.data
                            ? domNode.children[0].data
                            : (entries[idx]?.text ?? "");

                    const handleCommit = (next: string) => {
                        const copy = entries.slice();
                        if (copy[idx]) copy[idx] = { ...copy[idx], text: next };
                        const nextHtml = applyTextReplacements(doc, copy);
                        onChange(nextHtml);
                    };

                    return <EditableText initial={innerText} onCommit={handleCommit} />;
                }
            },
        });
    }, [renderedOnce, entries, doc, onChange]);

    return (
        <div className="border border-[#008FF6] rounded-[16px] overflow-hidden">
            <div className="p-4 prose-sm prose max-w-none richtext">{Visual}</div>
        </div>
    );
};

export const EditableText: FC<{
    initial: string;
    onCommit: (next: string) => void;
    onLiveInput?: (next: string) => void;
}> = ({ initial, onCommit, onLiveInput }) => {
    const ref = useRef<HTMLSpanElement | null>(null);
    const composing = useRef(false);

    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current;
        if (document.activeElement !== el) {
            el.textContent = initial ?? "";
        } else if (!el.textContent) {
            el.textContent = initial ?? "";
        }
    }, [initial]);

    return (
        <span
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onCompositionStart={() => {
                composing.current = true;
            }}
            onCompositionEnd={(e) => {
                composing.current = false;
                onLiveInput?.(e.currentTarget.textContent ?? "");
            }}
            onInput={(e) => {
                if (!composing.current) {
                    onLiveInput?.(e.currentTarget.textContent ?? "");
                }
            }}
            onBlur={(e) => onCommit(e.currentTarget.textContent ?? "")}
            className="outline-none ring-1 ring-transparent focus:ring-[#008FF6] rounded-sm"
            style={{ cursor: "text" }}
        >
            {initial}
        </span>
    );
};
