export interface ChatTemplates {
  id: string;
  file: File;
}

export const templates: ChatTemplates[] = [
  {
    id: "template-1",
    file: new File(["Hello, this is a test template."], "template1.txt", {
      type: "text/plain",
    }),
  },
  {
    id: "template-2",
    file: new File(["Another mock template with content."], "template2.txt", {
      type: "text/plain",
    }),
  },
  {
    id: "template-13",
    file: new File(["Hello, this is a test template."], "template1.txt", {
      type: "text/plain",
    }),
  },
  {
    id: "template-24",
    file: new File(["Another mock template with content."], "template2.txt", {
      type: "text/plain",
    }),
  },
  {
    id: "template-5",
    file: new File(["Hello, this is a test template."], "template1.txt", {
      type: "text/plain",
    }),
  },
  {
    id: "template-27",
    file: new File(["Another mock template with content."], "template2.txt", {
      type: "text/plain",
    }),
  },
];
