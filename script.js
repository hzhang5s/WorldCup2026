/* =====================================================================
   API ENDPOINTS — all data is fetched live from ESPN's public JSON API.

   LIVE SCOREBOARD:
   https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard

   ALL MATCHES (full tournament, scores + venues + status):
   https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=200

   GROUP STANDINGS:
   https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?season=2026
===================================================================== */
const SCOREBOARD_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=200";
const STANDINGS_URL =
  "https://site.api.espn.com/apis/v2/sports/soccer/fifa.world/standings?season=2026";
const SCORERS_URL =
  "https://api.football-data.org/v4/competitions/WC/scorers?limit=10";

/* ============ team metadata ============ */
const NAMES = {
  SUI: "Switzerland",
  COL: "Colombia",
  ARG: "Argentina",
  EGY: "Egypt",
  USA: "United States",
  BEL: "Belgium",
  POR: "Portugal",
  ESP: "Spain",
  MEX: "Mexico",
  ENG: "England",
  BRA: "Brazil",
  NOR: "Norway",
  PAR: "Paraguay",
  FRA: "France",
  CAN: "Canada",
  MAR: "Morocco",
  GHA: "Ghana",
  AUS: "Australia",
  CPV: "Cape Verde",
  RSA: "South Africa",
  KOR: "South Korea",
  CZE: "Czechia",
  BIH: "Bosnia & Herz.",
  QAT: "Qatar",
  SCO: "Scotland",
  HTI: "Haiti",
  TUR: "Türkiye",
  GER: "Germany",
  CIV: "Ivory Coast",
  ECU: "Ecuador",
  CUW: "Curaçao",
  NED: "Netherlands",
  JPN: "Japan",
  SWE: "Sweden",
  TUN: "Tunisia",
  IRN: "Iran",
  NZL: "New Zealand",
  URU: "Uruguay",
  KSA: "Saudi Arabia",
  SEN: "Senegal",
  IRQ: "Iraq",
  AUT: "Austria",
  DZA: "Algeria",
  JOR: "Jordan",
  COD: "DR Congo",
  UZB: "Uzbekistan",
  CRO: "Croatia",
  PAN: "Panama",
  TBD: "To be decided",
};

/* ESPN / other providers sometimes use different codes — normalize */
const ALIAS = {
  HAI: "HTI",
  IRI: "IRN",
  ALG: "DZA",
  CUR: "CUW",
  CVI: "CPV",
  CGO: "COD",
  IVC: "CIV",
  RCB: "COD",
  SAF: "RSA",
  NEP: "NED",
};
function norm(code) {
  code = (code || "TBD").toUpperCase();
  return ALIAS[code] || code;
}

