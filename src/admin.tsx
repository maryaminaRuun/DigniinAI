import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Check,
  ChevronRight,
  CloudRain,
  Database,
  FileWarning,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Radio,
  Send,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  createAlert,
  currentSession,
  getReports,
  isDemo,
  moderate,
  signIn,
  signOut,
  type CommunityReport,
} from "./lib/supabase";
import "./admin.css";
import "./auth.css";
type View = "dashboard" | "alerts" | "reports";
function Admin({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("dashboard");
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [composer, setComposer] = useState(false);
  const [notice, setNotice] = useState("");
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    getReports().then(setReports);
  }, []);
  const pending = reports.filter((r) => r.state === "pending").length;
  async function decide(id: string, state: "verified" | "rejected") {
    await moderate(id, state);
    setReports(await getReports());
    setNotice(state === "verified" ? "Report verified" : "Report rejected");
  }
  return (
    <div className="admin-shell">
      <aside className={mobile ? "show" : ""}>
        <div className="admin-brand">
          <span>
            <Radio />
          </span>
          <b>
            Digniin<span>AI</span>
            <small>Coordinator</small>
          </b>
          <button onClick={() => setMobile(false)}>
            <X />
          </button>
        </div>
        <nav>
          <Nav
            icon={<LayoutDashboard />}
            label="Overview"
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          />
          <Nav
            icon={<Bell />}
            label="Alert management"
            active={view === "alerts"}
            onClick={() => setView("alerts")}
          />
          <Nav
            icon={<FileWarning />}
            label="Community reports"
            badge={pending}
            active={view === "reports"}
            onClick={() => setView("reports")}
          />
          <Nav icon={<BarChart3 />} label="Impact analytics" />
          <Nav icon={<Settings />} label="Settings" />
        </nav>
        <div className="operator">
          <i>MR</i>
          <div>
            <b>Maryama Ruun</b>
            <small>Alert coordinator</small>
          </div>
          <button className="logout" onClick={onLogout} title="Sign out"><LogOut /></button>
        </div>
      </aside>
      <main>
        <header>
          <button className="mobile-menu" onClick={() => setMobile(true)}>
            <Menu />
          </button>
          <div>
            <small>HIIRAAN RESPONSE CENTRE</small>
            <h1>
              {view === "dashboard"
                ? "Operational overview"
                : view === "alerts"
                  ? "Alert management"
                  : "Community reports"}
            </h1>
          </div>
          <div className="status">
            <i></i>Systems operational
          </div>
        </header>
        {isDemo && (
          <div className="demo">
            <Database />
            <span>
              <b>Safe demonstration mode</b> — Add Supabase environment values
              to enable the live shared database.
            </span>
          </div>
        )}
        {notice && (
          <div className="toast">
            <Check />
            {notice}
            <button onClick={() => setNotice("")}>×</button>
          </div>
        )}
        {view === "dashboard" && (
          <Dashboard
            pending={pending}
            onAlert={() => setComposer(true)}
            onReports={() => setView("reports")}
          />
        )}{" "}
        {view === "alerts" && <Alerts onCreate={() => setComposer(true)} />}{" "}
        {view === "reports" && <Reports rows={reports} decide={decide} />}
      </main>
      {composer && (
        <Composer
          close={() => setComposer(false)}
          done={() => {
            setComposer(false);
            setNotice("Draft alert saved for human review");
          }}
        />
      )}
    </div>
  );
}
function Dashboard({
  pending,
  onAlert,
  onReports,
}: {
  pending: number;
  onAlert: () => void;
  onReports: () => void;
}) {
  return (
    <div className="page">
      <section className="metrics">
        <Metric
          icon={<Users />}
          value="12,480"
          label="People targeted"
          trend="Across 8 districts"
        />
        <Metric
          icon={<Check />}
          value="65.8%"
          label="Acknowledgement"
          trend="8,206 confirmed"
        />
        <Metric
          icon={<ShieldCheck />}
          value="25.4%"
          label="Taking action"
          trend="3,174 responses"
        />
        <Metric
          icon={<FileWarning />}
          value={String(pending)}
          label="Reports pending"
          trend="Requires moderation"
          warn
        />
      </section>
      <section className="admin-grid">
        <article className="active-alert">
          <div className="section-head">
            <div>
              <small>ACTIVE ALERT</small>
              <h2>High flood risk — Beledweyne</h2>
            </div>
            <span>HIGH</span>
          </div>
          <p>
            <MapPin /> Beledweyne, Hiiraan · Valid for 48–72 hours
          </p>
          <div className="alert-message">
            <CloudRain />
            <span>
              Heavy rainfall upstream may raise Shabelle River levels.
              Communities close to riverbanks should prepare to move early.
            </span>
          </div>
          <div className="delivery">
            <Progress label="PWA / Web" value={96} />
            <Progress label="SMS simulation" value={81} />
            <Progress label="Voice simulation" value={64} />
          </div>
          <button className="outline">
            View alert details <ChevronRight />
          </button>
        </article>
        <article className="quick">
          <div className="section-head">
            <div>
              <small>COORDINATOR ACTIONS</small>
              <h2>Quick actions</h2>
            </div>
          </div>
          <button onClick={onAlert}>
            <Plus />
            <span>
              <b>Create new alert</b>
              <small>Draft and review a localized warning</small>
            </span>
            <ChevronRight />
          </button>
          <button onClick={onReports}>
            <FileWarning />
            <span>
              <b>Moderate reports</b>
              <small>{pending} community submissions waiting</small>
            </span>
            <ChevronRight />
          </button>
          <button>
            <Send />
            <span>
              <b>Test delivery</b>
              <small>Preview SMS and voice channels</small>
            </span>
            <ChevronRight />
          </button>
        </article>
      </section>
      <section className="district-card">
        <div className="section-head">
          <div>
            <small>RESPONSE BY LOCATION</small>
            <h2>District reach and action</h2>
          </div>
          <button>Export report</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>District</th>
              <th>Risk level</th>
              <th>Targeted</th>
              <th>Reached</th>
              <th>Acknowledged</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <Row
              name="Beledweyne"
              risk="HIGH"
              target="5,200"
              reach="78%"
              ack="69%"
              action="31%"
            />
            <Row
              name="Jalalaqsi"
              risk="WATCH"
              target="2,840"
              reach="61%"
              ack="54%"
              action="22%"
            />
            <Row
              name="Bulo Burte"
              risk="MONITOR"
              target="2,510"
              reach="52%"
              ack="46%"
              action="18%"
            />
            <Row
              name="Mataban"
              risk="LOW"
              target="1,930"
              reach="44%"
              ack="39%"
              action="12%"
            />
          </tbody>
        </table>
      </section>
    </div>
  );
}
function Alerts({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="page">
      <div className="list-head">
        <div>
          <h2>Alerts</h2>
          <p>Draft, review and publish approved community warnings.</p>
        </div>
        <button className="primary" onClick={onCreate}>
          <Plus />
          Create alert
        </button>
      </div>
      <article className="alert-list">
        <div className="alert-item">
          <span className="hazard-icon">
            <AlertTriangle />
          </span>
          <div>
            <b>High flood risk — Beledweyne</b>
            <small>Flood · Hiiraan · Published 13 Jul 2026</small>
          </div>
          <span className="pill high">HIGH</span>
          <span className="published">● Published</span>
          <button>Manage</button>
        </div>
        <div className="alert-item">
          <span className="hazard-icon watch">
            <CloudRain />
          </span>
          <div>
            <b>Heavy rainfall preparedness — Jalalaqsi</b>
            <small>Rainfall · Hiiraan · Draft updated 13 Jul 2026</small>
          </div>
          <span className="pill watch">WATCH</span>
          <span className="draft">Draft</span>
          <button>Review</button>
        </div>
      </article>
    </div>
  );
}
function Reports({
  rows,
  decide,
}: {
  rows: CommunityReport[];
  decide: (id: string, s: "verified" | "rejected") => void;
}) {
  return (
    <div className="page">
      <div className="list-head">
        <div>
          <h2>Moderation queue</h2>
          <p>
            Community observations never change official risk levels without
            verification.
          </p>
        </div>
        <span className="queue">
          {rows.filter((r) => r.state === "pending").length} pending
        </span>
      </div>
      <div className="report-list">
        {rows.map((r) => (
          <article key={r.id}>
            <div className="report-top">
              <span>{r.category}</span>
              <small>
                {r.id} · {new Date(r.created_at).toLocaleString()}
              </small>
            </div>
            <h3>
              <MapPin />
              {r.location}
            </h3>
            <p>{r.description}</p>
            <div className="report-bottom">
              <span className={"state " + r.state}>{r.state}</span>
              {r.state === "pending" && (
                <div>
                  <button
                    className="reject"
                    onClick={() => decide(r.id, "rejected")}
                  >
                    Reject
                  </button>
                  <button
                    className="verify"
                    onClick={() => decide(r.id, "verified")}
                  >
                    <Check />
                    Verify report
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
function Composer({ close, done }: { close: () => void; done: () => void }) {
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = new FormData(e.currentTarget);
    await createAlert({
      hazard_type: f.get("hazard"),
      severity: f.get("severity"),
      title_en: f.get("title"),
      title_so: f.get("titleSo"),
      message_en: f.get("message"),
      message_so: f.get("messageSo"),
      source_name: f.get("source"),
      starts_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 259200000).toISOString(),
    });
    done();
  }
  return (
    <div className="modal">
      <form onSubmit={submit}>
        <div className="modal-head">
          <div>
            <small>HUMAN APPROVAL REQUIRED</small>
            <h2>Create alert draft</h2>
          </div>
          <button type="button" onClick={close}>
            <X />
          </button>
        </div>
        <div className="form-grid">
          <label>
            Hazard type
            <select name="hazard">
              <option>flood</option>
              <option>drought</option>
              <option>extreme heat</option>
              <option>heavy rainfall</option>
            </select>
          </label>
          <label>
            Severity
            <select name="severity">
              <option>watch</option>
              <option>high</option>
              <option>extreme</option>
            </select>
          </label>
          <label className="wide">
            English title
            <input
              name="title"
              required
              defaultValue="High flood risk — Beledweyne"
            />
          </label>
          <label className="wide">
            Somali title
            <input
              name="titleSo"
              required
              defaultValue="Khatar fatahaad oo sare — Beledweyne"
            />
          </label>
          <label className="wide">
            English message
            <textarea name="message" required rows={3} />
          </label>
          <label className="wide">
            Somali message
            <textarea name="messageSo" required rows={3} />
          </label>
          <label className="wide">
            Authoritative source
            <input
              name="source"
              required
              placeholder="ICPAC product or authorized agency"
            />
          </label>
        </div>
        <div className="review-note">
          <ShieldCheck />
          This saves a draft. An authorized human must validate the source,
          translation and actions before publication.
        </div>
        <div className="modal-actions">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary" disabled={busy}>
            {busy ? "Saving…" : "Save for review"}
          </button>
        </div>
      </form>
    </div>
  );
}
function Nav({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button className={active ? "active" : ""} onClick={onClick}>
      {icon}
      <span>{label}</span>
      {badge ? <i>{badge}</i> : null}
    </button>
  );
}
function Metric({
  icon,
  value,
  label,
  trend,
  warn,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  trend: string;
  warn?: boolean;
}) {
  return (
    <article className={warn ? "warn" : ""}>
      <span>{icon}</span>
      <div>
        <b>{value}</b>
        <small>{label}</small>
        <em>{trend}</em>
      </div>
    </article>
  );
}
function Progress({ label, value }: { label: string; value: number }) {
  return (
    <div className="prog">
      <div>
        <span>{label}</span>
        <b>{value}%</b>
      </div>
      <i>
        <em style={{ width: value + "%" }} />
      </i>
    </div>
  );
}
function Row(p: {
  name: string;
  risk: string;
  target: string;
  reach: string;
  ack: string;
  action: string;
}) {
  return (
    <tr>
      <td>
        <b>{p.name}</b>
      </td>
      <td>
        <span className={"pill " + p.risk.toLowerCase()}>{p.risk}</span>
      </td>
      <td>{p.target}</td>
      <td>{p.reach}</td>
      <td>{p.ack}</td>
      <td>{p.action}</td>
    </tr>
  );
}
function AuthGate() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { currentSession().then((s) => { setAuthenticated(Boolean(s.user)); setLoading(false); }); }, []);
  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    const result = await signIn(String(data.get("email")), String(data.get("password")));
    setBusy(false); if (result.ok) setAuthenticated(true); else setError(result.error || "Unable to sign in");
  }
  async function logout() { await signOut(); setAuthenticated(false); }
  if (loading) return <div className="auth-loading">Checking secure session…</div>;
  if (authenticated) return <Admin onLogout={logout} />;
  return <main className="auth-page"><section className="auth-card">
    <div className="auth-logo"><span><Radio /></span><b>Digniin<span>AI</span><small>Coordinator access</small></b></div>
    <div className="auth-copy"><small>SECURE OPERATIONS PORTAL</small><h1>Sign in to continue</h1><p>Only authorized alert coordinators can draft warnings or verify community reports.</p></div>
    <form onSubmit={login}><label>Email address<input name="email" type="email" autoComplete="email" required placeholder="coordinator@example.org" /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="auth-error">{error}</p>}<button className="primary" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}</button></form>
    <div className="auth-note"><ShieldCheck /><span>Authentication is provided by Supabase. DigniinAI never stores your password.</span></div><a href="/">← Return to public warnings</a>
  </section></main>;
}
createRoot(document.getElementById("admin-root")!).render(<AuthGate />);
