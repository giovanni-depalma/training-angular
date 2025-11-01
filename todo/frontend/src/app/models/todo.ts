export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string; // ISO UTC string dal backend
  categoryId: number | null;
}

export interface CreateTodoInput {
  title: string;
  completed: boolean;
  categoryId: number | null;
}