const FLAGS = {
  SUI: ["#DA291C", "#FFFFFF"],
  COL: ["#FCD116", "#003893"],
  ARG: ["#74ACDF", "#F6B40E"],
  EGY: ["#CE1126", "#111111"],
  USA: ["#B22234", "#3C3B6E"],
  BEL: ["#111111", "#FDDA24"],
  POR: ["#046A38", "#DA291C"],
  ESP: ["#AA151B", "#F1BF00"],
  MEX: ["#006847", "#CE1126"],
  ENG: ["#FFFFFF", "#CE1126"],
  BRA: ["#009C3B", "#FFDF00"],
  NOR: ["#BA0C2F", "#00205B"],
  PAR: ["#D52B1E", "#0038A8"],
  FRA: ["#0055A4", "#EF4135"],
  CAN: ["#FF0000", "#FFFFFF"],
  MAR: ["#C1272D", "#006233"],
  GHA: ["#CE1126", "#FCD116"],
  AUS: ["#00008B", "#FFCD00"],
  CPV: ["#003893", "#CF2027"],
  RSA: ["#007749", "#FFB612"],
  KOR: ["#CD2E3A", "#0047A0"],
  CZE: ["#D7141A", "#11457E"],
  BIH: ["#002F6C", "#FECB00"],
  QAT: ["#8A1538", "#FFFFFF"],
  SCO: ["#005EB8", "#FFFFFF"],
  HTI: ["#00209F", "#D21034"],
  TUR: ["#E30A17", "#FFFFFF"],
  GER: ["#DD0000", "#FFCC00"],
  CIV: ["#FF8200", "#009A44"],
  ECU: ["#FFDD00", "#034EA2"],
  CUW: ["#002B7F", "#F9E814"],
  NED: ["#AE1C28", "#21468B"],
  JPN: ["#FFFFFF", "#BC002D"],
  SWE: ["#006AA7", "#FECC02"],
  TUN: ["#E70013", "#FFFFFF"],
  IRN: ["#239F40", "#DA0000"],
  NZL: ["#00247D", "#CC142B"],
  URU: ["#7BAFD4", "#FFFFFF"],
  KSA: ["#006C35", "#FFFFFF"],
  SEN: ["#00853F", "#FDEF42"],
  IRQ: ["#CE1126", "#111111"],
  AUT: ["#ED2939", "#FFFFFF"],
  DZA: ["#006233", "#FFFFFF"],
  JOR: ["#CE1126", "#007A3D"],
  COD: ["#007FFF", "#F7D618"],
  UZB: ["#0099B5", "#1EB53A"],
  CRO: ["#FF0000", "#171796"],
  PAN: ["#DA121A", "#072357"],
  TBD: ["#9AA79E", "#C7CFC8"],
};

function flagCSS(c) {
  const f = FLAGS[c] || FLAGS.TBD;
  return `background:linear-gradient(90deg, ${f[0]} 50%, ${f[1]} 50%)`;
}

/* FIFA 3-letter → ISO 3166 codes for the flagcdn.com API */
const ISO2 = {
  SUI: "ch",
  COL: "co",
  ARG: "ar",
  EGY: "eg",
  USA: "us",
  BEL: "be",
  POR: "pt",
  ESP: "es",
  MEX: "mx",
  ENG: "gb-eng",
  BRA: "br",
  NOR: "no",
  PAR: "py",
  FRA: "fr",
  CAN: "ca",
  MAR: "ma",
  GHA: "gh",
  AUS: "au",
  CPV: "cv",
  RSA: "za",
  KOR: "kr",
  CZE: "cz",
  BIH: "ba",
  QAT: "qa",
  SCO: "gb-sct",
  HTI: "ht",
  TUR: "tr",
  GER: "de",
  CIV: "ci",
  ECU: "ec",
  CUW: "cw",
  NED: "nl",
  JPN: "jp",
  SWE: "se",
  TUN: "tn",
  IRN: "ir",
  NZL: "nz",
  URU: "uy",
  KSA: "sa",
  SEN: "sn",
  IRQ: "iq",
  AUT: "at",
  DZA: "dz",
  JOR: "jo",
  COD: "cd",
  UZB: "uz",
  CRO: "hr",
  PAN: "pa",
};

/* Flag image: flagcdn.com renders edge-to-edge with no padding, so it's primary;
   the ESPN logo URL is the backup, then the color bar if both fail. */
function flagImg(code, meta, size, cls) {
  const bar = `<span class="bar" style="${flagCSS(code)}"></span>`;
  if (!code || code === "TBD") return bar;
  const iso = ISO2[code];
  const primary = iso
    ? `https://flagcdn.com/w${size || 80}/${iso}.png`
    : meta && meta.logo;
  if (!primary) return bar;
  const backup = iso && meta && meta.logo ? meta.logo : "";
  return (
    `<span class="bar" style="display:none;${flagCSS(code)}"></span>` +
    `<img class="${cls || "flag"}" src="${esc(primary)}"${backup ? ` data-alt="${esc(backup)}"` : ""} ` +
    `alt="${esc(NAMES[code] || code)} flag" loading="lazy" ` +
    `onerror="if(this.dataset.alt){this.src=this.dataset.alt;this.dataset.alt='';}` +
    `else{this.style.display='none';this.previousElementSibling.style.display='inline-block'}">`
  );
}
function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function name(m, code) {
  return m && m.fullName ? m.fullName : NAMES[code] || code;
}

