"use client";
import { useEffect, useState } from "react";
import { isValidWord } from "../lib/words";
import { Guess, Letter, LetterState } from "../types";
import Keyboard from "./Keyboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PartyPopper, X, Flame, Trophy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useLetterCellAnimations } from "../hooks/useLetterCellAnimations";
import { useWordleStorage } from "../hooks/useWordleStorage";
import { GUESS_LIMIT, ANIMATION_TIMINGS } from "../lib/constants";

export interface LetterCellProps {
  letter: string;
  state?: LetterState;
  animate?: boolean;
}

export interface WordRowProps {
  guess: Guess;
  isCurrent: boolean;
  onUpdate: (letters: Letter[]) => void;
  onSubmit: (letters: Letter[]) => void;
  gameOver: boolean;
  shake?: boolean;
}

function LetterCell({ letter, state = "default", animate }: LetterCellProps) {
  const {
    popping,
    flipping,
    isCorrect,
    isPresent,
    isAbsent,
  } = useLetterCellAnimations({ letter, state, animate });

  const cellClass = twMerge(
    `flex items-center justify-center text-2xl sm:text-3xl rounded-lg w-12 h-12 sm:w-14 sm:h-14 border-2 transition-transform duration-${ANIMATION_TIMINGS.POP_DURATION}`,
    popping && "scale-110",
    flipping && "animate-flip",
    letter === ""
      ? "border-gray-400 dark:border-gray-600"
      : "border-gray-500 dark:border-gray-800",
    isCorrect && "border-0 bg-emerald-500 text-white",
    isPresent && "border-0 bg-yellow-500 text-white",
    isAbsent  && "border-0 bg-gray-600 text-white"
  );

  return <span className={cellClass}>{letter.toUpperCase()}</span>;
}

function WordRow({ guess, isCurrent, onUpdate, onSubmit, gameOver, shake }: WordRowProps){

  useEffect(() => {
    if (!isCurrent || gameOver) return;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const nextLetters = [...guess.letters];
      const cursor = nextLetters.findIndex((l) => l.char === "");

      if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
        if (cursor !== -1) {
          nextLetters[cursor] = { ...nextLetters[cursor], char: e.key.toUpperCase() };
        }
      } else if (e.key === "Backspace") {
        const deleteIndex = cursor === -1 ? guess.letters.length - 1 : cursor - 1;
        if (deleteIndex >= 0) {
          nextLetters[deleteIndex] = { ...nextLetters[deleteIndex], char: "" };
        }
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
    <div className={twMerge("flex gap-1", shake && "animate-shake")}>
      {guess.letters.map((letter, idx) => (
        <LetterCell 
          key={idx} 
          letter={letter.char} 
          state={letter.state} 
          animate={isCurrent && !gameOver} 
        />

      ))}
    </div>
  );
}

export default function WordleClient() {
  const {
    guesses,
    setGuesses,
    currentRow,
    setCurrentRow,
    gameOver,
    setGameOver,
    isWin,
    setIsWin,
    streak,
    highestStreak,
    isLoaded,
  } = useWordleStorage();
  
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Open dialog when game ends
  useEffect(() => {
    if (gameOver && isLoaded) {
      setDialogOpen(true);
    }
  }, [gameOver, isLoaded]);



  const updateGuess = (idx: number, letters: Letter[]) => {
    setGuesses((prev) =>
      prev.map((g, i) => (i === idx ? { ...g, letters } : g))
    );
  };

  const submitGuess = async (idx: number, letters: Letter[]) => {
    if (gameOver) return;

    const word = letters.map((l) => l.char).join("");
    const result = await isValidWord(word);

    if (!result.isValid) {
      setGuesses((prev) =>
        prev.map((g, i) =>
          i === idx ? { ...g, isValid: false, isSolution: false } : g
        )
      );
      setShakeRow(idx);
      setTimeout(() => setShakeRow(null), ANIMATION_TIMINGS.SHAKE_DURATION);
      return;
    }


    result.letterStates.forEach((state, i) => {
      setTimeout(() => {
        setGuesses((prev) =>
          prev.map((g, gi) =>
            gi === idx
              ? {
                  ...g,
                  letters: g.letters.map((l, li) =>
                    li === i ? { ...l, state } : l
                  ),
                  isValid: true,
                  isSolution: result.isSolution,
                }
              : g
          )
        );
      }, i * ANIMATION_TIMINGS.LETTER_REVEAL_DELAY);
    });

    setTimeout(() => {
      if (result.isSolution) {
        setIsWin(true);
        setGameOver(true);
      } else {
        if (currentRow < GUESS_LIMIT - 1) setCurrentRow(currentRow + 1);
        else setGameOver(true);
      }
    }, result.letterStates.length * ANIMATION_TIMINGS.LETTER_REVEAL_DELAY + 50);
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
          shake={shakeRow === idx}
        />
      ))}

      <br />
      <Keyboard states={keyboardStates} />

      {/* Endgame Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm rounded-2xl shadow-lg">
          <DialogHeader>
            <DialogTitle>
                           
                {isWin ? (
                    <span className="flex justify-center items-center text-2xl font-bold gap-2"> 
                      <PartyPopper/>
                      You Got it!
                    </span>
                  ) : (
                    <h2 className="flex justify-center items-center text-2xl font-bold gap-2"> 
                      <X/>
                      {'Your guess is wrong :('}
                    </h2>
                  )
                }
              
            </DialogTitle>
          </DialogHeader>
          <div className="text-center mt-2 space-y-2">
            {isWin ? (
              <p className="text-emerald-600 text-lg font-semibold">
                Today's word was "{guesses[currentRow].letters.map(l => l.char).join('')}" come back tomorrow for a new word 🤙
              </p>
            ) : (
              <p className="text-red-600 text-lg font-semibold">
                Better luck next time — try again tomorrow!
              </p>
            )}

            <div className="mt-4 flex flex-col text-foreground">
              <span className="flex justify-center items-center gap-1">
                <Flame/> Current Streak: <b>{streak}</b>
              </span>
              <span className="flex justify-center items-center gap-1">
                <Trophy/> Highest Streak: <b>{highestStreak}</b>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

}
