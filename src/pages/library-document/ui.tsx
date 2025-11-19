import { ChatSocketService } from "entities/chat";
import {
  CoachListItem,
  useLazyDownloadCoachPhotoQuery,
  useGetCoachesQuery,
  useGetLibraryContentQuery,
  useLazyGetCoachProfileQuery,
} from "entities/client";
import { clearAllChatHistory } from "entities/client/lib";
import {
  ContentStatus,
  useGetCreatorPhotoQuery,
  useGetCreatorProfileQuery,
  useUpdateStatusMutation,
  useGetQuizScoreQuery,
} from "entities/content";
import { useGetDocumentByIdQuery } from "entities/document";
import { useGetUserHealthHistoryQuery } from "entities/health-history";
import { setError, setHealthHistory } from "entities/health-history/lib";
import { ChatActions, ChatLoading } from "features/chat";
import { useTextSelectionTooltip } from "pages/content-manager/document/lib";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { phoneMask, toast, usePageWidth } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Dialog,
  DialogContent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";
import SharePopup from "widgets/share-popup/ui";
import { DocumentLoadingSkeleton } from "./lib";
import { ResizableLibraryChat } from "widgets/library-small-chat/components/ResizableSmallChat";

const extractScripts = (content: string) => {
  const scriptRegex = /<script[\s\S]*?>([\s\S]*?)<\/script>/g;
  const scripts: string[] = [];
  let match;

  while ((match = scriptRegex.exec(content)) !== null) {
    scripts.push(match[1]);
  }

  const contentWithoutScripts = content.replace(scriptRegex, "");

  return { contentWithoutScripts, scripts };
};

