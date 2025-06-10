// server/shared/user-session-store.js
// Simple in-memory session store for user tokens
// For production, replace with Redis or another distributed cache
const userSessionStore = new Map();

/**
 * Get the session for a user if it exists and is not expired.
 * @param {string} userId
 * @returns {SessionData|null}
 */
function getUserSession(userId) {
  const session = userSessionStore.get(userId);
  if (session && session.backboneSessionExpiresAt > Date.now() && session.directorySessionExpiresAt > Date.now()) {
    return session;
  }
  return null;
}

/**
 * Set the session for a user.
 * @param {string} userId
 * @param {string} alias
 * @param {SessionData} sessionData
 */
function setUserSession(userId, alias, sessionData) {
  if (userId && alias) {
    if(userSessionStore.has(alias)) {
      removeUserSession(alias);
    }
    userSessionStore.set(userId, sessionData);
  } else if(alias) {
    userSessionStore.set(alias, sessionData);
  } else if(userId) {
    userSessionStore.set(userId, sessionData);
  } else {
    throw new Error('User ID or alias must be provided to set a session.');
  }
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
  removeUserSession,
  userSessionStore
};

