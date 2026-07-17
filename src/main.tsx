import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Bell,
  CloudRain,
  MapPin,
  Radio,
  ShieldCheck,
  Users,
  WifiOff,
  CheckCircle2,
  Phone,
  Volume2,
  Send,
  BarChart3,
  Languages,
  Menu,
  X,
} from "lucide-react";
import "./styles.css";
import "./public-extra.css";
import { submitAlertResponse, submitCommunityReport } from "./lib/supabase";

type Lang = "en" | "so";
type Status = "none" | "received" | "acting" | "help";
const copy = {
  en: {
    nav: ["Dashboard", "Alerts", "Community", "Impact"],
    live: "LIVE MONITORING",
    title: "Early warning. Clear action.",
    sub: "Turning trusted climate information into simple, local actions for communities across the IGAD region.",
    active: "Active warning",
    flood: "High flood risk — Beledweyne",
    issued:
      "Issued 13 Jul 2026 · Source: Demonstration based on ICPAC products",
    message:
      "Heavy rainfall upstream may raise Shabelle River levels within 48–72 hours. Communities near riverbanks should prepare to move early.",
    actions: "What should you do?",
    a1: "Move important documents and valuables to higher ground.",
    a2: "Identify the nearest safe route and shelter.",
    a3: "Keep children and livestock away from the riverbank.",
    respond: "Confirm your status",
    received: "I received this",
    acting: "Taking action",
    help: "I need help",
    thanks: "Response recorded. Local coordinators can now see your status.",
    overview: "Regional risk overview",
    reports: "Community reports",
    reach: "Alert reach",
    ack: "Acknowledged",
    action: "Taking action",
    districts: "Districts monitored",
    report: "Report a local incident",
    what: "What are you seeing?",
    location: "Location",
    details: "Short description",
    submit: "Submit report",
    offline: "Designed for low bandwidth · Offline fallback ready",
    role: "Advice for",
    resident: "Residents",
    farmer: "Farmers",
    pastoralist: "Pastoralists",
    authority: "Local authorities",
    sms: "SMS preview",
    voice: "Voice alert",
    sim: "Simulation only",
  },
  so: {
    nav: ["Guudmar", "Digniino", "Bulshada", "Saameynta"],
    live: "KORMEER TOOS AH",
    title: "Digniin hore. Tallaabo cad.",
    sub: "Macluumaadka cimilada ee lagu kalsoon yahay waxaan u beddelnaa tallaabooyin fudud oo deegaanka ku habboon.",
    active: "Digniin firfircoon",
    flood: "Khatar fatahaad oo sare — Beledweyne",
    issued:
      "La soo saaray 13 Luulyo 2026 · Isha: Tusaale ku salaysan adeegyada ICPAC",
    message:
      "Roobab culus oo ka da’aya meelaha sare ayaa kor u qaadi kara heerka Webiga Shabeelle 48–72 saac gudahood. Bulshada webiga u dhow waa inay isu diyaariso inay goor hore guurto.",
    actions: "Maxaad samaynaysaa?",
    a1: "Dukumentiyada iyo alaabta muhiimka ah gee meel sare.",
    a2: "Ogow jidka nabdoon iyo goobta hoyga kuugu dhow.",
    a3: "Carruurta iyo xoolaha ka fogee jiinka webiga.",
    respond: "Xaaladdaada xaqiiji",
    received: "Waan helay",
    acting: "Tallaabo ayaan qaadayaa",
    help: "Caawimaad ayaan rabaa",
    thanks:
      "Jawaabta waa la diiwaangeliyey. Isku-duwayaasha deegaanka ayaa arki kara.",
    overview: "Guudmarka khatarta gobolka",
    reports: "Warbixinnada bulshada",
    reach: "Dad la gaarsiiyey",
    ack: "Xaqiijiyey",
    action: "Tallaabo qaaday",
    districts: "Degmooyin la kormeero",
    report: "Soo sheeg dhacdo deegaanka ah",
    what: "Maxaad arkaysaa?",
    location: "Goobta",
    details: "Sharaxaad kooban",
    submit: "Dir warbixinta",
    offline: "Internet yar ayuu ku shaqeeyaa · Habka offline-ka waa diyaar",
    role: "Talo loogu talagalay",
    resident: "Dadka deegaanka",
    farmer: "Beeraleyda",
    pastoralist: "Xoolo-dhaqatada",
    authority: "Maamulka deegaanka",
    sms: "Tusaalaha SMS",
    voice: "Digniin cod ah",
    sim: "Waa tijaabo keliya",
  },
};

