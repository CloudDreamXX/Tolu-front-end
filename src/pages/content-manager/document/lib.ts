import { useEffect, useState } from "react";

export function useTextSelectionTooltip() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [textForInput, setTextForInput] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection?.toString()) {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top - 40,
        left: rect.left + 100,
      });
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  };

  const handleTooltipClick = () => {
    setTextForInput(selectedText);
    setShowTooltip(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("selectionchange", handleTextSelection);

    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("selectionchange", handleTextSelection);
    };
  }, []);

  return {
    selectedText,
    textForInput,
    tooltipPosition,
    showTooltip,
    handleTooltipClick,
  };
}
