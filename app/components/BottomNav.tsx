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
      <div className="flex items-stretch justify-around h-[82px]">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center justify-center gap-2 flex-1 min-h-full pt-1"
            >
              {active && (
                <motion.div
                  layoutId="bottom-tab-pill"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-[3px] rounded-full bg-accent-purple"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div whileTap={{ scale: 0.75 }} transition={{ duration: 0.1 }}>
                <Icon
                  className={`w-7 h-7 transition-colors duration-200 ${
                    active ? "text-accent-purple" : "text-white/50"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </motion.div>
              <span
                className={`text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                  active ? "text-accent-purple" : "text-white/50"
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
