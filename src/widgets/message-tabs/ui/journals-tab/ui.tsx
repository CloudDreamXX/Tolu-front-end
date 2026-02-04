import { SymptomData, symptomsTrackerApi } from "entities/symptoms-tracker";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { CalendarBlock } from "widgets/dayli-journal/ui";

type Props = {
    clientId: string;
};

export const CoachDailyJournal = ({ clientId }: Props) => {
    const getFormattedDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const [selectedDate, setSelectedDate] = useState<string>(getFormattedDate());
    const [records, setRecords] = useState<SymptomData[]>([]);
    const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

    const { data } =
        symptomsTrackerApi.endpoints.getSymptomsByDateForCoach.useQuery({ clientId: clientId, targetDate: selectedDate });

    useEffect(() => {
        if (!data?.data?.length) {
            setRecords([]);
            setSelectedRecordId(null);
            return;
        }

        const sorted = [...data.data].sort(
            (a, b) =>
                new Date(b.created_at || "").getTime() -
                new Date(a.created_at || "").getTime()
        );

        setRecords(sorted);
        setSelectedRecordId(sorted[0].id || null);
    }, [data]);

    const selectedRecord =
        records.find((r) => r.id === selectedRecordId) || records[0];

    const formatTimeHM = (iso?: string) => {
        if (!iso) return "";
        const d = new Date(iso);
        return `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes()
        ).padStart(2, "0")}`;
    };

    return (
        <div className="flex flex-col gap-6 w-full overflow-y-auto h-[calc(100vh-156px)]">
            {/* Date picker */}
            <CalendarBlock
                selectedDate={selectedDate}
                handleDateChange={(date) => {
                    const formatted = new Date(
                        date.getTime() - date.getTimezoneOffset() * 60000
                    )
                        .toISOString()
                        .split("T")[0];
                    setSelectedDate(formatted);
                }}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4">
                <h1 className="text-2xl font-semibold text-[#1D1D1F]">
                    Daily Journal Overview
                </h1>

                {records.length > 1 && (
                    <Select
                        value={selectedRecordId ?? undefined}
                        onValueChange={setSelectedRecordId}
                    >
                        <SelectTrigger className="w-[160px] h-10">
                            <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[240px]">
                            <SelectGroup>
                                {records.map((r) => (
                                    <SelectItem key={r.id} value={r.id || ""}>
                                        {formatTimeHM(r.created_at)}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            </div>

            {!selectedRecord ? (
                <div className="text-sm text-[#5F5F65]">No entries for this date</div>
            ) : (
                <>
                    {/* Symptoms */}
                    <SummaryBlock title="Most Noticeable Symptoms">
                        {selectedRecord.symptoms?.map((s) => (
                            <Tag key={s}>{s}</Tag>
                        ))}
                    </SummaryBlock>

                    {/* Duration */}
                    <SummaryBlock title="Duration">
                        <Tag>{selectedRecord.duration_category}</Tag>
                    </SummaryBlock>

                    {/* Triggers */}
                    <SummaryBlock title="Suspected Triggers">
                        {selectedRecord.suspected_triggers?.map((t) => (
                            <Tag key={t}>{t}</Tag>
                        ))}
                    </SummaryBlock>

                    {/* Sleep */}
                    <SummaryBlock title="Sleep Summary">
                        <Tag>
                            Total sleep: {selectedRecord.sleep_hours}h{" "}
                            {selectedRecord.sleep_minutes}m
                        </Tag>
                        <Tag>Woke up: {selectedRecord.times_woke_up}</Tag>
                        <Tag>Fell back: {selectedRecord.how_fell_asleep}</Tag>
                        <Tag>Quality: {selectedRecord.sleep_quality}</Tag>
                    </SummaryBlock>

                    {/* Meals */}
                    <SummaryBlock title="Meals">
                        {selectedRecord.meal_details?.map((meal) => (
                            <div key={meal.meal_type} className="flex gap-2">
                                <MaterialIcon iconName="lightbulb" />
                                <span className="font-medium capitalize">
                                    {meal.meal_type}:
                                </span>
                                <span>{meal.food_items || "-"}</span>
                                {meal.time && <span>({meal.time})</span>}
                            </div>
                        ))}
                    </SummaryBlock>

                    {/* Notes */}
                    {selectedRecord.user_notes && (
                        <SummaryBlock title="Client Notes">
                            <p className="text-sm text-[#1D1D1F]">
                                {selectedRecord.user_notes}
                            </p>
                        </SummaryBlock>
                    )}
                </>
            )}
        </div>
    );
};

const SummaryBlock = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="flex flex-col gap-3 bg-white rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-[#1D1D1F]">{title}</h2>
        <div className="flex flex-wrap gap-2">{children}</div>
    </div>
);

const Tag = ({ children }: { children: React.ReactNode }) => (
    <div className="px-4 py-2 bg-[#F3F7FD] rounded-md text-sm text-[#1D1D1F]">
        {children}
    </div>
);
