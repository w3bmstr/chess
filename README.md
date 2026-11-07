# Chess

## Opening Encyclopedia

The repository includes a full ECO code-space runtime encyclopedia and a browser-test cross-check against the supplied ECO reference list.

- See [data/books/eco_encyclopedia_data.js](data/books/eco_encyclopedia_data.js) for the full in-repo encyclopedia dataset.
- See [data/books/opening_explorer_book_data.js](data/books/opening_explorer_book_data.js) for the smaller weighted explorer book used for live move suggestions.
- See [data/books/eco_reference_titles.js](data/books/eco_reference_titles.js) for the canonical code-level ECO titles imported from the supplied reference list.
- See [tests/eco_reference_data.js](tests/eco_reference_data.js) and [tests/ui.test.js](tests/ui.test.js) for the cross-reference coverage checks.

### Expanding The Encyclopedia

If you want broader coverage than the current curated dataset, merge external PGN opening libraries into the encyclopedia instead of hand-editing thousands of lines.

- Use `npm run openings:merge -- path\to\opening-library.pgn` to merge one or more PGN libraries into [data/books/eco_encyclopedia_data.js](data/books/eco_encyclopedia_data.js).
- Add `--replace` if you want to rebuild the encyclopedia from the supplied library files instead of merging into the current dataset.
- Add `--dry-run` to inspect import counts, duplicates, and skipped games before writing changes.
- The merge script expects PGN headers with `ECO`, plus `Opening` and optional `Variation` headers when available.

## Testing

This project uses a browser-first test harness instead of a Node-based runner.

### Browser Suites

- [tests/engine-smoke.html](tests/engine-smoke.html) runs the fast everyday suite: core engine checks, controller logic, notation, UI logic, and integration smoke coverage.
- [tests/engine-deep.html](tests/engine-deep.html) runs the slower regression suite: deeper mate search tests and published perft divide checks.
- [tests/engine-tests.html](tests/engine-tests.html) runs the full combined browser suite.
- [engine-harness.html](engine-harness.html) is the manual diagnostics page, not the automated test suite.

### How To Run

1. Open one of the HTML suite pages in a browser.
2. Start with the smoke suite during normal development.
3. Run the deep suite before merging engine, move generation, evaluation, or search changes.
4. Run the full suite when you want one combined pass.

The browser-first landing page is [tests/index.html](tests/index.html).

### Local Quick Start

If you are not using GitHub, you can ignore everything under [.github/workflows](.github/workflows).

1. Run [scripts/open-test-suite.ps1](scripts/open-test-suite.ps1) with `-Suite hub`, `-Suite smoke`, `-Suite deep`, `-Suite full`, or `-Suite harness`.
2. The script starts the local test server if needed and opens the matching page in your default browser.
3. Run [scripts/stop-test-server.ps1](scripts/stop-test-server.ps1) when you want to stop the local server.

Examples:

- `powershell -ExecutionPolicy Bypass -File .\scripts\open-test-suite.ps1 -Suite hub`
- `powershell -ExecutionPolicy Bypass -File .\scripts\open-test-suite.ps1 -Suite smoke`
- `powershell -ExecutionPolicy Bypass -File .\scripts\open-test-suite.ps1 -Suite deep`
- `powershell -ExecutionPolicy Bypass -File .\scripts\open-test-suite.ps1 -Suite full`
- `powershell -ExecutionPolicy Bypass -File .\scripts\stop-test-server.ps1`

### GitHub Pages

The site is already organized as one GitHub repository. GitHub Pages keeps the
relative folders used by the browser app (`app`, `config`, `data`, `engine`,
`ui`, and `vendor`); flattening them into one physical folder would create
filename collisions and break the script paths.

The [Deploy GitHub Pages workflow](.github/workflows/pages.yml) publishes the
root `index.html` and the files it needs whenever `main` or `master` is
updated. Enable **Settings > Pages > Source: GitHub Actions** once in the
repository settings.

GitHub Pages hosts the browser application only. The Node multiplayer server
under `server/` needs a separate Node-capable host, and its URL must be set in
`config/runtime-config.js` before multiplayer can be used.

### VS Code Tasks

The repository now includes repeatable VS Code tasks in [.vscode/tasks.json](.vscode/tasks.json).

1. Run `Open Browser Test Hub` for the local browser-first entry point.
2. Run `Open Smoke Test Suite`, `Open Deep Test Suite`, or `Open Full Test Suite` to jump straight to a specific suite.
3. Run `Open Manual Engine Harness` when you want the diagnostics page instead of the automated suites.
4. Run `Stop Chess2 Test Server` to shut the local server down.

The local server is powered by [scripts/serve-tests.ps1](scripts/serve-tests.ps1), so the test pages no longer depend on opening raw `file://` URLs.

### Recommended Workflow

1. Use the smoke suite for quick feedback while changing controller or UI logic.
2. Use the deep suite after any search, perft, or evaluation change.
3. Use the full suite before considering the browser test pass complete.

### Current Limits

- CI covers the smoke suite on pushes and pull requests, and the deep suite on manual trigger or nightly schedule.
- The full combined suite is automated as a manual workflow only.
- Manual diagnostics remain outside the automated workflow.
- Performance benchmarks in [tests/performance/bench_eval.js](tests/performance/bench_eval.js) and [tests/performance/bench_search.js](tests/performance/bench_search.js) are manual checks, not pass/fail tests.

### CI Smoke Tests

The repository now includes a GitHub Actions smoke workflow at [.github/workflows/smoke-tests.yml](.github/workflows/smoke-tests.yml).

1. The workflow serves the repository over HTTP.
2. It opens [tests/engine-smoke.html](tests/engine-smoke.html) in headless Chromium through [scripts/run-smoke-suite.mjs](scripts/run-smoke-suite.mjs).
3. It fails the build on browser errors or any failed smoke test.

Local CI-style smoke runs use `npm install` followed by `npm run test:smoke` while the local static server is running.

### CI Deep Tests

The repository also includes a deep regression workflow at [.github/workflows/deep-tests.yml](.github/workflows/deep-tests.yml).

1. It runs on manual trigger and nightly schedule.
2. It opens [tests/engine-deep.html](tests/engine-deep.html) in headless Chromium through the same runner script.
3. It uses a longer timeout so the slower mate-depth and divide regressions can complete.

Local CI-style deep runs use `npm install` followed by `npm run test:deep` with `CHESS2_TEST_PATH=/tests/engine-deep.html` and the local static server running.

### CI Full Tests

The repository also includes a manual full-suite workflow at [.github/workflows/full-tests.yml](.github/workflows/full-tests.yml).

1. It runs only from `workflow_dispatch`.
2. It opens [tests/engine-tests.html](tests/engine-tests.html) in headless Chromium through the same runner script.
3. It is intended for explicit full validation passes rather than every push.

### Failure Artifacts

Smoke, deep, and full workflows now capture Playwright failure artifacts on CI failure.

1. Each failing job uploads a JSON results file and text summary.
2. Each failing job uploads the rendered page HTML and a screenshot of the failure state.
3. Each failing job uploads the temporary HTTP server log.

### Badges

Status badges have not been added yet because the workflows need to exist and run successfully at least once before the badge targets are worth wiring into the README.