function App() {
  const [lang, setLang] = useState<Lang>("en");
  const [status, setStatus] = useState<Status>(
    () => (localStorage.getItem("digniin-status") as Status) || "none",
  );
  const [role, setRole] = useState("resident");
  const [menu, setMenu] = useState(false);
  const [reported, setReported] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const t = copy[lang];
  useEffect(() => {
    localStorage.setItem("digniin-status", status);
    if (status !== "none") {
      const apiStatus = status === "help" ? "need_help" : status;
      submitAlertResponse(apiStatus).then((result) => {
        if (!result.ok && !result.error?.includes("duplicate")) {
          setSubmitError(
            lang === "en"
              ? "Response is saved on this device and will synchronize when the connection is available."
              : "Jawaabta qalabkan ayaa lagu kaydiyey, waxaana la diri doonaa marka internetku diyaar noqdo.",
          );
        }
      });
    }
  }, [status, lang]);
  useEffect(() => {
    const retry = () => {
      if (status === "none") return;
      submitAlertResponse(status === "help" ? "need_help" : status);
    };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [status]);
  async function respond(next: Status) {
    setStatus(next);
    setSubmitError("");
  }
  async function reportIncident(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitting(true); setSubmitError("");
    const data = new FormData(event.currentTarget);
    const result = await submitCommunityReport(String(data.get("category")), String(data.get("description")));
    setSubmitting(false);
    if (result.ok) setReported(true);
    else setSubmitError(lang === "en" ? "The report could not be sent. Check your connection and try again." : "Warbixinta lama dirin. Internetka hubi oo isku day mar kale.");
  }
  const roleAdvice: { [k: string]: string } = {
    resident: t.a2,
    farmer:
      lang === "en"
        ? "Move tools, seed and stored crops away from low-lying areas."
        : "Qalabka, abuurka iyo dalagga kaydsan ka fogee meelaha hoose.",
    pastoralist: t.a3,
    authority:
      lang === "en"
        ? "Check shelters, evacuation routes and vulnerable-household lists."
        : "Hubi hoyga, waddooyinka daad-gureynta iyo liiska qoysaska nugul.",
  };
  return (
    <div>
      <header>
        <a className="brand" href="#">
          <span>
            <Radio />
          </span>
          <b>
            Digniin<span>AI</span>
          </b>
        </a>
        <nav className={menu ? "open" : ""}>
          {t.nav.map((x) => (
            <a href="#overview" key={x}>
              {x}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="lang"
            onClick={() => setLang(lang === "en" ? "so" : "en")}
          >
            <Languages /> {lang === "en" ? "SO" : "EN"}
          </button>
          <button className="menu" onClick={() => setMenu(!menu)}>
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <i></i>
              {t.live}
            </div>
            <h1>{t.title}</h1>
            <p>{t.sub}</p>
            <div className="source">
              <ShieldCheck /> Human-approved alerts <span /> <WifiOff />{" "}
              {t.offline}
            </div>
          </div>
          <div className="radar">
            <div className="pulse p1"></div>
            <div className="pulse p2"></div>
            <MapPin />
            <small>Beledweyne</small>
          </div>
        </section>
        <section className="stats" id="overview">
          <Stat icon={<Users />} value="12,480" label={t.reach} />
          <Stat icon={<CheckCircle2 />} value="8,206" label={t.ack} />
          <Stat icon={<ShieldCheck />} value="3,174" label={t.action} />
          <Stat icon={<MapPin />} value="8" label={t.districts} />
        </section>
        <section className="grid">
          <article className="alert-card">
            <div className="alert-head">
              <div className="hazard">
                <AlertTriangle />
                <div>
                  <small>{t.active}</small>
                  <h2>{t.flood}</h2>
                </div>
              </div>
              <span className="high">HIGH</span>
            </div>
            <p className="issued">{t.issued}</p>
            <div className="warning">
              <CloudRain />
              <p>{t.message}</p>
            </div>
            <div className="role-row">
              <b>{t.role}</b>
              {["resident", "farmer", "pastoralist", "authority"].map((r) => (
                <button
                  className={role === r ? "selected" : ""}
                  onClick={() => setRole(r)}
                  key={r}
                >
                  {t[r as keyof typeof t]}
                </button>
              ))}
            </div>
            <div className="action-box">
              <h3>{t.actions}</h3>
              <ul>
                <li>
                  <CheckCircle2 />
                  {t.a1}
                </li>
                <li>
                  <CheckCircle2 />
                  {roleAdvice[role]}
                </li>
              </ul>
            </div>
            <h3>{t.respond}</h3>
            <div className="responses">
              <button
                className={status === "received" ? "chosen" : ""}
                onClick={() => respond("received")}
              >
                <CheckCircle2 />
                {t.received}
              </button>
              <button
                className={status === "acting" ? "chosen" : ""}
                onClick={() => respond("acting")}
              >
                <ShieldCheck />
                {t.acting}
              </button>
              <button
                className={status === "help" ? "chosen help" : ""}
                onClick={() => respond("help")}
              >
                <Phone />
                {t.help}
              </button>
            </div>
            {status !== "none" && <p className="success">✓ {t.thanks}</p>}
            {submitError && <p className="form-error">{submitError}</p>}
          </article>
          <aside>
            <article className="map-card">
              <div className="card-title">
                <div>
                  <small>{t.overview}</small>
                  <h3>Hiiraan, Somalia</h3>
                </div>
                <span className="updated">● LIVE</span>
              </div>
              <div className="map">
                <div className="river"></div>
                <div className="risk-zone"></div>
                <div className="pin pin1">
                  <i></i>
                  <label>
                    Beledweyne
                    <br />
                    <b>HIGH</b>
                  </label>
                </div>
                <div className="pin pin2">
                  <i></i>
                  <label>
                    Jalalaqsi
                    <br />
                    <b>WATCH</b>
                  </label>
                </div>
                <span className="road r1"></span>
                <span className="road r2"></span>
              </div>
              <div className="channels">
                <button>
                  <Send />
                  {t.sms}
                  <small>{t.sim}</small>
                </button>
                <button>
                  <Volume2 />
                  {t.voice}
                  <small>{t.sim}</small>
                </button>
              </div>
            </article>
            <article className="report-card">
              <div className="card-title">
                <div>
                  <small>{t.reports}</small>
                  <h3>{t.report}</h3>
                </div>
                <BarChart3 />
              </div>
              {reported ? (
                <div className="report-success">
                  <CheckCircle2 />
                  <b>
                    {lang === "en"
                      ? "Report submitted"
                      : "Warbixinta waa la diray"}
                  </b>
                  <p>
                    {lang === "en"
                      ? "Pending moderator verification."
                      : "Waxay sugaysaa xaqiijinta maamulka."}
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={reportIncident}
                >
                  <label>
                    {t.what}
                    <select name="category" required>
                      <option value="">—</option>
                      <option>Rising water / Biyo kacaya</option>
                      <option>Blocked road / Waddo xiran</option>
                      <option>Need assistance / Caawimaad</option>
                    </select>
                  </label>
                  <label>
                    {t.location}
                    <input name="location" required placeholder="Beledweyne" defaultValue="Beledweyne" />
                  </label>
                  <label>
                    {t.details}
                    <textarea name="description" required minLength={10} maxLength={1000} rows={2} />
                  </label>
                  <button className="submit" disabled={submitting}>
                    <Send />
                    {submitting ? (lang === "en" ? "Sending…" : "Waa la dirayaa…") : t.submit}
                  </button>
                </form>
              )}
              {submitError && <p className="form-error">{submitError}</p>}
            </article>
          </aside>
        </section>
      </main>
      <footer>
        <b>DigniinAI</b>
        <span>From early warning to verified early action.</span>
        <span>Prototype by Eng. Maryama (Queen Reza) · 2026</span>
      </footer>
    </div>
  );
}
function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <article>
      <span>{icon}</span>
      <div>
        <b>{value}</b>
        <small>{label}</small>
      </div>
    </article>
  );
}
createRoot(document.getElementById("root")!).render(<App />);