/* ============ round from date (2026 official calendar) ============ */
function roundFor(d) {
  const day = d.toISOString().slice(0, 10);
  if (day <= "2026-06-27") return "Group stage";
  if (day <= "2026-07-03") return "Round of 32";
  if (day <= "2026-07-08") return "Round of 16";
  if (day <= "2026-07-12") return "Quarterfinals";
  if (day <= "2026-07-16") return "Semifinals";
  if (day === "2026-07-18") return "Third-place match";
  return "Final";
}
const ROUND_ORDER = [
  "Group stage",
  "Round of 32",
  "Round of 16",
  "Quarterfinals",
  "Semifinals",
  "Third-place match",
  "Final",
];

/* ============ app state (filled from API; fallback below) ============ */
let MATCHES = [];
let GROUPS = {};
let usingFallback = false;

/* ============ fetch + map ESPN data ============ */
async function loadData() {
  const btn = document.getElementById("refreshBtn"),
    msg = document.getElementById("statusMsg");
  btn.disabled = true;
  msg.textContent = "Fetching from ESPN API…";
  try {
    const [sbRes, stRes] = await Promise.all([
      fetch(SCOREBOARD_URL),
      fetch(STANDINGS_URL),
    ]);
    if (!sbRes.ok) throw new Error("scoreboard HTTP " + sbRes.status);
    const sb = await sbRes.json();
    MATCHES = (sb.events || [])
      .map((ev) => {
        const comp = (ev.competitions || [])[0] || {};
        const cs = comp.competitors || [];
        const home = cs.find((c) => c.homeAway === "home") || cs[0] || {};
        const away = cs.find((c) => c.homeAway === "away") || cs[1] || {};
        const st = (ev.status && ev.status.type) || {};
        const d = new Date(ev.date);
        const venue = comp.venue || {};
        return {
          round: roundFor(d),
          date: d,
          home: norm(home.team && home.team.abbreviation),
          away: norm(away.team && away.team.abbreviation),
          homeMeta: {
            fullName:
              home.team &&
              (home.team.displayName || home.team.shortDisplayName),
            logo:
              home.team &&
              (home.team.logo ||
                (home.team.logos &&
                  home.team.logos[0] &&
                  home.team.logos[0].href)),
          },
          awayMeta: {
            fullName:
              away.team &&
              (away.team.displayName || away.team.shortDisplayName),
            logo:
              away.team &&
              (away.team.logo ||
                (away.team.logos &&
                  away.team.logos[0] &&
                  away.team.logos[0].href)),
          },
          hs: Number(home.score || 0),
          as: Number(away.score || 0),
          status:
            st.state === "post"
              ? "final"
              : st.state === "in"
                ? "live"
                : "scheduled",
          detail:
            st.state === "in"
              ? ev.status.displayClock || st.detail || "Live"
              : st.detail || "",
          note:
            st.detail && /pens|penalt|extra/i.test(st.detail) ? st.detail : "",
          when: d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          kick: d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          venue: venue.fullName || "",
          city: venue.address
            ? [venue.address.city, venue.address.state]
                .filter(Boolean)
                .join(", ")
            : "",
        };
      })
      .sort((a, b) => a.date - b.date);

    GROUPS = {};
    if (stRes.ok) {
      const st = await stRes.json();
      (st.children || []).forEach((ch) => {
        const label =
          (ch.name || ch.abbreviation || "")
            .replace(/^.*Group\s*/i, "")
            .trim() || ch.name;
        const entries = (ch.standings || {}).entries || [];
        GROUPS[label] = entries
          .map((en) => {
            const g = (n) => {
              const s = (en.stats || []).find((x) => x.name === n);
              return s ? Number(s.value) : 0;
            };
            return {
              t: norm(en.team && en.team.abbreviation),
              meta: {
                fullName: en.team && en.team.displayName,
                logo:
                  en.team &&
                  (en.team.logo ||
                    (en.team.logos &&
                      en.team.logos[0] &&
                      en.team.logos[0].href)),
              },
              w: g("wins"),
              d: g("ties"),
              l: g("losses"),
              p: g("points"),
              rank: g("rank") || 0,
            };
          })
          .sort((a, b) => (a.rank || 99) - (b.rank || 99) || b.p - a.p);
      });
    }
    usingFallback = false;
    document.getElementById("lastUpdated").textContent =
      "Live via ESPN API · updated " +
      new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    msg.textContent = "";
  } catch (err) {
    console.error("API load failed:", err);
    if (!MATCHES.length) {
      loadFallback();
    }
    msg.textContent =
      "API unreachable here — showing Jul 7 snapshot. Open the file in a regular browser for live data.";
  } finally {
    btn.disabled = false;
    loadScorers();
    renderAll();
  }
}

