# BFF service token (M2M client) — user guide

**For whom:** whoever deploys or operates the Directory frontend (BFF).

## What changes for you

The BFF used to get its service token from Keycloak with a user and password. It can now get it the same way `directory-backend` does: with the credentials of Directory's **Backbone managed client** (machine-to-machine, "M2M"). No user or password is involved.

Nothing changes for people using the site.

## Turn it on

Add these variables to the BFF's Vault path (never to the repository):

| Variable | Meaning | Required |
|---|---|---|
| `M2M_CLIENT_ID` | Id (UUID) of Directory's managed client in Backbone | yes |
| `M2M_CLIENT_SECRET` | Its secret | yes |
| `M2M_TOKEN_URL` | Full URL of Backbone's `POST /api/v1/managed-clients/token` | yes |
| `M2M_SCOPES` | Scopes asked for, comma separated (a subset of the ones registered for the client) | no |

- **All three required variables set:** the BFF uses the M2M client.
- **Any of them missing:** the BFF keeps using the previous Keycloak client (`AUTH_*` and `BACKBONE_AUTH_*`), so you can roll out and roll back by changing the variables only.

## How to check it works

1. Restart the BFF with the variables.
2. Sign in on the site. If the sign-in and the landing page load, the token was issued.
3. With `--debugMode` the log shows `[M2MCLT] ::: Requesting a new M2M token`. The secret and the token are never logged.

## If something fails

| Symptom | Likely cause |
|---|---|
| The log shows `Error fetching the M2M token` and sign-in answers 502/500 | Wrong id/secret/URL, or the client lacks the scopes in `M2M_SCOPES` |
| Works, then fails after a while | Backbone revoked the client: fix it in Backbone; the BFF asks for a new token when the cached one expires |
| Still using Keycloak | One of the three required variables is empty |
