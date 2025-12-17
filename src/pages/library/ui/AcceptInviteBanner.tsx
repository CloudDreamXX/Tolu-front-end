import { useState } from "react";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "shared/ui/item";
import { Button } from "shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "shared/ui";
type Props = {
  coachName?: string;
  onAccept: () => void;
  onCancelConfirmed: () => void;
};
export const AcceptInviteBanner = ({
  coachName,
  onAccept,
  onCancelConfirmed,
}: Props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  return (
    <>
      <div className="w-full bg-white border-b shadow flex flex-col">
        <Item>
          <ItemContent>
            <ItemTitle>New Invitation</ItemTitle>
            <ItemDescription className="line-clamp-none">
              You've received an invitation from{" "}
              <span className="font-medium">{coachName}</span>
            </ItemDescription>
          </ItemContent>
          <ItemActions className="space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setConfirmOpen(true)}
            >
              Decline
            </Button>
            <Button size="sm" variant="brightblue" onClick={onAccept}>
              Accept
            </Button>
          </ItemActions>
        </Item>
      </div>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            If you decline this invitation, you won’t be able to accept it later
            unless the coach sends a new one.
          </p>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onCancelConfirmed();
              }}
            >
              Decline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
