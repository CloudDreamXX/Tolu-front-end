import { EyeClosed, EyeIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "shared/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from "shared/ui";

type ChangePasswordModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (newPass: string) => void;
  onForgot?: () => void;
  mode?: "change" | "create";
};

export const ChangePasswordModal = ({
  open,
  onOpenChange,
  onSubmit,
  onForgot,
  mode = "change",
}: ChangePasswordModalProps) => {
  const isCreate = mode === "create";

  const [touched, setTouched] = useState({ next: false, conf: false });
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState<{
    cur: boolean;
    next: boolean;
    conf: boolean;
  }>({
    cur: false,
    next: false,
    conf: false,
  });

  const meetsPolicy = useMemo(() => {
    const hasLen = next.length >= 8;
    const hasLetter = /[A-Za-z]/.test(next);
    const hasDigit = /\d/.test(next);
    return hasLen && hasLetter && hasDigit;
  }, [next]);

  const match = next.length > 0 && next === confirm;

  const canSubmit =
    (isCreate ? true : current.length > 0) && meetsPolicy && match;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    onSubmit?.(next);
    setCurrent("");
    setNext("");
    setConfirm("");
    onOpenChange(false);
  };

  const title = isCreate ? "Create a New Password" : "Change password";
  const description = isCreate
    ? "Please enter your new password below."
    : "Enter your current password and your new password below.";
  const actionLabel = isCreate ? "Create" : "Change";

  const showMismatch =
    touched.next &&
    touched.conf &&
    next.length > 0 &&
    confirm.length > 0 &&
    next !== confirm;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showMobileBack={false}
        className="bg-white p-6 rounded-none
      fixed inset-0 w-screen overflow-y-auto overscroll-contain
      md:bottom-auto md:top-1/2 md:left-1/2 md:right-auto 
      md:w-[min(800px,calc(100vw-64px))] 
      md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:overflow-visible
    "
      >
        <DialogHeader className="flex flex-col gap-4 ">
          <DialogTitle className="flex items-center gap-2">{title}</DialogTitle>
          <DialogDescription>
            <p className="text-base">{description}</p>
            <p className="text-base">
              Your new password must meet security requirements and will take
              effect immediately.
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {!isCreate && (
            <div className="flex flex-col gap-2.5 w-full">
              <label>Current password</label>
              <Input
                placeholder=""
                type={show.cur ? "text" : "password"}
                autoComplete="current-password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                iconRight={
                  show.cur ? <EyeIcon size={16} /> : <EyeClosed size={16} />
                }
                onIconClick={() => setShow((s) => ({ ...s, cur: !s.cur }))}
              />
            </div>
          )}

          <div className="flex flex-col gap-2.5 w-full">
            <label>New password</label>
            <Input
              placeholder=""
              type={show.next ? "text" : "password"}
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, next: true }))}
              className={cn(
                showMismatch &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              iconRight={
                show.next ? <EyeIcon size={16} /> : <EyeClosed size={16} />
              }
              onIconClick={() => setShow((s) => ({ ...s, next: !s.next }))}
            />
            {showMismatch && (
              <p className="text-xs text-red-500">
                New password and confirmation do not match.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <label>Confirm new password</label>
            <Input
              placeholder=""
              type={show.conf ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onBlur={() => setTouched((s) => ({ ...s, conf: true }))}
              className={cn(
                showMismatch &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              iconRight={
                show.conf ? <EyeIcon size={16} /> : <EyeClosed size={16} />
              }
              onIconClick={() => setShow((s) => ({ ...s, conf: !s.conf }))}
            />
            {showMismatch && (
              <p className="text-xs text-red-500">
                New password and confirmation do not match.
              </p>
            )}
          </div>

          {!isCreate && (
            <div className="flex justify-end">
              <Button
                variant="link"
                className="text-[#1C63DB]"
                onClick={() => onForgot?.()}
              >
                Forgot password
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-1">
          <Button
            variant="blue2"
            onClick={() => onOpenChange(false)}
            className="w-32"
          >
            Cancel
          </Button>

          <Button
            variant="brightblue"
            onClick={handleSubmit}
            className="w-32 disabled:bg-[#D5DAE2] disabled:text-[#5F5F65] disabled:opacity-100"
            disabled={!canSubmit}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