/* ============ optional live scorers ============ */
let BOOT = [
  {
    rank: 1,
    player: "Lionel Messi",
    team: "ARG",
    goals: 8,
    note: "Scored in the R16 comeback vs Egypt",
  },
  {
    rank: 2,
    player: "Kylian Mbappé",
    team: "FRA",
    goals: 7,
    note: "2 assists — first tiebreaker",
  },
  {
    rank: 3,
    player: "Erling Haaland",
    team: "NOR",
    goals: 7,
    note: "Brace to knock out Brazil",
  },
  { rank: 4, player: "Harry Kane", team: "ENG", goals: 6, note: "" },
  { rank: 5, player: "Ousmane Dembélé", team: "FRA", goals: 4, note: "" },
  { rank: 5, player: "Mikel Oyarzabal", team: "ESP", goals: 4, note: "" },
  {
    rank: 5,
    player: "Vinícius Júnior",
    team: "BRA",
    goals: 4,
    note: "Eliminated",
  },
  {
    rank: 5,
    player: "Ismaïla Sarr",
    team: "SEN",
    goals: 4,
    note: "Eliminated",
  },
];
async function loadScorers() {
  if (!FOOTBALL_DATA_KEY) return; // no key: keep snapshot
  try {
    const res = await fetch(SCORERS_URL, {
      headers: { "X-Auth-Token": FOOTBALL_DATA_KEY },
    });
    if (!res.ok) throw new Error("scorers HTTP " + res.status);
    const data = await res.json();
    if (Array.isArray(data.scorers) && data.scorers.length) {
      BOOT = data.scorers.map((s, i) => ({
        rank: i + 1,
        player: s.player.name,
        team: norm(s.team && s.team.tla),
        goals: s.goals || 0,
        note: s.assists ? `${s.assists} assists` : "",
      }));
      document.getElementById("bootLegend").textContent =
        "Live via football-data.org. Tiebreakers: most assists, then fewest minutes played.";
    }
  } catch (err) {
    console.error("Scorers load failed:", err);
  }
}

/* ============ rendering ============ */
function showTab(btn) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".panel")
    .forEach((p) => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.panel).classList.add("active");
}

