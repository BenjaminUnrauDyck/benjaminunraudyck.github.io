# Instructions: Reuse the Meshtastic Site Planner RF Engine in a New MapLibre Project

## Goal

Create a new web project that reuses the RF simulation engine from the open-source Meshtastic Site Planner, but **does not reuse its Vue/Pinia UI**.

The new project should eventually let a user:

1. Open a MapLibre map.
2. Place a proposed Meshtastic node on the map.
3. Configure a small set of practical RF inputs such as antenna height and simulation radius.
4. Run the same WebAssembly/SPLAT!/ITM coverage calculation used by the Meshtastic Site Planner.
5. Fetch terrain through the reused terrain service.
6. Display the returned coverage result as an overlay on the MapLibre map.
7. Show progress and allow cancellation.
8. Later support point-to-point link analysis and relay-site suggestions.

The immediate objective is **not** to recreate the entire Meshtastic Site Planner. It is to extract the minimum reusable engine/terrain/rendering pipeline and integrate it into a clean project.

---

# Important Context

The Meshtastic Site Planner repository is already cloned and working locally under WSL.

The original project has been successfully installed with pnpm and runs on localhost.

The important simulation call found in `src/store.ts` is:

```ts
const result = await (await getEngine()).run(params, {
  terrain: getTerrain(),
  signal: abortController.signal,
  onProgress: (p) => {
    this.progress = p;
  },
});
```

This is the key public boundary we want to reuse.

The architecture is approximately:

```text
UI
  ↓
buildCoverageRequest(...)
  ↓
toEngineParams(...)
  ↓
WasmCoverageEngine.run(...)
  ↕
TerrainService
  ↓
CoverageResult
  ↓
cropToRadius(...)
  ↓
coverage rendering
  ↓
MapLibre overlay
```

The Meshtastic planner also appears to expose:

```ts
engine.runLink(...)
engine.findHighpoint(...)
```

These are not required for the first milestone, but should be preserved as future capabilities if practical.

---

# Development Environment

Use WSL, not native Windows.

The project should live somewhere like:

```text
/home/benja/<project-name>
```

Do not place it under:

```text
/mnt/c/...
```

The Meshtastic Site Planner repository contains filenames that are invalid on the native Windows filesystem.

Use Node 20+.

Recommended setup:

```bash
node --version
pnpm --version
```

Use pnpm for package management unless there is a strong reason not to.

---

# New Project Strategy

Prefer a small Vite + TypeScript project.

The frontend can remain framework-free if desired.

Recommended initial project:

```bash
pnpm create vite meshtastic-rf-mvp --template vanilla-ts
cd meshtastic-rf-mvp
pnpm install
pnpm add maplibre-gl
pnpm dev
```

Suggested source layout:

```text
src/
├── main.ts
├── map/
│   ├── map.ts
│   └── coverageOverlay.ts
├── simulation/
│   ├── simulation.ts
│   ├── defaults.ts
│   └── types.ts
├── engine/
│   ├── CoverageEngine.ts
│   ├── WasmCoverageEngine.ts
│   ├── params.ts
│   ├── protocol.ts
│   └── ...
├── terrain/
│   ├── TerrainService.ts
│   └── ...
└── assets/
    └── ...
```

Do not copy Vue components or Pinia stores unless they contain logic that cannot reasonably be separated.

---

# Phase 1 — Trace the Existing Planner Before Copying Code

Before moving files, inspect the original repository.

Read these in this order:

```text
src/store.ts
src/engine/params.ts
src/engine/CoverageEngine.ts
src/engine/WasmCoverageEngine.ts
src/engine/protocol.ts
src/terrain/TerrainService.ts
```

Then find:

```text
cropToRadius(...)
syncOverlays(...)
coverageImage(...)
coverageContours(...)
```

Search the repo with:

