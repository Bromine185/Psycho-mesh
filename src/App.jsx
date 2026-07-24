import React, { useMemo, useState } from "react";

// ---------------------------------------------------------------
// INTERPRETATION WATCH — synthetic demo
//
// Sibling of Assumption Watch. That app surveils the world's
// assumptions; this one surveils the PM's map of the world.
//
// Objects:
//   S_l  the master landscape — a frozen-protocol model (k-sample
//        mean, dispersion shown) emitting the shared dossier schema
//   I_l  the PM's interpretation — inferred from the position tape
//        + memos, in the same schema
//   d    componentwise divergence S_l − I_l, flagged against the
//        ruler's own jitter (σ across k samples)
//
// The thesis, rendered as behavior:
//   LABEL SUPPLY OFF — divergence is measurable but it is only
//   disagreement with M. The headline P(PM read correct) is "—":
//   without labels there is no map from d to error.
//   LABEL SUPPLY ON  — the user IS the label supply. Resolving
//   tripwires (sparse anchor) and advancing scored beats
//   (prequential, dense) turns disagreement into error, and the
//   headline number comes into existence.
//
// Everything here is synthetic and labeled as such. The
// calibration head is a toy with its formula printed on the page.
// ---------------------------------------------------------------

const C = {
  bg: "#0A0C0F",
  field: "#0E1116",
  line: "#1E242C",
  paper: "#E9ECF0",
  muted: "#8B95A1",
  dim: "#59636E",
  red: "#E8503A",
  blue: "#7CA8CE", // M — the ruler
  gold: "#C0A468", // PM
  green: "#59B389",
  gray: "#77828F",
};

const MONO =
  'ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Consolas, monospace';
const SANS =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif';

// ----------------------------- the frame -------------------------

const POSITION = {
  id: "P2",
  desc: "Receive 5y INR OIS",
  exposure: "HIGH",
  depends: ["A2", "A3"],
};

const BANK = [
  { id: "A2", short: "CPI basket & weights", },
  { id: "A3", short: "RBI reaction function" },
  { id: "A8", short: "Data cadence" },
];

const VERDICTS = ["VALUE UPDATE", "ASSUMPTION BREAK", "NO IMPACT"];
const VSHORT = ["VU", "AB", "NI"];
const VERDICT_COLORS = [C.gray, C.red, C.dim];

// M protocol pin — the coordinate system, not the truth.
const M_PROTOCOL = "M = fable-5-max · prompt v3 (hash 9f2c) · T=1 · k=20 · S_l = sample mean · σ = sample sd";

// ----------------------------- the thread ------------------------
// One situation, five beats. t0 reconstructs a real MoSPI
// announcement (labeled); t1–t4 are invented continuations.

const BEATS = [
  {
    id: "t0",
    source: "STAT OFFICE",
    reliability: "OFFICIAL",
    tag: "REAL BASIS FEB 2026",
    headline:
      "MoSPI: CPI base year to move to 2024; new basket weights drawn from CES 2023-24",
    tape: "no change · P2 held at full size",
    pmRead: "hold P2 through the first re-based print — comparability assumed",
    mRead: "trim / hedge before the first print becomes a known repricing event",
    master: {
      a: { A2: 0.82, A3: 0.38, A8: 0.3 },
      sigma: { A2: 0.05, A3: 0.06, A8: 0.05 },
      verdict: [0.1, 0.84, 0.06],
    },
    pm: { a: { A2: 0.45, A3: 0.3, A8: 0.35 }, verdict: [0.4, 0.48, 0.12] },
  },
  {
    id: "t1",
    source: "STAT OFFICE",
    reliability: "OFFICIAL",
    tag: "SYNTHETIC",
    headline:
      "MoSPI technical note: linked series from January; food & beverages weight cut 45.9% → 39.1%",
    tape: "adds 10% to P2 on the dip",
    pmRead: "hold — weight cut noted, target continuity still assumed",
    mRead: "trim into the print window; the wedge is now sized",
    master: {
      a: { A2: 0.9, A3: 0.46, A8: 0.28 },
      sigma: { A2: 0.04, A3: 0.06, A8: 0.05 },
      verdict: [0.06, 0.9, 0.04],
    },
    pm: { a: { A2: 0.7, A3: 0.42, A8: 0.3 }, verdict: [0.2, 0.72, 0.08] },
  },
  {
    id: "t2",
    source: "CENTRAL BANK",
    reliability: "OFFICIAL",
    tag: "SYNTHETIC",
    headline:
      "RBI deputy governor: target is 'headline CPI as published' — no continuity language on the re-based series",
    tape: "buys 6m payer fly as a tail hedge",
    pmRead: "hold hedged — continuity ambiguity is now the live risk",
    mRead: "trim into the print; ambiguity raises, not lowers, event risk",
    master: {
      a: { A2: 0.91, A3: 0.58, A8: 0.26 },
      sigma: { A2: 0.04, A3: 0.07, A8: 0.05 },
      verdict: [0.05, 0.91, 0.04],
    },
    pm: { a: { A2: 0.78, A3: 0.6, A8: 0.27 }, verdict: [0.12, 0.82, 0.06] },
  },
  {
    id: "t3",
    source: "NEWSWIRE",
    reliability: "OFFICIAL",
    tag: "SYNTHETIC",
    headline:
      "First print on 2024 base: 2.9% y/y vs 4.1% old-basket nowcast; 5y OIS rallies 18bp on the day",
    tape: "trims P2 by half before the print",
    pmRead: "half size into the print; re-assess on RBI language",
    mRead: "trimmed is correct; fade the mechanical rally after RBI speaks",
    master: {
      a: { A2: 0.93, A3: 0.55, A8: 0.24 },
      sigma: { A2: 0.03, A3: 0.06, A8: 0.04 },
      verdict: [0.04, 0.93, 0.03],
    },
    pm: { a: { A2: 0.88, A3: 0.52, A8: 0.24 }, verdict: [0.07, 0.9, 0.03] },
  },
  {
    id: "t4",
    source: "CENTRAL BANK",
    reliability: "OFFICIAL",
    tag: "SYNTHETIC",
    headline:
      "MPC minutes: three of six members flag re-basing distortion; guidance stresses look-through to the spliced series",
    tape: "re-enters P2 after the minutes",
    pmRead: "re-enter — look-through confirmed, the mechanical print fades",
    mRead: "re-enter after clarification — converged with the PM",
    master: {
      a: { A2: 0.94, A3: 0.4, A8: 0.22 },
      sigma: { A2: 0.03, A3: 0.05, A8: 0.04 },
      verdict: [0.03, 0.94, 0.03],
    },
    pm: { a: { A2: 0.92, A3: 0.43, A8: 0.22 }, verdict: [0.04, 0.93, 0.03] },
  },
];

