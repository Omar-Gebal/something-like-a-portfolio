export type LetterState = "default" | "correct" | "present" | "absent";

export type Letter = {
  char: string;
  state: LetterState;
  animation?: string;
};

export interface Guess {
    letters: Letter[];
    isValid: boolean;
    isSolution: boolean;
}