```bash
grep -Rni "WasmCoverageEngine" src
grep -Rni "toEngineParams" src
grep -Rni "buildCoverageRequest" src
grep -Rni "cropToRadius" src
grep -Rni "coverageImage" src
grep -Rni "coverageContours" src
grep -Rni "runLink" src
grep -Rni "findHighpoint" src
```

For each important function, determine:

- Where it lives.
- What it imports.
- Whether it depends on Vue or Pinia.
- Whether it can be copied directly.
- What data it accepts.
- What data it returns.

Do not begin by editing the WASM or C/C++ source.

---

# Phase 2 — Identify the Minimum Engine Dependency Set

The goal is to build a dependency list such as:

```text
REUSE
✓ CoverageEngine.ts
✓ WasmCoverageEngine.ts
✓ params.ts
✓ protocol.ts
✓ worker files
✓ TerrainService.ts
✓ terrain helpers
✓ generated WASM/glue files
✓ relevant coverage-result types
✓ crop/render helpers if useful

DO NOT REUSE
✗ Vue components
✗ Pinia store
✗ permalink logic
✗ search UI
✗ site-list UI
✗ export panels
✗ unrelated map controls
```

Do not assume the above list is complete.

Actually follow imports recursively.

When copying a file, inspect all of its imports first.

If an import is only a Vue/Pinia concern, refactor the reusable logic away from it rather than dragging the whole UI architecture into the new project.

---

# Phase 3 — Understand the Input Contract

The existing planner appears to create a user-facing request and then convert it with:

```ts
const request = buildCoverageRequest(this.splatParams);
const params = toEngineParams(request);
```

The new project should reproduce the same conversion path rather than manually guessing SPLAT units.

Inspect the exact definitions of:

```text
buildCoverageRequest(...)
toEngineParams(...)
```

Document every required engine parameter.

Likely concepts include:

```text
latitude
longitude
TX antenna height
TX power
TX antenna gain
system loss
frequency
RX height
clutter height
ground dielectric
ground conductivity
atmospheric bending / refractivity
radio climate
polarization
simulation radius
situation fraction
time fraction
terrain resolution
```

Important:

The existing planner may express some values in user-friendly units and convert them before the engine call.

Do not bypass these conversions until they are fully understood.

For example, TX power may be entered in watts and converted to dBm using:

```ts
10 * Math.log10(watts) + 30
```

Do not accidentally supply watts where the engine expects dBm.

---

# Phase 4 — Create a Small Friendly MVP Input Model

The customer-facing MVP should initially expose only a few controls:

```text
Latitude / Longitude        selected from map
Antenna height              user editable
Simulation radius           user editable
Terrain resolution          standard/high
```

Everything else can initially use hard-coded defaults matching sensible Meshtastic planner defaults.

Create a file such as:

```text
src/simulation/defaults.ts
```

Example concept:

```ts
export const DEFAULT_RF_SETTINGS = {
  frequencyMHz: 915,
  txPowerWatts: ...,
  txGainDb: ...,
  systemLossDb: ...,
  rxHeightM: ...,
  clutterHeightM: ...,
  ...
};
```

Do not invent values.

Extract the defaults from the Meshtastic Site Planner source and document where each came from.

Later the UI can expose advanced settings.

---

# Phase 5 — Reuse the Terrain Service

The discovered engine call passes:

```ts
terrain: getTerrain()
```

and the store appears to lazily construct:

```ts
terrain ??= new TerrainService();
```

Inspect:

```text
src/terrain/TerrainService.ts
```

and all of its imports.

Determine:

- Where elevation data is downloaded from.
- Whether it uses SRTM or another dataset.
- How tiles/pages are cached.
- Whether browser storage is involved.
- Whether any service worker is required.
- Whether standard and high-resolution terrain use different sources.
- What interface `WasmCoverageEngine.run()` expects from the terrain object.

The first milestone is simply to instantiate the same terrain service in the new project:

```ts
const terrain = new TerrainService();
```

Do not redesign terrain acquisition yet.

---

# Phase 6 — Reuse the WASM Engine

Create a minimal engine singleton or lazy loader.

Conceptually:

