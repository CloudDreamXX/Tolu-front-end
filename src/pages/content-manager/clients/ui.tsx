import React, { useState, useMemo, useRef, useCallback } from "react";
import ClientsIcon from "shared/assets/icons/clients";
import Search from "shared/assets/icons/search";
import Plus from "shared/assets/icons/white-plus";
import Eye from "shared/assets/icons/blue-eye";
import TrashIcon from "shared/assets/icons/trash-icon";
import Messages from "shared/assets/icons/blue-messages";
import { Button } from "shared/ui";
import Arrow from "shared/assets/icons/pages-arrow";
import { ConfirmDeleteModal } from "widgets/ConfirmDeleteModal";
import { ConfirmDiscardModal } from "widgets/ConfirmDiscardModal";
import { EditClientModal } from "widgets/EditClientModal";
import {
  ClientProfile,
  Client,
  CoachService,
  InviteClientPayload,
  ClientDetails,
} from "entities/coach";
import { useEffect } from "react";
import { RootState } from "entities/store";
import { useSelector } from "react-redux";
import { SelectedClientModal } from "widgets/SelectedClientModal";
import BlueDots from "shared/assets/icons/blue-dots";
import CloseIcon from "shared/assets/icons/close";
import ConfirmIcon from "shared/assets/icons/confirm";
import { toast } from "shared/lib/hooks/use-toast";
import UploadCloud from "shared/assets/icons/upload-cloud";
import { File, X } from "lucide-react";
import EmptyClients from "shared/assets/images/EmptyClients.png";

const PAGE_SIZE = 10;

