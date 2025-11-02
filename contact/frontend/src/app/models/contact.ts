export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface CreateContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  groupIds: number[] | null;
}
