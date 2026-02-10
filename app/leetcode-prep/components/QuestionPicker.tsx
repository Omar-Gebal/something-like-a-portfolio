'use client';

import { useState, useEffect } from 'react';
import { Category, Question } from '../data/types';
import clsx from 'clsx';

export default function QuestionPicker({ data }: { data: Category[] }) {
  const allCategoryNames = data.map((cat) => cat.categoryName);
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>(allCategoryNames);
  const [randomQuestion, setRandomQuestion] = useState<Question | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem('pickedCategories');
    if (saved) {
      try {
        setSelectedCategories(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved categories:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('pickedCategories', JSON.stringify(selectedCategories));
    }
  }, [selectedCategories, isLoaded]);

  const isAllSelected = selectedCategories.length === allCategoryNames.length;

  const toggleCategory = (name: string) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(allCategoryNames);
    }
  };

  const handlePickRandom = () => {
    const pool = data
      .filter((cat) => selectedCategories.includes(cat.categoryName))
      .flatMap((cat) => cat.questions);

    if (pool.length === 0) {
      alert("Please select at least one topic.");
      return;
    }
    
    const random = pool[Math.floor(Math.random() * pool.length)];
    setRandomQuestion(random);
  };

  // Prevent hydration mismatch (Optional: hides toggle buttons until storage is loaded)
  // If you don't mind a slight UI flash, you can remove this check.
  if (!isLoaded) return <div className="mt-8">Loading preferences...</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-md font-bold uppercase">
          Topics
        </h2>
        <button
          onClick={handleSelectAllToggle}
          className="text-xs font-medium underline underline-offset-4 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
        >
          {isAllSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {data.map((cat) => {
          const isSelected = selectedCategories.includes(cat.categoryName);
          return (
            <button
              key={cat.categoryName}
              onClick={() => toggleCategory(cat.categoryName)}
              className={clsx(
                'px-4 py-2 text-sm border transition-colors cursor-pointer',
                {
                  'bg-foreground text-background border-foreground hover:opacity-90':
                    isSelected,
                  'bg-transparent text-foreground border-foreground hover:bg-foreground/5':
                    !isSelected,
                }
              )}
            >
              {cat.categoryName}
            </button>

          );
        })}
      </div>

      <button
        onClick={handlePickRandom}
        className="px-6 py-3 bg-orange-500 text-white font-bold hover:opacity-80 transition-opacity cursor-pointer"
      >
        Pick Random Problem
      </button>

      {/* Result Display */}
      {randomQuestion && (
        <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
              randomQuestion.difficulty === 'Easy' ? 'border-green-500 text-green-600' :
              randomQuestion.difficulty === 'Medium' ? 'border-yellow-500 text-yellow-600' :
              'border-red-500 text-red-600'
            }`}>
              {randomQuestion.difficulty}
            </span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-xs text-gray-700 dark:text-gray-300">Problem #{randomQuestion.id}</span>
          </div>
          <h2 className="text-2xl font-bold mb-4">{randomQuestion.title}</h2>
          <a
            href={randomQuestion.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-black dark:text-white underline font-medium underline-offset-4 hover:opacity-70"
          >
            Solve on LeetCode →
          </a>
        </div>
      )}
    </div>
  );
}