import { ChatMessage } from "../messages-tab/mock";

export interface ChatNotes extends ChatMessage {
  file: {
    id: string;
    file: File;
  }[];
}

export const notes: ChatNotes[] = [
  {
    id: "msg-1",
    text: "Pretty good, just wrapped up a meeting. You?",
    time: "10:06 AM",
    name: "You",
    isOwn: true,
    file: [],
  },
  {
    id: "msg-2",
    text: "Pretty good, just wrapped up a meeting. You?",
    time: "10:06 AM",
    name: "You",
    isOwn: true,
    file: [],
  },
  {
    id: "msg-3",
    text: "",
    time: "10:07 AM",
    name: "Kathy Pacheco",
    isOwn: true,
    file: [
      {
        id: "template-5",
        file: new File(["Hello, this is a test template."], "template1.txt", {
          type: "text/plain",
        }),
      },
      {
        id: "template-27",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
    ],
  },
  {
    id: "msg-4",
    text: "Sure, let's do that after lunch!",
    time: "10:08 AM",
    name: "You",
    file: [
      {
        id: "template-5",
        file: new File(["Hello, this is a test template."], "template1.txt", {
          type: "text/plain",
        }),
      },
      {
        id: "template-27",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
      {
        id: "template-25",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
      {
        id: "template-25",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
      {
        id: "template-25",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
      {
        id: "template-25",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
      {
        id: "template-25",
        file: new File(
          ["Another mock template with content."],
          "template2.txt",
          {
            type: "text/plain",
          }
        ),
      },
    ],
    isOwn: true,
  },
];
