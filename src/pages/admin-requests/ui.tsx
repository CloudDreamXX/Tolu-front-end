import {
  useGetAllAccessRequestsQuery,
  useApproveRequestMutation,
  useDenyRequestMutation,
} from "entities/admin";
import { useState, useRef, useEffect } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

export const AdminRequests = () => {
  const { data, isLoading, isError } = useGetAllAccessRequestsQuery();
  const [approveRequest] = useApproveRequestMutation();
  const [denyRequest] = useDenyRequestMutation();

  const [popupFor, setPopupFor] = useState<string | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setPopupFor(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await approveRequest({ request_id: id }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeny = async (id: string) => {
    try {
      await denyRequest({ request_id: id }).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col gap-[16px] md:gap-[35px] p-8 overflow-y-auto min-h-[calc(100vh-85px)] md:min-h-[calc(100vh-109px)] h-full">
      <div className="flex flex-col md:flex-row gap-[16px] justify-between md:items-end">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <MaterialIcon iconName="person_raised_hand" fill={1} />
          Requests
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-y-auto">
        <div className="grid grid-cols-2 bg-[#C7D8EF] text-[#000000] px-4 py-3 font-semibold text-gray-700">
          <div>User</div>
          <div className="text-right pr-4">Actions</div>
        </div>

        {isLoading && <div className="px-4 py-6 text-gray-500">Loading...</div>}

        {isError && (
          <div className="px-4 py-6 text-red-500">Failed to load requests.</div>
        )}

        {!isLoading && data?.requests?.length === 0 && (
          <div className="px-4 py-6 text-gray-500">No requests found.</div>
        )}

        {data?.requests?.map((req: any) => (
          <div
            key={req.id}
            className="grid grid-cols-2 px-4 py-4 border-t border-gray-200 items-center"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-900">
                {req?.first_name
                  ? `${req?.first_name} ${req?.last_name}`
                  : "Unknown User"}
              </span>
              <span className="text-sm text-gray-600">Email: {req?.email}</span>
              {req?.phone_number && <span className="text-sm text-gray-600">Phone number: {req?.phone_number}</span>}
              {req?.account_type && <span className="text-sm text-gray-600">Account type: {req?.account_type}</span>}
              <span className="text-xs text-gray-400">
                Requested at: {new Date(req.created_at).toLocaleString()}
              </span>
            </div>

            {req?.status === "approved" ? (
              <p className="text-[14px] px-[12px] py-[8px] text-[#4BD37B] ml-auto">
                Approved
              </p>
            ) : (
              <div className="flex flex-row gap-3 justify-end">
                {req?.status === "denied" ? (
                  <p className="text-[14px] px-[12px] py-[8px] text-[#FF1F0F]">
                    Denied
                  </p>
                ) : (
                  <Button
                    className="px-[12px] py-[8px] bg-[#FF1F0F] rounded-[8px]"
                    onClick={() => handleDeny(req.id)}
                  >
                    Deny
                  </Button>
                )}

                {req?.status === "denied" ? (
                  <div className="relative flex items-center justify-center">
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      className="flex items-center justify-center"
                      onClick={() => setPopupFor(req.id)}
                    >
                      <MaterialIcon iconName="more_vert" />
                    </Button>

                    {popupFor === req.id && (
                      <div
                        ref={popupRef}
                        className="absolute right-0 mt-16 bg-white border rounded-lg shadow-lg z-50"
                      >
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          className="w-full text-center px-[12px] py-[8px] rounded-[8px] hover:bg-gray-100 text-[#4BD37B] text-[14px]"
                          onClick={() => {
                            handleApprove(req.id);
                            setPopupFor(null);
                          }}
                        >
                          Approve
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    className="px-[12px] py-[8px] bg-[#4BD37B] rounded-[8px]"
                    onClick={() => handleApprove(req.id)}
                  >
                    Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
