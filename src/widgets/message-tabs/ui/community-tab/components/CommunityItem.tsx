import { cn } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";

interface CommunityItemProps {
    // avatarSrc?: string;
    first_name: string;
    last_name: string;
    topic: string;
    message: string;
}

export const CommunityItem = ({
    // avatarSrc,
    first_name,
    last_name,
    topic,
    message,
}: CommunityItemProps) => {
    const initials = `${first_name?.[0] ?? ""}${last_name?.[0] ?? ""}`.toUpperCase() || "UN"

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-[6px] mb-[16px]">
                <Avatar className="w-[32px] h-[32px] ">
                    {/* <AvatarImage src={avatarSrc} /> */}
                    <AvatarFallback className={cn("bg-slate-300")}>
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-black text-[16px] font-medium">{first_name} {last_name}</p>
                    <span className="text-[#5F5F65] text-[12px] font-medium">{topic}</span>
                </div>
            </div>
            <div className="flex flex-col gap-[24px]">
                <p className="text-black text-[16px] font-regular">{message}</p>
                <ul className="flex items-center gap-[16px]">
                    <li><Button variant="unstyled" className="text-[14px] text-[#1C63DB]">Comment</Button></li>
                    <li><Button variant="unstyled" className="text-[14px] text-[#1C63DB]">Vote up</Button></li>
                    <li><Button variant="unstyled" className="text-[14px] text-[#1C63DB]">Share</Button></li>
                    <li><Button variant="unstyled" className="text-[14px] text-[#1C63DB]">Collaborate</Button></li>
                </ul>
                <div className="w-full h-[80px] rounded-[16px] bg-[#AAC6EC]/50" />
            </div>
        </div>
    );
}