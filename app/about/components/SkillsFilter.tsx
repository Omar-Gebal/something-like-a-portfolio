'use client';

import { Separator } from "@/components/ui/separator";
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import { twMerge } from "tailwind-merge";

const skills = {
  languages: ["Go", "Typescript", "Python", "Dart"],
  backend: ["Gin / Echo", "Flask", "MySQL", "PostgreSQL", "MongoDB"],
  frontend: ["NextJS / React", "Vue", "React native", "Flutter", "Angular"],
  devops: ["AWS", "Kubernetes", "Docker", "Jenkins", "RabbitMQ"],
  design: ["Illustrator", "Photoshop", "Figma"],
};

type SkillCategory = keyof typeof skills | 'all';

export default function SkillsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilter = (searchParams.get('filter') as SkillCategory) || 'all';
  const [activeFilter, setActiveFilter] = useState<SkillCategory>(initialFilter);

  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') {
      return Object.values(skills).flat();
    }
    return skills[activeFilter as keyof typeof skills] || [];
  }, [activeFilter]);

  const handleFilterChange = (key: SkillCategory) => {
    setActiveFilter(key);
    const newUrl = key === 'all' ? '/about' : `/about?filter=${key}`;
    router.push(newUrl, { scroll: false });
  };

  const filterButtons: { key: SkillCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'backend', label: 'Backend' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'languages', label: 'Languages' },
    { key: 'devops', label: 'DevOps' },
    { key: 'design', label: 'Design' },
  ];

  // This component only returns the JSX for the skills section
  return (
    <div>
      <h2 className="text-lg font-semibold">Skills</h2>
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleFilterChange(key)}
            className={twMerge(
              "px-3 py-1 rounded-md text-sm font-medium transition-all duration-200",
              activeFilter === key
                ? "bg-foreground text-background"
                : "border border-foreground/20 hover:border-foreground/50 hover:bg-foreground/5"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <Separator className="my-4 bg-foreground" />
      <div className="flex flex-wrap gap-2 mt-2">
        {filteredSkills.map((skill) => (
          <div
            key={skill}
            className="px-3 py-1 border border-foreground rounded-md text-sm"
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}