// Committed next-beat distributions for each transition t_i → t_{i+1}.
// Commit-before-reveal: these exist before ADVANCE; scoring only
// happens if the label supply is on when the beat lands.
const TRANSITIONS = [
  {
    candidates: [
      "Weights note: food cut ≥ 5pp",
      "Weights note: minor shifts < 2pp",
      "Timeline slips",
    ],
    m: [0.58, 0.27, 0.15],
    pm: [0.34, 0.44, 0.22],
    actual: 0,
  },
  {
    candidates: [
      "RBI: explicit continuity language",
      "RBI: 'as published' — ambiguous",
      "RBI silent before the print",
    ],
    m: [0.3, 0.5, 0.2],
    pm: [0.42, 0.38, 0.2],
    actual: 1,
  },
  {
    candidates: [
      "Print ≥ 1pp below old nowcast",
      "Print within 0.5pp of nowcast",
      "Print delayed / partial",
    ],
    m: [0.62, 0.28, 0.1],
    pm: [0.55, 0.34, 0.11],
    actual: 0,
  },
  {
    candidates: [
      "Minutes: distortion flagged, look-through",
      "Minutes: dovish embrace of the print",
      "Minutes: no re-basing signal",
    ],
    m: [0.55, 0.33, 0.12],
    pm: [0.52, 0.36, 0.12],
    actual: 0,
  },
];

// Sparse anchors — resolvable propositions with probabilities
// committed at open. The user resolves them; the wire only suggests.
const TRIPWIRES = [
  {
    id: "T1",
    text: "New basket cuts food & beverages weight by ≥ 5pp",
    opensAt: 0,
    resolvableAt: 1,
    m: 0.68,
    pm: 0.4,
    suggests: "HIT",
    hint: "wire: 6.8pp cut",
  },
  {
    id: "T2",
    text: "Explicit target-continuity language from RBI before the first re-based print",
    opensAt: 0,
    resolvableAt: 2,
    m: 0.25,
    pm: 0.55,
    suggests: "MISS",
    hint: "wire: 'as published' only",
  },
  {
    id: "T3",
    text: "First new-basket print lands ≥ 1pp below the old-basket nowcast",
    opensAt: 1,
    resolvableAt: 3,
    m: 0.64,
    pm: 0.48,
    suggests: "HIT",
    hint: "wire: 1.2pp below",
  },
  {
    id: "T4",
    text: "≥ 25bp of additional easing priced within a week of the first print",
    opensAt: 2,
    resolvableAt: 3,
    m: 0.45,
    pm: 0.62,
    suggests: "MISS",
    hint: "wire: 18bp on the day",
  },
  {
    id: "T5",
    text: "Minutes show ≥ 2 members citing re-basing distortion",
    opensAt: 3,
    resolvableAt: 4,
    m: 0.58,
    pm: 0.5,
    suggests: "HIT",
    hint: "wire: 3 of 6 members",
  },
];