```ts
let engine: WasmCoverageEngine | undefined;

async function getEngine() {
  if (!engine) {
    engine = new WasmCoverageEngine();
  }

  return engine;
}
```

The exact constructor/initialization may differ.

Follow the original code.

The new project's simulation API should hide all engine complexity behind one function.

Target interface:

```ts
export async function simulateCoverage(
  input: ProposedNodeSimulationInput,
  options?: {
    signal?: AbortSignal;
    onProgress?: (progress: number) => void;
  }
): Promise<CoverageResult>
```

Internally:

```text
friendly input
  ↓
build request
  ↓
toEngineParams
  ↓
engine.run
  ↓
raw result
  ↓
optional crop
  ↓
return
```

The rest of the app should not directly call `WasmCoverageEngine`.

---

# Phase 7 — Workers and WASM Assets

Inspect how `WasmCoverageEngine.ts` launches workers.

Find:

```text
new Worker(...)
```

or equivalent worker initialization.

Determine:

- Which worker files must be copied.
- How Vite resolves the worker URL.
- Where the `.wasm` binary lives.
- Whether generated JavaScript glue files are required.
- Whether any static assets need to go under `public/`.
- Whether worker files import the WASM themselves.
- Whether MIME types or special headers are required.

Preserve the original Vite-compatible worker loading approach whenever possible.

Do not rewrite the worker layer unless necessary.

Verify the copied WASM asset is actually served by opening browser DevTools → Network and confirming the `.wasm` request returns HTTP 200.

---

# Phase 8 — Build the First Simulation Harness Before Map Rendering

Before integrating the heatmap, prove that the engine runs in the new project.

Create a temporary test button:

```text
[ Run Test Simulation ]
```

Use fixed coordinates and defaults.

Log:

```ts
console.log(result);
```

Also log useful metadata:

```ts
console.log({
  width: result.width,
  height: result.height,
  bounds: result.bounds,
});
```

Adapt property names to the real result type.

Acceptance criteria:

```text
✓ terrain downloads successfully
✓ worker starts
✓ WASM loads
✓ progress callback fires
✓ run() resolves
✓ result contains a coverage grid
✓ no Vue or Pinia dependency is required
```

Do not continue to rendering until this works.

---

# Phase 9 — Add Cancellation and Progress

Use an `AbortController`.

Concept:

```ts
const controller = new AbortController();

const result = await simulateCoverage(input, {
  signal: controller.signal,
  onProgress: (p) => {
    console.log("Progress:", p);
  },
});
```

Cancel with:

```ts
controller.abort();
```

The UI should eventually provide:

```text
Calculating coverage... 47%
[ Cancel ]
```

Do not let repeated clicks start unlimited simultaneous simulations.

Disable or cancel the previous simulation when appropriate.

---

# Phase 10 — Understand the Coverage Result

Inspect the result type returned from:

```ts
engine.run(...)
```

Document:

- grid dimensions
- geographic bounds
- value type
- whether values are dBm
- nodata representation
- orientation of rows/columns
- coordinate ordering
- whether the result already contains an image
- how the original project crops the result
- what `cropToRadius()` does

The original store performs:

```ts
const cropped = cropToRadius(
  result,
  request.lat,
  request.lon,
  request.radius
);
```

Reuse this helper initially unless there is a strong reason not to.

---

# Phase 11 — Reuse the Existing Coverage Rendering Logic

Find the original planner's implementation of:

```text
coverageImage(...)
coverageContours(...)
syncOverlays(...)
```

The fastest MVP path is likely the same one used by the planner.

Possible approaches:

```text
CoverageResult
  ↓
colorize Float32 dBm grid
  ↓
Canvas/ImageData
  ↓
MapLibre image source
```

or:

```text
CoverageResult
  ↓
d3-contour
  ↓
GeoJSON
  ↓
MapLibre fill layers
```

Prefer copying/refactoring the original rendering helper rather than recreating RF color logic from scratch.

---

# Phase 12 — Display the Coverage in MapLibre

