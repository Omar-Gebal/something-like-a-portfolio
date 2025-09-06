import React from 'react';
import { Coffee, WholeWord } from 'lucide-react';
import { SiGithub, SiLinkedin } from "react-icons/si";
import MyButton from './ui/MyButton';

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Omar-Gebal",
    icon: SiGithub,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/omaremadd/",
    icon: SiLinkedin,
  },
];
export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <main className="text-center">
        {/* Profile Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2 bg-clip-text">
            Omar Emad
          </h1>
          <p className="text-xl mb-4">Software Engineer</p>
          <p className="max-w-md mx-auto">
            Full-stack developer that's building cool stuff.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* <MyButton type='primary'>
            <span className="flex items-center gap-2">
              <WholeWord className="w-5 h-5 group-hover:rotate-12" />
              Solve Today's Wordle
            </span>
          </MyButton> */}
          
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <MyButton key={label} type="secondary" href={href}>
              <span className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {label}
              </span>
            </MyButton>
          ))}
        </div>
      </main>
    </div>
  );
}
