# Interpretation Watch

**Synthetic demo.** Sibling of [Assumption Watch](https://github.com/Bromine185/A_C-3000).
That app surveils the world's assumptions; this one surveils the PM's map of
the world — and refuses to call disagreement "error" until labels exist.

## The objects

```
S_l   master landscape — frozen-protocol model (k=20 sample mean, σ shown)
I_l   the PM's interpretation — inferred from the position tape + memos,
      projected into the same schema
d     componentwise divergence, flagged against the ruler's own jitter
P     the headline: P(PM read correct) — a probability, not a verdict
```

One situation thread (the CPI re-base from Assumption Watch's N3), five
beats, one position under assessment (P2, receive 5y INR OIS).

## With and without the label supply

The `LABEL SUPPLY` toggle is the whole argument:

- **OFF** — landscapes, divergence, and contraction are all still
  computable, but they are disagreement with M, and M is a coordinate
  system, not the truth. The headline P renders as `—`: no labels, no map
  from d to error.
- **ON** — *you* are the label supply, through two channels:
  1. **Tripwire ledger (sparse anchor):** resolvable propositions with
     probabilities committed at open by both agents. Click HIT / MISS —
     the wire suggests, you decide. Brier accumulates per agent.
  2. **Prequential beat-scoring (dense interpolant):** M and the PM hold
     committed distributions over the next beat. ADVANCE reveals the
     actual and charges log-loss (bits). The PM's per-beat contraction is
     the learning rate.

  As n grows, the toy calibration head produces P with a shrinking CI.
  Resolve tripwires against M and watch its Brier degrade — the demo does
  not privilege the ruler.

No retro-scoring: beats advanced with labels off stay `SEALED`. A
prequential loss can only be charged on a commit that was checked when the
beat landed. Tripwires resolve late without penalty — their commitments
are timestamped.

## Run it

```
npm install
npm run dev        # local dev server
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

No network calls, no keys — everything is pre-authored and deterministic.

## Deploy

Static site; any static host works (Vercel auto-detects Vite; Netlify:
build `npm run build`, publish `dist/`).

## Integrity notes

- Every beat is a synthetic recreation and labeled as such; t0 reconstructs
  an actual MoSPI announcement (`REAL BASIS FEB 2026`). Keep the labels if
  you modify the data.
- All probabilities (both agents, both channels) are hand-authored to tell
  one coherent story: a PM who starts in the comparability trap, learns at
  ~0.24 bits/beat, and converges with the ruler by t4.
- The calibration head is a toy with its formula printed on the page:
  `logit P = −0.4 + 1.8·agree + 2.0·(BrierM − BrierPM) + 1.5·slope`,
  CI = 0.5/√n. The shape of the machine, not a belief.
- Not investment advice. The tool gauges the PM; the PM still decides.
