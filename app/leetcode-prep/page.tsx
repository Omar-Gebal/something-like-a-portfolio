import questionData from './data/questions.json';
import QuestionPicker from './components/QuestionPicker';
import { Category } from './data/types';

export default function Page() {
  const data = questionData as Category[];

  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">LeetCode Prep Random Question Picker</h1>

      <p className="mt-2 leading-relaxed dark:text-white">
        Sharpen your problem-solving and pattern recognition skills.  
        Pick the topics you know, and get a random problem you’re guaranteed to
        be able to solve with enough thought, without you giving up early.
      </p>

      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium">Note:</span> Problems and problem categories are based on{" "}
        <a
          href="https://neetcode.io"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-black dark:hover:text-white"
        >
          NeetCode's List
        </a>
        .
      </p>

      <hr className="my-8 border-dashed border-foreground" />

      <QuestionPicker data={data} />
    </main>
  );
}