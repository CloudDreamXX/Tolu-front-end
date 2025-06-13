import React from "react";
import TrashIcon from "shared/assets/icons/trash-icon";

export const ConfirmDeleteModal = ({
  onCancel,
  onDelete,
}: {
  onCancel: () => void;
  onDelete: () => void;
}) => (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg mx-[16px]">
      <h2 className="text-[20px] font-semibold text-[#1D1D1F] flex flex-col md:flex-row md:items-center gap-[10px] md:gap-[8px] mb-[12px]">
        <TrashIcon fill="#1D1D1F" /> Are you sure you want to delete this user?
      </h2>
      <p className="text-[14px] text-[#5F5F65] font-[500] mb-[24px]">
        This action is permanent and cannot be undone. All associated data and
        access will be removed.
      </p>
      <div className="flex justify-between gap-[8px]">
        <button
          className="p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#FF1F0F] text-white text-[16px] font-semibold"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);
