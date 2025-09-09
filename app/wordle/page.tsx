import React from "react";
import WordleClient from "./WordleClient";

export default async function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="text-center mb-2">
        <h1 className="text-4xl font-extrabold">Wordle 🎯</h1>
        <ul className="mt-4 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside font-semibold">
          <li><span className="text-emerald-600 ">Green</span> → correct letter in the correct spot.</li>
          <li><span className="text-yellow-500">Yellow</span> → correct letter in the wrong spot.</li>
          <li><span className="text-gray-600 dark:text-gray-400">Gray</span> → letter not in the word at all.</li>
        </ul>
      </header>
      <WordleClient />
    </main>
  );
}