// ----------------------------- math ------------------------------

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const fmt = (x, d = 2) => (x == null || isNaN(x) ? "—" : x.toFixed(d));
const bits = (p) => -Math.log2(clamp(p, 1e-6, 1));
const brier = (p, hit) => Math.pow(p - (hit ? 1 : 0), 2);

// Divergence at a beat: 70% mean |Δ| over assumption components,
// 30% total-variation distance between verdict distributions.
function divergence(beat) {
  const per = {};
  let sum = 0;
  for (const a of BANK) {
    const d = Math.abs(beat.master.a[a.id] - beat.pm.a[a.id]);
    per[a.id] = d;
    sum += d;
  }
  const compMean = sum / BANK.length;
  const tv =
    beat.master.verdict.reduce(
      (acc, v, i) => acc + Math.abs(v - beat.pm.verdict[i]),
      0
    ) / 2;
  return { per, tv, total: 0.7 * compMean + 0.3 * tv };
}

function olsSlope(ys) {
  if (ys.length < 2) return 0;
  const n = ys.length;
  const xbar = (n - 1) / 2;
  const ybar = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0,
    den = 0;
  ys.forEach((y, i) => {
    num += (i - xbar) * (y - ybar);
    den += (i - xbar) * (i - xbar);
  });
  return den === 0 ? 0 : num / den;
}

// ----------------------------- atoms -----------------------------

function Eyebrow({ children, color = C.dim, style }) {
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.16em",
        color,
        textTransform: "uppercase",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Rule({ margin = "26px 0" }) {
  return <div style={{ height: 1, background: C.line, margin }} />;
}

function Chip({ children, color = C.dim, filled = false }) {
  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.08em",
        color: filled ? C.bg : color,
        background: filled ? color : "transparent",
        border: `1px solid ${color}`,
        padding: "2px 7px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function Btn({ children, onClick, disabled, color = C.paper, filled = false, small = false }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: MONO,
        fontSize: small ? 10 : 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: disabled ? C.dim : filled || hover ? C.bg : color,
        background: disabled
          ? "transparent"
          : filled || hover
          ? color
          : "transparent",
        border: `1px solid ${disabled ? C.line : color}`,
        padding: small ? "3px 9px" : "7px 14px",
        cursor: disabled ? "default" : "pointer",
        transition: "background 120ms, color 120ms",
      }}
    >
      {children}
    </button>
  );
}

// Paired horizontal bars: M (with its own dispersion bracket) above PM.
function PairBar({ label, m, sigma, pm, d, jitter }) {
  const track = {
    position: "relative",
    height: 8,
    background: C.bg,
    border: `1px solid ${C.line}`,
  };
  const bracketLeft = clamp(m - sigma, 0, 1) * 100;
  const bracketW = clamp(2 * sigma, 0, 1) * 100;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(110px, 150px) 1fr 52px 62px",
        gap: "0 14px",
        alignItems: "center",
        padding: "9px 0",
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div>
        <div style={{ fontFamily: MONO, fontSize: 12, color: C.paper }}>{label.id}</div>
        <div style={{ fontFamily: SANS, fontSize: 11, color: C.dim, marginTop: 2 }}>
          {label.short}
        </div>
      </div>
      <div style={{ display: "grid", gap: 5 }}>
        <div style={track}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${m * 100}%`,
              background: C.blue,
              opacity: 0.85,
              transition: "width 400ms",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -3,
              height: 14,
              left: `${bracketLeft}%`,
              width: `${bracketW}%`,
              borderLeft: `1px solid ${C.blue}`,
              borderRight: `1px solid ${C.blue}`,
              opacity: 0.5,
            }}
          />
        </div>
        <div style={track}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${pm * 100}%`,
              background: C.gold,
              opacity: 0.85,
              transition: "width 400ms",
            }}
          />
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, textAlign: "right" }}>
        <div style={{ color: C.blue }}>{fmt(m)}</div>
        <div style={{ color: C.gold, marginTop: 5 }}>{fmt(pm)}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontFamily: MONO, fontSize: 11, color: jitter ? C.dim : C.paper }}>
          d {fmt(d)}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.08em",
            marginTop: 3,
            color: jitter ? C.dim : C.green,
          }}
        >
          {jitter ? "≤ JITTER" : "SIGNAL"}
        </div>
      </div>
    </div>
  );
}

function StackBar({ dist, height = 8 }) {
  return (
    <div style={{ display: "flex", height, border: `1px solid ${C.line}` }}>
      {dist.map((v, i) => (
        <div
          key={i}
          style={{
            width: `${v * 100}%`,
            background: VERDICT_COLORS[i],
            opacity: 0.85,
            transition: "width 400ms",
          }}
        />
      ))}
    </div>
  );
}

