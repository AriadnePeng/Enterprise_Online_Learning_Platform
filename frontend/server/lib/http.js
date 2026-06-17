export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function sendJson(response, statusCode, body, corsHeaders = {}) {
  const content = JSON.stringify(body);
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(content),
    ...corsHeaders,
  });
  response.end(content);
}

export function success(response, data = null, message = '操作成功', corsHeaders = {}) {
  sendJson(response, 200, { success: true, message, data }, corsHeaders);
}

export function failure(response, error, corsHeaders = {}) {
  const statusCode = Number(error.statusCode) || 500;
  const message = statusCode >= 500 ? '服务器内部错误' : error.message;
  if (statusCode >= 500) console.error(error);
  sendJson(response, statusCode, { success: false, message, data: null }, corsHeaders);
}

export async function readJson(request, maxBytes = 1024 * 1024) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxBytes) throw new HttpError(413, '请求体过大');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw new HttpError(400, 'JSON 格式错误');
  }
}

export function route(method, pattern, handler) {
  return { method, pattern, handler };
}

export function matchRoute(routes, method, pathname) {
  for (const item of routes) {
    if (item.method !== method) continue;
    const match = pathname.match(item.pattern);
    if (match) return { handler: item.handler, params: match.groups || {}, match };
  }
  return null;
}

