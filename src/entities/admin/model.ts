export interface User {
    email: string;
    name: string;
    phone_number: string | null;
    role: number;
    signup_date: string | null;
}

export interface UsersResponse {
    users: User[];
}