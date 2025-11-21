import { ChatSocketService } from "entities/chat";
import {
  ClientDetails,
  ClientProfile,
  InviteClientPayload,
  useDeleteClientMutation,
  useEditClientMutation,
  useGetManagedClientsQuery,
  useInviteClientMutation,
  useLazyGetClientInfoQuery,
  useLazyGetClientProfileQuery,
} from "entities/coach";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmIcon from "shared/assets/icons/confirm";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { usePageWidth } from "shared/lib";
import { toast } from "shared/lib/hooks/use-toast";
import { Button, Dialog, DialogContent, DialogTrigger, Input } from "shared/ui";
import { AddClientModal } from "widgets/AddClientModal/ui";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { ConfirmDiscardModal } from "widgets/ConfirmDiscardModal";
import { EditClientModal } from "widgets/EditClientModal";
import { EmptyStateTolu } from "widgets/empty-state-tolu";
import { ResizableLibraryChat } from "widgets/library-small-chat/components/ResizableSmallChat";
import { SelectedClientModal } from "widgets/SelectedClientModal";

const PAGE_SIZE = 10;

export const ContentManagerClients: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClient, setSelectedClient] = useState<ClientProfile>({
    client_info: {
      id: "",
      name: "",
      gender: "",
      last_activity: "",
      chief_concerns: "",
      recent_updates: "",
      cycle_status: "",
      menopause_status: "",
      learning_now: {
        total_shared: 0,
        recent_items: [],
      },
      recent_interventions: "",
      recent_labs: "",
    },
    health_profile: {
      intakes: {
        challenges: "",
        symptoms: "",
      },
      health_timeline: {
        diagnosis: "",
        medication: "",
      },
    },
    personal_insights: {},
    labs: {},
  });
  const [clientInfo, setClientInfo] = useState<ClientDetails>({
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    primary_health_challenge: "",
    connection_source: "",
    working_duration: "",
    is_primary_coach: "",
    focus_areas: [],
    tolu_benefit: "",
    collaborative_usage: "",
    created_at: "",
    permission_type: "",
  });
  const [newClient, setNewClient] = useState<InviteClientPayload>({
    first_name: "",
    last_name: "",
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    primary_health_challenge: "",
    connection_source: "",
    working_duration: "",
    is_primary_coach: "",
    focus_areas: [],
    tolu_benefit: "",
    collaborative_usage: "",
    permission_type: "",
  });
  const [deleteMenuId, setDeleteMenuId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("healthProfile");
  const [editModal, setEditModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [activeEditTab, setActiveEditTab] = useState<string>("editClientInfo");
  const { isMobile, isTablet, isMobileOrTablet } = usePageWidth();
  const [popupClientId, setPopupClientId] = useState<string | null>(null);
  const [inviteSuccessPopup, setInviteSuccessPopup] = useState<boolean>(false);
  const [importClientsPopup, setImportClientsPopup] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [widthPercent, setWidthPercent] = useState(50);

  const {
    data: clientsData,
    refetch: refetchClients,
    isLoading: loading,
  } = useGetManagedClientsQuery();
  const [inviteClient] = useInviteClientMutation();
  const [deleteClient] = useDeleteClientMutation();
  const [editClient] = useEditClientMutation();
  const [getClientInfo] = useLazyGetClientInfoQuery();
  const [getClientProfile] = useLazyGetClientProfileQuery();

  const contentRef = useRef<HTMLDivElement>(null);
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setIsWide(width > 480);
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "invitation_requested" ||
        message.notification.type === "client_joined" ||
        message.notification.type === "message"
      ) {
        toast({
          title: message.notification.title,
          description: message.notification.message,
        });
      }
    };

    ChatSocketService.on("notification", (message: any) =>
      handleNewMessage(message)
    );

    return () => {
      ChatSocketService.off("notification", (message: any) =>
        handleNewMessage(message)
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        deleteMenuId &&
        !(
          document
            .querySelector(`[data-delete-menu-id="${deleteMenuId}"]`)
            ?.contains(target) ||
          (event.target as HTMLElement).closest('[data-delete-trigger="true"]')
        )
      ) {
        setDeleteMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [deleteMenuId]);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return clientsData?.clients;
    return clientsData?.clients.filter((c) => {
      const name = (c.name ?? "").toLowerCase();
      const status = (c.status ?? "").toLowerCase();
      return name.includes(q) || status.includes(q);
    });
  }, [clientsData, searchQuery]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredClients?.slice(start, start + PAGE_SIZE);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil((filteredClients?.length ?? 0) / PAGE_SIZE);

  const handleCancelEdit = () => {
    setConfirmDiscard(true);
  };

  const cleanState = () => {
    setSelectedClient({
      client_info: {
        id: "",
        name: "",
        gender: "",
        last_activity: "",
        chief_concerns: "",
        recent_updates: "",
        cycle_status: "",
        menopause_status: "",
        learning_now: {
          total_shared: 0,
          recent_items: [],
        },
        recent_interventions: "",
        recent_labs: "",
      },
      health_profile: {
        intakes: {
          challenges: "",
          symptoms: "",
        },
        health_timeline: {
          diagnosis: "",
          medication: "",
        },
      },
      personal_insights: {},
      labs: {},
    });
    setClientInfo({
      first_name: "",
      last_name: "",
      full_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "",
      primary_health_challenge: "",
      connection_source: "",
      working_duration: "",
      is_primary_coach: "",
      focus_areas: [],
      tolu_benefit: "",
      collaborative_usage: "",
      created_at: "",
      permission_type: "",
    });
    setNewClient({
      first_name: "",
      last_name: "",
      full_name: "",
      email: "",
      phone_number: "",
      date_of_birth: "",
      primary_health_challenge: "",
      connection_source: "",
      working_duration: "",
      is_primary_coach: "",
      focus_areas: [],
      tolu_benefit: "",
      collaborative_usage: "",
      permission_type: "",
    });
  };

  const discardChanges = () => {
    setEditModal(false);
    setAddModal(false);
    cleanState();
    setConfirmDiscard(false);
  };

  const updateClient = (field: string, value: any) => {
    if (addModal) {
      setNewClient((prev) => ({ ...prev, [field]: value }));
    } else if (editModal) {
      setClientInfo((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleEditSuccess = async () => {
    editClient({
      clientId: selectedClient.client_info.id,
      payload: clientInfo,
    });
    setEditModal(false);
    cleanState();
  };

  const handleInviteClient = async (formValues: InviteClientPayload) => {
    try {
      inviteClient({ payload: formValues });
      setAddModal(false);
      refetchClients();
      toast({
        title: "Invited successfully",
      });
    } catch (error) {
      console.error("Error inviting client", error);
      toast({
        variant: "destructive",
        title: "Failed to invite client",
        description: "Failed to invite client. Please try again.",
      });
    }
  };

  const handleSelectClient = async (clientId: string) => {
    try {
      const { data: fullClient } = await getClientProfile(clientId);
      if (fullClient) {
        setSelectedClient(fullClient);
      }

      const { data: editClientInfo } = await getClientInfo(clientId);
      if (editClientInfo && editClientInfo.client) {
        setClientInfo(editClientInfo.client);
      }
    } catch (e) {
      console.error("Error loading client profile", e);
      toast({
        variant: "destructive",
        title: "Failed to load client profile",
        description: "Failed to load client profile. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedClient) return;

    try {
      await deleteClient(selectedClient.client_info.id);
      refetchClients();
      toast({
        title: "Deleted successfully",
      });
    } catch (err) {
      console.error("Failed to delete client", err);
      toast({
        variant: "destructive",
        title: "Failed to delete client",
        description: "Failed to delete client. Please try again.",
      });
    } finally {
      setConfirmDelete(false);
      cleanState();
    }
  };

  const handleNewClientSave = () => {
    handleInviteClient(newClient);
    cleanState();
    setAddModal(false);
    setInviteSuccessPopup(true);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / 1024).toFixed(0)} KB`);

    try {
      await inviteClient({ payload: null, file });
      refetchClients();
      toast({
        title: "File imported successfully",
      });
      setInviteSuccessPopup(true);
      setImportClientsPopup(false);
      setUploadedFileName(null);
    } catch (error) {
      console.error("Error importing clients", error);
      toast({
        variant: "destructive",
        title: "Failed to import clients",
        description: "An error occurred during import. Please try again.",
      });
    }
  };

  const ClientSkeletonRow = () => {
    return (
      <div
        className="
      md:grid md:grid-cols-5 md:items-center md:py-[12px]
      flex flex-col gap-2 p-[12px] border border-[#AAC6EC] rounded-[8px] bg-white 
      md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:border-[#DBDEE1] animate-pulse
    "
      >
        {Array(5)
          .fill(0)
          .map((_, i) =>
            i === 4 ? (
              <div
                key={i}
                className="hidden md:flex items-center justify-end gap-[24px]"
              >
                {[...Array(1)].map((_, j) => (
                  <div
                    key={j}
                    className="h-[24px] w-[39px] skeleton-gradient rounded-[1000px]"
                  />
                ))}
              </div>
            ) : (
              <div
                key={i}
                className="h-[10px] w-full md:w-[80px] lg:w-[100px] skeleton-gradient rounded-[24px]"
              />
            )
          )}
      </div>
    );
  };

  const handleResendInvite = async (clientId: string) => {
    try {
      const { data: currentClientInfo } = await getClientInfo(clientId);

      if (currentClientInfo && currentClientInfo.client) {
        await handleInviteClient(currentClientInfo.client);
      }
      toast({
        title: "Invite resent successfully",
      });
    } catch (e) {
      console.error("Failed to resend invite", e);
      toast({
        variant: "destructive",
        title: "Failed to resend invite",
        description: "Please try again.",
      });
    }
  };

  return (
    <div className={`flex gap-6 p-4 ${isWide ? "p-8" : ""} xl:p-0 h-screen`}>
      <div
        ref={contentRef}
        className={`flex flex-col overflow-y-auto xl:p-8 xl:pr-0 h-full w-full
    ${isWide ? "gap-[24px] p-0" : "gap-[16px]"}`}
        style={{ width: isMobileOrTablet ? "100%" : `${100 - widthPercent}%` }}
      >
        {loading ? (
          <div className={`${isWide ? "lg:mt-4 rounded-[8px]" : ""}`}>
            <div
              className={`hidden ${isWide ? "grid" : ""} grid-cols-5 bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[24px] py-[22px]`}
            >
              <div className="h-[10px] w-[60px] xl:w-[80px] skeleton-gradient rounded-[24px]" />
              <div className="h-[10px] w-[60px] xl:w-[80px] skeleton-gradient rounded-[24px]" />
              <div className="h-[10px] w-[60px] xl:w-[80px] skeleton-gradient rounded-[24px]" />
              <div className="h-[10px] w-[60px] xl:w-[80px] skeleton-gradient rounded-[24px]" />
              <div className="pr-4 text-right"></div>
            </div>
            <div
              className={`flex flex-col gap-4 pb-[16px] ${isWide ? "bg-white gap-0" : ""}`}
            >
              {Array.from({ length: 10 }).map((_, i) => (
                <ClientSkeletonRow key={i} />
              ))}
            </div>
          </div>
        ) : clientsData && clientsData.clients.length === 0 ? (
          <EmptyStateTolu
            text="Invite your clients to Tolu to deliver personalized education or insight unique to their personal health challenges."
            footer={
              <div className="flex gap-4">
                <Button
                  variant="brightblue"
                  className="min-w-40"
                  onClick={() => {
                    cleanState();
                    setActiveEditTab("editClientInfo");
                    setAddModal(true);
                  }}
                >
                  Invite a client
                </Button>

                <Dialog
                  open={importClientsPopup}
                  onOpenChange={setImportClientsPopup}
                >
                  <DialogTrigger>
                    <Button
                      variant="blue2"
                      className={`text-black border border-blue-600 w-full ${isWide ? "w-fit" : ""} min-w-40`}
                    >
                      Upload client list
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`${isWide ? "max-w-3xl" : ""} gap-6 left-[50%] bottom-auto top-[50%] rounded-[18px] z-50 grid translate-x-[-50%] translate-y-[-50%] mx-[16px]`}
                  >
                    {uploadedFileName ? (
                      <div className="w-full max-w-[330px]">
                        <p className="text-left  text-black text-base font-medium mb-[8px]">
                          Import PDF
                        </p>
                        <div className="w-full relative border border-[#1C63DB] rounded-[8px] px-[16px] py-[12px] flex items-center gap-3">
                          <MaterialIcon iconName="docs" fill={1} />
                          <div className="flex flex-col leading-[1.2]">
                            <p className="text-[14px]  text-black font-semibold">
                              {uploadedFileName}
                            </p>
                            <p className="text-[12px]  text-[#5F5F65]">
                              {uploadedFileSize}
                            </p>
                          </div>
                          <Button
                            variant={"unstyled"}
                            size={"unstyled"}
                            onClick={() => {
                              setUploadedFileName(null);
                              setUploadedFileSize(null);
                            }}
                            className="absolute top-[6px] right-[6px]"
                          >
                            <MaterialIcon iconName="close" size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Drop Zone
                      <div className="w-full">
                        <p className="text-left text-black text-base font-medium mb-[8px]">
                          Import СSV/XLSX
                        </p>
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          tabIndex={0}
                          aria-label="Upload client list"
                          className={`w-full border ${dragOver ? "border-[#0057C2]" : "border-dashed border-[#1C63DB]"} rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer`}
                          onClick={handleUploadClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleUploadClick();
                            }
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                        >
                          <MaterialIcon
                            iconName="cloud_upload"
                            fill={1}
                            className="text-[#1C63DB] p-2 border rounded-xl"
                          />
                          <div className="text-[#1C63DB] text-[14px] font-semibold">
                            Click {isMobile || isTablet ? "" : "or drag"} to
                            upload
                          </div>
                          <p className="text-[#5F5F65] text-[14px] mt-[4px]">
                            СSV/XLSX
                          </p>
                        </Button>
                      </div>
                    )}

                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div
              className={`flex flex-wrap gap-[16px] justify-between ${isWide ? "items-end flex-row" : "flex-col"}`}
            >
              <div className="flex flex-col gap-2">
                <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
                  <MaterialIcon iconName="person_search" fill={1} />
                  Client List
                </h1>
                <p>
                  Use the list below to filter, search, and take action on
                  individual client records.
                </p>
              </div>
              <div
                className={`flex ${isWide ? "flex-row gap-[50px] md:gap-2" : "flex-col gap-2"} w-full`}
              >
                <div
                  className={`flex gap-[8px] items-center ${isWide ? "lg:w-[300px]" : "w-full"} rounded-full border border-[#DBDEE1] px-[12px] py-[8px] bg-white h-[40px]`}
                >
                  <MaterialIcon iconName="search" size={16} />
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="outline-none w-full placeholder-custom text-[14px] font-semibold text-[#000] border-none h-9"
                  />
                </div>
                <Button
                  variant={"brightblue"}
                  className={`h-[40px] ${isWide ? "w-fit ml-auto" : "w-full"}`}
                  onClick={() => {
                    cleanState();
                    setActiveEditTab("editClientInfo");
                    setAddModal(true);
                  }}
                >
                  Add new client
                  <MaterialIcon iconName="add" size={20} />
                </Button>
                <Dialog
                  open={importClientsPopup}
                  onOpenChange={setImportClientsPopup}
                >
                  <DialogTrigger>
                    <Button
                      variant="blue2"
                      className={`text-black border border-blue-600 ${isWide ? "w-fit" : "w-full"} min-w-40`}
                    >
                      Upload client list
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`${isWide ? "max-w-3xl" : ""} gap-6 left-[50%] bottom-auto top-[50%] rounded-[18px] z-50 grid translate-x-[-50%] translate-y-[-50%] mx-[16px]`}
                  >
                    {uploadedFileName ? (
                      <div className="w-full max-w-[330px]">
                        <p className="text-left  text-black text-base font-medium mb-[8px]">
                          Import PDF
                        </p>
                        <div className="w-full relative border border-[#1C63DB] rounded-[8px] px-[16px] py-[12px] flex items-center gap-3">
                          <MaterialIcon iconName="docs" fill={1} />
                          <div className="flex flex-col leading-[1.2]">
                            <p className="text-[14px]  text-black font-semibold">
                              {uploadedFileName}
                            </p>
                            <p className="text-[12px]  text-[#5F5F65]">
                              {uploadedFileSize}
                            </p>
                          </div>
                          <Button
                            variant={"unstyled"}
                            size={"unstyled"}
                            onClick={() => {
                              setUploadedFileName(null);
                              setUploadedFileSize(null);
                            }}
                            className="absolute top-[6px] right-[6px]"
                          >
                            <MaterialIcon iconName="close" size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Drop Zone
                      <div className="w-full">
                        <p className="text-left  text-black text-base font-medium mb-[8px]">
                          Import СSV/XLSX
                        </p>
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          tabIndex={0}
                          aria-label="Upload client list"
                          className={`w-full border ${dragOver ? "border-[#0057C2]" : "border-dashed border-[#1C63DB]"} rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer`}
                          onClick={handleUploadClick}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleUploadClick();
                            }
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOver(true);
                          }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                        >
                          <MaterialIcon
                            iconName="cloud_upload"
                            fill={1}
                            className="text-[#1C63DB] p-2 border rounded-xl"
                          />
                          <div className="text-[#1C63DB] text-[14px] font-semibold">
                            Click {isMobile || isTablet ? "" : "or drag"} to
                            upload
                          </div>
                          <p className="text-[#5F5F65] text-[14px] mt-[4px]">
                            СSV/XLSX
                          </p>
                        </Button>
                      </div>
                    )}

                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className={`${isWide ? "rounded-[8px]" : ""}`}>
              <div
                className={`${isWide ? "grid" : "hidden"} grid-cols-5 bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[12px] py-[16px]`}
              >
                <div className="flex items-center justify-center">
                  Full name
                </div>
                <div className="flex items-center justify-center">Status</div>
                <div className="flex items-center justify-center">Summary</div>
                <div className="flex items-center justify-center">Message</div>
                <div className="flex items-center justify-center"></div>
              </div>

              <div
                className={`flex flex-col gap-4 pb-[16px] ${isWide ? "bg-white gap-0" : ""}`}
              >
                {paginatedClients?.map((client, idx) => (
                  <div
                    key={idx}
                    className={`${isWide ? "grid grid-cols-5 items-center p-[12px] rounded-none border-x-0 border-t-0 border-b border-[#DBDEE1]" : "flex flex-col"} gap-2 p-[16px] border border-[#AAC6EC] rounded-[8px] bg-white`}
                  >
                    <div
                      className={`${isWide ? "text-[16px] border-none pb-0" : "border-b border-[#F3F6FB] pb-[10px]"} flex items-center`}
                    >
                      <div
                        className={`w-full ${isWide ? "hidden" : ""} text-[14px] text-[#5F5F65]`}
                      >
                        Name
                      </div>
                      <div className="flex items-center justify-center w-full text-[16px] font-semibold text-center">
                        {(client.first_name && client.last_name)
                          ? `${client.first_name} ${client.last_name}`
                          : client.first_name || client.name}
                      </div>
                    </div>

                    <div
                      className={`${isWide ? "text-[16px] border-none pb-0" : "border-b border-[#F3F6FB] pb-[10px]"} flex items-center`}
                    >
                      <div
                        className={`w-full ${isWide ? "hidden" : ""} text-[14px] text-[#5F5F65]`}
                      >
                        Status
                      </div>
                      <div className="w-full text-[16px] flex items-center justify-center">
                        {client.status === "waiting to accept invite" ? (
                          <div className="flex flex-col items-center justify-center ">
                            Pending
                            <Button
                              variant={"unstyled"}
                              size={"unstyled"}
                              className="text-[14px] text-[#1C63DB]"
                              onClick={() =>
                                handleResendInvite(client.client_id)
                              }
                            >
                              Resend invitation
                            </Button>
                          </div>
                        ) : client.status === "active" ? (
                          "Active"
                        ) : (
                          client.status
                        )}
                      </div>
                    </div>

                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      onClick={() => {
                        handleSelectClient(client.client_id);
                      }}
                      className={`${isWide ? "flex" : "hidden"} items-center justify-center text-[#000]`}
                    >
                      <MaterialIcon iconName="visibility" fill={1} />
                    </Button>
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      className={`items-center justify-center ${isWide ? "flex" : "hidden"} ${client.status !== "active" ? "opacity-[0.5]" : ""}`}
                      disabled={client.status !== "active"}
                      onClick={() => {
                        navigate(
                          `/content-manager/messages/${client.client_id}`
                        );
                      }}
                    >
                      <MaterialIcon iconName="forum" fill={1} />
                    </Button>

                    {isWide && (
                      <div
                        className="relative ml-auto"
                        data-delete-menu-id={client.client_id}
                      >
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          onClick={() =>
                            setDeleteMenuId(
                              deleteMenuId === client.client_id
                                ? null
                                : client.client_id
                            )
                          }
                          className="flex items-center justify-center hover:bg-[#ECEFF4] rounded-full w-fit"
                          data-delete-trigger="true"
                        >
                          <MaterialIcon iconName="more_vert" />
                        </Button>

                        {deleteMenuId === client.client_id && (
                          <div className="absolute top-[30px] right-0 bg-white py-[16px] px-[14px] rounded-[10px] flex items-center gap-[8px] text-[#FF1F0F] text-[16px] font-[500] w-[238px] shadow-[0px_8px_18px_rgba(0,0,0,0.15)] z-50">
                            <Button
                              variant={"unstyled"}
                              size={"unstyled"}
                              className="flex items-center gap-[8px] w-full text-left"
                              onClick={async () => {
                                handleSelectClient(client.client_id);
                                setConfirmDelete(true);
                                setDeleteMenuId(null);
                              }}
                            >
                              <MaterialIcon
                                iconName="delete"
                                fill={1}
                                className="text-[#FF1F0F]"
                              />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {isMobile || !isWide ? (
                      <div className="w-full flex flex-col gap-[8px] mt-[24px]">
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          className={`w-full flex justify-center items-center gap-[8px] text-[16px] text-[#1C63DB] font-[500] px-[32px] py-[8px] bg-[#008FF61A] rounded-[1000px] ${client.status !== "active" ? "opacity-[0.5]" : ""}`}
                          onClick={() => handleSelectClient(client.client_id)}
                          disabled={client.status !== "active"}
                        >
                          <MaterialIcon iconName="visibility" fill={1} />
                          View profile
                        </Button>
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          className={`w-full flex justify-center items-center gap-[8px] text-[16px] text-[#1C63DB] font-[500] px-[32px] py-[8px] bg-[#008FF61A] rounded-[1000px] ${client.status !== "active" ? "opacity-[0.5]" : ""}`}
                          onClick={() => {
                            if (client.status !== "active") return;
                            navigate(
                              `/content-manager/messages/${client.client_id}`
                            );
                          }}
                          disabled={client.status !== "active"}
                        >
                          <MaterialIcon iconName="forum" fill={1} />
                          Chat
                        </Button>
                      </div>
                    ) : isTablet ? (
                      <div className="relative ml-auto h-[24px]">
                        <Button
                          variant={"unstyled"}
                          size={"unstyled"}
                          className="w-fit h-fit"
                          onClick={() => {
                            setPopupClientId(
                              popupClientId === client.client_id
                                ? null
                                : client.client_id
                            );
                          }}
                        >
                          <MaterialIcon
                            iconName="more_vert"
                            className="text-blue-500"
                          />
                        </Button>

                        {popupClientId === client.client_id && (
                          <div
                            className="
        absolute right-0 top-[34px]
        w-[238px] bg-white shadow-[0px_8px_18px_rgba(0,0,0,0.15)]
        rounded-[10px] px-[14px] py-[16px] flex flex-col gap-[16px] z-50
      "
                          >
                            <Button
                              variant={"unstyled"}
                              size={"unstyled"}
                              className="flex items-center gap-[8px] text-[#FF1F0F] font-[500] text-[16px]"
                              onClick={() => {
                                handleSelectClient(client.client_id);
                                setConfirmDelete(true);
                                setPopupClientId(null);
                              }}
                            >
                              <MaterialIcon
                                iconName="delete"
                                fill={1}
                                className="text-[#FF1F0F]"
                              />
                              Delete user
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : undefined}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {totalPages > 1 && !loading && (
          <div className="flex items-center justify-center gap-2 pb-4">
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
            >
              <MaterialIcon iconName="arrow_left_alt" />
            </Button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border rounded-[8px] ${currentPage === page
                    ? "border-[#1C63DB] text-[#1C63DB]"
                    : "border-[#DBDEE1]"
                    }`}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              variant={"unstyled"}
              size={"unstyled"}
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
            >
              <MaterialIcon iconName="arrow_right_alt" />
            </Button>
          </div>
        )}

        {confirmDiscard && (
          <ConfirmDiscardModal
            onCancel={() => setConfirmDiscard(false)}
            onDiscard={discardChanges}
          />
        )}

        {selectedClient.client_info.id !== "" &&
          !confirmDelete &&
          !editModal && (
            <SelectedClientModal
              clientId={selectedClient.client_info.id}
              onClose={() => {
                setConfirmDelete(false);
                cleanState();
              }}
              onEdit={() => setEditModal(true)}
              onDelete={() => setConfirmDelete(true)}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}

        {editModal && (
          <EditClientModal
            client={clientInfo}
            activeEditTab={activeEditTab}
            setActiveEditTab={setActiveEditTab}
            onCancel={handleCancelEdit}
            onSave={handleEditSuccess}
            updateClient={updateClient}
          />
        )}

        {addModal && (
          <AddClientModal
            client={newClient}
            updateClient={updateClient}
            onCancel={handleCancelEdit}
            onSave={handleNewClientSave}
          />
        )}

        {confirmDelete && (
          <ConfirmDeleteModal
            onCancel={() => {
              setConfirmDelete(false);
              cleanState();
            }}
            onDelete={handleDelete}
          />
        )}

        {inviteSuccessPopup && (
          <div className="absolute inset-0 top-0 min-h-[calc(100vh-85px)] bottom-0 z-50 bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex stretch items-center justify-center">
            <div className="bg-white rounded-[16px] shadow-xl p-[24px] w-full h-fit text-center relative mx-[16px] md:w-[550px]">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="absolute top-[24px] right-[24px] cursor-pointer"
                onClick={() => setInviteSuccessPopup(false)}
              >
                <MaterialIcon iconName="close" />
              </Button>
              <div className="flex justify-center items-center mb-[24px]">
                <ConfirmIcon />
              </div>
              <p className="text-[#1D1D1F] text-[28px] font-semibold mb-[24px]">
                Client has been invited successfully
              </p>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="bg-[#1C63DB] text-white px-[16px] py-[10px] w-full max-w-[250px] rounded-full font-semibold text-[16px] leading-normal"
                onClick={() => setInviteSuccessPopup(false)}
              >
                Go Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
      <ResizableLibraryChat
        widthPercent={widthPercent}
        setWidthPercent={setWidthPercent}
        isCoach
      />
    </div>
  );
};
