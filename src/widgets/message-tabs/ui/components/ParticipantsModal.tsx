import { Participant } from "entities/chat";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Dialog,
  DialogContent,
  DialogTitle,
} from "shared/ui";

export const ParticipantsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  participants: Participant[];
}> = ({ open, onClose, participants }) => {
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl gap-6">
        <DialogTitle className="hidden">Title </DialogTitle>
        <div className="px-4 pb-4 overflow-y-auto">
          <ul className="space-y-3">
            {participants.map((p) => (
              <li key={p.user.id} className="flex items-center gap-3">
                <Avatar className="ring-1 ring-black/5 border-white rounded-full shadow-sm w-8 h-8 border-[1.5px]">
                  <AvatarImage src={undefined} alt={p.user.name} />
                  <AvatarFallback className="text-[11px] font-medium">
                    {p.user.first_name && p.user.last_name
                      ? `${p.user.first_name.slice(0, 1).toUpperCase()}${p.user.last_name.slice(0, 1).toUpperCase()}`
                      : p.user.name.split(" ").length > 1
                        ? p.user.name
                            .split(" ")
                            .map((word) => word[0].toUpperCase())
                            .slice(0, 2)
                            .join("")
                        : "UN"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#111827] truncate">
                    {(p?.user.first_name &&
                      p?.user.last_name &&
                      `${p?.user.first_name} ${p?.user.last_name}`) ||
                      p?.user.name}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
