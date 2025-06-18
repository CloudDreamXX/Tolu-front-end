export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  name: string;
  isOwn: boolean;
}

export const messages: ChatMessage[] = [
  {
    id: "msg-1",
    text: "Hey! How's your day going?",
    time: "10:05 AM",
    name: "Kathy Pacheco",
    isOwn: false,
  },
  {
    id: "msg-2",
    text: "Pretty good, just wrapped up a meeting. You?",
    time: "10:06 AM",
    name: "You",
    isOwn: true,
  },
  {
    id: "msg-3",
    text: "Same here. Want to catch up later?",
    time: "10:07 AM",
    name: "Kathy Pacheco",
    isOwn: false,
  },
  {
    id: "msg-1",
    text: "Hey! How's your day going?",
    time: "10:05 AM",
    name: "Kathy Pacheco",
    isOwn: false,
  },
  {
    id: "msg-2",
    text: "Pretty good, just wrapped up a meeting. You?",
    time: "10:06 AM",
    name: "You",
    isOwn: true,
  },
  {
    id: "msg-3",
    text: "Same here. Want to catch up later?",
    time: "10:07 AM",
    name: "Kathy Pacheco",
    isOwn: false,
  },
  {
    id: "msg-4",
    text: "Sure, let's do that after lunch!",
    time: "10:08 AM",
    name: "You",
    isOwn: true,
  },
  {
    id: "msg-5",
    text: "Same here. Want to catch up later?",
    time: "10:07 AM",
    name: "Kathy Pacheco",
    isOwn: false,
  },
  {
    id: "msg-6",
    text: "Sure, let's do that after lunch!",
    time: "10:08 AM",
    name: "You",
    isOwn: true,
  },
  {
    id: "msg-7",
    text: "Same here. Want to catch up later?",
    time: "10:07 AM",
    name: "Kathy Pacheco",
    isOwn: false,
  },
];
