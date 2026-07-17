import { createClient } from "@supabase/supabase-js";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isDemo = !url || !key;
export const supabase = isDemo ? null : createClient(url, key);
export async function signIn(email: string, password: string) {
  if (!supabase) return { ok: true };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { ok: !error, error: error?.message };
}
export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}
export async function currentSession() {
  if (!supabase) return { demo: true, user: { email: "demo@digniin.local" } };
  const { data } = await supabase.auth.getSession();
  return { demo: false, user: data.session?.user || null };
}

const DEMO_ALERT_ID = "20000000-0000-0000-0000-000000000001";
const BELEDWEYNE_ID = "10000000-0000-0000-0000-000000000001";

function deviceId() {
  let id = localStorage.getItem("digniin-device-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("digniin-device-id", id);
  }
  return id;
}

export async function submitAlertResponse(status: "received" | "acting" | "need_help") {
  if (!supabase) return { ok: true, demo: true };
  const { error } = await supabase.from("alert_responses").insert({
    alert_id: DEMO_ALERT_ID,
    anonymous_device_id: deviceId(),
    status,
    location_id: BELEDWEYNE_ID,
  });
  return { ok: !error, error: error?.message };
}

export async function submitCommunityReport(category: string, description: string) {
  if (!supabase) return { ok: true, demo: true };
  const { error } = await supabase.from("community_reports").insert({
    alert_id: DEMO_ALERT_ID,
    location_id: BELEDWEYNE_ID,
    category,
    description,
    state: "pending",
  });
  return { ok: !error, error: error?.message };
}

export type CommunityReport = {
  id: string;
  category: string;
  location: string;
  description: string;
  state: "pending" | "verified" | "rejected";
  created_at: string;
};
const seed: CommunityReport[] = [
  {
    id: "RPT-024",
    category: "Rising water",
    location: "Howlwadaag, Beledweyne",
    description: "Water is approaching homes beside the river road.",
    state: "pending",
    created_at: "2026-07-13T10:42:00Z",
  },
  {
    id: "RPT-023",
    category: "Blocked road",
    location: "Kooshin, Beledweyne",
    description: "The eastern access road is difficult to pass.",
    state: "pending",
    created_at: "2026-07-13T09:18:00Z",
  },
  {
    id: "RPT-022",
    category: "Need assistance",
    location: "Buundoweyn",
    description: "An elderly household needs evacuation support.",
    state: "verified",
    created_at: "2026-07-13T08:05:00Z",
  },
];
export async function getReports() {
  if (supabase) {
    const { data, error } = await supabase
      .from("community_reports")
      .select("id,category,description,state,created_at,locations(name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((x: any) => ({
      ...x,
      location: x.locations?.name || "Unknown",
    }));
  }
  const saved = localStorage.getItem("digniin-admin-reports");
  return saved ? JSON.parse(saved) : seed;
}
export async function moderate(id: string, state: "verified" | "rejected") {
  if (supabase) {
    const { error } = await supabase
      .from("community_reports")
      .update({ state })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const rows: CommunityReport[] = await getReports();
  localStorage.setItem(
    "digniin-admin-reports",
    JSON.stringify(rows.map((r) => (r.id === id ? { ...r, state } : r))),
  );
}
export async function createAlert(payload: any) {
  if (supabase) {
    const { error } = await supabase.from("alerts").insert(payload);
    if (error) throw error;
    return;
  }
  const rows = JSON.parse(localStorage.getItem("digniin-demo-alerts") || "[]");
  rows.unshift({
    ...payload,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  });
  localStorage.setItem("digniin-demo-alerts", JSON.stringify(rows));
}
