export interface IUser {
  name: string;
  email: string;
  dob: string;
  password: string;
  type?: string;
  role: string;
  location: string;
  num_clients: string;
  priority: string[];
}

export interface IRegisterUser {
  name: string;
  email: string;
  dob: string;
  password: string;
  phone_number: string;
  roleID: number;
}