// Minimal sparkline: series = [{ ys, color, dashed }], shared y-domain.
function Spark({ series, w = 300, h = 64, yMax }) {
  const all = series.flatMap((s) => s.ys).filter((y) => y != null);
  if (!all.length) return null;
  const max = yMax ?? Math.max(...all) * 1.15;
  const n = Math.max(...series.map((s) => s.ys.length));
  const px = (i) => (n < 2 ? w / 2 : 8 + (i * (w - 16)) / (n - 1));
  const py = (y) => h - 8 - (y / max) * (h - 16);
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: "100%", maxWidth: w, height: "auto", display: "block" }}
    >
      <line x1={0} y1={h - 8} x2={w} y2={h - 8} stroke={C.line} strokeWidth={1} />
      {series.map((s, si) => {
        const pts = s.ys
          .map((y, i) => (y == null ? null : `${px(i)},${py(y)}`))
          .filter(Boolean);
        return (
          <g key={si}>
            {pts.length > 1 && (
              <polyline
                points={pts.join(" ")}
                fill="none"
                stroke={s.color}
                strokeWidth={1.5}
                strokeDasharray={s.dashed ? "3 3" : "none"}
              />
            )}
            {s.ys.map((y, i) =>
              y == null ? null : (
                <circle key={i} cx={px(i)} cy={py(y)} r={2.2} fill={s.color} />
              )
            )}
          </g>
        );
      })}
    </svg>
  );
}

function LockBox({ children, onUnlock }) {
  return (
    <div
      style={{
        border: `1px dashed ${C.line}`,
        padding: "22px 20px",
        display: "flex",
        flexWrap: "wrap",
        gap: 14,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, letterSpacing: "0.04em" }}>
        {children}
      </div>
      <Btn small color={C.gold} onClick={onUnlock}>
        turn on label supply
      </Btn>
    </div>
  );
}

function Section({ n, label, note, children }) {
  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <Eyebrow color={C.muted}>
          {n} · {label}
        </Eyebrow>
        {note && (
          <span style={{ fontFamily: SANS, fontSize: 11, color: C.dim }}>{note}</span>
        )}
      </div>
      <div style={{ marginTop: 14 }}>{children}</div>
    </div>
  );
}

// ----------------------------- sections --------------------------

function ModeToggle({ mode, setMode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Eyebrow>label supply</Eyebrow>
      <div style={{ display: "flex", border: `1px solid ${C.line}` }}>
        {["off", "on"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "5px 12px",
              border: "none",
              cursor: "pointer",
              color: mode === m ? C.bg : C.dim,
              background: mode === m ? (m === "on" ? C.gold : C.muted) : "transparent",
              transition: "background 120ms, color 120ms",
            }}
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function Header({ mode, setMode, onReset }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 18,
        alignItems: "flex-end",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Eyebrow color={C.dim}>pm psychometrics — synthetic demo</Eyebrow>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 22,
            letterSpacing: "0.06em",
            color: C.paper,
            marginTop: 8,
          }}
        >
          INTERPRETATION WATCH
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.muted, marginTop: 6, maxWidth: 560 }}>
          Assumption Watch surveils the world's assumptions. This surveils the
          PM's map of it — and refuses to call disagreement "error" until you
          supply labels.
        </div>
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
        <ModeToggle mode={mode} setMode={setMode} />
        <Btn small color={C.muted} onClick={onReset}>
          reset
        </Btn>
      </div>
    </div>
  );
}

function HeadPanel({ mode, head, beat }) {
  const has = mode === "on" && head.n > 0;
  return (
    <div
      style={{
        marginTop: 30,
        border: `1px solid ${C.line}`,
        background: C.field,
        display: "flex",
        flexWrap: "wrap",
        gap: "20px 28px",
        padding: "20px 22px",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ minWidth: 240 }}>
        <Eyebrow color={C.muted}>situation S — CPI re-base · target continuity</Eyebrow>
        <div style={{ fontFamily: MONO, fontSize: 12.5, color: C.paper, marginTop: 10 }}>
          {POSITION.id} · {POSITION.desc}
          <span style={{ color: C.dim }}>
            {"  ·  "}exposure {POSITION.exposure}{"  ·  "}depends {POSITION.depends.join(" ")}
          </span>
        </div>
        <div style={{ marginTop: 12, display: "grid", gap: 5 }}>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.gold }}>
            PM read · {beat.pmRead}
          </div>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.blue }}>
            M read · {beat.mRead}
          </div>
        </div>
      </div>
      <div style={{ textAlign: "right", minWidth: 210 }}>
        <Eyebrow color={C.muted} style={{ textAlign: "right" }}>
          p( pm read correct )
        </Eyebrow>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 44,
            lineHeight: 1,
            marginTop: 10,
            color: has ? C.paper : C.dim,
          }}
        >
          {has ? fmt(head.p) : "—"}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.dim, marginTop: 8 }}>
          {has
            ? `± ${fmt(head.ci)} · n = ${head.n} labels · toy head`
            : mode === "on"
            ? "no labels yet — resolve a tripwire or advance a scored beat"
            : "no label supply — divergence cannot be mapped to error"}
        </div>
      </div>
    </div>
  );
}

