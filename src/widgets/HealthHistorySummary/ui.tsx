import { skipToken } from "@reduxjs/toolkit/query";
import { useGetHealthHistoryNotesQuery } from "entities/coach";
import { HealthHistory, MedicalCondition, TraumaEvent } from "entities/health-history";
import { useMemo } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";
import { CoachBlockNote } from "widgets/ClientComprehensiveSummary/components/CoachBlockNote";
import { HEALTH_HISTORY_SUMMARY } from "./lib";

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | string[] | TraumaEvent | MedicalCondition | undefined;
}) => (
  <div className="space-y-1">
    <div className="font-medium text-base">{label}</div>
    <p className="text-sm text-gray-900 whitespace-pre-wrap">
      {value && String(value) ? String(value) : "-"}
    </p>
  </div>
);

const Section = ({
  title,
  children,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  onEdit: () => void;
}) => (
  <div className="space-y-4 border-b border-[#EAEAEA] pb-4">
    <div className="flex items-center justify-between">
      <h3 className="text-[18px] font-medium">{title}</h3>
      <Button variant="unstyled" size="unstyled" onClick={onEdit}>
        <MaterialIcon iconName="edit" />
      </Button>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

export const HealthHistorySummary = ({
  data,
  clientId,
  onEditSection,
}: {
  data: HealthHistory | null;
  clientId?: string;
  onEditSection: (step: number) => void;
}) => {
  const { data: notesData } = useGetHealthHistoryNotesQuery(
    clientId && data?.id ? { clientId, healthHistoryId: data.id } : skipToken,
    { skip: !clientId || !data?.id }
  );

  const notesByBlock = useMemo(() => {
    const map: Record<
      string,
      { id: string; content: string }
    > = {};

    notesData?.notes.forEach((n) => {
      map[n.block_name] = {
        id: n.id,
        content: n.note_content,
      };
    });

    return map;
  }, [notesData]);

  return (
    <div className="space-y-6">
{HEALTH_HISTORY_SUMMARY.map((section) => (
  <Section
    key={section.block}
    title={section.title}
    onEdit={() => onEditSection(section.step)}
  >
    {section.fields.map((field) => {
      const rawValue = data?.[field.key];
      const value = field.format
        ? field.format(rawValue)
        : rawValue;

      return (
        <SummaryRow
          key={String(field.key)}
          label={field.label}
          value={value}
        />
      );
    })}

    {clientId && data && (
      <CoachBlockNote
        clientId={clientId}
        healthHistoryId={data.id}
        blockName={section.block}
        initialValue={notesByBlock[section.block]?.content}
        noteId={notesByBlock[section.block]?.id}
      />
    )}
  </Section>
))}
    </div>
  );
};
