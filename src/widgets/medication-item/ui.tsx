import { memo } from "react";
import { Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { FileBadge } from "widgets/notes-item/ui";
import { toUserTZ } from "widgets/message-tabs/helpers";
import { Medication } from "entities/health-history";

export const MedicationItem = memo(function MedicationItem({
    medication,
    onEdit,
    onDelete,
}: {
    medication: Medication;
    onEdit: (id: string, title: string, content: string) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <div className="flex justify-between gap-3 p-3 mb-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <div className="min-w-0">
                {medication.title && (
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 truncate">
                        {medication.title}
                    </h4>
                )}

                {medication.content && (
                    <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
                        {medication.content}
                    </p>
                )}

                {medication.file_info && (
                    <div className="mt-2">
                        <FileBadge
                            fi={medication.file_info}
                        />
                    </div>
                )}

                <p className="mt-2 text-xs text-gray-500">
                    • Created: {toUserTZ(medication.created_at).toLocaleString()}
                </p>

                <p className="mt-2 text-xs text-gray-500">
                    • Updated: {toUserTZ(medication.updated_at).toLocaleString()}
                </p>
            </div>

            <div className="flex items-start flex-shrink-0 gap-1">
                <Button
                    value="ghost"
                    aria-label="Edit"
                    onClick={() =>
                        onEdit(medication.id, medication.title ?? "", medication.content)
                    }
                >
                    <MaterialIcon iconName="edit" className="w-4 h-4 p-0 text-black" />
                </Button>

                <Button
                    value="ghost"
                    aria-label="Delete"
                    onClick={() => onDelete(medication.id)}
                >
                    <MaterialIcon
                        iconName="delete"
                        fill={1}
                        className="w-4 h-4 p-0 text-red-500"
                    />
                </Button>
            </div>
        </div>
    );
});
