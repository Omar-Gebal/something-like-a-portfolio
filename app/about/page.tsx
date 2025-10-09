import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import WorkExperienceMapper from "./components/WorkExperienceMapper";

const skills = {
  languages: ["Go", "Typescript", "Python", "Dart"],
  backend: ["Gin / Echo", "Flask", "MySQL", "PostgreSQL", "MongoDB"],
  frontend: ["NextJS / React", "Vue", "React native", "Flutter", "Angular"],
  devops: ["AWS", "Kubernetes", "Docker", "Jenkins", "RabbitMQ"],
  design: ["Illustrator", "Photoshop", "Figma"],
};

type SkillCategory = keyof typeof skills | 'all';

interface PageProps {
  searchParams: { filter?: string };
}

export default function Page({ searchParams }: PageProps) {
  const firstTechJobDate = dayjs("2021-09-01");
  const now = dayjs();
  const yearsOfTechExperience = now.diff(firstTechJobDate, "year");

  const activeFilter: SkillCategory = (searchParams.filter as SkillCategory) || 'all';

  const getFilteredSkills = () => {
    if (activeFilter === 'all') {
      return skills;
    }
    return { [activeFilter]: skills[activeFilter] };
  };

  const filterButtons: { key: SkillCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'backend', label: 'Backend' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'languages', label: 'Languages' },
    { key: 'devops', label: 'DevOps' },
    { key: 'design', label: 'Design' },
  ];

  return (
    <main className="px-8 py-6 max-w-6xl mx-auto">
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
            <h2 className="text-lg font-semibold">Skills</h2>
            
            <div className="flex gap-2 flex-wrap">
              {filterButtons.map(({ key, label }) => (
                <Link
                  key={key}
                  href={key === 'all' ? '/about' : `/about?filter=${key}`}
                  className={twMerge("px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
                    activeFilter === key ? "bg-foreground text-background": "border border-foreground/20 hover:border-foreground/50 hover:bg-foreground/5"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
            <Separator className="my-4 bg-foreground" />
            <div className="flex flex-wrap gap-2 mt-2 ">
              {Object.values(getFilteredSkills()).flat().map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1 border border-foreground rounded-md text-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
      </section>
      <WorkExperienceMapper/>
    </main>
  );
}