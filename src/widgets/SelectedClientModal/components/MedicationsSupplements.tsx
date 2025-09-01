import React, { useEffect, useState } from "react";
import { MedicationsAndSupplements, MedicationInfo } from "entities/coach";
import { usePageWidth } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export type Medication = {
  medication_id: string;
  name: string;
  dosage: string;
  takingSince: string;
  prescribed: string;
  status: string;
};

export type MedsData = {
  previous: Medication[];
  current: Medication[];
};

export type MedsEditing = {
  section: "previous" | "current";
  index: number;
} | null;

const PillInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...rest
}) => (
  <input
    {...rest}
    className={[
      "w-full rounded-[12px] border border-[#DBDEE1] bg-white",
      "px-[16px] py-[10px] text-[14px] text-[#1D1D1F] outline-none",
      className,
    ].join(" ")}
  />
);

const ColumnLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[12px] font-semibold text-[#5F5F65]">{children}</div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <h3 className="text-[16px] font-bold text-[#1C63DB]">{children}</h3>;

const RowView: React.FC<{ med: Medication; onEdit: () => void }> = ({
  med,
  onEdit,
}) => (
  <div className="relative">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-x-[8px] gap-y-1 p-[16px] md:p-0 bg-white md:bg-transparent rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-0">
      <ColumnLabel>Name</ColumnLabel>
      <div className="md:hidden text-[16px] text-[#1D1D1F]">{med.name}</div>
      <ColumnLabel>Dosage</ColumnLabel>
      <div className="md:hidden text-[16px] text-[#1D1D1F]">{med.dosage}</div>
      <ColumnLabel>Taking since</ColumnLabel>
      <div className="md:hidden text-[16px] text-[#1D1D1F]">
        {med.takingSince}
      </div>
      <ColumnLabel>Prescribed</ColumnLabel>
      <div className="md:hidden text-[16px] text-[#1D1D1F]">
        {med.prescribed}
      </div>
      <ColumnLabel>Status</ColumnLabel>
      <div className="md:hidden text-[16px] text-[#1D1D1F]">{med.status}</div>

      <div className="hidden md:block text-[16px] text-[#1D1D1F]">
        {med.name}
      </div>
      <div className="hidden md:block text-[16px] text-[#1D1D1F]">
        {med.dosage}
      </div>
      <div className="hidden md:block text-[16px] text-[#1D1D1F]">
        {med.takingSince}
      </div>
      <div className="hidden md:block text-[16px] text-[#1D1D1F]">
        {med.prescribed}
      </div>
      <div className="hidden md:block text-[16px] text-[#1D1D1F]">
        {med.status}
      </div>
    </div>

    <button
      onClick={onEdit}
      className="absolute right-[16px] md:right-0 top-1/2 -translate-y-1/2 md:-bottom-5 p-1 rounded hover:bg-black/5"
      title="Edit"
      aria-label="Edit row"
    >
      <MaterialIcon iconName="edit" fill={1} />
    </button>
  </div>
);

const RowEdit: React.FC<{
  med: Medication;
  onChange: (next: Medication) => void;
}> = ({ med, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-x-[8px] gap-y-1 md:py-[8px] p-[16px] md:p-0 bg-white md:bg-transparent rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-0">
    <ColumnLabel>Name</ColumnLabel>
    <PillInput
      value={med.name}
      onChange={(e) => onChange({ ...med, name: e.target.value })}
      placeholder="Medication name"
      className="md:hidden"
    />
    <ColumnLabel>Dosage</ColumnLabel>
    <PillInput
      value={med.dosage}
      onChange={(e) => onChange({ ...med, dosage: e.target.value })}
      placeholder="e.g., 50 mcg daily"
      className="md:hidden"
    />
    <ColumnLabel>Taking since</ColumnLabel>
    <PillInput
      value={med.takingSince}
      onChange={(e) => onChange({ ...med, takingSince: e.target.value })}
      placeholder="DD.MM.YYYY"
      className="md:hidden"
    />
    <ColumnLabel>Prescribed</ColumnLabel>
    <PillInput
      value={med.prescribed}
      onChange={(e) => onChange({ ...med, prescribed: e.target.value })}
      placeholder="Prescriber"
      className="md:hidden"
    />
    <ColumnLabel>Status</ColumnLabel>
    <PillInput
      value={med.status}
      onChange={(e) => onChange({ ...med, status: e.target.value })}
      placeholder="Active / not active"
      className="md:hidden"
    />

    <PillInput
      value={med.name}
      onChange={(e) => onChange({ ...med, name: e.target.value })}
      placeholder="Medication name"
      className="hidden md:block"
    />
    <PillInput
      value={med.dosage}
      onChange={(e) => onChange({ ...med, dosage: e.target.value })}
      placeholder="e.g., 50 mcg daily"
      className="hidden md:block"
    />
    <PillInput
      value={med.takingSince}
      onChange={(e) => onChange({ ...med, takingSince: e.target.value })}
      placeholder="DD.MM.YYYY"
      className="hidden md:block"
    />
    <PillInput
      value={med.prescribed}
      onChange={(e) => onChange({ ...med, prescribed: e.target.value })}
      placeholder="Prescriber"
      className="hidden md:block"
    />
    <PillInput
      value={med.status}
      onChange={(e) => onChange({ ...med, status: e.target.value })}
      placeholder="Active / not active"
      className="hidden md:block"
    />
  </div>
);

const TableCard: React.FC<{
  title: string;
  rows: Medication[];
  onRowsChange: (next: Medication[]) => void;
  editing: MedsEditing;
  setEditing: (e: MedsEditing) => void;
  section: "previous" | "current";
}> = ({ title, rows, onRowsChange, editing, setEditing, section }) => {
  const editingIndex = editing?.section === section ? editing.index : -1;
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isMobile } = usePageWidth();

  return (
    <div>
      <div
        className="flex justify-between text-[#1C63DB]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <SectionTitle>{title}</SectionTitle>
        <span className={`md:hidden ${isExpanded ? "rotate-[180deg]" : ""}`}>
          <MaterialIcon iconName="keyboard_arrow_right" />
        </span>
      </div>

      {(isExpanded || !isMobile) && (
        <div className="flex flex-col gap-[16px] mt-[8px]">
          {rows.map((med, idx) => (
            <div key={idx}>
              {editingIndex === idx ? (
                <RowEdit
                  med={med}
                  onChange={(next) => {
                    const copy = [...rows];
                    copy[idx] = next;
                    onRowsChange(copy);
                  }}
                />
              ) : (
                <RowView
                  med={med}
                  onEdit={() => setEditing({ section, index: idx })}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

type Props = {
  client: MedicationsAndSupplements;
  editing: MedsEditing;
  setEditing: (e: MedsEditing) => void;
  onChange?: (next: MedicationsAndSupplements) => void;
};

const EMPTY_MED: Medication = {
  medication_id: "",
  name: "",
  dosage: "",
  takingSince: "",
  prescribed: "",
  status: "",
};

const ensureAtLeastOneRow = (arr: Medication[]): Medication[] =>
  arr && arr.length > 0 ? arr : [{ ...EMPTY_MED }];

const fromInfo = (m: MedicationInfo): Medication => ({
  medication_id: m.medication_id ?? "",
  name: m.name ?? "",
  dosage: m.dosage ?? "",
  takingSince: m.prescribed_date ?? "",
  prescribed: m.prescribed_by ?? "",
  status: m.status ?? "",
});

const toInfo = (m: Medication): MedicationInfo => ({
  medication_id: m.medication_id,
  name: m.name,
  dosage: m.dosage,
  prescribed_date: m.takingSince,
  prescribed_by: m.prescribed,
  status: m.status,
});

const toApiShape = (v: MedsData): MedicationsAndSupplements => ({
  previous_medications: (v.previous || []).map(toInfo),
  current_medications: (v.current || []).map(toInfo),
});

const fromClient = (c: MedicationsAndSupplements): MedsData => {
  const prev = ensureAtLeastOneRow(
    (c?.previous_medications ?? []).map(fromInfo)
  );
  const curr = ensureAtLeastOneRow(
    (c?.current_medications ?? []).map(fromInfo)
  );
  return { previous: prev, current: curr };
};

const MedicationsSupplements: React.FC<Props> = ({
  client,
  editing,
  setEditing,
  onChange,
}) => {
  const [rows, setRows] = useState<MedsData>(() => fromClient(client));

  useEffect(() => {
    setRows(fromClient(client));
  }, [client]);

  useEffect(() => {
    if (onChange) onChange(toApiShape(rows));
  }, [rows, onChange]);

  return (
    <div className="flex flex-col gap-[24px] pr-1">
      <TableCard
        title="Previous Medications"
        rows={rows.previous}
        onRowsChange={(next) =>
          setRows((r) => ({ ...r, previous: ensureAtLeastOneRow(next) }))
        }
        editing={editing}
        setEditing={setEditing}
        section="previous"
      />

      <TableCard
        title="Current Medications"
        rows={rows.current}
        onRowsChange={(next) =>
          setRows((r) => ({ ...r, current: ensureAtLeastOneRow(next) }))
        }
        editing={editing}
        setEditing={setEditing}
        section="current"
      />
    </div>
  );
};

export default MedicationsSupplements;
