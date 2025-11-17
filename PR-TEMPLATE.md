# Summary
- Hardened AI controller: use `GEMINI_API_KEY`, improve parsing of Gemini responses, and add clearer logging/error paths instead of silent failures.
- Tightened auth middleware responses: missing/invalid tokens now return 401 consistently while preserving the `{ valid:false, user:null }` payload.
- Session controller resilience: team mutations now resolve both custom `id` and subdoc `_id` so strike/score updates work reliably.
- Question set controller alignment: removed obsolete `questionIds` logic and now normalize/update `answers` inline with the schema (add/remove answer entries, run validators on update).

# Testing
- Not run (logic-only changes).
