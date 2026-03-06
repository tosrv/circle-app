// User Data
export interface UserPayload {
  id: number;
  username: string;
}

// Registration
export type RegisterDTO = {
  username: string;
  fullname: string;
  email: string;
  password: string;
};

// Login
export type LoginDTO = {
  email: string;
  password: string;
};