The new project already needs MapLibre.

Create a dedicated function:

```ts
showCoverageOverlay(map, result)
```

It should:

1. Remove or update an existing coverage source/layer.
2. Convert the result to the correct image or GeoJSON format.
3. Add it to MapLibre.
4. Use the exact returned geographic bounds.
5. Apply sensible opacity.
6. Allow toggling visibility.

Suggested separation:

```text
simulation.ts
    produces RF data only

coverageOverlay.ts
    knows about MapLibre only
```

Do not mix RF calculation code with map rendering code.

---

# Phase 13 — Proposed Node Workflow

Once simulation and rendering both work, connect them to the existing planning UX.

Target flow:

```text
User clicks map
    ↓
Create proposed node
    ↓
Open node panel
    ↓
Antenna height: [ 8 m ]
Radius:         [ 30 km ]
Resolution:     [ Standard ]
    ↓
[ Calculate Coverage ]
    ↓
progress
    ↓
coverage overlay appears
```

Store proposed nodes separately from live Meshtastic nodes.

Suggested model:

```ts
type PlannedNode = {
  id: string;
  lat: number;
  lon: number;
  antennaHeightM: number;
  simulationRadiusKm: number;
};
```

---

# Phase 14 — Keep Simulation and Rendering Reusable

The architecture should eventually allow:

```text
simulate node
simulate another node
compare two sites
toggle coverage layers
calculate direct link
suggest relay location
```

Avoid singleton global state for individual simulation results.

The engine itself may be shared, but results should be associated with node IDs.

Example:

```ts
type CoverageSimulation = {
  nodeId: string;
  input: ProposedNodeSimulationInput;
  result: CoverageResult;
};
```

---

# Phase 15 — Point-to-Point Link Simulation

After full coverage simulation works, inspect:

```ts
engine.runLink(...)
```

Build a separate wrapper:

```ts
simulateLink(nodeA, nodeB, options)
```

Potential UI:

```text
Node A → Node B

Distance
Azimuth
Predicted received power
Link margin
Terrain profile
Fresnel clearance
Status
```

Do not implement this before single-node coverage works.

---

# Phase 16 — Highpoint / Relay Suggestions

After `runLink()` works, inspect:

```ts
engine.findHighpoint(...)
```

This may later help with relay-site recommendations.

The eventual planning feature should follow this philosophy:

```text
human supplies realistic candidate areas
software ranks RF quality
```

Do not attempt full global optimization initially.

Future candidate scoring can include:

```text
line of sight
predicted link strength
number of reachable nodes
coverage improvement
redundancy
antenna height
access
power availability
installation feasibility
cost
```

---

# Phase 17 — Map Basemap Strategy

The RF simulation should remain independent from the visible basemap.

The visible map can be:

```text
satellite
street/vector
terrain
```

The DEM used for RF calculations is separate.

For the Chaco-style rural use case, satellite imagery will usually be more useful visually than dramatic 3D terrain.

Keep terrain elevation available in the background for RF calculations.

---

# Phase 18 — Offline Design, Later

Do not build offline map downloading in the first engine-integration milestone.

However, preserve an architecture that could later cache:

```text
map imagery
terrain tiles
node configuration
simulation results
telemetry
mesh topology
```

The eventual product may need to work in areas with little or no Internet connectivity.

---

# Phase 19 — Licensing and Attribution

Before copying source files into a separate product repository:

1. Inspect the Meshtastic Site Planner repository license.
2. Preserve copyright/license notices as required.
3. Determine whether copied source files require attribution.
4. Keep third-party terrain/map provider terms separate from Meshtastic source-code licensing.
5. Do not reuse basemap URLs blindly if they require API keys or prohibit commercial/offline use.

Record the source of every reused file.

Suggested comment:

```ts
// Adapted from Meshtastic Site Planner.
// Original source: <repository/path>
// See project LICENSE / NOTICE for attribution.
```

Use the exact licensing requirements found in the repository rather than guessing.

