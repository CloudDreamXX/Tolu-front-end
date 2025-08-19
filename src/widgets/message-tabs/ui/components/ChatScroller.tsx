import { forwardRef } from "react";

export const ChatScroller = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`chat-scroller ${className ?? ""}`} {...props} />
));
