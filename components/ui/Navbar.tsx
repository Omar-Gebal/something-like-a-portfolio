"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Moon, Sun, Menu } from "lucide-react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const links = [
  { name: "Home", href: "/" },
  // { name: "Projects", href: "/projects" },
  { name: "About", href: "/about" },
  { name: "Digest", href: "/digest" },
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
  const pathname = usePathname();

  const linkStyles = "hover:text-orange-500 hover:underline transition-colors duration-50";

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between py-3 px-6">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold hover:text-orange-500 transition-colors">
          Omar Emad
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-orange-500 hover:underline transition-colors duration-50"
            >
              {name}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background shadow-md py-4 z-40 border-t border-border">
          {links.map(({ name, href }) => (
            <Link
              key={href}
              href={href}
              className={twMerge("block px-4 py-2 hover:text-orange-500 hover:underline transition-colors duration-50")}
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
    </nav>

  );
}