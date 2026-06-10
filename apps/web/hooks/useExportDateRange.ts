import { useCallback, useSyncExternalStore } from "react";
import { storage } from "@/utils/storage";
import { EXPORT_DATE_RANGE_KEY } from "@/utils/Constants";

type ExportDateRange = {
  startDate: string;
  endDate: string;
};

const EMPTY_EXPORT_DATES: ExportDateRange = {
  startDate: "",
  endDate: "",
};

let snapshot: ExportDateRange = EMPTY_EXPORT_DATES;
let initialized = false;
const listeners = new Set<() => void>();

function loadExportDateRange(): ExportDateRange {
  const raw = storage.get(EXPORT_DATE_RANGE_KEY);
  if (!raw) return EMPTY_EXPORT_DATES;

  try {
    const parsed = JSON.parse(raw) as Partial<ExportDateRange>;
    return {
      startDate: parsed.startDate ?? "",
      endDate: parsed.endDate ?? "",
    };
  } catch {
    return EMPTY_EXPORT_DATES;
  }
}

function persistExportDateRange(startDate: string, endDate: string) {
  if (!startDate && !endDate) {
    storage.remove(EXPORT_DATE_RANGE_KEY);
    return;
  }

  storage.set(EXPORT_DATE_RANGE_KEY, JSON.stringify({ startDate, endDate }));
}

function ensureExportDateRangeLoaded() {
  if (initialized) return;
  initialized = true;

  const loaded = loadExportDateRange();
  if (!loaded.startDate && !loaded.endDate) return;

  snapshot = {
    startDate: loaded.startDate,
    endDate: loaded.endDate,
  };
}

function readExportDateRange() {
  ensureExportDateRangeLoaded();
  return snapshot;
}

function getExportDateRangeServerSnapshot() {
  return EMPTY_EXPORT_DATES;
}

function subscribeExportDateRange(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function writeExportDateRange(startDate: string, endDate: string) {
  ensureExportDateRangeLoaded();

  const next: ExportDateRange =
    !startDate && !endDate ? EMPTY_EXPORT_DATES : { startDate, endDate };

  if (
    snapshot.startDate === next.startDate &&
    snapshot.endDate === next.endDate
  ) {
    return;
  }

  persistExportDateRange(startDate, endDate);
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export function useExportDateRange() {
  const dates = useSyncExternalStore(
    subscribeExportDateRange,
    readExportDateRange,
    getExportDateRangeServerSnapshot,
  );

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    writeExportDateRange(startDate, endDate);
  }, []);

  return {
    startDate: dates.startDate,
    endDate: dates.endDate,
    setDateRange,
  };
}