function BeatsRail({ beatIdx, onAdvance, mode }) {
  const beat = BEATS[beatIdx];
  const done = beatIdx >= BEATS.length - 1;
  return (
    <Section n="01" label="the thread" note="one situation, five beats — advance to replay it">
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 16 }}>
        {BEATS.map((b, i) => (
          <React.Fragment key={b.id}>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 10,
                padding: "3px 8px",
                border: `1px solid ${i <= beatIdx ? C.muted : C.line}`,
                color: i === beatIdx ? C.bg : i < beatIdx ? C.muted : C.dim,
                background: i === beatIdx ? C.muted : "transparent",
              }}
            >
              {b.id}
            </div>
            {i < BEATS.length - 1 && (
              <div
                style={{
                  width: 26,
                  height: 1,
                  background: i < beatIdx ? C.muted : C.line,
                }}
              />
            )}
          </React.Fragment>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <Btn onClick={onAdvance} disabled={done} color={C.paper} small>
            {done ? "thread complete" : "advance beat →"}
          </Btn>
        </div>
      </div>
      <div style={{ border: `1px solid ${C.line}`, background: C.field, padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Chip color={C.muted}>{beat.source}</Chip>
          <Chip color={C.muted}>{beat.reliability}</Chip>
          <Chip color={beat.tag === "SYNTHETIC" ? C.dim : C.gold}>{beat.tag}</Chip>
        </div>
        <div
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: C.paper,
            marginTop: 12,
            lineHeight: 1.5,
          }}
        >
          {beat.headline}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.dim, marginTop: 12 }}>
          position tape · {beat.tape}
          <span style={{ color: C.line }}>{"   "}|{"   "}</span>
          I_l inferred from tape + memos
        </div>
      </div>
    </Section>
  );
}

function Landscapes({ beat }) {
  const div = divergence(beat);
  const allJitter = BANK.every((a) => div.per[a.id] <= beat.master.sigma[a.id]);
  return (
    <Section
      n="02"
      label="landscapes — shared schema"
      note="S_l and I_l projected onto the same coordinates; d is componentwise"
    >
      <div
        style={{
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          fontFamily: MONO,
          fontSize: 10,
          color: C.dim,
          marginBottom: 4,
        }}
      >
        <span>
          <span style={{ color: C.blue }}>▪</span> S_l — master (±σ bracket)
        </span>
        <span>
          <span style={{ color: C.gold }}>▪</span> I_l — PM, inferred
        </span>
      </div>
      <div>
        {BANK.map((a) => (
          <PairBar
            key={a.id}
            label={a}
            m={beat.master.a[a.id]}
            sigma={beat.master.sigma[a.id]}
            pm={beat.pm.a[a.id]}
            d={div.per[a.id]}
            jitter={div.per[a.id] <= beat.master.sigma[a.id]}
          />
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(110px, 150px) 1fr 1fr",
          gap: "0 14px",
          alignItems: "center",
          padding: "12px 0 4px",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted }}>
          verdict dist
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 3 }}>
            TV distance {fmt(div.tv)}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, marginTop: 3 }}>
            VU update · AB break · NI none
          </div>
        </div>
        <div>
          <StackBar dist={beat.master.verdict} />
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.blue, marginTop: 4 }}>
            S_l · {beat.master.verdict.map((v, i) => `${VSHORT[i]} ${fmt(v)}`).join(" · ")}
          </div>
        </div>
        <div>
          <StackBar dist={beat.pm.verdict} />
          <div style={{ fontFamily: MONO, fontSize: 9, color: C.gold, marginTop: 4 }}>
            I_l · {beat.pm.verdict.map((v, i) => `${VSHORT[i]} ${fmt(v)}`).join(" · ")}
          </div>
        </div>
      </div>
      <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 12 }}>
        {M_PROTOCOL}
        {allJitter && (
          <span style={{ color: C.green }}>
            {"   ·   "}all components within ruler dispersion — landscapes
            indistinguishable at k=20
          </span>
        )}
      </div>
    </Section>
  );
}