---

# Phase 20 — Minimal Acceptance Test

The engine extraction is considered successful when the new project can do all of the following:

```text
✓ loads its own MapLibre map
✓ lets the user add a proposed node
✓ creates RF parameters from that node
✓ instantiates TerrainService
✓ instantiates WasmCoverageEngine
✓ loads worker(s)
✓ loads WASM
✓ downloads required terrain
✓ emits progress
✓ supports cancellation
✓ returns a valid coverage grid
✓ crops the result correctly
✓ renders the coverage on MapLibre
✓ can remove/re-run the overlay
✓ does not require Vue
✓ does not require Pinia
✓ does not require the original Meshtastic UI
```

---

# Debugging Order

If the integration fails, debug in this order:

## 1. Build/import errors

Check:

```text
missing files
incorrect relative imports
TypeScript aliases
Vite config
worker import syntax
```

## 2. WASM loading

Check browser Network tab for:

```text
.wasm
worker script
```

Confirm HTTP 200 responses.

## 3. Worker errors

Check browser console for worker exceptions.

Open worker source and trace its initialization.

## 4. Terrain errors

Confirm terrain requests return valid data.

Check CORS and request URLs.

## 5. Engine parameter errors

Compare the new `params` object directly with the original planner's `params` for the same UI values.

## 6. Rendering errors

If simulation succeeds but nothing appears:

```text
inspect result bounds
inspect grid dimensions
inspect dBm values
verify MapLibre coordinate order
verify image corner ordering
verify layer opacity
```

---

# Recommended Working Method for ChatGPT

When helping with this project:

1. Do not guess the engine API.
2. Ask for or inspect the actual source file when uncertain.
3. Follow imports recursively.
4. Preserve the original engine behavior until the first simulation works.
5. Refactor only after parity is achieved.
6. Do not introduce Vue or Pinia into the new project unless genuinely required.
7. Keep the public API of the extracted simulation layer small.
8. Prefer adapting original Meshtastic helpers over reimplementing RF math.
9. Separate:
   - simulation
   - terrain
   - map rendering
   - UI state
10. Test after every extraction step.

When a source file is provided, explain:

```text
what it does
what it imports
whether it should be reused
what can be removed
what depends on it
```

Then update the extraction plan.

---

# Suggested First Session in the New Project

Tomorrow, begin with this exact sequence:

```text
1. Create Vite + TypeScript project.
2. Add MapLibre.
3. Confirm blank MapLibre map works.
4. Open original `src/engine/params.ts`.
5. Trace its imports.
6. Open `CoverageEngine.ts`.
7. Open `WasmCoverageEngine.ts`.
8. Build the reusable-file dependency tree.
9. Copy only the first self-contained engine files.
10. Fix imports.
11. Copy TerrainService and dependencies.
12. Copy worker/WASM assets.
13. Create a fixed-coordinate test simulation.
14. Do not add heatmap rendering until run() succeeds.
```

---

# Desired End-State API

The rest of the application should eventually interact with the RF system through something close to:

```ts
const result = await simulateCoverage(
  {
    lat: -22.4,
    lon: -60.2,
    antennaHeightM: 8,
    radiusKm: 30,
  },
  {
    signal: abortController.signal,
    onProgress: (progress) => {
      updateProgress(progress);
    },
  }
);

showCoverageOverlay(map, result);
```

That is the design target.

Everything complicated about:

```text
SPLAT!
ITM / Longley-Rice
terrain files
workers
WASM memory
unit conversion
coverage grids
```

should remain behind the reusable simulation module.

---

# First Question to Ask in the New Chat

After attaching this file, say:

> I want to continue the Meshtastic Site Planner engine extraction. Read these instructions first. We already have the original planner running locally. Start by helping me trace `src/engine/params.ts` and build the minimum dependency tree needed to reuse `WasmCoverageEngine.run()` in a clean Vite + TypeScript + MapLibre project.

Then provide `src/engine/params.ts` or paste its contents.

