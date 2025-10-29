export type Gender = 'M' | 'F';

export interface ClientInput {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  phone?: string;
}

export interface ClientRecord extends ClientInput {
  id: string;
  createdAt: string;
}
