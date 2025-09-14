import { useState, useEffect } from "react";
import { LetterState } from "../types";
import { ANIMATION_TIMINGS } from '../lib/constants';

interface UseLetterCellAnimationsProps {
  letter: string;
  state: LetterState;
  animate?: boolean;
}

interface UseLetterCellAnimationsReturn {
  popping: boolean;
  flipping: boolean;
  flippingHalf: boolean;
  revealed: boolean;
  isCorrect: boolean;
  isPresent: boolean;
  isAbsent: boolean;
}

export function useLetterCellAnimations({
  letter,
  state = "default",
  animate,
}: UseLetterCellAnimationsProps): UseLetterCellAnimationsReturn {
  const [popping, setPopping] = useState(false);
  const [flipping, setFlipping] = useState(false);
  const [flippingHalf, setFlippingHalf] = useState(false);
  // I use revealed to make sure the color stays after the animation, and when loaded from local storage I reveal immediately
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (animate && state !== "default") {
      setFlipping(true);

      const half = setTimeout(() => setFlippingHalf(true), ANIMATION_TIMINGS.FLIP_HALF_DURATION);
      const end = setTimeout(() => {
        setFlipping(false);
        setFlippingHalf(false);
        setRevealed(true);
      }, ANIMATION_TIMINGS.FLIP_FULL_DURATION);

      return () => {
        clearTimeout(half);
        clearTimeout(end);
      };
    } else if (state !== "default") {
      setRevealed(true);
    }
  }, [state, animate]);

  useEffect(() => {
    if (letter !== "") {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), ANIMATION_TIMINGS.POP_DURATION);
      return () => clearTimeout(t);
    }
  }, [letter]);

  const isCorrect = (flippingHalf || revealed) && state === "correct";
  const isPresent = (flippingHalf || revealed) && state === "present";
  const isAbsent = (flippingHalf || revealed) && state === "absent";

  return {
    popping,
    flipping,
    flippingHalf,
    revealed,
    isCorrect,
    isPresent,
    isAbsent,
  };
}