function renderBoard() {
  const el = document.getElementById("boardSection");
  const live = MATCHES.filter((m) => m.status === "live");
  if (live.length) {
    const m = live[0];
    el.innerHTML = `
    <div class="board"><div class="board-inner">
      <div class="board-top">
        <span class="live-badge"><span class="live-dot"></span>Live</span>
        <span>${esc(m.round)}${m.venue ? ` · ${esc(m.venue)}` : ""}</span>
      </div>
      <div class="scoreline">
        <div class="team"><div class="team-code">${esc(m.home)}</div>
          <div class="team-name">${esc(name(m.homeMeta, m.home))}</div>
          <div class="flagwrap">${flagImg(m.home, m.homeMeta, 160, "flag flag-lg")}</div></div>
        <div class="big-score"><span>${esc(m.hs)}</span><span class="dash">–</span><span>${esc(m.as)}</span></div>
        <div class="team"><div class="team-code">${esc(m.away)}</div>
          <div class="team-name">${esc(name(m.awayMeta, m.away))}</div>
          <div class="flagwrap">${flagImg(m.away, m.awayMeta, 160, "flag flag-lg")}</div></div>
      </div>
      <div class="board-meta"><span class="minute">${esc(m.detail || "")}</span></div>
    </div></div>`;
    return;
  }
  const n = MATCHES.find((m) => m.status === "scheduled");
  if (!n) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = `
  <div class="board"><div class="board-inner">
    <div class="board-top"><span style="letter-spacing:.14em">Next match</span><span>${esc(n.round)}</span></div>
    <div class="scoreline">
      <div class="team"><div class="team-code">${esc(n.home)}</div>
        <div class="team-name">${esc(name(n.homeMeta, n.home))}</div>
        <div class="flagwrap">${flagImg(n.home, n.homeMeta, 160, "flag flag-lg")}</div></div>
      <div class="big-score"><span class="dash">vs</span></div>
      <div class="team"><div class="team-code">${esc(n.away)}</div>
        <div class="team-name">${esc(name(n.awayMeta, n.away))}</div>
        <div class="flagwrap">${flagImg(n.away, n.awayMeta, 160, "flag flag-lg")}</div></div>
    </div>
    <div class="board-meta">${esc(n.when)} · ${esc(n.kick)}${n.venue ? ` · ${esc(n.venue)}` : ""}${n.city ? `, ${esc(n.city)}` : ""}</div>
  </div></div>`;
}

function matchRowHTML(m) {
  const done = m.status === "final",
    live = m.status === "live";
  const hw = done && m.hs > m.as,
    aw = done && m.as > m.hs;
  const mid =
    done || live
      ? `${esc(m.hs)}–${esc(m.as)}`
      : `<span class="kick">${esc(m.kick)}</span>`;
  const chip = live
    ? `<span class="chip live">${esc(m.detail || "LIVE")}</span>`
    : done
      ? `<span class="chip ft">FT</span>`
      : `<span class="chip next">${esc(m.when)}</span>`;
  return `
  <div class="mrow">
    <div class="side ${hw ? "won" : aw ? "lost" : ""}">
      ${flagImg(m.home, m.homeMeta, 80, "flag")}<span class="tname">${esc(name(m.homeMeta, m.home))}</span>
    </div>
    <div class="mid">${mid}</div>
    <div class="side right ${aw ? "won" : hw ? "lost" : ""}">
      <span class="tname">${esc(name(m.awayMeta, m.away))}</span>${flagImg(m.away, m.awayMeta, 80, "flag")}
    </div>
    <div class="meta">
      ${m.venue ? `${esc(m.venue)}${m.city ? ` · ${esc(m.city)}` : ""}<br>` : ""}
      ${esc(m.when)}${!done ? ` · ${esc(m.kick)}` : ""} ${chip}
      ${m.note ? `<br><span class="note">${esc(m.note)}</span>` : ""}
    </div>
  </div>`;
}

function renderMatches() {
  const el = document.getElementById("allMatches");
  el.innerHTML = [...ROUND_ORDER]
    .reverse() /* Final → Third place → Semis → QF → R16 → R32 → Groups */
    .filter((r) => MATCHES.some((m) => m.round === r))
    .map(
      (r) => `
    <div class="section-label">${esc(r)}</div>
    <div class="round-block">${MATCHES.filter((m) => m.round === r)
      .slice()
      .reverse() /* latest match first within each round */
      .map(matchRowHTML)
      .join("")}</div>
  `,
    )
    .join("");
}

function renderLiveLists() {
  const finals = MATCHES.filter((m) => m.status === "final")
    .slice(-6)
    .reverse();
  document.getElementById("latestList").innerHTML = finals
    .map(matchRowHTML)
    .join("");
  const next = MATCHES.filter((m) => m.status === "scheduled").slice(0, 4);
  document.getElementById("nextList").innerHTML = next
    .map(matchRowHTML)
    .join("");
}

