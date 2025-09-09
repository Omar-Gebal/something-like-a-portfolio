export type LetterState = "default" | "correct" | "present" | "absent";

export interface Letter{
    char: string;
    state: LetterState;
}

export interface Guess {
    letters: Letter[];
    isValid: boolean;
    isSolution: boolean;
}