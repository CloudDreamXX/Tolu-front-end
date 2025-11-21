import { ClientDetails } from "entities/coach";
import React, { useEffect, useRef, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SelectField } from "widgets/CRMSelectField";
import { CustomRadio } from "widgets/CustomRadio";
import { MultiSelectField } from "widgets/MultiSelectField";
import {
  Button,
  Calendar,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import { cn } from "shared/lib";
import { format } from "date-fns";

interface EditClientModalProps {
  client: ClientDetails;
  activeEditTab: string;
  updateClient: (field: string, value: any) => void;
  setActiveEditTab: (tab: string) => void;
  onCancel: () => void;
  onSave?: () => void;
}

const tabs = [
  "editClientInfo",
  "relationshipContext",
  "clientFitTOLU",
  "healthProfilePlan",
];

export const EditClientModal: React.FC<EditClientModalProps> = ({
  client,
  activeEditTab,
  updateClient,
  setActiveEditTab,
  onCancel,
  onSave,
}) => {
  const [noPhoneNumber, setNoPhoneNumber] = useState(false);

  const tabsContainerRef = useRef<HTMLDivElement | null>(null);

  const [localDate, setLocalDate] = useState<Date | null>(
    client?.date_of_birth ? new Date(client.date_of_birth) : null
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    localDate ? localDate.getFullYear() : new Date().getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(
    localDate
      ? new Date(localDate.getFullYear(), localDate.getMonth())
      : new Date(selectedYear, 0)
  );

  useEffect(() => {
    if (client?.date_of_birth) {
      const d = new Date(client.date_of_birth);
      if (!Number.isNaN(d.getTime())) {
        setLocalDate(d);
        setSelectedYear(d.getFullYear());
        setDisplayMonth(new Date(d.getFullYear(), d.getMonth()));
      }
    }
  }, [client?.date_of_birth]);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (activeEditTab === tabs[tabs.length - 1] && tabsContainerRef.current) {
      tabsContainerRef.current.scrollTo({
        left: tabsContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    if (activeEditTab === tabs[0] && tabsContainerRef.current) {
      tabsContainerRef.current.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    }
  }, [activeEditTab]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setDisplayMonth((prev) => new Date(year, prev.getMonth()));
    if (localDate) {
      const d = new Date(localDate);
      d.setFullYear(year);
      setLocalDate(d);
    }
  };

  const renderFooter = () => {
    return (
      <div className="flex flex-col-reverse gap-[8px] md:flex-row justify-between items-center mt-[24px]">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="w-full md:w-[144px] h-[40px] rounded-[1000px] text-white bg-[#1C63DB] text-[16px] font-semibold"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    );
  };

  const getLabel = (step: string) => {
    switch (step) {
      case "editClientInfo":
        return "Client info";
      case "relationshipContext":
        return "Relationship Context";
      case "clientFitTOLU":
        return "Client Fit for Tolu";
      case "healthProfilePlan":
        return "Health Profile Completion Plan";
      default:
        return step;
    }
  };

  return (
    <div
      className={`fixed top-0 inset-0 z-[999] bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex items-start md:items-center justify-center overflow-y-auto`}
    >
      <div
        className={`bg-[#F2F4F6] md:bg-[#F9FAFB] md:rounded-[18px] md:shadow-xl px-[16px] py-[24px] md:p-[24px] top-0 bottom-0 h-full min-h-[calc(100vh-85px)] md:min-h-auto md:max-h-[90vh] w-full md:h-fit md:w-[720px] lg:w-[800px] text-left relative md:mx-[16px] overflow-hidden flex flex-col`}
      >
        <span
          className="hidden md:block absolute top-[16px] right-[16px] cursor-pointer z-20"
          onClick={onCancel}
        >
          <MaterialIcon iconName="close" />
        </span>

        <div className="flex gap-[24px] items-center mb-[16px] md:mb-[24px]">
          <div className="flex items-center gap-[8px]">
            <MaterialIcon iconName="account_circle" size={24} />
            <h2 className="text-[20px] font-[700]">Edit client</h2>
          </div>
          <span
            className="absolute z-20 visible cursor-pointer md:hidden top-6 right-4"
            onClick={onCancel}
          >
            <MaterialIcon iconName="close" />
          </span>
        </div>

        <div>
          <div
            className="hidden md:flex gap-[16px] mb-[16px] md:mb-[24px] border border-[#DBDEE1] bg-white rounded-[1000px] p-[8px] overflow-x-auto scrollbar-hide"
            ref={tabsContainerRef}
          >
            {tabs.map((tab) => (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                key={tab}
                className={`w-full px-[24px] py-[10px] rounded-full text-nowrap font-semibold text-[14px] ${activeEditTab === tab ? "bg-[#F2F4F6] text-[#000000] border border-[#DBDEE1]" : "text-[#000000]"}`}
                onClick={() => setActiveEditTab(tab)}
              >
                {getLabel(tab)}
              </Button>
            ))}
          </div>
          <div className="w-full mb-[16px] md:hidden">
            <SelectField
              label=""
              options={tabs.map((tab) => ({
                value: tab,
                label: getLabel(tab),
              }))}
              selected={getLabel(activeEditTab) || ""}
              onChange={(value) => {
                setActiveEditTab(value);
              }}
            />
          </div>
        </div>

        <main className="overflow-y-auto pr-[2px] grow">
          {activeEditTab === "editClientInfo" && (
            <div className="flex flex-col gap-[16px] md:gap-[24px]">
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Full name
                </label>
                <Input
                  type="text"
                  placeholder="Enter full name"
                  value={client?.full_name || ""}
                  onChange={(e) => updateClient("full_name", e.target.value)}
                  className="placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
                />
              </div>
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Email address
                </label>
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={client?.email || ""}
                  onChange={(e) => updateClient("email", e.target.value)}
                  className="placeholder-custom  w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
                />
                <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
                  <MaterialIcon iconName="info" size={16} fill={1} />
                  Used to send client invite and profile access
                </div>
              </div>
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Phone number
                </label>
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  value={client?.phone_number || ""}
                  onChange={(e) => updateClient("phone_number", e.target.value)}
                  className={`placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold ${noPhoneNumber ? "bg-gray-100" : ""}`}
                  disabled={noPhoneNumber}
                  required={!noPhoneNumber}
                />
                <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
                  <Input
                    type="checkbox"
                    checked={noPhoneNumber}
                    onChange={() => {
                      setNoPhoneNumber(!noPhoneNumber);
                      if (!noPhoneNumber) updateClient("phone_number", "");
                    }}
                    className="accent-[#1C63DB]"
                  />
                  <label>I don’t have this client’s phone number</label>
                </div>
              </div>

              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Date of birth
                </label>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-[#DFDFDF] hover:bg-white rounded-[1000px] px-[12px] py-[12.5px]",
                        !localDate && "text-muted-foreground"
                      )}
                    >
                      <MaterialIcon iconName="calendar_today" fill={1} />
                      {localDate ? format(localDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-auto p-0 pointer-events-auto"
                    align="start"
                  >
                    <div className="flex gap-[8px] items-center m-4 mb-1">
                      Choose a year:
                      <select
                        value={selectedYear}
                        onChange={(e) =>
                          handleYearChange(Number(e.target.value))
                        }
                        className="px-2 py-1 border rounded-md outline-0"
                      >
                        {Array.from(
                          { length: 100 },
                          (_, i) => new Date().getFullYear() - i
                        ).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Calendar
                      mode="single"
                      selected={localDate ?? undefined}
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          setLocalDate(selectedDate);
                          updateClient(
                            "date_of_birth",
                            format(selectedDate, "yyyy-MM-dd")
                          );
                          const y = selectedDate.getFullYear();
                          if (y !== selectedYear) setSelectedYear(y);
                          setDisplayMonth(
                            new Date(
                              selectedDate.getFullYear(),
                              selectedDate.getMonth()
                            )
                          );
                        }
                      }}
                      initialFocus
                      month={displayMonth}
                      onMonthChange={(m) => {
                        setDisplayMonth(m);
                        const y = m.getFullYear();
                        if (y !== selectedYear) setSelectedYear(y);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
                  <MaterialIcon iconName="info" size={16} fill={1} />
                  Helps personalize age-appropriate guidance
                </div>
              </div>
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Primary health challenge
                </label>
                <Input
                  type="text"
                  placeholder="What's your client's chief concern?"
                  value={client?.primary_health_challenge || ""}
                  onChange={(e) =>
                    updateClient("primary_health_challenge", e.target.value)
                  }
                  className="placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
                />
                <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
                  <MaterialIcon iconName="info" size={16} fill={1} />
                  e.g., Fatigue, Gut issues, Hormonal imbalance
                </div>
              </div>
            </div>
          )}

          {activeEditTab === "relationshipContext" && (
            <div className="flex flex-col gap-[16px] md:gap-[24px]">
              <SelectField
                label="How did you first connect with this client?"
                options={[
                  { value: "Referral", label: "Referral" },
                  { value: "Social Media", label: "Social Media" },
                  { value: "Workshop or Event", label: "Workshop or Event" },
                  { value: "Previous Program", label: "Previous Program" },
                  { value: "Other", label: "Other" },
                ]}
                selected={client.connection_source || ""}
                onChange={(value) => updateClient("connection_source", value)}
              />

              <SelectField
                label="How long have you been working together?"
                options={[
                  {
                    value: "New (Less than 1 month)",
                    label: "New (Less than 1 month)",
                  },
                  { value: "1–3 months", label: "1–3 months" },
                  { value: "3–6 months", label: "3–6 months" },
                  { value: "6–12 months", label: "6–12 months" },
                  { value: "Over a year", label: "Over a year" },
                ]}
                selected={client.working_duration || ""}
                onChange={(value) => updateClient("working_duration", value)}
              />

              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Are you their primary health coach?
                </label>
                <div className="flex gap-[60px]">
                  <CustomRadio
                    label="Yes"
                    name="primaryCoach"
                    value="yes"
                    selected={client.is_primary_coach || ""}
                    onChange={(value) =>
                      updateClient("is_primary_coach", value)
                    }
                  />
                  <CustomRadio
                    label="No – I’m part of a care team"
                    name="primaryCoach"
                    value="no"
                    selected={client.is_primary_coach || ""}
                    onChange={(value) =>
                      updateClient("is_primary_coach", value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeEditTab === "clientFitTOLU" && (
            <div className="flex flex-col gap-[16px] md:gap-[24px]">
              <MultiSelectField
                label="What are your client’s current focus areas?"
                options={[
                  { label: "Hormone Health" },
                  { label: "Gut Health" },
                  { label: "Autoimmunity or Inflammation" },
                  { label: "Metabolic or Weight Issues" },
                  { label: "Sleep & Stress" },
                  { label: "Emotional Well-being" },
                  { label: "Chronic Illness Management" },
                  { label: "General Wellness / Optimization" },
                ]}
                selected={client.focus_areas || ""}
                onChange={(value) => updateClient("focus_areas", value)}
              />
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  How do you believe your client can benefit from TOLU?
                </label>
                <Input
                  placeholder="Type here"
                  type="text"
                  value={client?.tolu_benefit || ""}
                  onChange={(e) => updateClient("tolu_benefit", e.target.value)}
                  className="placeholder-custom w-full outline-none border border-[#DBDEE1] rounded-[1000px] px-[12px] py-[12.5px] text-[14px] text-[#1D1D1F] font-semibold"
                />
                <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
                  <MaterialIcon iconName="info" size={16} fill={1} />
                  e.g., personalized education
                </div>
              </div>
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Do you plan to use Tolu collaboratively during your sessions?
                </label>
                <div className="flex flex-col gap-2 mt-2">
                  <CustomRadio
                    label="Yes – I’ll reference it often"
                    name="toluUsage"
                    value="often"
                    selected={client.collaborative_usage || ""}
                    onChange={(value) =>
                      updateClient("collaborative_usage", value)
                    }
                  />
                  <CustomRadio
                    label="Occasionally – For certain tools"
                    name="toluUsage"
                    value="occasional"
                    selected={client.collaborative_usage || ""}
                    onChange={(value) =>
                      updateClient("collaborative_usage", value)
                    }
                  />
                  <CustomRadio
                    label="The client will use it independently"
                    name="toluUsage"
                    value="independent"
                    selected={client.collaborative_usage || ""}
                    onChange={(value) =>
                      updateClient("collaborative_usage", value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {activeEditTab === "healthProfilePlan" && (
            <div className="flex flex-col gap-[16px] md:gap-[24px]">
              <div>
                <label className="block mb-[12px] text-[16px] text-[#000] font-semibold">
                  Who will complete the client’s Tolu health profile?
                </label>
                <div className="flex flex-col gap-2 mt-2">
                  <CustomRadio
                    label="The client will complete it with my guidance"
                    name="profileCompletion"
                    value="with_help"
                    selected={client.permission_type || ""}
                    onChange={(value) => updateClient("permission_type", value)}
                  />
                  <CustomRadio
                    label="The client will complete it independently"
                    name="profileCompletion"
                    value="independent"
                    selected={client.permission_type || ""}
                    onChange={(value) => updateClient("permission_type", value)}
                  />
                </div>
                <div className="flex gap-[8px] items-center mt-[8px] text-[12px] text-[#5F5F65]">
                  <MaterialIcon iconName="info" size={16} fill={1} />
                  You can always edit or review it later
                </div>
              </div>
            </div>
          )}
        </main>

        <div className="mt-auto">{renderFooter()}</div>
      </div>
    </div>
  );
};
