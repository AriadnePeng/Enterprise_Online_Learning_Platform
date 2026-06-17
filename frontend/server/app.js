import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config as defaultConfig } from './config.js';
import { bearerToken, createToken, verifyToken } from './lib/auth.js';
import { failure, HttpError, matchRoute, readJson, route, success } from './lib/http.js';
import { JsonStore } from './lib/store.js';
import { crudService } from './services/crud.js';
import { procedureService } from './services/procedures.js';
import { viewService } from './services/views.js';

function createCorsHeaders(request, settings) {
  const origin = request.headers.origin;
  const allowedOrigin = origin && settings.corsOrigins.has(origin) ? origin : 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function requireAuth(request, settings) {
  return verifyToken(bearerToken(request), settings.tokenSecret);
}

function buildRoutes(store, settings) {
  return [
    route('GET', /^\/api\/health$/, async ({ response, corsHeaders }) => {
      success(response, {
        status: 'UP',
        service: 'enterprise-learning-api',
        storage: 'json',
        time: new Date().toISOString(),
      }, '服务运行正常', corsHeaders);
    }),

    route('POST', /^\/api\/auth\/login$/, async ({ request, response, corsHeaders }) => {
      const { username, password } = await readJson(request);
      if (!username || !password) throw new HttpError(400, '请输入账号和密码');
      const database = store.snapshot();
      const administrator = database.administrator.find((item) => item.username === username && item.password === password);
      const user = administrator || database.user_info.find((item) => item.username === username && item.password === password);
      if (!user) throw new HttpError(401, '账号或密码错误');
      const authUser = administrator
        ? { id: administrator.admin_code || String(administrator.admin_id), name: administrator.admin_name, role: administrator.role }
        : { id: user.user_id, name: user.username, role: user.role };
      success(response, {
        token: createToken(authUser, settings.tokenSecret, settings.tokenLifetimeSeconds),
        user: authUser,
      }, '登录成功', corsHeaders);
    }),

    route('GET', /^\/api\/views\/tasks\/progress-overview$/, async ({ response, corsHeaders }) => {
      success(response, viewService.taskProgress(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/tasks\/delay-warnings$/, async ({ response, corsHeaders }) => {
      success(response, viewService.delayWarnings(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/exams\/score-summary$/, async ({ response, corsHeaders }) => {
      success(response, viewService.examScoreSummary(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/exams\/answer-sheets$/, async ({ response, corsHeaders }) => {
      success(response, viewService.answerSheets(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/stats\/learning-exam$/, async ({ response, corsHeaders }) => {
      success(response, viewService.learningExamStats(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/stats\/employee-anomalies$/, async ({ response, corsHeaders }) => {
      success(response, viewService.employeeAnomalies(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/users\/safe$/, async ({ response, corsHeaders }) => {
      success(response, viewService.safeUsers(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/notes\/lecturer-student$/, async ({ response, corsHeaders }) => {
      success(response, viewService.lecturerNotes(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/courses\/category-stats$/, async ({ response, corsHeaders }) => {
      success(response, viewService.courseCategoryStats(store.snapshot()), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/views\/courses\/list-extended$/, async ({ response, corsHeaders }) => {
      success(response, viewService.courseListExtended(store.snapshot()), '查询成功', corsHeaders);
    }),

    route('POST', /^\/api\/procedures\/tasks\/batch-assign$/, async ({ request, response, corsHeaders }) => {
      success(response, await procedureService.batchAssignTask(store, await readJson(request)), '执行成功', corsHeaders);
    }),
    route('POST', /^\/api\/procedures\/tasks\/update-time$/, async ({ request, response, corsHeaders }) => {
      success(response, await procedureService.updateTaskTime(store, await readJson(request)), '执行成功', corsHeaders);
    }),
    route('POST', /^\/api\/procedures\/courses\/(?<courseId>\d+)\/offline$/, async ({ response, corsHeaders, params }) => {
      success(response, await procedureService.offlineCourse(store, params.courseId), '课程已下架', corsHeaders);
    }),
    route('POST', /^\/api\/procedures\/exams\/auto-submit$/, async ({ request, response, corsHeaders }) => {
      success(response, await procedureService.autoSubmitExam(store, await readJson(request)), '自动交卷成功', corsHeaders);
    }),
    route('GET', /^\/api\/procedures\/exams\/(?<examId>\d+)\/pass-rate$/, async ({ response, corsHeaders, params }) => {
      success(response, procedureService.passRate(store, params.examId), '统计成功', corsHeaders);
    }),
    route('GET', /^\/api\/procedures\/stats\/export-anomaly-employees$/, async ({ response, corsHeaders, url }) => {
      success(response, procedureService.anomalyEmployees(store, url.searchParams), '查询成功', corsHeaders);
    }),
    route('POST', /^\/api\/procedures\/stats\/archive-monthly\/(?<statMonth>\d{4}-\d{2})$/, async ({ response, corsHeaders, params }) => {
      success(response, await procedureService.archiveMonthly(store, params.statMonth), '归档成功', corsHeaders);
    }),
    route('POST', /^\/api\/procedures\/notes\/update$/, async ({ request, response, corsHeaders }) => {
      success(response, await procedureService.updateNote(store, await readJson(request)), '笔记已更新', corsHeaders);
    }),
    route('GET', /^\/api\/procedures\/notes\/admin-all$/, async ({ response, corsHeaders }) => {
      success(response, procedureService.allNotes(store), '查询成功', corsHeaders);
    }),
    route('POST', /^\/api\/procedures\/checkin\/process$/, async ({ request, response, corsHeaders }) => {
      success(response, await procedureService.processCheckin(store, await readJson(request)), '打卡成功', corsHeaders);
    }),

    route('GET', /^\/api\/(?<table>[a-z_]+)\/list$/, async ({ response, corsHeaders, params, url }) => {
      success(response, crudService.list(store, params.table, url.searchParams), '查询成功', corsHeaders);
    }),
    route('GET', /^\/api\/(?<table>[a-z_]+)\/detail\/(?<id>[^/]+)$/, async ({ response, corsHeaders, params }) => {
      success(response, crudService.detail(store, params.table, decodeURIComponent(params.id)), '查询成功', corsHeaders);
    }),
    route('POST', /^\/api\/(?<table>[a-z_]+)\/add$/, async ({ request, response, corsHeaders, params }) => {
      success(response, await crudService.add(store, params.table, await readJson(request)), '新增成功', corsHeaders);
    }),
    route('POST', /^\/api\/(?<table>[a-z_]+)\/update$/, async ({ request, response, corsHeaders, params }) => {
      success(response, await crudService.update(store, params.table, await readJson(request)), '更新成功', corsHeaders);
    }),
    route('POST', /^\/api\/(?<table>[a-z_]+)\/delete\/(?<id>[^/]+)$/, async ({ response, corsHeaders, params }) => {
      success(response, await crudService.delete(store, params.table, decodeURIComponent(params.id)), '删除成功', corsHeaders);
    }),
  ];
}

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function serveStatic(request, response, pathname, staticDir) {
  if (!['GET', 'HEAD'].includes(request.method || 'GET')) {
    throw new HttpError(404, '资源不存在');
  }

  const normalizedPath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^[/\\]+/, '');
  let filePath = path.resolve(staticDir, relativePath);
  const staticRoot = path.resolve(staticDir);
  if (!filePath.startsWith(staticRoot)) throw new HttpError(403, '禁止访问该资源');

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    await sendFile(response, filePath, request.method === 'HEAD');
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
    await sendFile(response, path.join(staticRoot, 'index.html'), request.method === 'HEAD');
  }
}

async function sendFile(response, filePath, headOnly = false) {
  const content = await fs.readFile(filePath);
  response.writeHead(200, {
    'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Content-Length': content.length,
    'Cache-Control': path.basename(filePath) === 'index.html'
      ? 'no-cache'
      : 'public, max-age=31536000, immutable',
  });
  response.end(headOnly ? undefined : content);
}

export async function createApp(overrides = {}) {
  const settings = { ...defaultConfig, ...overrides };
  const store = await new JsonStore(settings.dataFile).init();
  const routes = buildRoutes(store, settings);

  const server = http.createServer(async (request, response) => {
    const corsHeaders = createCorsHeaders(request, settings);
    if (request.method === 'OPTIONS') {
      response.writeHead(204, corsHeaders);
      response.end();
      return;
    }

    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
      if (url.pathname.startsWith('/api/')) {
        const matched = matchRoute(routes, request.method || 'GET', url.pathname);
        if (!matched) throw new HttpError(404, '接口不存在');
        if (url.pathname !== '/api/health' && url.pathname !== '/api/auth/login') {
          request.auth = requireAuth(request, settings);
        }
        await matched.handler({
          request,
          response,
          url,
          params: matched.params,
          match: matched.match,
          corsHeaders,
        });
        return;
      }

      await serveStatic(request, response, url.pathname, settings.staticDir);
    } catch (error) {
      failure(response, error, corsHeaders);
    }
  });

  return { server, store, settings };
}
