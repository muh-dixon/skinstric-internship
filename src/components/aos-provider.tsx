"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AOS from "aos";

type AOSProviderProps = {
  children: React.ReactNode;
};

export function AOSProvider({ children }: AOSProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-out-cubic",
      once: false,
      mirror: true,
      offset: 24,
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      AOS.refreshHard();
    }, 80);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}
