const jwt = require('jsonwebtoken');
const {setUserSession, getUserSession} = require("./user-session-store");
const {getOAuthClient} = require("../proxy/oauth-client");
const APPLICATION_ID = process.env.APPLICATION_ID;
const INNER_AUTH_PATH = process.env.API_SERVICE_DIRECTORY_SESSION_RELATIVE_PATH;
const API_SERVICE_DIRECTORY_MAP = JSON.parse(process.env.API_SERVICE_DIRECTORY_MAP);
const OAUTH_AUTHENTICATION_TYPE = process.env.AUTH_AUTHENTICATION_TYPE;
const OAUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
const OAUTH_GRANT_TYPE = process.env.AUTH_GRANT_TYPE;
const OAUTH_TOKEN_URL = process.env.AUTH_SERVER_URI;
const OAUTH_USER_ALIAS = process.env.AUTH_USER_ALIAS;
const OAUTH_USER_PASSWORD = process.env.AUTH_USER_PASSWORD;

/**
 * Creates a session element with the provided parameters.
 * @param session - The current session data.
 * @param userId - The user ID to associate with the session.
 * @param directoryBearerToken - The bearer token for Directory Backend services.
 * @param directorySessionToken - The session token for Directory Backend services.
 * @returns {Promise<*&{directorySession, directorySessionExpiresAt, directoryBearerToken}>}
 */
async function getSessionElement(session, userId, directoryBearerToken, directorySessionToken) {
  const sessionData = {
    ...session,
    directorySession: directorySessionToken||session?.directorySession|| null,
    directorySessionExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hora
    directoryBearerToken: directoryBearerToken||session?.directoryBearerToken|| null,
  };

  setUserSession(userId, null, sessionData);
  return sessionData;
}

/**
 * Retrieves the session token for the Directory Backend services.
 * @param userId - The user ID to retrieve the session for.
 * @param directoryOauthClientConfig - The configuration for the Directory OAuth client.
 * @returns {Promise<{directoryBearerToken}|{directorySession}|SessionData|*>}
 */
async function getDirectorySessionToken(userId, directoryOauthClientConfig) {
  const sessionData = getUserSession(userId);
  if (sessionData && sessionData.directorySession && sessionData.directoryBearerToken && sessionData.directorySessionExpiresAt > Date.now() && sessionData.backboneSessionExpiresAt > Date.now()) {
    return sessionData;
  }
  const directoryBearerToken = await getOAuthClient(directoryOauthClientConfig).getBearerToken();
  return getSessionElement(sessionData, userId, directoryBearerToken);
}

/**
 * Extracts the user ID from the JWT token.
 * @param backboneJWT - The JWT token to decode.
 * @returns {*|null}
 */
function getUserId(backboneJWT) {
  // Decode the payload without verifying the signature
  const decoded = jwt.decode(backboneJWT);

  if (decoded && decoded.uid) {
    console.log('UID:', decoded.uid);
    return decoded.uid;
  } else {
    console.log('UID not found in the token.');
    return null;
  }
}

module.exports = {
  APPLICATION_ID,
  INNER_AUTH_PATH,
  API_SERVICE_DIRECTORY_MAP,
  OAUTH_AUTHENTICATION_TYPE,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_GRANT_TYPE,
  OAUTH_TOKEN_URL,
  OAUTH_USER_ALIAS,
  OAUTH_USER_PASSWORD,


  getSessionElement,
  getDirectorySessionToken,
  getUserId
}
