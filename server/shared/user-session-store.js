// server/shared/user-session-store.js
// Simple in-memory session store for user tokens
// For production, replace with Redis or another distributed cache

const userSessionStore = new Map();

/**
 * Get the session for a user if it exists and is not expired.
 * @param {string} userId
 * @returns {object|null}
 */
function getUserSession(userId) {
  const session = userSessionStore.get(userId);
  if (session && session.expiresAt > Date.now()) {
    return session;
  }
  return null;
}

/**
 * Set the session for a user.
 * @param {string} userId
 * @param {object} sessionData
 */
function setUserSession(userId, sessionData) {
  userSessionStore.set(userId, sessionData);
}

/**
 * Remove the session for a user.
 * @param {string} userId
 */
function removeUserSession(userId) {
  userSessionStore.delete(userId);
}

module.exports = {
  getUserSession,
  setUserSession,
  removeUserSession
};

