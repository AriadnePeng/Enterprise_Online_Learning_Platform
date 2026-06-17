import crypto from 'node:crypto';

function encode(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

export function createToken(user, secret, lifetimeSeconds) {
  const header = encode({ alg: 'HS256', typ: 'JWT' });
  const payload = encode({
    sub: user.id,
    name: user.name,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + lifetimeSeconds,
  });
  const content = `${header}.${payload}`;
  return `${content}.${sign(content, secret)}`;
}

export function verifyToken(token, secret) {
  if (!token) throw unauthorized();
  const [header, payload, signature] = token.split('.');
  if (!header || !payload || !signature) throw unauthorized();
  const content = `${header}.${payload}`;
  const expected = sign(content, secret);
  const valid = signature.length === expected.length
    && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) throw unauthorized();

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    throw unauthorized();
  }
  if (!data.exp || data.exp < Math.floor(Date.now() / 1000)) throw unauthorized('登录已过期');
  return data;
}

export function bearerToken(request) {
  const value = request.headers.authorization || '';
  return value.startsWith('Bearer ') ? value.slice(7) : '';
}

function unauthorized(message = '请先登录') {
  return Object.assign(new Error(message), { statusCode: 401 });
}

