import React from "react";
import WordleClient from "./WordleClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";
import MyButton from "@/components/ui/MyButton";

export default function Page() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <header className="relative w-full max-w-md mb-4 flex items-center justify-center">
        <h1 className="text-4xl font-extrabold text-center">Wordle 🎯</h1>

        <Dialog>
          <DialogTrigger asChild>
            <MyButton className="w-10 h-10 p-2 flex items-center justify-center absolute right-0">
              <span>?</span>
            </MyButton>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader> 
              <DialogTitle>How to Play Wordle 🎯</DialogTitle> 
            </DialogHeader> 
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <p> Guess the <strong>hidden 5-letter word</strong> in 6 tries. Each guess must be a valid word. </p> 
                <ul className="list-disc list-inside space-y-1"> 
                  <li> <span className="font-bold text-emerald-600">Green</span> → correct letter in the correct spot. </li> 
                  <li> <span className="font-bold text-yellow-500">Yellow</span> → correct letter in the wrong spot. </li> 
                  <li> <span className="font-bold text-gray-600 dark:text-gray-400">Gray</span> → letter not in the word. </li> 
                </ul> 
                <p>Use the hints to find the word before your tries run out!</p> </div>
          </DialogContent>
        </Dialog>
      </header>
      <WordleClient />
    </main>
  );
}