function Learning({ mode, divSeries, rows, slope, setMode }) {
  const scoredM = rows.map((r) => (r.scored ? r.lossM : null));
  const scoredPM = rows.map((r) => (r.scored ? r.lossPM : null));
  const anyScored = rows.some((r) => r.scored);
  return (
    <Section
      n="03"
      label="divergence & learning"
      note="contraction per beat — the learning-rate quantity"
    >
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px", minWidth: 240 }}>
          <Eyebrow>d(S_l, I_l) per beat</Eyebrow>
          <div style={{ marginTop: 10 }}>
            <Spark series={[{ ys: divSeries, color: C.muted }]} yMax={0.3} />
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.dim, marginTop: 8 }}>
            {divSeries.length > 1
              ? `contracting ${fmt(-olsSlope(divSeries), 3)} / beat`
              : "advance beats to trace contraction"}
            {" — "}
            <span style={{ color: mode === "on" ? C.dim : C.gold }}>
              disagreement with M, not error
            </span>
          </div>
        </div>
        <div style={{ flex: "1 1 260px", minWidth: 240 }}>
          <Eyebrow>prequential loss per beat (bits)</Eyebrow>
          {mode === "on" ? (
            <>
              <div style={{ marginTop: 10 }}>
                <Spark
                  series={[
                    { ys: scoredM, color: C.blue },
                    { ys: scoredPM, color: C.gold },
                  ]}
                  yMax={2}
                />
              </div>
              <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.dim, marginTop: 8 }}>
                {anyScored ? (
                  <>
                    <span style={{ color: C.gold }}>PM slope {slope >= 0 ? "−" : "+"}{fmt(Math.abs(slope))} bits/beat</span>
                    {" · "}
                    <span style={{ color: C.blue }}>M ~ flat</span>
                    {" — the early gap was the PM's, and it closed"}
                  </>
                ) : (
                  "advance beats with labels on to charge loss against arrivals"
                )}
              </div>
            </>
          ) : (
            <div style={{ marginTop: 10 }}>
              <LockBox onUnlock={() => setMode("on")}>
                loss against arriving beats requires labels — this panel is the
                dense label channel
              </LockBox>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

function Prequential({ mode, rows, nextTransition, beatIdx, setMode }) {
  if (mode === "off") {
    return (
      <Section
        n="04"
        label="prequential beat-scoring"
        note="dense channel — every headline resolves probability mass"
      >
        <LockBox onUnlock={() => setMode("on")}>
          M and the PM have committed distributions over the next beat. sealed
          — scoring requires label supply
        </LockBox>
      </Section>
    );
  }
  return (
    <Section
      n="04"
      label="prequential beat-scoring"
      note="commit-before-reveal — advancing the thread scores both agents against reality"
    >
      {nextTransition && (
        <div style={{ border: `1px solid ${C.line}`, background: C.field, padding: "14px 16px", marginBottom: 14 }}>
          <Eyebrow color={C.muted}>
            committed · next beat t{beatIdx + 1} — candidates
          </Eyebrow>
          <div style={{ marginTop: 10, display: "grid", gap: 7 }}>
            {nextTransition.candidates.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 74px 74px",
                  gap: 12,
                  fontFamily: MONO,
                  fontSize: 11,
                  color: C.muted,
                }}
              >
                <span style={{ fontFamily: SANS, fontSize: 12, color: C.paper }}>{c}</span>
                <span style={{ color: C.blue, textAlign: "right" }}>M {fmt(nextTransition.m[i])}</span>
                <span style={{ color: C.gold, textAlign: "right" }}>PM {fmt(nextTransition.pm[i])}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 10 }}>
            advance the beat to reveal the actual and charge log-loss
          </div>
        </div>
      )}
      {rows.length > 0 && (
        <div style={{ display: "grid", gap: 0 }}>
          {rows.map((r) => (
            <div
              key={r.i}
              style={{
                display: "grid",
                gridTemplateColumns: "56px 1fr 92px 92px",
                gap: 12,
                alignItems: "baseline",
                padding: "8px 0",
                borderBottom: `1px solid ${C.line}`,
                fontFamily: MONO,
                fontSize: 11,
              }}
            >
              <span style={{ color: C.dim }}>
                t{r.i}→t{r.i + 1}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: r.scored ? C.paper : C.dim }}>
                {TRANSITIONS[r.i].candidates[TRANSITIONS[r.i].actual]}
              </span>
              {r.scored ? (
                <>
                  <span style={{ color: C.blue, textAlign: "right" }}>M {fmt(r.lossM)} b</span>
                  <span style={{ color: C.gold, textAlign: "right" }}>PM {fmt(r.lossPM)} b</span>
                </>
              ) : (
                <span style={{ gridColumn: "3 / 5", color: C.dim, textAlign: "right", fontSize: 10, letterSpacing: "0.06em" }}>
                  SEALED — advanced with labels off
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {rows.some((r) => r.scored) && (
        <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 12 }}>
          cumulative{"  ·  "}
          <span style={{ color: C.blue }}>
            M {fmt(rows.reduce((a, r) => a + (r.scored ? r.lossM : 0), 0))} bits
          </span>
          {"  ·  "}
          <span style={{ color: C.gold }}>
            PM {fmt(rows.reduce((a, r) => a + (r.scored ? r.lossPM : 0), 0))} bits
          </span>
        </div>
      )}
    </Section>
  );
}

function Ledger({ mode, beatIdx, resolutions, onResolve, onClear, setMode }) {
  const visible = TRIPWIRES.filter((t) => t.opensAt <= beatIdx);
  if (mode === "off") {
    return (
      <Section n="05" label="tripwire ledger" note="sparse channel — resolvable propositions, committed at open">
        <LockBox onUnlock={() => setMode("on")}>
          {visible.length} tripwire{visible.length === 1 ? "" : "s"} open with
          committed probabilities from both agents. resolution requires label
          supply — you are the label supply
        </LockBox>
      </Section>
    );
  }
  const resolved = TRIPWIRES.filter((t) => resolutions[t.id]);
  const bM = resolved.length
    ? resolved.reduce((a, t) => a + brier(t.m, resolutions[t.id] === "HIT"), 0) / resolved.length
    : null;
  const bPM = resolved.length
    ? resolved.reduce((a, t) => a + brier(t.pm, resolutions[t.id] === "HIT"), 0) / resolved.length
    : null;
  return (
    <Section
      n="05"
      label="tripwire ledger"
      note="the sparse anchor — your clicks are the labels; the wire only suggests"
    >
      <div>
        {visible.map((t) => {
          const res = resolutions[t.id];
          const resolvable = beatIdx >= t.resolvableAt;
          return (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "34px 1fr auto",
                gap: 14,
                alignItems: "center",
                padding: "11px 0",
                borderBottom: `1px solid ${C.line}`,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 12, color: C.muted }}>{t.id}</span>
              <div>
                <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.paper, lineHeight: 1.45 }}>
                  {t.text}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, marginTop: 4 }}>
                  committed · <span style={{ color: C.blue }}>M {fmt(t.m)}</span> ·{" "}
                  <span style={{ color: C.gold }}>PM {fmt(t.pm)}</span>
                  {res && (
                    <>
                      {"   →   brier "}
                      <span style={{ color: C.blue }}>
                        M {fmt(brier(t.m, res === "HIT"))}
                      </span>{" "}
                      ·{" "}
                      <span style={{ color: C.gold }}>
                        PM {fmt(brier(t.pm, res === "HIT"))}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
                {res ? (
                  <>
                    <Chip color={res === "HIT" ? C.green : C.red} filled>
                      {res}
                    </Chip>
                    <button
                      onClick={() => onClear(t.id)}
                      style={{
                        fontFamily: MONO,
                        fontSize: 11,
                        color: C.dim,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 2,
                      }}
                      title="clear resolution"
                    >
                      ×
                    </button>
                  </>
                ) : resolvable ? (
                  <>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: C.dim }}>
                      {t.hint} · suggests {t.suggests}
                    </span>
                    <Btn small color={C.green} onClick={() => onResolve(t.id, "HIT")}>
                      hit
                    </Btn>
                    <Btn small color={C.red} onClick={() => onResolve(t.id, "MISS")}>
                      miss
                    </Btn>
                  </>
                ) : (
                  <Chip color={C.dim}>OPEN · resolves ≥ t{t.resolvableAt}</Chip>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 12 }}>
        brier (mean, n={resolved.length}){"  ·  "}
        <span style={{ color: C.blue }}>M {fmt(bM)}</span>
        {"  ·  "}
        <span style={{ color: C.gold }}>PM {fmt(bPM)}</span>
        {resolved.length > 0 && bM != null && bPM != null && (
          <span style={{ color: C.dim }}>
            {"   — "}
            {bPM < bM
              ? "the PM out-called the ruler on these anchors"
              : "M better calibrated on these anchors — resolve against it and watch this flip"}
          </span>
        )}
      </div>
    </Section>
  );
}

