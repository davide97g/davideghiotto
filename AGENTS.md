## Learned User Preferences

- On the RAL page, company logos should be shaped for readability: Reply and Bitrock get a white background and round crop, Namirial is round on white, Infodati stays as-provided.
- RAL chart vertical company bands should use brand colors — Reply green, Namirial black & white, Infodati pink, Bitrock orange — with clear tenure dividers so mid-chart employer framing is easy to read.
- RAL unlocks must not last forever: after a TTL the backend must stop serving amounts and the UI must clear figures; the countdown should stay correct when returning to the same browser later.
- Prefer real email OTP for RAL disclosure (no disposable/temp mail); keep disclosure fail-closed when the gate service is down or misconfigured.

## Learned Workspace Facts

- The portfolio has a `/ral` disclosure page with a salary timeline chart, company logos/colors, and an email OTP unlock flow.
- Exact RAL amounts live only in `services/ral-gate` (Node/Fastify, VPS-deployable); the portfolio ships company/date metadata without amounts and stays locked if the API is unavailable.
- Verified ral-gate unlocks are time-boxed via `SESSION_TTL_SECONDS` (default about one hour); expired sessions get 401 and the client clears local unlock state.
- RAL chart employers are Reply, Namirial, Infodati, and Bitrock; chart bands should follow non-overlapping salary tenures rather than overlapping CV date ranges.
