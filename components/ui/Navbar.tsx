"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu } from "lucide-react";
import Link from "next/link";

const links = [
  { name: "Home", href: "/" },
  // { name: "Projects", href: "/projects" },
  // { name: "About", href: "/about" },
  // { name: "Contact", href: "/contact" },
];

function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 relative w-6 h-6 cursor-pointer transform transition-transform hover:scale-110"
    >
      <Moon className="absolute inset-0 scale-0 dark:scale-100 transition-transform" />
      <Sun className="absolute inset-0 scale-100 dark:scale-0 transition-transform" />
    </button>
  );
}


export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-background text-foreground px-4 py-2 flex items-center justify-between">
      <Link
        href={'/'}
        className="hover:text-purple-400"
      >
        <div className="text-lg font-bold">Omar Emad</div>
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-6">
        {links.map(({ name, href }) => (
          <Link
            key={href}
            href={href}
            className="hover:underline"
          >
            {name}
          </Link>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
          <Menu size={20} />
        </button>

        {menuOpen && (
          <div className="absolute top-10 left-0 w-full bg-background shadow-md py-4 z-50">
            {links.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className="block px-4 py-2 hover:underline"
                onClick={() => setMenuOpen(false)}
              >
                {name}
              </Link>
            ))}
            <div className="mx-4 mt-2">
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
