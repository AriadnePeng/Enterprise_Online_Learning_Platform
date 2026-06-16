import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { createApp } from '../app.js';

let server;
let baseUrl;
let token;
let testDir;

async function api(pathname, options = {}) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const body = await response.json();
  return { response, body };
}

before(async () => {
  testDir = await fs.mkdtemp(path.join(os.tmpdir(), 'enterprise-learning-api-'));
  await fs.mkdir(path.join(testDir, 'dist'));
  await fs.writeFile(path.join(testDir, 'dist', 'index.html'), '<h1>Enterprise Learning</h1>');
  await fs.writeFile(path.join(testDir, 'dist', 'app.js'), 'console.log("ok");');
  const app = await createApp({
    dataFile: path.join(testDir, 'database.json'),
    staticDir: path.join(testDir, 'dist'),
    tokenSecret: 'test-secret',
    corsOrigins: new Set(['http://localhost:3000']),
  });
  server = app.server;
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  await fs.rm(testDir, { recursive: true, force: true });
});

test('health endpoint is public', async () => {
  const { response, body } = await api('/api/health');
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.status, 'UP');
});

test('serves frontend assets and SPA fallback', async () => {
  const indexResponse = await fetch(`${baseUrl}/`);
  assert.equal(indexResponse.status, 200);
  assert.match(await indexResponse.text(), /Enterprise Learning/);

  const assetResponse = await fetch(`${baseUrl}/app.js`);
  assert.equal(assetResponse.headers.get('content-type'), 'text/javascript; charset=utf-8');
  assert.match(await assetResponse.text(), /console\.log/);

  const fallbackResponse = await fetch(`${baseUrl}/dashboard`);
  assert.equal(fallbackResponse.status, 200);
  assert.match(await fallbackResponse.text(), /Enterprise Learning/);
});

test('protected endpoints reject anonymous requests', async () => {
  const { response, body } = await api('/api/user_info/list');
  assert.equal(response.status, 401);
  assert.equal(body.success, false);
});

test('login returns a usable token', async () => {
  const { response, body } = await api('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', password: '123456' }),
  });
  assert.equal(response.status, 200);
  assert.equal(body.data.user.name, '系统管理员');
  token = body.data.token;
  assert.ok(token);
});

test('generic CRUD supports create, update, detail and delete', async () => {
  const list = await api('/api/user_info/list');
  assert.equal(list.response.status, 200);
  assert.equal(list.body.data.length, 8);

  const added = await api('/api/user_info/add', {
    method: 'POST',
    body: JSON.stringify({
      username: '接口测试用户',
      role: '学员',
      position: '测试工程师',
      learning_status: 1,
      contact: '13900001111',
    }),
  });
  assert.equal(added.response.status, 200);
  assert.equal(added.body.data.user_id, 'U009');
  assert.equal('password' in added.body.data, false);

  const updated = await api('/api/user_info/update', {
    method: 'POST',
    body: JSON.stringify({ ...added.body.data, position: '高级测试工程师' }),
  });
  assert.equal(updated.body.data.position, '高级测试工程师');

  const detail = await api('/api/user_info/detail/U009');
  assert.equal(detail.body.data.username, '接口测试用户');

  const deleted = await api('/api/user_info/delete/U009', { method: 'POST' });
  assert.equal(deleted.response.status, 200);

  const missing = await api('/api/user_info/detail/U009');
  assert.equal(missing.response.status, 404);
});

test('views return joined and aggregated records', async () => {
  const scores = await api('/api/views/exams/score-summary');
  assert.equal(scores.response.status, 200);
  assert.equal(scores.body.data[0].username, '李勇');
  assert.equal(scores.body.data[0].pass_result, '及格');

  const categories = await api('/api/views/courses/category-stats');
  assert.equal(categories.response.status, 200);
  assert.ok(categories.body.data.some((row) => row.category_name === '安全合规'));

  const stats = await api('/api/views/stats/learning-exam');
  assert.equal(stats.body.data.length, 6);
});

test('task procedures update related data transactionally', async () => {
  const assigned = await api('/api/procedures/tasks/batch-assign', {
    method: 'POST',
    body: JSON.stringify({
      p_task_id: 'T900',
      p_task_name: '后端联调培训',
      p_creator_id: 'A001',
      p_target_position: '安全工程师',
      p_deadline: 16,
    }),
  });
  assert.equal(assigned.response.status, 200);
  assert.match(assigned.body.data, /2 名学员/);

  const progress = await api('/api/views/tasks/progress-overview');
  const task = progress.body.data.find((row) => row.task_id === 'T900');
  assert.equal(task.assigned_count, 2);

  const delayed = await api('/api/procedures/tasks/update-time', {
    method: 'POST',
    body: JSON.stringify({ p_task_id: 'T900', p_new_deadline: 32 }),
  });
  assert.match(delayed.body.data, /32 小时/);
});

test('course and exam procedures expose expected results', async () => {
  const offline = await api('/api/procedures/courses/1/offline', { method: 'POST' });
  assert.equal(offline.response.status, 200);

  const course = await api('/api/course/detail/1');
  assert.equal(course.body.data.course_status, 0);

  const passRate = await api('/api/procedures/exams/1/pass-rate');
  assert.equal(passRate.response.status, 200);
  assert.equal(passRate.body.data[0].pass_rate, 100);
});
