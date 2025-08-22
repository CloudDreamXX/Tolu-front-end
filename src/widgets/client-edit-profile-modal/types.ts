export type ClientProfileData = {
  name: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female";
  timeZone: string;
};

export const defaultData: ClientProfileData = {
  name: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  gender: "female",
  timeZone: "",
};