function Footer() {
  const note = { fontFamily: SANS, fontSize: 11.5, color: C.dim, lineHeight: 1.6 };
  return (
    <div style={{ marginTop: 48 }}>
      <Rule margin="0 0 20px" />
      <div style={{ display: "grid", gap: 10 }}>
        <div style={note}>
          <span style={{ color: C.muted }}>The point.</span> Without the label
          supply, everything above the fold is still computable — landscapes,
          divergence, contraction — but it is disagreement with M, and M is a
          coordinate system, not the truth. Truth enters only through the
          ledger and the arriving beats. That is why the headline number does
          not exist until you switch labels on and start resolving reality.
        </div>
        <div style={note}>
          <span style={{ color: C.muted }}>Toy calibration head.</span>{" "}
          <span style={{ fontFamily: MONO, fontSize: 10.5 }}>
            logit P = −0.4 + 1.8·agree + 2.0·(BrierM − BrierPM) + 1.5·slope
          </span>{" "}
          — coefficients invented, n tiny, CI = 0.5/√n. The shape of the
          machine, not a belief.
        </div>
        <div style={note}>
          <span style={{ color: C.muted }}>No retro-scoring.</span> Beats
          advanced with labels off stay sealed: prequential loss can only be
          charged on a commit that was checked when the beat landed. Tripwires
          resolve late without penalty — their commitments are timestamped.
        </div>
        <div style={note}>
          <span style={{ color: C.muted }}>Integrity.</span> Every beat is a
          synthetic recreation and labeled as such; t0 reconstructs an actual
          MoSPI announcement (REAL BASIS FEB 2026). All probabilities are
          hand-authored. Not investment advice; the tool gauges the PM, the PM
          still decides.
        </div>
      </div>
    </div>
  );
}

