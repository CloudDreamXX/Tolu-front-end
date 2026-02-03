import { skipToken } from "@reduxjs/toolkit/query";
import { useGetHealthHistoryNotesQuery } from "entities/coach";
import { HealthHistory } from "entities/health-history";
import { useMemo } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";
import { CoachBlockNote } from "widgets/ClientComprehensiveSummary/components/CoachBlockNote";

export const HEALTH_HISTORY_BLOCKS = {
  BASIC_INFO: "basic_info",
  BIRTH_BODY: "birth_body",
  HEALTH_CONCERNS: "health_concerns",
  BOWEL_HEALTH: "bowel_health",
  STRESSFUL_EVENTS: "stressful_events",
  MEDICAL_HISTORY: "medical_history",
  ORAL_HEALTH: "oral_health",
  LIFESTYLE_HISTORY: "lifestyle_history",
  SLEEP_HISTORY: "sleep_history",
  WOMENS_HEALTH: "womens_health",
  SEXUAL_HISTORY: "sexual_history",
  MENTAL_HEALTH: "mental_health",
  OTHER: "other",
};

const SummaryRow = ({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) => (
  <div className="space-y-1">
    <div className="font-medium text-base">{label}</div>
    <p className="text-sm text-gray-900 whitespace-pre-wrap">
      {value && String(value) ? String(value) : "-"}
    </p>
  </div>
);

const join = (v?: string[]) => (v && v.length ? v.join(", ") : "-");

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

  const note = notesData?.notes.find(
    (n) => n.block_name === HEALTH_HISTORY_BLOCKS.BASIC_INFO
  );

  const notesByBlock = useMemo(() => {
    const map: Record<string, string> = {};
    notesData?.notes.forEach((n) => {
      map[n.block_name] = n.note_content;
    });
    return map;
  }, [notesData]);
  console.log(data)

  return (
    <div className="space-y-6">
      <Section title="Birth & Body" onEdit={() => onEditSection(1)}>
        <SummaryRow label="Age" value={data?.age} />
        <SummaryRow label="Birth date" value={data?.birth_date} />
        <SummaryRow label="Gender at birth" value={data?.gender_at_birth} />
        <SummaryRow
          label="Chosen gender"
          value={data?.chosen_gender_after_birth}
        />
        <SummaryRow
          label="Breastfed or bottle"
          value={data?.breastfed_or_bottle}
        />
        <SummaryRow
          label="Birth delivery method"
          value={data?.birth_delivery_method}
        />
        <SummaryRow label="Birth weight" value={data?.birth_weight_lbs} />
        <SummaryRow
          label="Birth order / siblings"
          value={data?.birth_order_siblings}
        />
        <SummaryRow label="Height" value={data?.height} />
        <SummaryRow label="Blood type" value={data?.blood_type} />
        <SummaryRow
          label="Current weight (lbs)"
          value={data?.current_weight_lbs}
        />
        <SummaryRow label="Ideal weight (lbs)" value={data?.ideal_weight_lbs} />
        <SummaryRow
          label="Weight 1 year ago (lbs)"
          value={data?.weight_one_year_ago_lbs}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.BIRTH_BODY}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.BIRTH_BODY]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Health Concerns" onEdit={() => onEditSection(2)}>
        <SummaryRow
          label="Main health concerns"
          value={data?.main_health_concerns}
        />
        <SummaryRow
          label="When first experienced"
          value={data?.when_first_experienced}
        />
        <SummaryRow
          label="How dealt with concerns"
          value={data?.how_dealt_with_concerns}
        />
        <SummaryRow
          label="Success with approaches"
          value={data?.success_with_approaches}
        />
        <SummaryRow
          label="Other practitioners"
          value={data?.other_health_practitioners}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.HEALTH_CONCERNS}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.HEALTH_CONCERNS]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Bowel Health" onEdit={() => onEditSection(3)}>
        <SummaryRow
          label="Bowel movement frequency"
          value={data?.bowel_movement_frequency}
        />
        <SummaryRow
          label="Bowel consistency"
          value={join(data?.bowel_movement_consistency)}
        />
        <SummaryRow
          label="Bowel color"
          value={join(data?.bowel_movement_color)}
        />
        <SummaryRow label="Intestinal gas" value={data?.intestinal_gas} />
        <SummaryRow
          label="Food poisoning history"
          value={data?.food_poisoning_history}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.BOWEL_HEALTH}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.BOWEL_HEALTH]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Stressful Events" onEdit={() => onEditSection(4)}>
        <SummaryRow
          label="Death in family"
          value={data?.trauma_death_family?.status}
        />
        <SummaryRow
          label="Accidental death"
          value={data?.trauma_death_accident?.status}
        />
        <SummaryRow
          label="Sexual / physical abuse"
          value={data?.trauma_sexual_physical_abuse?.status}
        />
        <SummaryRow
          label="Emotional neglect"
          value={data?.trauma_emotional_neglect?.status}
        />
        <SummaryRow
          label="Discrimination"
          value={data?.trauma_discrimination?.status}
        />
        <SummaryRow
          label="Additional notes"
          value={data?.trauma_additional_notes}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.STRESSFUL_EVENTS}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.STRESSFUL_EVENTS]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Medical History" onEdit={() => onEditSection(5)}>
        <SummaryRow
          label="GI conditions"
          value={data?.gastrointestinal_dates}
        />
        <SummaryRow
          label="Hormonal / metabolic"
          value={data?.hormones_metabolic_dates}
        />
        <SummaryRow label="Cardiovascular" value={data?.cardiovascular_dates} />
        <SummaryRow label="Cancer history" value={data?.cancer_dates} />
        <SummaryRow
          label="Neurologic / mood"
          value={data?.neurologic_mood_dates}
        />
        <SummaryRow
          label="Other conditions"
          value={data?.other_conditions_symptoms}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.MEDICAL_HISTORY}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.MEDICAL_HISTORY]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Oral Health" onEdit={() => onEditSection(6)}>
        <SummaryRow
          label="Last dentist visit"
          value={data?.last_dentist_visit}
        />
        <SummaryRow label="Dental regimen" value={data?.oral_dental_regimen} />
        <SummaryRow
          label="Oral health concerns"
          value={data?.oral_health_concerns}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.ORAL_HEALTH}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.ORAL_HEALTH]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Lifestyle History" onEdit={() => onEditSection(7)}>
        <SummaryRow
          label="Exercise / recreation"
          value={data?.exercise_recreation}
        />
        <SummaryRow label="Substance use" value={data?.substance_use_history} />
        <SummaryRow label="Stress handling" value={data?.stress_handling} />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.LIFESTYLE_HISTORY}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.LIFESTYLE_HISTORY]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Sleep History" onEdit={() => onEditSection(8)}>
        <SummaryRow
          label="Satisfied with sleep"
          value={data?.satisfied_with_sleep}
        />
        <SummaryRow
          label="Stay awake all day"
          value={data?.stay_awake_all_day}
        />
        <SummaryRow label="Sleep 6–8 hours" value={data?.sleep_6_8_hours} />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.SLEEP_HISTORY}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.SLEEP_HISTORY]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Women’s Health" onEdit={() => onEditSection(9)}>
        <SummaryRow label="Age first period" value={data?.age_first_period} />
        <SummaryRow label="PMS / pain" value={data?.menses_pms_pain} />
        <SummaryRow label="Birth control" value={data?.birth_control_pills} />
        <SummaryRow
          label="Pregnancy concerns"
          value={data?.conception_pregnancy_problems}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.WOMENS_HEALTH}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.WOMENS_HEALTH]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Sexual History" onEdit={() => onEditSection(10)}>
        <SummaryRow
          label="Sexual functioning concerns"
          value={data?.sexual_functioning_concerns}
        />
        <SummaryRow
          label="Partners past year"
          value={data?.sexual_partners_past_year}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.SEXUAL_HISTORY}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.SEXUAL_HISTORY]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Mental Health" onEdit={() => onEditSection(11)}>
        <SummaryRow label="General moods" value={data?.general_moods} />
        <SummaryRow label="Energy level" value={data?.energy_level_scale} />
        <SummaryRow
          label="Best point in life"
          value={data?.best_point_in_life}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.MENTAL_HEALTH}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.MENTAL_HEALTH]}
            noteId={note?.id}
          />
        )}
      </Section>

      <Section title="Goals & Support" onEdit={() => onEditSection(12)}>
        <SummaryRow
          label="Health goals"
          value={data?.health_goals_aspirations}
        />
        <SummaryRow label="Why achieve goals" value={data?.why_achieve_goals} />
        <SummaryRow
          label="Support system"
          value={data?.family_friends_support}
        />
        {clientId && data && (
          <CoachBlockNote
            clientId={clientId}
            healthHistoryId={data.id}
            blockName={HEALTH_HISTORY_BLOCKS.OTHER}
            initialValue={notesByBlock[HEALTH_HISTORY_BLOCKS.OTHER]}
            noteId={note?.id}
          />
        )}
      </Section>
    </div>
  );
};
