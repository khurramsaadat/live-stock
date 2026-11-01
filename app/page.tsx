"use client";

import { useEffect, useState } from "react";
import { Dashboard } from "@/components/market/dashboard";
import { Landing } from "@/components/market/landing";

export default function Home() {
  const [view, setView] = useState<"landing" | "app">("landing");

  useEffect(() => {
    const stored = localStorage.getItem("ls-view");
    if (stored === "app") setView("app");
  }, []);

  const launch = () => {
    localStorage.setItem("ls-view", "app");
    setView("app");
  };

  const backToLanding = () => {
    localStorage.removeItem("ls-view");
    setView("landing");
  };

  if (view === "app") {
    return <Dashboard onBackToLanding={backToLanding} />;
  }

  return <Landing onLaunch={launch} />;
}
