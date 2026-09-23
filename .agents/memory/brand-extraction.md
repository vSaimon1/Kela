---
name: Brand extraction fallback
description: Fallback for deriving brand context when automated brand parsing is unavailable.
---

When automated brand extraction is unavailable, fetch the official site content directly, inspect the rendered page, download only the site's public assets needed for the build, and pass those local assets plus the real copy to the design handoff.

**Why:** Automated brand parsing may require a paid mode and stop the build instead of returning partial results.

**How to apply:** Treat the live site and its bundled/local assets as the source of truth; do not substitute invented brand facts or placeholder imagery.