// ----------------------------- app -------------------------------

export default function App() {
  const [mode, setMode] = useState("off"); // "off" | "on" — the label supply
  const [beatIdx, setBeatIdx] = useState(0);
  // How each completed transition was advanced — "on" transitions are
  // scored, "off" transitions stay sealed (no retro-scoring).
  const [advancedWith, setAdvancedWith] = useState([]);
  const [resolutions, setResolutions] = useState({});

  const advance = () => {
    if (beatIdx >= BEATS.length - 1) return;
    setAdvancedWith((prev) => [...prev, mode]);
    setBeatIdx((i) => i + 1);
  };

  const reset = () => {
    setBeatIdx(0);
    setAdvancedWith([]);
    setResolutions({});
  };

  const beat = BEATS[beatIdx];

  const divSeries = useMemo(
    () => BEATS.slice(0, beatIdx + 1).map((b) => divergence(b).total),
    [beatIdx]
  );

  const rows = useMemo(
    () =>
      advancedWith.map((w, i) => ({
        i,
        scored: w === "on",
        lossM: bits(TRANSITIONS[i].m[TRANSITIONS[i].actual]),
        lossPM: bits(TRANSITIONS[i].pm[TRANSITIONS[i].actual]),
      })),
    [advancedWith]
  );

  const head = useMemo(() => {
    const resolved = TRIPWIRES.filter((t) => resolutions[t.id]);
    const scored = rows.filter((r) => r.scored);
    const n = resolved.length + scored.length;
    if (n === 0) return { n: 0 };

    const d0 = divergence(BEATS[0]).total;
    const agree = 1 - clamp(divSeries[divSeries.length - 1] / d0, 0, 1);

    const bM = resolved.length
      ? resolved.reduce((a, t) => a + brier(t.m, resolutions[t.id] === "HIT"), 0) /
        resolved.length
      : null;
    const bPM = resolved.length
      ? resolved.reduce((a, t) => a + brier(t.pm, resolutions[t.id] === "HIT"), 0) /
        resolved.length
      : null;
    const ledgerEdge = bM != null && bPM != null ? clamp(bM - bPM, -0.5, 0.5) : 0;

    const pmLosses = scored.map((r) => r.lossPM);
    const slope = pmLosses.length >= 2 ? -olsSlope(pmLosses) : 0; // + = contracting

    const logit = -0.4 + 1.8 * agree + 2.0 * ledgerEdge + 1.5 * slope;
    return {
      n,
      p: 1 / (1 + Math.exp(-logit)),
      ci: Math.min(0.45, 0.5 / Math.sqrt(n)),
      slope,
    };
  }, [rows, resolutions, divSeries]);

  const scoredPMLosses = rows.filter((r) => r.scored).map((r) => r.lossPM);
  const slope = scoredPMLosses.length >= 2 ? -olsSlope(scoredPMLosses) : 0;

  const nextTransition = beatIdx < TRANSITIONS.length ? TRANSITIONS[beatIdx] : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        padding: "44px 20px 72px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <Header mode={mode} setMode={setMode} onReset={reset} />
        <HeadPanel mode={mode} head={head} beat={beat} />
        <BeatsRail beatIdx={beatIdx} onAdvance={advance} mode={mode} />
        <Landscapes beat={beat} />
        <Learning
          mode={mode}
          divSeries={divSeries}
          rows={rows}
          slope={slope}
          setMode={setMode}
        />
        <Prequential
          mode={mode}
          rows={rows}
          nextTransition={nextTransition}
          beatIdx={beatIdx}
          setMode={setMode}
        />
        <Ledger
          mode={mode}
          beatIdx={beatIdx}
          resolutions={resolutions}
          onResolve={(id, r) => setResolutions((p) => ({ ...p, [id]: r }))}
          onClear={(id) =>
            setResolutions((p) => {
              const q = { ...p };
              delete q[id];
              return q;
            })
          }
          setMode={setMode}
        />
        <Footer />
      </div>
    </div>
  );
}