function renderGroups() {
  const el = document.getElementById("groupsGrid");
  const keys = Object.keys(GROUPS).sort();
  if (!keys.length) {
    el.innerHTML =
      '<p class="legend">Standings unavailable from the API right now.</p>';
    return;
  }
  el.innerHTML = keys
    .map(
      (g) => `
  <div class="gcard">
    <h3>Group ${esc(g)}</h3>
    <table>
      <tr><th class="tl">Team</th><th>W</th><th>D</th><th>L</th><th>Pts</th></tr>
      ${GROUPS[g]
        .map(
          (row) => `
      <tr>
        <td class="tl"><span class="gteam">${flagImg(row.t, row.meta, 80, "flag flag-sm")}${esc(name(row.meta, row.t))}</span></td>
        <td>${row.w}</td><td>${row.d}</td><td>${row.l}</td><td class="pts">${row.p}</td>
      </tr>`,
        )
        .join("")}
    </table>
  </div>`,
    )
    .join("");
}

function renderBoot() {
  document.getElementById("bootList").innerHTML = BOOT.map(
    (b) => `
  <div class="boot-row ${b.rank === 1 ? "leader" : ""}">
    <div class="boot-rank">${b.rank}</div>
    <div class="boot-player">
      <span class="boot-name">${esc(b.player)}</span>
      <span class="boot-team">${flagImg(b.team, null, 80, "flag flag-sm")}${esc(NAMES[b.team] || b.team)}${b.note ? ` · <span class="boot-note">${esc(b.note)}</span>` : ""}</span>
    </div>
    <div class="boot-goals"><div class="n">${b.goals}</div><div class="lbl">Goals</div></div>
  </div>`,
  ).join("");
}

function renderAll() {
  renderBoard();
  renderLiveLists();
  renderMatches();
  renderGroups();
  renderBoot();
}

