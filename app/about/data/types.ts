import { Dayjs } from "dayjs";
import { StaticImageData } from "next/image";

export type WorkExperience = {
    company: Organisation;
    roles: Role[];
};

type Organisation = {
    name: string;
    icon: StaticImageData;
    location: string;
    organisationUrl: string;
}
type Role = {
    title: string;
    employmentType: 'Part-time' | 'Full-time' | 'Internship';
    description: string;
    descriptionPoints: string[];
    startDate: Dayjs;
    endDate?: Dayjs;
  };