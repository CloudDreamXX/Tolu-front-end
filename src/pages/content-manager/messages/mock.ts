export type ChatRole = "coach" | "client";

export interface ChatItemModel {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  pinned: boolean;
  role: ChatRole;
  lastMessage: string;
}

export const chatItems: ChatItemModel[] = [
  {
    id: "1",
    name: "Amanda Francis",
    username: "@ammy",
    avatar: "/avatars/amanda.png",
    isOnline: true,
    lastSeen: "5m ago",
    pinned: true,
    role: "client",
    lastMessage: "Sure thing, I’ll have a look today. They’re looking great!",
  },
  {
    id: "2",
    name: "Kathy Pacheco",
    username: "@pach",
    avatar: "/avatars/kathy.png",
    isOnline: false,
    lastSeen: "20m ago",
    pinned: false,
    role: "client",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur. Nunc et egestas nunc.",
  },
  {
    id: "3",
    name: "Dennis Callis",
    username: "@dennis.callis",
    avatar: "/avatars/dennis.png",
    isOnline: false,
    lastSeen: "1h ago",
    pinned: false,
    role: "coach",
    lastMessage: "Just wanted to say thanks for chasing up the release for me.",
  },
  {
    id: "4",
    name: "Group Chat",
    username: "@group_chat",
    avatar: "/avatars/group.png",
    isOnline: true,
    lastSeen: "online",
    pinned: false,
    role: "client",
    lastMessage: "Team — let’s wrap up all updates by EOD Friday.",
  },
  {
    id: "5",
    name: "John Dukes",
    username: "@john",
    avatar: "/avatars/john.png",
    isOnline: true,
    lastSeen: "online",
    pinned: false,
    role: "coach",
    lastMessage: "Thanks! Looks great!",
  },
  {
    id: "6",
    name: "Katie Sims",
    username: "@katie",
    avatar: "/avatars/katie.png",
    isOnline: false,
    lastSeen: "2h ago",
    pinned: true,
    role: "client",
    lastMessage:
      "Hey, Katherine sent me the latest doc. I have a quick question about the...",
  },
  {
    id: "7",
    name: "Anna Francis",
    username: "@anna",
    avatar: "/avatars/anna.png",
    isOnline: false,
    lastSeen: "4h ago",
    pinned: false,
    role: "client",
    lastMessage: "Thanks for checking in. I’ll get back to you tomorrow.",
  },
  {
    id: "8",
    name: "Amanda Francis",
    username: "@ammy",
    avatar: "/avatars/amanda.png",
    isOnline: true,
    lastSeen: "5m ago",
    pinned: true,
    role: "client",
    lastMessage: "Sure thing, I’ll have a look today. They’re looking great!",
  },
  {
    id: "9",
    name: "Kathy Pacheco",
    username: "@pach",
    avatar: "/avatars/kathy.png",
    isOnline: false,
    lastSeen: "20m ago",
    pinned: false,
    role: "client",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur. Nunc et egestas nunc.",
  },
  {
    id: "10",
    name: "Dennis Callis",
    username: "@dennis.callis",
    avatar: "/avatars/dennis.png",
    isOnline: false,
    lastSeen: "1h ago",
    pinned: false,
    role: "coach",
    lastMessage: "Just wanted to say thanks for chasing up the release for me.",
  },
  {
    id: "11",
    name: "Amanda Francis",
    username: "@ammy",
    avatar: "/avatars/amanda.png",
    isOnline: true,
    lastSeen: "5m ago",
    pinned: true,
    role: "client",
    lastMessage: "Sure thing, I’ll have a look today. They’re looking great!",
  },
  {
    id: "12",
    name: "Kathy Pacheco",
    username: "@pach",
    avatar: "/avatars/kathy.png",
    isOnline: false,
    lastSeen: "20m ago",
    pinned: false,
    role: "client",
    lastMessage:
      "Lorem ipsum dolor sit amet consectetur. Nunc et egestas nunc.",
  },
  {
    id: "13",
    name: "Dennis Callis",
    username: "@dennis.callis",
    avatar: "/avatars/dennis.png",
    isOnline: false,
    lastSeen: "1h ago",
    pinned: false,
    role: "coach",
    lastMessage: "Just wanted to say thanks for chasing up the release for me.",
  },
  {
    id: "14",
    name: "Dennis Callis",
    username: "@dennis.callis",
    avatar: "/avatars/dennis.png",
    isOnline: false,
    lastSeen: "1h ago",
    pinned: false,
    role: "coach",
    lastMessage: "Just wanted to say thanks for chasing up the release for me.",
  },
];
