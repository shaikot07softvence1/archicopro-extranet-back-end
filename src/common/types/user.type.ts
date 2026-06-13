export interface User {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  image?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
