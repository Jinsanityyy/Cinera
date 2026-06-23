"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bookmark, User } from "lucide-react";
import { motion } from "framer-motion";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/browse", label: "Browse", icon: Search },
  { href: "/mylist", label: "My List", icon: Bookmark },
  { href: "/profiles", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/8"
      style={{
        background: "rgba(10,10,15,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-stretch justify-around h-16">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-1 flex-1 min-h-full"
            >
              {active && (
                <motion.div
                  layoutId="bottom-tab-pill"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-accent-purple"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.8 }} transition={{ duration: 0.1 }}>
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    active ? "text-accent-purple" : "text-white/35"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </motion.div>
              <span
                className={`text-[10px] font-medium tracking-wide transition-colors duration-200 ${
                  active ? "text-accent-purple" : "text-white/35"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