/* ============ fallback snapshot (used only if the API is unreachable) ============ */
function loadFallback() {
  usingFallback = true;
  const F = (round, home, away, hs, as, when, venue, city, note) => ({
    round,
    home,
    away,
    hs,
    as,
    status: "final",
    when,
    kick: "",
    venue,
    city,
    note: note || "",
    date: new Date(),
    homeMeta: {},
    awayMeta: {},
  });
  const S = (round, home, away, when, kick, venue, city) => ({
    round,
    home,
    away,
    hs: 0,
    as: 0,
    status: "scheduled",
    when,
    kick,
    venue,
    city,
    note: "",
    date: new Date("2099-01-01"),
    homeMeta: {},
    awayMeta: {},
  });
  MATCHES = [
    F(
      "Round of 32",
      "CAN",
      "RSA",
      1,
      0,
      "Sun Jun 28",
      "SoFi Stadium",
      "Inglewood, CA",
    ),
    F(
      "Round of 32",
      "BRA",
      "JPN",
      2,
      1,
      "Mon Jun 29",
      "NRG Stadium",
      "Houston, TX",
    ),
    F(
      "Round of 32",
      "PAR",
      "GER",
      1,
      1,
      "Mon Jun 29",
      "Gillette Stadium",
      "Foxborough, MA",
      "Paraguay win 4–3 on pens",
    ),
    F(
      "Round of 32",
      "MAR",
      "NED",
      1,
      1,
      "Mon Jun 29",
      "Estadio BBVA",
      "Monterrey, MX",
      "Morocco win 3–2 on pens",
    ),
    F(
      "Round of 32",
      "NOR",
      "CIV",
      2,
      1,
      "Tue Jun 30",
      "AT&T Stadium",
      "Arlington, TX",
    ),
    F(
      "Round of 32",
      "FRA",
      "SWE",
      3,
      0,
      "Tue Jun 30",
      "MetLife Stadium",
      "E. Rutherford, NJ",
    ),
    F(
      "Round of 32",
      "MEX",
      "ECU",
      2,
      0,
      "Tue Jun 30",
      "Estadio Azteca",
      "Mexico City, MX",
    ),
    F(
      "Round of 32",
      "ENG",
      "COD",
      2,
      1,
      "Wed Jul 1",
      "Mercedes-Benz Stadium",
      "Atlanta, GA",
    ),
    F(
      "Round of 32",
      "BEL",
      "SEN",
      3,
      2,
      "Wed Jul 1",
      "Lumen Field",
      "Seattle, WA",
      "After extra time",
    ),
    F(
      "Round of 32",
      "USA",
      "BIH",
      2,
      0,
      "Wed Jul 1",
      "Levi's Stadium",
      "Santa Clara, CA",
    ),
    F(
      "Round of 32",
      "ESP",
      "AUT",
      3,
      0,
      "Thu Jul 2",
      "SoFi Stadium",
      "Inglewood, CA",
    ),
    F(
      "Round of 32",
      "POR",
      "CRO",
      2,
      1,
      "Thu Jul 2",
      "BMO Field",
      "Toronto, CAN",
    ),
    F(
      "Round of 32",
      "SUI",
      "DZA",
      2,
      0,
      "Thu Jul 2",
      "BC Place",
      "Vancouver, CAN",
    ),
    F(
      "Round of 32",
      "EGY",
      "AUS",
      1,
      1,
      "Fri Jul 3",
      "AT&T Stadium",
      "Arlington, TX",
      "Egypt win 4–2 on pens",
    ),
    F(
      "Round of 32",
      "ARG",
      "CPV",
      3,
      2,
      "Fri Jul 3",
      "Hard Rock Stadium",
      "Miami Gardens, FL",
      "After extra time",
    ),
    F(
      "Round of 32",
      "COL",
      "GHA",
      1,
      0,
      "Fri Jul 3",
      "Arrowhead Stadium",
      "Kansas City, MO",
    ),
    F(
      "Round of 16",
      "CAN",
      "MAR",
      0,
      3,
      "Sat Jul 4",
      "NRG Stadium",
      "Houston, TX",
    ),
    F(
      "Round of 16",
      "PAR",
      "FRA",
      0,
      1,
      "Sat Jul 4",
      "Lincoln Financial Field",
      "Philadelphia, PA",
    ),
    F(
      "Round of 16",
      "BRA",
      "NOR",
      1,
      2,
      "Sun Jul 5",
      "MetLife Stadium",
      "E. Rutherford, NJ",
    ),
    F(
      "Round of 16",
      "MEX",
      "ENG",
      2,
      3,
      "Sun Jul 5",
      "Estadio Azteca",
      "Mexico City, MX",
    ),
    F(
      "Round of 16",
      "POR",
      "ESP",
      0,
      1,
      "Mon Jul 6",
      "AT&T Stadium",
      "Arlington, TX",
    ),
    F(
      "Round of 16",
      "USA",
      "BEL",
      1,
      4,
      "Mon Jul 6",
      "Lumen Field",
      "Seattle, WA",
    ),
    F(
      "Round of 16",
      "ARG",
      "EGY",
      3,
      2,
      "Tue Jul 7",
      "Mercedes-Benz Stadium",
      "Atlanta, GA",
    ),
    {
      round: "Round of 16",
      home: "SUI",
      away: "COL",
      hs: 0,
      as: 0,
      status: "live",
      detail: "Live",
      when: "Tue Jul 7",
      kick: "4:00 PM",
      venue: "BC Place",
      city: "Vancouver, CAN",
      note: "",
      date: new Date(),
      homeMeta: {},
      awayMeta: {},
    },
    S(
      "Quarterfinals",
      "FRA",
      "MAR",
      "Thu Jul 9",
      "4:00 PM",
      "Gillette Stadium",
      "Foxborough, MA",
    ),
    S(
      "Quarterfinals",
      "ESP",
      "BEL",
      "Fri Jul 10",
      "3:00 PM",
      "SoFi Stadium",
      "Inglewood, CA",
    ),
    S(
      "Quarterfinals",
      "NOR",
      "ENG",
      "Sat Jul 11",
      "5:00 PM",
      "Hard Rock Stadium",
      "Miami Gardens, FL",
    ),
    S(
      "Quarterfinals",
      "ARG",
      "TBD",
      "Sat Jul 11",
      "9:00 PM",
      "Arrowhead Stadium",
      "Kansas City, MO",
    ),
    S(
      "Semifinals",
      "TBD",
      "TBD",
      "Tue Jul 14",
      "3:00 PM",
      "AT&T Stadium",
      "Arlington, TX",
    ),
    S(
      "Semifinals",
      "TBD",
      "TBD",
      "Wed Jul 15",
      "3:00 PM",
      "Mercedes-Benz Stadium",
      "Atlanta, GA",
    ),
    S(
      "Third-place match",
      "TBD",
      "TBD",
      "Sat Jul 18",
      "5:00 PM",
      "Hard Rock Stadium",
      "Miami Gardens, FL",
    ),
    S(
      "Final",
      "TBD",
      "TBD",
      "Sun Jul 19",
      "3:00 PM",
      "MetLife Stadium",
      "E. Rutherford, NJ",
    ),
  ];
  const G = (t, w, d, l, p) => ({ t, w, d, l, p, meta: {} });
  GROUPS = {
    A: [
      G("MEX", 3, 0, 0, 9),
      G("RSA", 1, 1, 1, 4),
      G("KOR", 1, 0, 2, 3),
      G("CZE", 0, 1, 2, 1),
    ],
    B: [
      G("SUI", 2, 1, 0, 7),
      G("CAN", 1, 1, 1, 4),
      G("BIH", 1, 1, 1, 4),
      G("QAT", 0, 1, 2, 1),
    ],
    C: [
      G("BRA", 2, 1, 0, 7),
      G("MAR", 2, 1, 0, 7),
      G("SCO", 1, 0, 2, 3),
      G("HTI", 0, 0, 3, 0),
    ],
    D: [
      G("USA", 2, 0, 1, 6),
      G("AUS", 1, 1, 1, 4),
      G("PAR", 1, 1, 1, 4),
      G("TUR", 1, 0, 2, 3),
    ],
    E: [
      G("GER", 2, 0, 1, 6),
      G("CIV", 2, 0, 1, 6),
      G("ECU", 1, 1, 1, 4),
      G("CUW", 0, 1, 2, 1),
    ],
    F: [
      G("NED", 2, 1, 0, 7),
      G("JPN", 1, 2, 0, 5),
      G("SWE", 1, 1, 1, 4),
      G("TUN", 0, 0, 3, 0),
    ],
    G: [
      G("BEL", 1, 2, 0, 5),
      G("EGY", 1, 2, 0, 5),
      G("IRN", 0, 3, 0, 3),
      G("NZL", 0, 1, 2, 1),
    ],
    H: [
      G("ESP", 2, 1, 0, 7),
      G("CPV", 0, 3, 0, 3),
      G("URU", 0, 2, 1, 2),
      G("KSA", 0, 2, 1, 2),
    ],
    I: [
      G("FRA", 3, 0, 0, 9),
      G("NOR", 2, 0, 1, 6),
      G("SEN", 1, 0, 2, 3),
      G("IRQ", 0, 0, 3, 0),
    ],
    J: [
      G("ARG", 3, 0, 0, 9),
      G("AUT", 1, 1, 1, 4),
      G("DZA", 1, 1, 1, 4),
      G("JOR", 0, 0, 3, 0),
    ],
    K: [
      G("COL", 2, 1, 0, 7),
      G("POR", 1, 2, 0, 5),
      G("COD", 1, 1, 1, 4),
      G("UZB", 0, 0, 3, 0),
    ],
    L: [
      G("ENG", 2, 1, 0, 7),
      G("CRO", 2, 0, 1, 6),
      G("GHA", 1, 1, 1, 4),
      G("PAN", 0, 0, 3, 0),
    ],
  };
  document.getElementById("lastUpdated").textContent = "Snapshot · Jul 7, 2026";
}

let autoTimer = null;
function toggleAuto() {
  const on = document.getElementById("autoToggle").checked;
  if (on) {
    autoTimer = setInterval(loadData, 60000);
  } else if (autoTimer) {
    clearInterval(autoTimer);
    autoTimer = null;
  }
}

loadData();