const getHeadshotFilename = (url?: string | null): string | null => {
  if (!url) return null;
  const clean = url.trim().split(/[?#]/)[0];
  const parts = clean.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last ? decodeURIComponent(last) : null;
};

export const LibraryDocument = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages] = useState([]);
  const [isLoadingSession] = useState(false);
  const [isCreatorCardOpen, setIsCreatorCardOpen] = useState(false);

  const dispatch = useDispatch();

  const [textContent, setTextContent] = useState("");
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);
  const { tooltipPosition, showTooltip, handleTooltipClick } =
    useTextSelectionTooltip();
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const { isMobile, isMobileOrTablet } = usePageWidth();
  const [sharePopup, setSharePopup] = useState<boolean>(false);
  const [providersOpen, setProvidersOpen] = useState(false);
  const [coaches, setCoaches] = useState<CoachListItem[]>([]);
  const [creatorPhoto, setCreatorPhoto] = useState<string | null>(null);

  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [coachProfiles, setCoachProfiles] = useState<Record<string, any>>({});

  const [widthPercent, setWidthPercent] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  const [coachDialogOpen, setCoachDialogOpen] = useState(false);

  const [renderedContent, setRenderedContent] = useState<JSX.Element | null>(
    null
  );
  const [scripts, setScripts] = useState<string[]>([]);

  const {
    data: selectedDocument,
    isLoading: isLoadingDocument,
    refetch,
  } = useGetDocumentByIdQuery(documentId!);
  const { data: creatorProfileData } = useGetCreatorProfileQuery(
    selectedDocument?.creator_id || ""
  );
  const shouldLoadPhoto =
    !!creatorProfileData?.creator_id &&
    !!creatorProfileData?.detailed_profile?.personal_info?.headshot_url;

  const { data: creatorPhotoData } = useGetCreatorPhotoQuery(
    {
      id: creatorProfileData?.creator_id || "",
      filename:
        creatorProfileData?.detailed_profile?.personal_info?.headshot_url
          ?.split("/")
          .pop() || "",
    },
    {
      skip: !shouldLoadPhoto,
    }
  );
  const [updateStatus] = useUpdateStatusMutation();
  const { data: healthHistoryData, error: healthHistoryError } =
    useGetUserHealthHistoryQuery();
  const { refetch: refetchFolders } = useGetLibraryContentQuery({
    page: 1,
    page_size: 10,
    folder_id: null,
  });
  const {
    data: coachesData,
    refetch: refetchCoaches,
    isLoading: isLoadingCoaches,
  } = useGetCoachesQuery();
  const [getCoachProfile, { data: coachProfileData }] =
    useLazyGetCoachProfileQuery();
  const [downloadCoachPhoto] = useLazyDownloadCoachPhotoQuery();

  const { data: quizScore, refetch: refetchQuizScore } = useGetQuizScoreQuery(
    documentId!
  );

  useEffect(() => {
    if (!documentId) return;
    if (!quizScore?.data?.questions?.length) return;

    const norm = (s?: string) =>
      (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    const allForms = Array.from(
      document.querySelectorAll("form[id]")
    ) as HTMLFormElement[];

    const cssEscape = (v: string) =>
      (window as any).CSS?.escape
        ? (window as any).CSS.escape(v)
        : v.replace(/["\\]/g, "\\$&");

    const extractStepNumber = (s: string) => {
      const m = s.match(/(\d+)$/);
      return m?.[1] || "";
    };

    const findRootSection = (el: Element | null) =>
      (el?.closest('[id^="quiz"]') ||
        el?.closest('[id^="card"]') ||
        el) as HTMLElement | null;

    const getCheckFnForForm = (form: HTMLFormElement) => {
      const root = findRootSection(form);
      const btn = root?.querySelector<HTMLButtonElement>(
        'button[type="button"][onclick^="checkQuiz"]'
      );
      if (btn) {
        const onclick = btn.getAttribute("onclick") || "";
        const fnNameMatch = onclick.match(/^\s*([a-zA-Z0-9_]+)\s*\(/);
        const fnName = fnNameMatch?.[1];
        const maybe = (window as any)[fnName as string];
        if (typeof maybe === "function") return maybe;
      }

      const n = extractStepNumber(form.id);
      const numbered = (window as any)[`checkQuiz${n}`];
      if (typeof numbered === "function") return numbered;

      const generic = (window as any).checkQuiz;
      if (typeof generic === "function") return generic;

      return undefined;
    };

    const applyChecksAndShowResults = () => {
      quizScore.data.questions.forEach((q) => {
        const want = norm(q.question_id);

        let form =
          (document.getElementById(q.question_id) as HTMLFormElement | null) ||
          null;

        if (!form) {
          form = allForms.find((f) => norm(f.id) === want) || null;
        }
        if (!form) {
          form =
            allForms.find((f) => {
              const fid = norm(f.id);
              return fid.includes(want) || want.includes(fid);
            }) || null;
        }
        if (!form) return;

        const answer = String(q.answer);
        const candidate = form.querySelector<HTMLInputElement>(
          `input[type="radio"][value="${cssEscape(answer)}"]`
        );
        if (!candidate) return;

        if (!candidate.checked) {
          candidate.checked = true;
          candidate.dispatchEvent(new Event("change", { bubbles: true }));
        }

        const checkFn = getCheckFnForForm(form);
        try {
          if (checkFn) checkFn();
          else {
            const root = findRootSection(form);
            const resultEl =
              (root?.querySelector('[id$="Result"]') as HTMLElement | null) ||
              (document.querySelector(
                `#${form.id.replace("Form", "")}Result`
              ) as HTMLElement | null);
            if (resultEl) {
              resultEl.textContent = q.is_correct ? "Correct!" : "Incorrect.";
              resultEl.style.color = q.is_correct ? "#27ae60" : "#c0392b";
            }
          }
        } catch (e) {
          console.warn("checkQuiz invocation failed:", e);
        }
      });

      countQuizzesAndResults();
    };

    const raf = requestAnimationFrame(applyChecksAndShowResults);
    return () => cancelAnimationFrame(raf);
  }, [documentId, quizScore, renderedContent, scripts]);

  const selectedCoach = useMemo(
    () => coaches.find((c) => c.coach_id === selectedCoachId) ?? null,
    [coaches, selectedCoachId]
  );

  const [quizStatus, setQuizStatus] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
  });

  const countQuizzesAndResults = () => {
    const quizzes = document.querySelectorAll('form[id^="quiz"]');
    const totalQuizzes = quizzes.length;

    let completedQuizzes = 0;

    quizzes.forEach((quiz) => {
      const selectedOption = quiz.querySelector('input[type="radio"]:checked');

      if (selectedOption) {
        completedQuizzes += 1;
      }
    });

    setQuizStatus({ totalQuizzes, completedQuizzes });
  };

  useEffect(() => {
    countQuizzesAndResults();

    const quizSubmitButtons = document.querySelectorAll(
      'button[type="button"][onclick^="checkQuiz"]'
    );

    quizSubmitButtons.forEach((button) => {
      button.addEventListener("click", () => {
        countQuizzesAndResults();
      });
    });

    return () => {
      quizSubmitButtons.forEach((button) => {
        button.removeEventListener("click", () => countQuizzesAndResults());
      });
    };
  }, [selectedDocument, renderedContent]);

  useEffect(() => {
    if (!creatorPhotoData) return;

    const objectUrl = URL.createObjectURL(creatorPhotoData);
    setCreatorPhoto(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [creatorPhotoData]);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "content_share" ||
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
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();

      const storedVoice = localStorage.getItem("selectedVoice");

      let voice: SpeechSynthesisVoice | null = null;

      if (storedVoice) {
        const storedVoiceSettings = JSON.parse(storedVoice);
        voice =
          availableVoices.find(
            (v) =>
              v.name === storedVoiceSettings.name &&
              v.lang === storedVoiceSettings.lang
          ) || null;
      }

      if (!voice) {
        voice =
          availableVoices.find(
            (v) => v.name === "Google UK English Male" && v.lang === "en-GB"
          ) || null;
      }

      setSelectedVoice(voice);

      if (voice) {
        const voiceSettings = { name: voice.name, lang: voice.lang };
        localStorage.setItem("selectedVoice", JSON.stringify(voiceSettings));
      }
    };

    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }

    return () => {
      if (speechSynthesis.onvoiceschanged) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  useEffect(() => {
    (window as any).__refetchQuizScore = refetchQuizScore;
    return () => {
      delete (window as any).__refetchQuizScore;
    };
  }, [refetchQuizScore]);

  useEffect(() => {
    const idx = (window as any).__currentCardIndex;
    if (idx) {
      const restore = setTimeout(() => {
        if ((window as any).showCard) {
          (window as any).showCard(idx);
        }
      }, 100);
      return () => clearTimeout(restore);
    }
  }, [renderedContent]);

  useEffect(() => {
    if (!selectedDocument) {
      setRenderedContent(null);
      setScripts([]);
      return;
    }

    const { contentWithoutScripts, scripts: extractedScripts } = extractScripts(
      selectedDocument.content
    );

    const parser = new DOMParser();
    const doc = parser.parseFromString(contentWithoutScripts, "text/html");

    const getCards = () =>
      Array.from(doc.querySelectorAll<HTMLElement>("[id^='card']")).filter(
        (el) => /card[-_]?\d+$/i.test(el.id)
      );

    const cards = getCards();

    if (!cards.length) {
      setRenderedContent(
        <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />
      );
      setScripts(extractedScripts || []);
      return;
    }

    if (quizScore?.data) {
      const lastCard = cards[cards.length - 1];
      if (lastCard) {
        const nextIndex = cards.length + 1;
        const nextCardId = `card-${nextIndex}`;

        const summaryDiv = doc.createElement("div");
        summaryDiv.id = nextCardId;
        summaryDiv.style.display = "none";
        summaryDiv.style.background = "transparent";

        const { correct_questions, total_questions, score_percent, questions } =
          quizScore.data;

        summaryDiv.innerHTML = `
        <h3 class="text-lg font-semibold text-[#1D1D1F] mb-3">Quiz Summary</h3>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-muted-foreground">
            ${correct_questions}/${total_questions} correct
          </span>
          <span class="text-sm font-medium text-[#1C63DB]">
            ${score_percent.toFixed(1)}%
          </span>
        </div>

        <div class="relative h-[4px] w-full bg-[#E0F0FF] rounded-full overflow-hidden mb-4">
          <div class="absolute top-0 left-0 h-full bg-[#1C63DB] transition-all"
            style="width: ${Math.min(
              100,
              (correct_questions / total_questions) * 100
            )}%;"></div>
        </div>

        <div class="divide-y border-t border-[#EAEAEA]">
          ${questions
            .map(
              (q) => `
            <div class="flex items-center justify-between py-2 text-sm">
              <div>
                <div class="font-medium text-[#1D1D1F]">${q.question_id}</div>
                <div class="text-xs text-muted-foreground">
                  Answer: ${String(q.answer).toUpperCase()}
                </div>
              </div>
              <div class="px-3 py-1 rounded-full text-xs font-medium ${
                q.is_correct
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700"
              }">
                ${q.is_correct ? "Correct" : "Incorrect"}
              </div>
            </div>`
            )
            .join("")}
        </div>

        <div class="card-nav" style="display:flex; justify-content:flex-start; margin-top:24px; gap:12px;">
          <Button variant={"unstyled"} size={"unstyled"} id="prevBtn" onclick="prevCard()" style="background:#007acc; color:#fff; border:none; border-radius:4px; padding:8px 18px; font-size:16px;">
            Previous
          </Button>
        </div>
      `;

        lastCard.insertAdjacentElement("afterend", summaryDiv);

        const lastNavContainer =
          lastCard.querySelector<HTMLElement>(".card-nav") ||
          lastCard.querySelector<HTMLElement>(
            'div[style*="display:flex"][style*="justify-content:space-between"]'
          ) ||
          lastCard.querySelector<HTMLElement>(
            'div[style*="display:flex"][style*="justify-content:flex-start"]'
          ) ||
          lastCard.querySelector<HTMLElement>(
            'div[style*="text-align:left"][style*="margin-top:24px"]'
          );

        if (lastNavContainer) {
          Object.assign(lastNavContainer.style, {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "24px",
            gap: "12px",
          });

          const nextBtn = doc.createElement("button");
          nextBtn.id = "nextBtn";
          nextBtn.textContent = "See Results";
          nextBtn.setAttribute(
            "onclick",
            `
            (function() {
              if (window.showCard) {
                showCard(${nextIndex});
              }
              if (window.__refetchQuizScore) {
                window.__refetchQuizScore();
              }
            })()
          `
          );
          Object.assign(nextBtn.style, {
            background: "#007acc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 18px",
            fontSize: "16px",
            marginLeft: "auto",
          });

          lastNavContainer.appendChild(nextBtn);
        } else {
          const navContainer = doc.createElement("div");
          navContainer.classList.add("card-nav");
          Object.assign(navContainer.style, {
            display: "flex",
            justifyContent: "space-between",
            marginTop: "24px",
            gap: "12px",
          });

          const prevBtn = doc.createElement("button");
          prevBtn.id = "prevBtn";
          prevBtn.textContent = "Previous";
          prevBtn.setAttribute("onclick", `prevCard()`);
          Object.assign(prevBtn.style, {
            background: "#007acc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 18px",
            fontSize: "16px",
          });

          const nextBtn = doc.createElement("button");
          nextBtn.id = "nextBtn";
          nextBtn.textContent = "See Results";
          nextBtn.setAttribute(
            "onclick",
            `
            (function() {
              if (window.showCard) {
                showCard(${nextIndex});
              }
              if (window.__refetchQuizScore) {
                window.__refetchQuizScore();
              }
            })()
          `
          );
          Object.assign(nextBtn.style, {
            background: "#007acc",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            padding: "8px 18px",
            fontSize: "16px",
          });

          navContainer.appendChild(prevBtn);
          navContainer.appendChild(nextBtn);
          lastCard.appendChild(navContainer);
        }
      }
    }

    const navFixScript = `
    (function(){
      function getCards() {
        return Array.from(document.querySelectorAll("[id^='card']")).filter(function(el){
          return /card[-_]?\\d+$/i.test(el.id);
        });
      }

      function getVisibleIndex(cards) {
        for (var i = 0; i < cards.length; i++) {
          var s = (cards[i].style && cards[i].style.display) || "";
          if (s !== "none") return i + 1;
        }
        return 1;
      }

      window.showCard = function(n){
        var cards = getCards();
        if (!cards.length) return;

        var idx = Math.max(1, Math.min(n, cards.length));
        for (var i = 0; i < cards.length; i++) {
          cards[i].style.display = (i === (idx - 1)) ? "block" : "none";
        }

        var prevBtn = document.getElementById("prevBtn");
        var nextBtn = document.getElementById("nextBtn");
        if (prevBtn) prevBtn.style.visibility = idx > 1 ? "visible" : "hidden";
        if (nextBtn) nextBtn.style.visibility = idx < cards.length ? "visible" : "hidden";

        // сохраняем текущий индекс глобально
        window.__currentCardIndex = idx;
      };

      window.nextCard = function(){
        var cards = getCards();
        if (!cards.length) return;
        var cur = getVisibleIndex(cards);
        window.showCard(cur + 1);
      };

      window.prevCard = function(){
        var cards = getCards();
        if (!cards.length) return;
        var cur = getVisibleIndex(cards);
        window.showCard(cur - 1);
      };
    })();
  `;

    setRenderedContent(
      <div dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />
    );
    setScripts([...(extractedScripts || []), navFixScript]);
  }, [selectedDocument, quizScore]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector(".prose");
      if (!container) return;

      container
        .querySelectorAll<HTMLFormElement>("form[id^='quiz-']")
        .forEach((form) => {
          const radios = form.querySelectorAll<HTMLInputElement>(
            'input[type="radio"]'
          );
          const submitBtn = form.querySelector<HTMLButtonElement>(
            'button[id$="-submit"]'
          );
          if (!submitBtn) return;

          const quizNum = form.id.replace("quiz-", "");
          const nextBtn = container.querySelector<HTMLButtonElement>(
            `#next-quiz-${quizNum}`
          );

          const anyChecked = Array.from(radios).some((r) => r.checked);
          submitBtn.disabled = !anyChecked;
          submitBtn.style.opacity = anyChecked ? "1" : "0.5";
          if (nextBtn) {
            nextBtn.disabled = !anyChecked;
            nextBtn.style.opacity = anyChecked ? "1" : "0.5";
          }

          radios.forEach((r) => {
            r.addEventListener("change", () => {
              submitBtn.disabled = false;
              submitBtn.style.opacity = "1";
            });
          });

          submitBtn.addEventListener("click", () => {
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            if (nextBtn) {
              nextBtn.disabled = false;
              nextBtn.style.opacity = "1";
            }
          });
        });
    }, 150);

    return () => clearTimeout(timer);
  }, [renderedContent]);

  useEffect(() => {
    scripts.forEach((scriptContent) => {
      const script = document.createElement("script");
      script.innerHTML = scriptContent;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    });
  }, [scripts]);

  useEffect(() => {
    if (selectedDocument) {
      const strippedText = selectedDocument.content.replace(
        /<\/?[^>]+(>|$)/g,
        ""
      );
      setTextContent(strippedText);
    }
  }, [selectedDocument]);

  const handleReadAloud = () => {
    setIsReadingAloud((prev) => !prev);
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(textContent);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        speechSynthesis.cancel();
      };

      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (healthHistoryData) {
      dispatch(setHealthHistory(healthHistoryData));
    }
  }, [dispatch, healthHistoryData]);

  useEffect(() => {
    if (coachesData) {
      setCoaches(coachesData.coaches);
    }
  }, [dispatch, coachesData]);

  useEffect(() => {
    if (healthHistoryError) {
      dispatch(setError("Failed to load user health history"));
      console.error("Health history fetch error:", healthHistoryError);
    }
  }, [healthHistoryError, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAllChatHistory());
    };
  }, []);

  useEffect(() => {
    if (!documentId) return;

    const extractStepNumber = (el?: Element | null) => {
      if (!el) return "";
      const id = (el as HTMLElement).id || "";
      const m = id.match(/^(card|quiz)-?(\d+)$/i) || id.match(/(\d+)$/);
      return m?.[2] || m?.[1] || "";
    };

    const findRootSection = (btn: Element) =>
      (btn.closest('[id^="card"]') ||
        btn.closest('[id^="quiz"]') ||
        btn.closest(
          '[id$="1"],[id$="2"],[id$="3"],[id$="4"],[id$="5"],[id$="6"],[id$="7"],[id$="8"],[id$="9"]'
        )) as HTMLElement | null;

    const handleSubmitClick = async (ev: Event) => {
      const btn = ev.currentTarget as HTMLButtonElement;

      const onclick = btn.getAttribute("onclick") || "";
      const fnNameMatch = onclick.match(/^\s*([a-zA-Z0-9_]+)\s*\(/);
      const fnName = fnNameMatch?.[1];
      const maybeFn = (window as any)[fnName as string];
      if (typeof maybeFn === "function") {
        try {
          maybeFn();
        } catch (e) {
          console.warn(`${fnName}() failed:`, e);
        }
      }

      const root = findRootSection(btn);
      const current_card_number = extractStepNumber(root);

      const form =
        (root?.querySelector("form[id^='quiz']") as HTMLFormElement | null) ||
        (btn.closest("form") as HTMLFormElement | null);

      if (!form) return;

      const question_id = form.id || "quiz-form";
      const checked = form.querySelector<HTMLInputElement>(
        'input[type="radio"]:checked'
      );
      if (!checked) return;

      const answer = checked.value;

      const resultEl =
        (root?.querySelector('[id$="Result"]') as HTMLElement | null) ||
        (root?.querySelector('[id$="-result"]') as HTMLElement | null) ||
        (root?.querySelector('[id$="Feedback"]') as HTMLElement | null) ||
        (root?.querySelector('[id$="-feedback"]') as HTMLElement | null) ||
        (document.querySelector(
          `#${question_id.replace("Form", "")}Result`
        ) as HTMLElement | null) ||
        (document.querySelector(
          `#${question_id.replace("Form", "")}-result`
        ) as HTMLElement | null) ||
        (document.querySelector(
          `#${question_id.replace("Form", "")}Feedback`
        ) as HTMLElement | null) ||
        (document.querySelector(
          `#${question_id.replace("Form", "")}-feedback`
        ) as HTMLElement | null);

      let is_correct = false;
      if (resultEl) {
        const txt = (resultEl.textContent || "").trim().toLowerCase();
        is_correct = txt.includes("correct");
      }

      const payload: ContentStatus = {
        content_id: documentId,
        status_data: {
          status: "read",
          is_archived: false,
          current_card_number,
          quiz_attempt: {
            question_id,
            answer,
            is_correct,
          },
        },
      };

      try {
        await updateStatus(payload);
      } catch (e) {
        console.error("updateStatus failed:", e);
      }
    };

    const buttons = Array.from(
      document.querySelectorAll('button[type="button"][onclick^="checkQuiz"]')
    );
    buttons.forEach((b) => b.addEventListener("click", handleSubmitClick));

    return () => {
      buttons.forEach((b) => b.removeEventListener("click", handleSubmitClick));
    };
  }, [documentId, renderedContent, updateStatus]);

  const fetchPhotoUrl = useCallback(
    async (coachId: string, filename?: string | null) => {
      if (!filename) return null;
      if (photoUrls[coachId]) return photoUrls[coachId];
      try {
        const { data: blob } = await downloadCoachPhoto({ coachId, filename });
        if (!blob) return null;
        const url = URL.createObjectURL(blob);
        setPhotoUrls((prev) => ({ ...prev, [coachId]: url }));
        return url;
      } catch (e) {
        console.warn("Photo download failed:", e);
        return null;
      }
    },
    [photoUrls]
  );

  const handleOpenCoach = useCallback(
    async (coach: CoachListItem) => {
      setSelectedCoachId(coach.coach_id);
      setCoachDialogOpen(true);

      try {
        if (!coachProfiles[coach.coach_id]) {
          getCoachProfile(coach.coach_id);
          setCoachProfiles((p) => ({
            ...p,
            [coach.coach_id]: coachProfileData,
          }));
          const fn = getHeadshotFilename(
            coachProfileData?.detailed_profile?.headshot_url ??
              coach.profile?.headshot_url
          );
          if (fn) void fetchPhotoUrl(coach.coach_id, fn);
        } else {
          const fn = getHeadshotFilename(
            coachProfiles[coach.coach_id]?.detailed_profile?.headshot_url ??
              coach.profile?.headshot_url
          );
          if (fn) void fetchPhotoUrl(coach.coach_id, fn);
        }
      } catch (e) {
        console.error("Failed to load coach profile:", e);
      }
    },
    [coachProfiles, fetchPhotoUrl]
  );

  const onProvidersOpenChange = useCallback(
    (open: boolean) => {
      setProvidersOpen(open);
      if (open) refetchCoaches();
    },
    [setProvidersOpen, refetchCoaches]
  );

  useEffect(() => {
    return () => {
      Object.values(photoUrls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photoUrls]);

  useEffect(() => {
    if (!providersOpen || !coaches.length) return;
    coaches.forEach((c) => {
      if (c.profile?.headshot_url && !photoUrls[c.coach_id]) {
        void fetchPhotoUrl(
          c.coach_id,
          getHeadshotFilename(c.profile?.headshot_url)
        );
      }
    });
  }, [providersOpen, coaches, photoUrls, fetchPhotoUrl]);

  const onStatusChange = async (
    status: "read" | "saved_for_later" | "currently_reading"
  ) => {
    if (
      status === "read" &&
      quizStatus.completedQuizzes !== quizStatus.totalQuizzes
    ) {
      toast({
        title: "Incomplete quizzes",
        description:
          "Please answer all the quizzes before marking this document as read.",
        variant: "destructive",
      });
      return;
    }

    if (documentId) {
      const newStatus: ContentStatus = {
        content_id: documentId,
        status_data: { status: status },
      };
      await updateStatus(newStatus);
      refetch();
    }
    refetchFolders();
  };

  useEffect(() => {
    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        setIsReadingAloud(false);
      }
    };
  }, [selectedDocument]);

  return (
    <div className={`flex flex-col w-full h-full gap-6`}>
      <div className="flex flex-row w-full min-h-[calc(100vh-117px)] xl:h-[100vh] gap-6 relative">
        <div
          className={`flex flex-col gap-6 p-6 pt-[102px] md:pt-6 xl:pr-0 w-full ${!isResizing ? "transition-[width] duration-300 ease-in-out" : ""}`}
          style={{
            width: isMobileOrTablet ? "100%" : `${100 - widthPercent}%`,
          }}
        >
          <div className="flex items-center gap-2 md:gap-4">
            <HealthProfileForm />
            <Popover open={providersOpen} onOpenChange={onProvidersOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  variant="blue2"
                  size={isMobile ? "sm" : "icon"}
                  className="text-[12px] px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
                >
                  {isMobile ? (
                    "Providers"
                  ) : (
                    <MaterialIcon iconName="groups" fill={1} />
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="w-fit md:w-[360px] p-0 rounded-[18px] border border-[#1C63DB] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] bg-white"
                align="start"
              >
                <div className="p-3 border-b border-[#EAEAEA]">
                  <div className="text-[14px] font-semibold text-[#1D1D1F]">
                    Your Providers
                  </div>
                  <div className="text-[12px] text-muted-foreground">
                    Coaches linked to your account
                  </div>
                </div>

                <ScrollArea className="max-h-[360px]">
                  {isLoadingCoaches ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      Loading…
                    </div>
                  ) : coaches.length ? (
                    <ul className="p-2">
                      {coaches.map((c) => {
                        const name = c.basic_info?.name;
                        const photo = photoUrls[c.coach_id];

                        return (
                          <li
                            key={c.coach_id}
                            className="p-2 rounded-[12px] hover:bg-[#F5F5F5] transition-colors"
                          >
                            <Button
                              variant={"unstyled"}
                              size={"unstyled"}
                              onClick={() => handleOpenCoach(c)}
                              className="flex items-center w-full gap-3 text-left"
                            >
                              <div className="h-10 w-10 rounded-full bg-[#E0F0FF] overflow-hidden flex items-center justify-center text-sm font-medium text-[#1C63DB]">
                                {photo ? (
                                  <img
                                    src={photo}
                                    alt={name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  name?.slice(0, 2).toUpperCase()
                                )}
                              </div>

                              <div className="truncate font-medium text-[14px]">
                                {name}
                              </div>
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <div className="p-4 text-sm text-muted-foreground">
                      No providers yet.
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

            <Dialog open={coachDialogOpen} onOpenChange={setCoachDialogOpen}>
              <DialogContent className="max-w-[560px] p-0 rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4 border-b">
                  <div className="h-12 w-12 rounded-full bg-[#E0F0FF] overflow-hidden flex items-center justify-center text-sm font-medium text-[#1C63DB]">
                    {selectedCoachId && photoUrls[selectedCoachId] ? (
                      <img
                        src={photoUrls[selectedCoachId]}
                        alt={selectedCoach?.basic_info?.name || "Coach"}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      (selectedCoach?.basic_info?.name || "C")
                        .slice(0, 2)
                        .toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="text-base font-semibold truncate">
                      {coachProfiles[selectedCoachId!]?.basic_info?.name ||
                        selectedCoach?.basic_info?.name ||
                        "Coach"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {coachProfiles[selectedCoachId!]?.basic_info?.role_name ||
                        "Practitioner"}
                      {coachProfiles[selectedCoachId!]?.relationship_details
                        ?.is_primary_coach === "yes"
                        ? " • Primary coach"
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3 text-sm">
                  <p className="leading-relaxed">
                    {coachProfiles[selectedCoachId!]?.detailed_profile?.bio ||
                      selectedCoach?.profile?.bio ||
                      "No bio provided."}
                  </p>

                  <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                    <span className="text-muted-foreground">Email:</span>
                    {coachProfiles[selectedCoachId!]?.basic_info?.email || "—"}

                    <span className="text-muted-foreground">Phone:</span>
                    {(coachProfiles[selectedCoachId!]?.basic_info?.phone &&
                      phoneMask(
                        coachProfiles[selectedCoachId!]?.basic_info?.phone
                      )) ||
                      "—"}

                    <span className="text-muted-foreground">Timezone:</span>
                    {coachProfiles[selectedCoachId!]?.detailed_profile
                      ?.timezone || "—"}

                    <span className="text-muted-foreground">Languages:</span>
                    {(
                      coachProfiles[selectedCoachId!]?.detailed_profile
                        ?.languages || []
                    ).join(", ") || "—"}

                    <span className="text-muted-foreground">Experience:</span>
                    {coachProfiles[selectedCoachId!]?.detailed_profile
                      ?.years_experience ?? "—"}

                    <span className="text-muted-foreground">
                      Working duration:
                    </span>
                    {coachProfiles[selectedCoachId!]?.relationship_details
                      ?.working_duration || "—"}
                  </div>
                </div>

                <Button onClick={() => setCoachDialogOpen(false)}>Close</Button>
              </DialogContent>
            </Dialog>

            <Button
              variant="blue2"
              size={isMobile ? "sm" : "icon"}
              className="text-[12px] px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
              disabled
            >
              {isMobile ? (
                "Communities (soon)"
              ) : (
                <MaterialIcon iconName="language" />
              )}
            </Button>
          </div>
          {!isLoadingDocument && selectedDocument && (
            <div className="w-full flex justify-end text-[16px] text-[#1D1D1F] font-semibold relative">
              Created by{" "}
              {
                <span
                  tabIndex={0}
                  aria-haspopup="dialog"
                  aria-expanded={isCreatorCardOpen}
                  onMouseEnter={
                    !isMobile ? () => setIsCreatorCardOpen(true) : undefined
                  }
                  onMouseLeave={
                    !isMobile ? () => setIsCreatorCardOpen(false) : undefined
                  }
                  onFocus={
                    !isMobile ? () => setIsCreatorCardOpen(true) : undefined
                  }
                  onBlur={
                    !isMobile ? () => setIsCreatorCardOpen(false) : undefined
                  }
                  onClick={
                    isMobile ? () => setIsCreatorCardOpen((v) => !v) : undefined
                  }
                  className="underline ml-[6px] cursor-pointer"
                >
                  {selectedDocument.creator_name}
                </span>
              }{" "}
              <span className="ml-[6px]">
                {selectedDocument.published_date
                  ? `on ${selectedDocument.published_date}`
                  : ""}
              </span>
              {isCreatorCardOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-full max-w-[500px] rounded-2xl border border-[#E5E7EB] bg-white shadow-xl p-4 z-50 flex items-start gap-6"
                  onMouseEnter={
                    !isMobile ? () => setIsCreatorCardOpen(true) : undefined
                  }
                  onMouseLeave={
                    !isMobile ? () => setIsCreatorCardOpen(false) : undefined
                  }
                  role="dialog"
                  aria-label="Coach details"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    {creatorProfileData && (
                      <Avatar className="object-cover w-[80px] h-[80px] rounded-full">
                        <AvatarImage src={creatorPhoto || undefined} />
                        <AvatarFallback className="text-3xl bg-slate-300 ">
                          {creatorProfileData.detailed_profile.personal_info
                            .first_name !== "" &&
                          creatorProfileData.detailed_profile.personal_info
                            .first_name !== null &&
                          creatorProfileData.detailed_profile.personal_info
                            .last_name !== null &&
                          creatorProfileData.detailed_profile.personal_info
                            .last_name !== "" ? (
                            <div className="flex items-center">
                              <span>
                                {creatorProfileData.detailed_profile.personal_info.first_name.slice(
                                  0,
                                  1
                                )}
                              </span>
                              <span>
                                {creatorProfileData.detailed_profile.personal_info.last_name.slice(
                                  0,
                                  1
                                )}
                              </span>
                            </div>
                          ) : (
                            creatorProfileData.basic_info.name.slice(0, 1)
                          )}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div className="text-[18px] text-[#111827] text-center font-semibold">
                      {creatorProfileData?.basic_info.name}
                    </div>
                  </div>
                  <div className="text-[16px] text-[#5F5F65] whitespace-pre-line w-full">
                    Bio: <br />{" "}
                    {creatorProfileData?.detailed_profile.personal_info.bio ||
                      "No bio provided."}
                  </div>
                </div>
              )}
            </div>
          )}
          {isLoadingDocument && (
            <div className="flex items-center gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
              <span className="inline-flex items-center justify-center w-5 h-5">
                <MaterialIcon
                  iconName="progress_activity"
                  className="text-blue-600 animate-spin"
                />
              </span>
              Please wait, we are loading the information...
            </div>
          )}
          <div className="flex flex-row w-full xl:h-[calc(100vh-176px)] gap-6 relative">
            <div className="hidden xl:block">
              <ChatActions
                initialStatus={selectedDocument?.readStatus}
                initialRating={selectedDocument?.userRating}
                onRegenerate={() => {}}
                isSearching={false}
                hasMessages={messages.length >= 2}
                onStatusChange={onStatusChange}
                onReadAloud={handleReadAloud}
                isReadingAloud={isReadingAloud}
                setSharePopup={setSharePopup}
                changeStatusDisabled={
                  quizStatus.completedQuizzes !== quizStatus.totalQuizzes
                }
              />
            </div>

            {isLoadingSession ? (
              <ChatLoading />
            ) : (
              <div className={`relative flex flex-col w-full h-full`}>
                {isLoadingDocument ? (
                  <DocumentLoadingSkeleton />
                ) : selectedDocument ? (
                  <div className="p-[24px] rounded-[16px] bg-white xl:overflow-y-auto">
                    <div className="prose-sm prose max-w-none">
                      {showTooltip && tooltipPosition && (
                        <div
                          className="fixed px-2 py-1 bg-white border border-blue-500 rounded-md"
                          style={{
                            top: `${tooltipPosition.top}px`,
                            left: `${tooltipPosition.left}px`,
                            transform: "translateX(-50%)",
                            zIndex: 9999,
                          }}
                        >
                          <Button
                            variant={"unstyled"}
                            size={"unstyled"}
                            onClick={handleTooltipClick}
                            className="text-black text-[16px] font-semibold"
                          >
                            Ask Tolu
                          </Button>
                        </div>
                      )}
                      {renderedContent}
                      {/* {resultsCard && (
                    <div className="mt-6">
                      {resultsCard}
                    </div>
                  )} */}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-red-500">
                    Failed to load the document.
                  </div>
                )}

                <div className="xl:hidden block mt-[16px] mb-[16px]">
                  <ChatActions
                    initialStatus={selectedDocument?.readStatus}
                    initialRating={selectedDocument?.rating}
                    onRegenerate={() => {}}
                    isSearching={false}
                    hasMessages={messages.length >= 2}
                    onStatusChange={onStatusChange}
                    onReadAloud={handleReadAloud}
                    isReadingAloud={isReadingAloud}
                    setSharePopup={setSharePopup}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {sharePopup && documentId && (
          <SharePopup
            contentId={documentId}
            onClose={() => setSharePopup(false)}
            coachId={creatorProfileData?.creator_id || ""}
          />
        )}

        <ResizableLibraryChat
          widthPercent={widthPercent}
          setWidthPercent={setWidthPercent}
          onResizeStart={() => setIsResizing(true)}
          onResizeEnd={() => setIsResizing(false)}
        />
      </div>
    </div>
  );
};
