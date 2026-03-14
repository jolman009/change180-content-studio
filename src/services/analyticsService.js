import { hasSupabaseEnv } from "../lib/runtime";
import { supabase } from "../lib/supabaseClient";
import { demoPerformanceLogs } from "../lib/demoData";

const PERFORMANCE_LOGS_STORAGE_KEY = "change180.performanceLogs";

function getStoredPerformanceLogs() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawLogs = window.localStorage.getItem(PERFORMANCE_LOGS_STORAGE_KEY);
  return rawLogs ? JSON.parse(rawLogs) : [];
}

function setStoredPerformanceLogs(logs) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PERFORMANCE_LOGS_STORAGE_KEY, JSON.stringify(logs));
}

function ensureSeedPerformanceLogs() {
  const logs = getStoredPerformanceLogs();
  if (logs.length > 0) {
    return logs;
  }

  setStoredPerformanceLogs(demoPerformanceLogs);
  return demoPerformanceLogs;
}

function getAnalyticsFallbackResult(error) {
  return {
    data: ensureSeedPerformanceLogs(),
    source: "local",
    fallbackReason: error?.message || "Supabase analytics is unavailable.",
  };
}

export async function getPerformanceLogs() {
  if (!hasSupabaseEnv || !supabase) {
    return {
      data: ensureSeedPerformanceLogs(),
      source: "local",
      fallbackReason: "Supabase environment variables are missing.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("performance_logs")
      .select("*")
      .order("logged_at", { ascending: false });

    if (error) throw error;

    const normalized = (data ?? []).map((item) => ({
      id: item.id,
      postTitle: item.post_title ?? "",
      platform: item.platform ?? "",
      outcome: item.outcome ?? "",
      insight: item.insight ?? "",
      nextMove: item.next_move ?? "",
      loggedAt: item.logged_at ?? "",
    }));

    setStoredPerformanceLogs(normalized);

    return {
      data: normalized.length > 0 ? normalized : ensureSeedPerformanceLogs(),
      source: "supabase",
    };
  } catch (error) {
    return getAnalyticsFallbackResult(error);
  }
}

export async function savePerformanceLog(log) {
  const record = {
    id: log.id ?? `log-${Date.now()}`,
    postTitle: log.postTitle,
    platform: log.platform,
    outcome: log.outcome,
    insight: log.insight,
    nextMove: log.nextMove,
    loggedAt: log.loggedAt ?? new Date().toISOString(),
  };

  if (!hasSupabaseEnv || !supabase) {
    const nextLogs = [record, ...getStoredPerformanceLogs()];
    setStoredPerformanceLogs(nextLogs);

    return {
      data: record,
      source: "local",
      fallbackReason: "Supabase environment variables are missing.",
    };
  }

  try {
    const { data, error } = await supabase
      .from("performance_logs")
      .insert({
        post_title: record.postTitle,
        platform: record.platform,
        outcome: record.outcome,
        insight: record.insight,
        next_move: record.nextMove,
        logged_at: record.loggedAt,
      })
      .select("*")
      .single();

    if (error) throw error;

    const normalized = {
      id: data.id,
      postTitle: data.post_title ?? "",
      platform: data.platform ?? "",
      outcome: data.outcome ?? "",
      insight: data.insight ?? "",
      nextMove: data.next_move ?? "",
      loggedAt: data.logged_at ?? "",
    };

    const nextLogs = [normalized, ...getStoredPerformanceLogs()];
    setStoredPerformanceLogs(nextLogs);

    return {
      data: normalized,
      source: "supabase",
    };
  } catch (error) {
    const nextLogs = [record, ...getStoredPerformanceLogs()];
    setStoredPerformanceLogs(nextLogs);

    return {
      data: record,
      source: "local",
      fallbackReason: error?.message || "Supabase analytics is unavailable.",
    };
  }
}
