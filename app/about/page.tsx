import dayjs from "dayjs";
import WorkExperienceMapper from "./components/WorkExperienceMapper";
import SkillsFilter from "./components/SkillsFilter";

export default function Page() {
  const firstTechJobDate = dayjs("2021-09-01");
  const now = dayjs();
  const yearsOfTechExperience = now.diff(firstTechJobDate, "year");

  return (
    <main className="px-6 py-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">About me</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="col-span-1">
          <h2 className="text-lg font-semibold">Introduction</h2>
          <p className="mt-2 leading-relaxed dark:text-white">
            My name is Omar Emad Gebal, I am a fullstack software engineer with
            {` ${yearsOfTechExperience}`}+ years of professional software engineering
            experience with a rich background in graphic design (another 2 years
            of experience).
          </p>
          <p className="mt-4 leading-relaxed dark:text-white">
            My current position is a software engineer at luciq (formerly
            instabug) where I use Go and Rails for backend tasks and projects
            and React and Vue for the frontend ones.
          </p>
        </div>

        <div className="col-span-1">
          <SkillsFilter />
        </div>
      </section>
      <WorkExperienceMapper/>
    </main>
  );
}