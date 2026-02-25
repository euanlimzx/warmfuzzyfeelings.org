"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "maintenance_notice_ack_v1";

export function MaintenanceGate() {
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setAcknowledged(true);
    }
  }, []);

  const handleAcknowledge = () => {
    setAcknowledged(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
  };

  if (acknowledged) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="max-w-md rounded-lg bg-white p-6 text-sm shadow-xl">
        <h2 className="mb-2 text-base font-semibold text-gray-900">
          Important notice
        </h2>
        <p className="mb-4 text-gray-700">
          this project is no longer actively maintained due to cost concerns.
          images may or may not work. if you really want to make a card or view
          your old card, please email euanlimzx@gmail.com!
        </p>
        <button
          type="button"
          onClick={handleAcknowledge}
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
        >
          I understand
        </button>
      </div>
    </div>
  );
}
