import { useEffect, useState, useCallback } from "react";

export function useLocal<T>(key: string, initial: T) {
  const [val, setVal] = useState<T>(initial);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setVal(JSON.parse(raw));
    } catch {}
    const on = (e: Event) => {
      if ((e as CustomEvent).detail === key) {
        const raw = localStorage.getItem(key);
        if (raw) setVal(JSON.parse(raw));
      }
    };
    window.addEventListener("ls-change", on);
    return () => window.removeEventListener("ls-change", on);
  }, [key]);
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setVal((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        localStorage.setItem(key, JSON.stringify(next));
        setTimeout(() => window.dispatchEvent(new CustomEvent("ls-change", { detail: key })));
        return next;
      });
    },
    [key],
  );
  return [val, set] as const;
}

export type Activity = { id: string; type: "summary" | "plan" | "chat"; title: string; at: number };
export type Prefs = { name: string; role: string; tone: string; workStart: string };
export const defaultPrefs: Prefs = { name: "", role: "", tone: "Professional", workStart: "09:00" };

export function logActivity(a: Omit<Activity, "id" | "at">) {
  const list: Activity[] = JSON.parse(localStorage.getItem("wp.activity") || "[]");
  list.unshift({ ...a, id: crypto.randomUUID(), at: Date.now() });
  localStorage.setItem("wp.activity", JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new CustomEvent("ls-change", { detail: "wp.activity" }));
}

export function getPrefs(): Prefs {
  try {
    return { ...defaultPrefs, ...JSON.parse(localStorage.getItem("wp.prefs") || "{}") };
  } catch {
    return defaultPrefs;
  }
}
