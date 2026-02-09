export interface Question {
  id: string;
  title: string;
  difficulty: string;
  link: string;
}

export interface Category {
  categoryName: string;
  questions: Question[];
}