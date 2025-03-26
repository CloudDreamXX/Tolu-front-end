import classNames from "classnames";
import { useEffect, useRef } from "react";

function Modal({
  isOpen,
  onClose,
  className = "",
  children,
  closeOnBackdropClick = true,
  title,
  description,
}) {
  const modalRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      if (modalRef.current) modalRef.current.focus();
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm overflow-y-auto"
      onClick={closeOnBackdropClick ? onClose : undefined}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className={classNames(
          "bg-white p-6 w-full max-w-[993px] rounded-lg shadow-lg flex flex-col gap-10",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        {(title || description) && (
          <div className="flex flex-col gap-3 items-center">
            {title && <h2 className="text-2xl font-bold text-center">{title}</h2>}
            {description && <p className="text-base font-semibold text-center">{description}</p>}
          </div>
        )}
        <div className="flex gap-4 items-center justify-center flex-wrap">
					{children}
				</div>
				
      </div>
    </div>
  );
}

export default Modal;
