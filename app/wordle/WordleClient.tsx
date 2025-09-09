"use client";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { isValidWord } from "@/app/wordle/words";
import { Guess, Letter, LetterState } from "@/app/wordle/types";
import Keyboard from "@/app/wordle/Keyboard";

const GUESS_LIMIT = 6;

function LetterCell({ letter, state = "default" }: { letter: string; state?: LetterState }) {
  const cellClass = clsx(
    "flex items-center justify-center text-3xl rounded-lg w-14 h-14",
    letter === "" ? "border-gray-400 dark:border-gray-600" : "border-gray-500 dark:border-gray-8a00",
    {
      "border-3 border-solid": state === "default",
      "bg-emerald-500 text-white": state === "correct",
      "bg-yellow-500 text-white": state === "present",
      "bg-gray-600 text-white": state === "absent",
    },
  );

  return <span className={cellClass}>{letter.toUpperCase()}</span>;
}

function WordRow({
  guess,
  isCurrent,
  onUpdate,
  onSubmit,
  gameOver,
}: {
  guess: Guess;
  isCurrent: boolean;
  onUpdate: (letters: Letter[]) => void;
  onSubmit: (letters: Letter[]) => void;
  gameOver: boolean;
}) {
  useEffect(() => {
    if (!isCurrent || gameOver) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const nextLetters = [...guess.letters];
      const cursor = nextLetters.findIndex((l) => l.char === "");

      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        if (cursor !== -1) nextLetters[cursor] = { ...nextLetters[cursor], char: e.key.toUpperCase() };
      } else if (e.key === "Backspace") {
        const deleteIndex = cursor === -1 ? guess.letters.length - 1 : cursor - 1;
        if (deleteIndex >= 0) nextLetters[deleteIndex] = { ...nextLetters[deleteIndex], char: "" };
      }

      onUpdate(nextLetters);

      if (e.key === "Enter" && nextLetters.every((l) => l.char !== "")) {
        onSubmit(nextLetters);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCurrent, guess, onUpdate, onSubmit, gameOver]);

  return (
    <div className="flex gap-1">
      {guess.letters.map((letter, idx) => (
        <LetterCell key={idx} letter={letter.char} state={letter.state} />
      ))}
    </div>
  );
}

export default function WordleClient() {
  const WORD_LENGTH = 5;
  const [guesses, setGuesses] = useState<Guess[]>(
    Array.from({ length: GUESS_LIMIT }, () => ({
      letters: Array.from({ length: WORD_LENGTH }, () => ({ char: "", state: "default" })),
      isValid: false,
      isSolution: false,
    }))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);


  const updateGuess = (idx: number, letters: Letter[]) => {
    setGuesses((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, letters } : g))
    );
  };

  const submitGuess = async (idx: number, letters: Letter[]) => {
  if (gameOver) return;

  const word = letters.map((l) => l.char).join("");
  const result = await isValidWord(word);

  setGuesses((prev) =>
    prev.map((g, i) =>
      i === idx
        ? {
            ...g,
            letters: g.letters.map((l, i) => ({ ...l, state: result.letterStates[i] })),
            isValid: result.isValid,
            isSolution: result.isSolution,
          }
        : g
      ) 
    );

    if (result.isSolution) {
      setIsWin(true);
      setGameOver(true);
      return;
    }

    // Only move to next row if the word is valid
    if (result.isValid) {
      if (currentRow < GUESS_LIMIT - 1) setCurrentRow(currentRow + 1);
      else setGameOver(true);
    }
  };

  function getKeyboardStates(guesses: Guess[]): Record<string, LetterState> {
    const priority: Record<LetterState, number> = {
      correct: 3,
      present: 2,
      absent: 1,
      default: 0,
    };

    const states: Record<string, LetterState> = {};

    for (const guess of guesses) {
      for (const letter of guess.letters) {
        if (!letter.char) continue;
        const current = states[letter.char] ?? "default";
        if (priority[letter.state] > priority[current]) {
          states[letter.char] = letter.state;
        }
      }
    }

    return states;
  }

  const keyboardStates = getKeyboardStates(guesses);
  return (
    <div className="flex justify-center items-center flex-col gap-1">
      {guesses.map((guess, idx) => (
        <WordRow
          key={idx}
          guess={guess}
          isCurrent={idx === currentRow}
          onUpdate={(letters) => updateGuess(idx, letters)}
          onSubmit={(letters) => submitGuess(idx, letters)}
          gameOver={gameOver}
        />
      ))}
      <br/>
      <Keyboard states={keyboardStates}/>
      {gameOver && (
        <div className="mt-4 text-xl font-bold">
          {isWin ? (
            <span className="text-emerald-600">🎉 You Win!</span>
          ) : (
            <span className="text-red-600">❌ You Lose! Better luck next time.</span>
          )}
        </div>
      )}

    </div>
  );
}
