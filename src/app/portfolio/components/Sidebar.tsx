"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookCopy,
  Briefcase,
  ChartNoAxesCombined,
  Gift,
  Headset,
  LogOut,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import useUserDetails from "@/hooks/user/useUserDetail";
import { toast } from "react-toastify";

const Sidebar = () => {
  const pathname = usePathname();
  const { clearUser } = useUserDetails();
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: "Portfolio", path: "/portfolio", icon: ChartNoAxesCombined },
    { name: "My Transactions", path: "/portfolio/wallets", icon: Wallet },
    { name: "My Rewards", path: "/portfolio/rewards", icon: Gift },
    { name: "Community Clubs", path: "/portfolio/community", icon: Users },
    {
      name: "Knowledge Base",
      path: "/portfolio/knowledge-base",
      icon: BookCopy,
    },
    { name: "Support", path: "/portfolio/support", icon: Headset },
    { name: "Settings", path: "/portfolio/settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ];

  const handleLogout = () => {
      setLoggingOut(true);
      sessionStorage.clear();
      clearUser();
      toast.success("Logged out successfully");
  
      setTimeout(() => {
        setLoggingOut(false);
        window.location.href = "/";
      }, 1000);
    };

  return (
    <div className="w-60 min-h-screen shadow-sm border-r px-2 py-4 bg-[#1D1C21] rounded-tr-3xl">
      <h1 className="text-white mb-3">My Dashboard</h1>
      <nav>
        <ul className="flex flex-col gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            if (item.name === "Logout") {
              return (
                <li key={item.name}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-5 py-2 rounded-lg text-white hover:text-muted-foreground w-full text-left"
                  >
                    <div className="p-2 rounded-full">
                      <Icon size={20} />
                    </div>
                    {item.name}
                  </button>
                </li>
              );
            }

            return (
              <li key={item.name}>
                <Link
                  href={item.path || "#"}
                  className={`flex items-center gap-5 py-2 rounded-lg transition-colors text-white hover:text-muted-foreground`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      pathname === item.path ? "bg-white text-black" : ""
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