export const ContentManagerClients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
  });
  const [newClient, setNewClient] = useState<InviteClientPayload>({
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
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("clientInfo");
  const [editModal, setEditModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);
  const [activeEditTab, setActiveEditTab] = useState<string>("editClientInfo");
  const [clientsData, setClientsData] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = useSelector((state: RootState) => state.user.token);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState<boolean>(
    window.innerWidth > 767 && window.innerWidth < 1024
  );
  const [popupClientId, setPopupClientId] = useState<string | null>(null);
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null);
  const [inviteSuccessPopup, setInviteSuccessPopup] = useState<boolean>(false);
  const [importClientsPopup, setImportClientsPopup] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      setImportClientsPopup(false);
    }
  }, []);

  useEffect(() => {
    if (importClientsPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [importClientsPopup, handleClickOutside]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth > 767 && window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const response = await CoachService.getManagedClients();
        setClientsData(response.clients);
      } catch (error) {
        console.error("Error fetching clients", error);
        toast({
          variant: "destructive",
          title: "Failed to fetch clients",
          description: "Failed to fetch clients. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clientsData.filter((client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, clientsData]);

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, currentPage]);

  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);

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
    });
    setNewClient({
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
    await CoachService.editClient(
      selectedClient.client_info.id,
      clientInfo,
      token
    );
    setEditModal(false);
    cleanState();
  };

  const handleInviteClient = async (formValues: InviteClientPayload) => {
    try {
      await CoachService.inviteClient(formValues);
      setAddModal(false);
      const updatedClients = await CoachService.getManagedClients();
      setClientsData(updatedClients.clients);
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
      const fullClient = await CoachService.getClientProfile(clientId, token);
      setSelectedClient(fullClient);

      const editClientInfo = await CoachService.getClientInfo(clientId, token);
      setClientInfo(editClientInfo.client);
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
      await CoachService.deleteClient(selectedClient.client_info.id, token);
      const updatedClients = await CoachService.getManagedClients();
      setClientsData(updatedClients.clients);
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

  const handleNextAddStep = () => {
    const tabs = [
      "editClientInfo",
      "relationshipContext",
      "clientFitTOLU",
      "healthProfilePlan",
    ];
    const nextIndex = tabs.indexOf(activeEditTab) + 1;
    if (nextIndex < tabs.length) {
      setActiveEditTab(tabs[nextIndex]);
    } else {
      handleInviteClient(newClient);
      cleanState();
      setAddModal(false);
      setInviteSuccessPopup(true);
    }
  };

  const handleBackAddStep = () => {
    const tabs = [
      "editClientInfo",
      "relationshipContext",
      "clientFitTOLU",
      "healthProfilePlan",
    ];
    const prevIndex = tabs.indexOf(activeEditTab) - 1;
    if (prevIndex >= 0) {
      setActiveEditTab(tabs[prevIndex]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await handleFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
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
      await CoachService.inviteClient(null, file);
      const updatedClients = await CoachService.getManagedClients();
      setClientsData(updatedClients.clients);
      toast({
        title: "File imported successfully",
      });
      setInviteSuccessPopup(true);
      setImportClientsPopup(false);
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
      md:grid md:grid-cols-6 md:items-center md:py-[12px]
      flex flex-col gap-2 p-[12px] border border-[#AAC6EC] rounded-[8px] bg-white 
      md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:border-[#DBDEE1] animate-pulse
    "
      >
        {Array(6)
          .fill(0)
          .map((_, i) =>
            i === 5 ? (
              <div
                key={i}
                className="hidden md:flex items-center justify-end gap-[24px]"
              >
                {[...Array(3)].map((_, j) => (
                  <div
                    key={j}
                    className="h-[24px] w-[39px] skeleton-gradient rounded-[1000px]"
                  />
                ))}
              </div>
            ) : (
              <div
                key={i}
                className="h-[10px] w-full md:w-[80px] lg:w-[126px] skeleton-gradient rounded-[24px]"
              />
            )
          )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[16px] md:gap-[24px] p-8 overflow-y-auto h-full">
      <div className="flex flex-col lg:flex-row gap-[16px] justify-between lg:items-end">
        <div className="flex flex-col gap-2">
          <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
            <ClientsIcon />
            Clients
          </h1>
          <p className="text-sm font-medium">
            Use the list below to filter, search, and take action on individual
            client records.
          </p>
        </div>
        <div className="flex flex-col md:flex-row flex-row gap-2 md:gap-[20px] lg:gap-2">
          <div className="flex gap-[8px] items-center w-full lg:w-[300px] rounded-full border border-[#DBDEE1] p-[12px] bg-white h-[44px]">
            <Search />
            <input
              placeholder="Search"
              className="outline-none w-full placeholder-custom text-[14px] font-semibold text-[#000]"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <Button
            variant={"brightblue"}
            className="h-[44px]"
            onClick={() => {
              cleanState();
              setActiveEditTab("editClientInfo");
              setAddModal(true);
            }}
          >
            Add new client
            <Plus />
          </Button>
          <Button
            variant={"light-blue"}
            className="h-[44px]"
            onClick={() => setImportClientsPopup(true)}
          >
            Upload CSV/XLSX
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="lg:mt-4 md:rounded-[8px]">
          <div className="hidden md:grid grid-cols-6 bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[24px] py-[22px]">
            <div className="h-[10px] w-[60px] xl:w-[106px] skeleton-gradient rounded-[24px]" />
            <div className="h-[10px] w-[60px] xl:w-[106px] skeleton-gradient rounded-[24px]" />
            <div className="h-[10px] w-[60px] xl:w-[106px] skeleton-gradient rounded-[24px]" />
            <div className="h-[10px] w-[60px] xl:w-[106px] skeleton-gradient rounded-[24px]" />
            <div className="h-[10px] w-[60px] xl:w-[106px] skeleton-gradient rounded-[24px]" />
            <div className="text-right pr-4"></div>
          </div>
          <div className="flex flex-col gap-4 md:gap-0 md:px-[12px] pb-[16px] md:bg-white">
            {Array.from({ length: 10 }).map((_, i) => (
              <ClientSkeletonRow key={i} />
            ))}
          </div>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center mt-[200px]">
          <img src={EmptyClients} alt="" className="mb-[32px] w-[163px]" />
          <div className="text-center flex flex-col items-center justify-center gap-[8px]">
            <p className="text-[32px] font-[700] text-[#1D1D1F]">
              There are no clients ...
            </p>
            <p className="text-[20px] font-[500] text-[#5F5F65] max-w-[450px]">
              Start adding clients to keep track of observations, updates, and
              progress.
            </p>
          </div>
        </div>
      ) : (
        <div className="lg:mt-4 md:rounded-[8px]">
          <div className="hidden md:grid grid-cols-7 bg-[#C7D8EF] text-[#000000] rounded-t-[8px] text-[16px] font-semibold px-[24px] py-[16px]">
            <div>Full name</div>
            <div>Gender</div>
            <div>Last seen</div>
            <div>Last update</div>
            <div>Learning now</div>
            <div>Status</div>
            <div className="text-right pr-4"></div>
          </div>

          <div className="flex flex-col gap-4 md:gap-0 md:px-[12px] pb-[16px] md:bg-white">
            {paginatedClients.map((client, idx) => (
              <div
                key={idx}
                className="
            md:grid md:grid-cols-7 md:items-center md:p-[12px]
            flex flex-col gap-2 p-[16px] border border-[#AAC6EC] rounded-[8px] bg-white md:rounded-none md:border-x-0 md:border-t-0 md:border-b md:border-[#DBDEE1]
          "
              >
                <div className="md:text-[16px] flex items-center border-b border-[#F3F6FB] md:border-none pb-[10px] md:pb-0">
                  <div className="w-full md:hidden text-[14px] text-[#5F5F65]">
                    Full name
                  </div>
                  <div className="w-full text-[16px] font-semibold">
                    {client.name}
                  </div>
                </div>

                <div className="md:text-[16px] flex items-center border-b border-[#F3F6FB] md:border-none pb-[10px] md:pb-0">
                  <div className="w-full md:hidden text-[14px] text-[#5F5F65]">
                    Gender
                  </div>
                  <div className="w-full text-[16px]">{client.gender}</div>
                </div>

                <div className="md:text-[16px] flex items-center border-b border-[#F3F6FB] md:border-none pb-[10px] md:pb-0">
                  <div className="w-full md:hidden text-[14px] text-[#5F5F65]">
                    Last seen
                  </div>
                  <div className="w-full text-[16px]">
                    {client.last_activity
                      ? new Date(client.last_activity).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </div>
                </div>

                <div className="md:text-[16px] flex items-center border-b border-[#F3F6FB] md:border-none pb-[10px] md:pb-0">
                  <div className="w-full md:hidden text-[14px] text-[#5F5F65]">
                    Last update
                  </div>
                  <div className="w-full text-[16px]">
                    {client.last_activity
                      ? new Date(client.last_activity).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </div>
                </div>

                <div className="md:text-[16px] flex items-center border-b border-[#F3F6FB] md:border-none pb-[10px] md:pb-0 relative">
                  <div className="w-full md:hidden text-[14px] text-[#5F5F65]">
                    Learning now
                  </div>
                  <div className="flex gap-1 items-center flex-wrap">
                    <span className="w-full text-black text-[16px] underline">
                      {client.learning_now[0]?.title || ""}
                    </span>
                    {client.learning_now.length > 1 && (
                      <>
                        <span className="text-black">and</span>
                        <button
                          onMouseEnter={() =>
                            setHoveredClientId(client.client_id)
                          }
                          onMouseLeave={() => setHoveredClientId(null)}
                          className="text-[#1C63D8] font-semibold underline underline-offset-2"
                        >
                          {client.learning_now.length - 1} more
                        </button>
                      </>
                    )}
                    {hoveredClientId === client.client_id && (
                      <div className="absolute left-0 top-full mt-1 z-[9999] bg-white border border-gray-200 shadow-md rounded-md p-2 text-sm">
                        <ul className="flex flex-col gap-[4px] text-black space-y-1">
                          {client.learning_now.slice(1).map((item, index) => (
                            <li key={index}>{item?.title || ""}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:text-[16px] flex items-center border-b border-[#F3F6FB] md:border-none pb-[10px] md:pb-0">
                  <div className="w-full md:hidden text-[14px] text-[#5F5F65]">
                    Status
                  </div>
                  <div className="w-full text-[16px]">
                    {client.status === "waiting to accept invite"
                      ? "pending"
                      : client.status}
                  </div>
                </div>

                {isMobile ? (
                  <div className="w-full flex flex-col gap-[8px] mt-[24px]">
                    <button
                      className="w-full flex justify-center items-center gap-[8px] text-[16px] text-[#1C63DB] font-[500] px-[32px] py-[8px] bg-[#008FF61A] rounded-[1000px]"
                      onClick={() => handleSelectClient(client.client_id)}
                    >
                      <Eye />
                      View profile
                    </button>
                    <button className="w-full flex justify-center items-center gap-[8px] text-[16px] text-[#1C63DB] font-[500] px-[32px] py-[8px] bg-[#008FF61A] rounded-[1000px]">
                      <Messages />
                      Chat with client
                    </button>
                  </div>
                ) : isTablet ? (
                  <div className="relative ml-auto h-[24px]">
                    <button
                      className="w-fit h-fit"
                      onClick={() => {
                        setPopupClientId(
                          popupClientId === client.client_id
                            ? null
                            : client.client_id
                        );
                      }}
                    >
                      <BlueDots />
                    </button>

                    {popupClientId === client.client_id && (
                      <div
                        className="
        absolute right-0 top-[34px]
        w-[238px] bg-white shadow-[0px_8px_18px_rgba(0,0,0,0.15)]
        rounded-[10px] px-[14px] py-[16px] flex flex-col gap-[16px] z-50
      "
                      >
                        <button
                          className="flex items-center gap-[8px] text-[#1D1D1F] font-[500] text-[16px]"
                          onClick={() => {
                            handleSelectClient(client.client_id);
                            setPopupClientId(null);
                          }}
                        >
                          <Eye /> View profile
                        </button>

                        <button
                          className="flex items-center gap-[8px] text-[#1D1D1F] font-[500] text-[16px]"
                          onClick={() => {
                            setPopupClientId(null);
                          }}
                        >
                          <Messages /> Open Chat
                        </button>

                        <button
                          className="flex items-center gap-[8px] text-[#FF1F0F] font-[500] text-[16px]"
                          onClick={() => {
                            handleSelectClient(client.client_id);
                            setConfirmDelete(true);
                            setPopupClientId(null);
                          }}
                        >
                          <TrashIcon /> Delete user
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-end items-center gap-4 mt-2 md:mt-0 md:justify-end">
                    <button
                      onClick={() => handleSelectClient(client.client_id)}
                    >
                      <Eye />
                    </button>
                    <button>
                      <Messages />
                    </button>
                    <button
                      onClick={() => {
                        handleSelectClient(client.client_id);
                        setConfirmDelete(true);
                      }}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="flex justify-center items-center gap-2 pb-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <span className="rotate-[180deg]">
              <Arrow />
            </span>
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border rounded-[8px] ${
                  currentPage === page
                    ? "border-[#1C63DB] text-[#1C63DB]"
                    : "border-[#DBDEE1]"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <Arrow />
          </button>
        </div>
      )}

      {confirmDiscard && (
        <ConfirmDiscardModal
          onCancel={() => setConfirmDiscard(false)}
          onDiscard={discardChanges}
        />
      )}

      {selectedClient.client_info.id !== "" && !confirmDelete && !editModal && (
        <SelectedClientModal
          client={selectedClient}
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
          isNew={false}
          updateClient={updateClient}
        />
      )}

      {addModal && (
        <EditClientModal
          client={newClient}
          activeEditTab={activeEditTab}
          setActiveEditTab={setActiveEditTab}
          onCancel={handleCancelEdit}
          onNext={handleNextAddStep}
          onBack={handleBackAddStep}
          isNew={true}
          updateClient={updateClient}
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
        <div className="absolute inset-0 top-0 min-h-[calc(100vh-85px)] bottom-0 z-10 bg-transparent md:bg-[rgba(0,0,0,0.3)] md:backdrop-blur-[2px] flex stretch items-center justify-center">
          <div className="bg-white rounded-[16px] shadow-xl p-[24px] w-full h-fit text-center relative mx-[16px] md:w-[550px]">
            <button
              className="absolute top-[24px] right-[24px] cursor-pointer"
              onClick={() => setInviteSuccessPopup(false)}
            >
              <CloseIcon />
            </button>
            <div className="flex justify-center items-center mb-[24px]">
              <ConfirmIcon />
            </div>
            <p className="text-[#1D1D1F] text-[28px] font-semibold mb-[24px]">
              Client has been invited successfully
            </p>
            <button
              className="bg-[#1C63DB] text-white px-[16px] py-[10px] w-full max-w-[250px] rounded-full font-semibold text-[16px] leading-normal"
              onClick={() => setInviteSuccessPopup(false)}
            >
              Go Back to Home
            </button>
          </div>
        </div>
      )}

      {importClientsPopup && (
        <div
          ref={modalRef}
          className="flex flex-col md:w-[410px] md:max-h-[700px] overflow-y-auto py-[24px] px-[16px] lg:py-[40px] lg:px-[40px] bg-white rounded-[20px] shadow-md gap-[24px] absolute top-[370px] left-[32px] right-[32px] md:left-auto md:top-[270px] lg:top-[230px] xl:top-[180px]"
        >
          {uploadedFileName ? (
            <div className="w-full max-w-[330px]">
              <p className="text-left font-[Nunito] text-black text-base font-medium mb-[8px]">
                Import PDF
              </p>
              <div className="w-full relative border border-[#1C63DB] rounded-[8px] px-[16px] py-[12px] flex items-center gap-3">
                <File stroke="#1C63DB" />
                <div className="flex flex-col leading-[1.2]">
                  <p className="text-[14px] font-[Nunito] text-black font-semibold">
                    {uploadedFileName}
                  </p>
                  <p className="text-[12px] font-[Nunito] text-[#5F5F65]">
                    {uploadedFileSize}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUploadedFileName(null);
                    setUploadedFileSize(null);
                  }}
                  className="absolute top-[6px] right-[6px]"
                >
                  <X size={16} stroke="#A7A7A7" />
                </button>
              </div>
            </div>
          ) : (
            // Drop Zone
            <div className="w-full">
              <p className="text-left font-[Nunito] text-black text-base font-medium mb-[8px]">
                Import СSV/XLSX
              </p>
              <div
                className={`w-full border ${
                  dragOver
                    ? "border-[#0057C2]"
                    : "border-dashed border-[#1C63DB]"
                } rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer`}
                onClick={handleUploadClick}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="flex p-2 items-center justify-center bg-white border rounded-[8px] border-[#F3F6FB]">
                  <UploadCloud />
                </div>
                <div className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                  Click {isMobile || isTablet ? "" : "or drag"} to upload
                </div>
                <p className="text-[#5F5F65] font-[Nunito] text-[14px] mt-[4px]">
                  СSV/XLSX
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
};
