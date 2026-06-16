import { getTableConfig } from '../data/table-config.js';
import { HttpError } from '../lib/http.js';
import { createId } from '../lib/store.js';

function now() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function sanitize(table, record) {
  if (!record) return record;
  if (table === 'user_info' || table === 'administrator') {
    const { password: _password, ...safe } = record;
    return safe;
  }
  return record;
}

function defaults(table, record) {
  const current = now();
  const value = { ...record };
  if (table === 'user_info') {
    value.password ||= '123456';
    value.user_create_time ||= current;
    value.learning_status = Number(value.learning_status ?? 1);
  }
  if (table === 'training_task') value.user_create_time ||= current.slice(0, 10);
  if (table === 'learning_progress') value.create_time ||= current;
  if (table === 'learning_note') {
    value.note_create_time ||= current;
    value.note_update_time ||= current;
  }
  if (table === 'exam_score') {
    value.review_time ||= current;
    value.pass_status = Number(value.pass_status ?? (Number(value.final_score) >= 60 ? 1 : 0));
  }
  if (table === 'answer_sheet') {
    value.submit_time ||= current;
    value.review_status = Number(value.review_status ?? 0);
  }
  return value;
}

function applyInsertTriggers(database, table, record) {
  if (table === 'course_chapter') {
    const course = database.course.find((item) => String(item.course_id) === String(record.course_id));
    if (course) {
      course.total_duration = database.course_chapter
        .filter((item) => String(item.course_id) === String(record.course_id))
        .reduce((sum, item) => sum + Number(item.duration || 0), 0) + Number(record.duration || 0);
    }
  }
  if (table === 'exam_score' && Number(record.pass_status) === 0) {
    const failed = database.exam_score.filter((item) => item.user_id === record.user_id && Number(item.pass_status) === 0).length + 1;
    database.exam_fail_log.push({
      log_id: createId('exam_fail_log', database.exam_fail_log),
      user_id: record.user_id,
      exam_id: record.exam_id,
      fail_score: record.final_score,
      fail_count: failed,
      log_time: now(),
    });
  }
}

function applyUpdateTriggers(database, table, before, after) {
  if (table === 'user_info' && before.role !== after.role && after.role === '管理员' && before.role !== '管理员') {
    database.sys_role_audit_log.push({
      log_id: createId('sys_role_audit_log', database.sys_role_audit_log),
      table_name: table,
      record_id: after.user_id,
      old_role: before.role,
      new_role: after.role,
      remark: '非法角色升级被拦截',
      create_time: now(),
    });
    throw new HttpError(403, '禁止通过普通资料修改提升为管理员');
  }
  if (table === 'learning_progress' && Number(before.status) !== 2 && Number(after.status) === 2) {
    const task = database.training_task.find((item) => item.task_id === after.task_id);
    if (task) {
      task.completed_count = database.learning_progress
        .filter((item) => item.task_id === after.task_id && (item.progress_id === after.progress_id ? Number(after.status) === 2 : Number(item.status) === 2))
        .length;
    }
  }
  if (table === 'course' && Number(before.course_status) !== Number(after.course_status)) {
    const online = Number(after.course_status) === 1;
    database.course_chapter
      .filter((item) => String(item.course_id) === String(after.course_id))
      .forEach((item) => { item.is_free = online ? 1 : 0; });
    database.learning_resource
      .filter((item) => String(item.course_id) === String(after.course_id))
      .forEach((item) => { item.resource_status = online ? 1 : 0; });
  }
}

export const crudService = {
  list(store, table, query) {
    const rows = store.table(table);
    const keyword = String(query.get('keyword') || query.get('search') || '').trim().toLowerCase();
    const filters = Array.from(query.entries()).filter(([key]) => !['keyword', 'search'].includes(key));
    return rows
      .filter((row) => !keyword || Object.values(row).some((value) => String(value).toLowerCase().includes(keyword)))
      .filter((row) => filters.every(([key, value]) => String(row[key]) === value))
      .map((row) => sanitize(table, row));
  },

  detail(store, table, id) {
    const config = getTableConfig(table);
    if (!config) throw new HttpError(404, `不支持的数据表: ${table}`);
    const row = store.table(table).find((item) => String(item[config.primaryKey]) === String(id));
    if (!row) throw new HttpError(404, '记录不存在');
    return sanitize(table, row);
  },

  async add(store, table, input) {
    const config = getTableConfig(table);
    if (!config) throw new HttpError(404, `不支持的数据表: ${table}`);
    return store.mutate((database) => {
      const rows = database[table] || [];
      const key = config.primaryKey;
      const record = defaults(table, input);
      if (!record[key]) record[key] = createId(table, rows, config);
      if (rows.some((item) => String(item[key]) === String(record[key]))) {
        throw new HttpError(409, `${String(record[key])} 已存在`);
      }
      applyInsertTriggers(database, table, record);
      rows.unshift(record);
      database[table] = rows;
      return sanitize(table, record);
    });
  },

  async update(store, table, input) {
    const config = getTableConfig(table);
    if (!config) throw new HttpError(404, `不支持的数据表: ${table}`);
    return store.mutate((database) => {
      const rows = database[table] || [];
      const key = config.primaryKey;
      if (input[key] === undefined || input[key] === null || input[key] === '') {
        throw new HttpError(400, `缺少主键字段 ${key}`);
      }
      const index = rows.findIndex((item) => String(item[key]) === String(input[key]));
      if (index < 0) throw new HttpError(404, '记录不存在');
      const before = rows[index];
      const after = defaults(table, { ...before, ...input });
      applyUpdateTriggers(database, table, before, after);
      rows[index] = after;
      return sanitize(table, after);
    });
  },

  async delete(store, table, id) {
    const config = getTableConfig(table);
    if (!config) throw new HttpError(404, `不支持的数据表: ${table}`);
    return store.mutate((database) => {
      const rows = database[table] || [];
      const index = rows.findIndex((item) => String(item[config.primaryKey]) === String(id));
      if (index < 0) throw new HttpError(404, '记录不存在');
      rows.splice(index, 1);
      return null;
    });
  },
};

