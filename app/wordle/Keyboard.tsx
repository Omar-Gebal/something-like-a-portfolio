import clsx from "clsx";
import { Delete } from "lucide-react";
import { LetterState } from "@/app/wordle/types";
import { useEffect, useState } from "react";

type KeyboardButtonProps = {
  char: string;
  state?: "correct" | "present" | "absent" | "default";
};

function KeyboardButton({ char, state = "default" }: KeyboardButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isSpecial = char === "Enter" || char === "Backspace";

  const press = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 120);
  };

  const handleClick = () => {
    press();
    const event = new KeyboardEvent("keydown", {
      key: char === "Backspace" ? "Backspace" : char,
      code: char.length === 1 ? `Key${char.toUpperCase()}` : char,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toUpperCase() === char.toUpperCase()) {
        press();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [char]);

  return (
    <button
      type="button"
      aria-label={char}
      onClick={handleClick}
      className={clsx(
        "flex items-center justify-center text-black rounded-md h-12 select-none transition-transform duration-100",
        isSpecial ? "text-sm w-13" : "text-xl w-8",
        {
          "bg-emerald-500 text-white": state === "correct",
          "bg-yellow-500 text-white": state === "present",
          "bg-gray-600 text-white": state === "absent",
          "bg-gray-300": state === "default",
          "scale-95 translate-y-0.5": isPressed,
        }
      )}
    >
      {char === "Backspace" ? <Delete size={17} /> : char}
    </button>
  );
}

function KeyboardRow({
  chars,
  states,
}: {
  chars: string[];
  states: Record<string, LetterState>;
}) {
  return (
    <section className="flex gap-1">
      {chars.map((char, charIndex) => (
        <KeyboardButton
          key={charIndex}
          char={char}
          state={states[char] ?? "default"}
        />
      ))}
    </section>
  );
}

export default function Keyboard({
  states,
}: {
  states: Record<string, LetterState>;
}) {
  const rows: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
  ];
  return (
    <section className="flex flex-col gap-1">
      {rows.map((row, rowIndex) => (
        <div className={clsx(rowIndex === 1 && "ms-4")} key={rowIndex}>
          <KeyboardRow chars={row} states={states} />
        </div>
      ))}
    </section>
  );
}
