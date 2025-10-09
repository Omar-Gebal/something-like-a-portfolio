import Image from "next/image";
import { experience } from "@/app/about/data/experience";

// Color class variables
const borderColor = "border-gray-400";
const textSecondary = "text-gray-700 dark:text-gray-300";
const textTertiary = "text-gray-600 dark:text-gray-400";
const linkColor = "text-sky-700 dark:text-sky-500";

export default function WorkExperienceMapper() {
    return (
        <section className="space-y-6 mt-6">
            <h2 className="text-lg font-semibold">Work Experience</h2>

            {experience.map((exp, i) => (
                <div
                    key={i}
                    className={`flex items-start gap-4 border-b ${borderColor} pb-4 last:border-none`}
                >
                    <Image
                        src={exp.company.icon}
                        alt="Company Logo"
                        width={64}
                        height={64}
                        className="rounded-md w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                    />


                    <div>
                        <a
                            href={exp.company.organisationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${linkColor} font-medium`}
                        >
                            {exp.company.name}
                        </a>

                        <p className={`text-sm ${textSecondary}`}>{exp.company.location}</p>

                        <ul className="mt-2 space-y-2">
                            {exp.roles.map((role, j) => (
                            <li key={j}>
                                <p className="font-semibold">{role.title}</p>

                                <p className={`text-sm ${textTertiary}`}>
                                {role.employmentType} •{" "}
                                {role.startDate.format("MMM YYYY")} -{" "}
                                {role.endDate ? role.endDate.format("MMM YYYY") : "Present"}
                                </p>

                                <p className={`mt-2 text-sm leading-relaxed ${textSecondary}`}>
                                {role.description}
                                </p>

                                {role.descriptionPoints?.length > 0 && (
                                <ul
                                    className={`mt-2 list-disc list-inside space-y-1 text-sm ${textTertiary}`}
                                >
                                    {role.descriptionPoints.map((point, k) => (
                                    <li key={k} className="pl-1">
                                        {point}
                                    </li>
                                    ))}
                                </ul>
                                )}
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </section>
  );
}
