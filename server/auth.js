const crypto = require('crypto');
const { ACCESS_TOKEN_TTL_MS, RESET_TOKEN_TTL_MS } = require('./config');

const hashPassword = (password) =>
  crypto.createHash('sha256').update(password).digest('hex');

const createToken = () => crypto.randomBytes(24).toString('hex');

const normalizeToken = (token) => token?.replace(/^Bearer\s+/i, '').trim();

const parseAuthorizationHeader = (headerValue) => {
  if (!headerValue || typeof headerValue !== 'string') {
    return null;
  }

  return normalizeToken(headerValue);
};

const removeExpiredTokens = (db) => {
  const now = Date.now();
  db.accessTokens = db.accessTokens.filter((token) => token.expiresAt > now);
  db.refreshTokens = db.refreshTokens.filter((token) => token.expiresAt > now);
  db.passwordResets = db.passwordResets.filter((token) => token.expiresAt > now);
};

const issueTokens = (db, userId) => {
  removeExpiredTokens(db);

  db.accessTokens = db.accessTokens.filter((token) => token.userId !== userId);

  const accessToken = createToken();
  const refreshToken = createToken();
  const now = Date.now();

  db.accessTokens.push({
    token: accessToken,
    userId,
    expiresAt: now + ACCESS_TOKEN_TTL_MS
  });

  db.refreshTokens.push({
    token: refreshToken,
    userId,
    expiresAt: now + ACCESS_TOKEN_TTL_MS * 14
  });

  return {
    accessToken: `Bearer ${accessToken}`,
    refreshToken
  };
};

const getUserByAccessToken = (db, accessToken) => {
  removeExpiredTokens(db);

  const normalizedToken = normalizeToken(accessToken);
  if (!normalizedToken) {
    return { error: 'missing' };
  }

  const tokenRecord = db.accessTokens.find(
    (token) => token.token === normalizedToken
  );

  if (!tokenRecord) {
    return { error: 'missing' };
  }

  if (tokenRecord.expiresAt <= Date.now()) {
    db.accessTokens = db.accessTokens.filter(
      (token) => token.token !== normalizedToken
    );
    return { error: 'expired' };
  }

  const user = db.users.find((item) => item.id === tokenRecord.userId);
  if (!user) {
    return { error: 'missing' };
  }

  return { user, token: normalizedToken };
};

const refreshUserSession = (db, refreshTokenValue) => {
  removeExpiredTokens(db);

  const refreshToken = db.refreshTokens.find(
    (token) => token.token === refreshTokenValue
  );

  if (!refreshToken || refreshToken.expiresAt <= Date.now()) {
    return null;
  }

  db.refreshTokens = db.refreshTokens.filter(
    (token) => token.token !== refreshTokenValue
  );

  return issueTokens(db, refreshToken.userId);
};

const createPasswordResetToken = (db, userId) => {
  const token = createToken().slice(0, 8).toUpperCase();

  db.passwordResets = db.passwordResets.filter((item) => item.userId !== userId);
  db.passwordResets.push({
    token,
    userId,
    expiresAt: Date.now() + RESET_TOKEN_TTL_MS
  });

  return token;
};

const consumePasswordResetToken = (db, tokenValue) => {
  removeExpiredTokens(db);

  const token = db.passwordResets.find((item) => item.token === tokenValue);
  if (!token || token.expiresAt <= Date.now()) {
    return null;
  }

  db.passwordResets = db.passwordResets.filter(
    (item) => item.token !== tokenValue
  );

  return db.users.find((user) => user.id === token.userId) || null;
};

module.exports = {
  hashPassword,
  issueTokens,
  getUserByAccessToken,
  refreshUserSession,
  createPasswordResetToken,
  consumePasswordResetToken,
  parseAuthorizationHeader
};
