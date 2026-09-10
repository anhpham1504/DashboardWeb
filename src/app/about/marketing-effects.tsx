"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./about.module.css";

export function MarketingEffects({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!preference.matches) entry.target.setAttribute("data-entered", "true");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    element.querySelectorAll("[data-reveal]").forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={root} className={styles.effects} data-paused={paused}>
      <button className={styles.motionToggle} type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} aria-label={paused ? "Bật hiệu ứng chuyển động" : "Tạm dừng hiệu ứng chuyển động"}>
        {paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? "Bật hiệu ứng" : "Dừng hiệu ứng"}</span>
      </button>
      {children}
    </div>
  );
}
