import { useCallback, useRef, useState } from "react";
import { phoneMask } from "shared/lib";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  RadioGroup,
  RadioGroupItem,
} from "shared/ui";
import { SearchableSelect } from "widgets/OnboardingPractitioner/components/SearchableSelect";
import { timezoneOptions } from "widgets/OnboardingPractitioner/profile-setup";
import { DateOfBirthPicker } from "widgets/date-of-birth-picker";
import { ClientProfileData, defaultData } from "./types";

type ClientEditProfileModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  initial?: ClientProfileData;
  onSave?: (data: ClientProfileData) => void;
};

export const ClientEditProfileModal = ({
  open,
  setOpen,
  initial = defaultData,
  onSave,
}: ClientEditProfileModalProps) => {
  const [dataState, setDataState] = useState<ClientProfileData>(initial);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const contentRef = useRef<HTMLDivElement>(null);

  const setData = useCallback(
    (p: Partial<ClientProfileData>) =>
      setDataState((prev) => ({ ...prev, ...p })),
    []
  );

  const close = () => setOpen(false);

  const handleSave = () => {
    onSave?.(dataState);
    close();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        ref={contentRef}
        showMobileBack={false}
        className="bg-white p-6 rounded-none
      fixed inset-0 w-screen overflow-y-auto overscroll-contain
      md:bottom-auto md:top-1/2 md:left-1/2 md:right-auto 
      md:w-[min(800px,calc(100vw-64px))] 
      md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl md:overflow-visible
    "
      >
        <DialogHeader className="flex flex-col gap-6 ">
          <DialogTitle className="flex items-center gap-2">
            Edit account info
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col w-full gap-6 md:flex-row">
            <div className="flex flex-col gap-2.5 w-full">
              <label>Name</label>
              <Input
                placeholder="Frances Swann"
                value={dataState.name}
                onChange={(e) => setData({ name: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2.5 w-full">
              <label>Phone number</label>
              <Input
                placeholder="(123) 456-7890"
                pattern={"^\\+?[1-9]\\d{1,14}$"}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phoneMask(dataState.phone)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setData({ phone: digits });
                }}
              />
            </div>
          </div>

          <div className="flex flex-col w-full gap-6 md:flex-row">
            <div className="flex flex-col gap-2.5 w-full">
              <label>Email</label>
              <Input
                placeholder="john.doe@example.com"
                type="email"
                value={dataState.email}
                onChange={(e) => setData({ email: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-2.5 w-full relative">
              <label>Date of birth</label>
              <DateOfBirthPicker
                date={dateOfBirth}
                setDate={setDateOfBirth}
                portalContainerRef={contentRef}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <label>Gender</label>
            <RadioGroup className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" />
                <label>Male</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" />
                <label>Female</label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex flex-col gap-[8px]">
            <SearchableSelect
              placeholder="Search for Time Zone"
              options={timezoneOptions}
              value={dataState.timeZone}
              onChange={(value) => setData({ timeZone: value })}
              label={"Time zone "}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between gap-1">
          <Button variant="blue2" onClick={close} className="w-32">
            Cancel
          </Button>

          <Button variant="brightblue" onClick={handleSave} className="w-32">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
