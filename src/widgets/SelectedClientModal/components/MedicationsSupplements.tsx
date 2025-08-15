import React, { useState } from "react";
import Chevron from "shared/assets/icons/chevron";
import EditIcon from "shared/assets/icons/edit";
import { usePageWidth } from "shared/lib";

export type Medication = {
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
}) => <h3 className="text-[18px] font-bold text-[#1C63DB]">{children}</h3>;

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
      className="absolute right-[16px] md:-right-1 top-[16px] md:top-1 p-1 rounded hover:bg-black/5"
      title="Edit"
      aria-label="Edit row"
    >
      <EditIcon />
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
          <Chevron />
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
  value: MedsData;
  onChange: (next: MedsData) => void;
  editing: MedsEditing;
  setEditing: (e: MedsEditing) => void;
};

const MedicationsSupplements: React.FC<Props> = ({
  value,
  onChange,
  editing,
  setEditing,
}) => (
  <div className="flex flex-col gap-[24px]">
    <TableCard
      title="Previous Medications"
      rows={value.previous}
      onRowsChange={(rows) => onChange({ ...value, previous: rows })}
      editing={editing}
      setEditing={setEditing}
      section="previous"
    />

    <TableCard
      title="Current Medications"
      rows={value.current}
      onRowsChange={(rows) => onChange({ ...value, current: rows })}
      editing={editing}
      setEditing={setEditing}
      section="current"
    />
  </div>
);

export default MedicationsSupplements;
