import { ContentService } from "entities/content";
import React, { useState } from "react";
import Facebook from "shared/assets/icons/facebook";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";
import { Button } from "shared/ui";

type Props = {
  contentId: string;
  coachId: string;
  onClose: () => void;
};

const SharePopup: React.FC<Props> = ({ contentId, coachId, onClose }) => {
  const [isEmailForm, setIsEmailForm] = useState(false);
  const [isCoachForm, setIsCoachForm] = useState(false);

  const [email, setEmail] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [coachMessage, setCoachMessage] = useState("");

  const shareEmail = async () => {
    const data = {
      content_id: contentId,
      recipient_email: email,
      personal_message: personalMessage,
    };
    try {
      await ContentService.shareEmail(data);
      onClose();
      toast({
        title: "Email sent successfully!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to sending email",
      });
    }
  };

  const shareCoach = async () => {
    const data = {
      content_id: contentId,
      coach_id: coachId,
      message: coachMessage,
    };
    try {
      await ContentService.shareCoach(data);
      onClose();
      toast({
        title: "Message sent to coach!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error sending to coach",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied to clipboard!",
    });
  };

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center px-[16px] overflow-y-auto flex items-center justify-center`}
      style={{
        background: "rgba(0, 0, 0, 0.30)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={`
          flex flex-col 
          bg-white 
          rounded-[18px] 
          w-full
          md:w-[500px] 
          px-[24px] 
          py-[24px] 
          gap-[24px] 
          relative
          top-0
        `}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
        >
          <MaterialIcon iconName="close" />
        </button>

        <h3
          id="modal-title"
          className="text-[24px] font-semibold text-[#1D1D1F]"
        >
          Share Content
        </h3>
        <p className="text-[16px] text-[#5F5F65] font-[500]">
          Share this content via:
        </p>

        <div className="flex items-center gap-2">
          <button
            className={`bg-white p-6 rounded-full flex justify-center gap-4 items-center cursor-pointer border ${isEmailForm && "border-blue-500"}`}
            onClick={() => {
              setIsEmailForm(true);
              setIsCoachForm(false);
            }}
          >
            <MaterialIcon
              iconName="mail"
              className={`${isEmailForm ? "text-blue-500" : ""}`}
            />
          </button>
          <button
            className={`bg-white p-6 rounded-full flex justify-center gap-4 items-center cursor-pointer border ${isCoachForm && "border-blue-500"}`}
            onClick={() => {
              setIsCoachForm(true);
              setIsEmailForm(false);
            }}
          >
            <MaterialIcon
              iconName="inbox"
              className={`${isCoachForm ? "text-blue-500" : ""}`}
            />
          </button>
          <div
            className="fb-share-button"
            data-href={window.location.href}
            data-layout="button_count"
            data-size="small"
          >
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`}
              target="_blank"
              className="fb-xfbml-parse-ignore bg-white p-6 rounded-full flex justify-center gap-4 items-center cursor-pointer border"
              rel="noopener noreferrer"
            >
              <Facebook />
            </a>
          </div>
        </div>

        <p className="text-[16px] text-[#5F5F65] font-[500]">Or copy link:</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={window.location.href}
            className="w-full p-2 border border-gray-300 rounded-md outline-none"
            readOnly
          />
          <Button onClick={copyToClipboard} variant={"brightblue"}>
            Copy
          </Button>
        </div>

        {isEmailForm && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Share via Email</h3>
            <input
              type="email"
              className="w-full p-2 mb-4 border border-gray-300 rounded-md outline-none"
              placeholder="Recipient's Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              className="w-full p-2 mb-4 border border-gray-300 rounded-md outline-none resize-none"
              placeholder="Message"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                variant="brightblue"
                className="w-fit"
                onClick={shareEmail}
              >
                Send Email
              </Button>
            </div>
          </div>
        )}

        {isCoachForm && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Share with Coach</h3>
            <textarea
              className="w-full p-2 mb-4 border border-gray-300 rounded-md outline-none resize-none"
              placeholder="Message"
              value={coachMessage}
              onChange={(e) => setCoachMessage(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                variant="brightblue"
                className="w-fit"
                onClick={shareCoach}
              >
                Send to Coach
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharePopup;
