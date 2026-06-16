export const tableConfig = {
  user_info: { primaryKey: 'user_id', prefix: 'U', width: 3 },
  training_task: { primaryKey: 'task_id', prefix: 'T', width: 3 },
  learning_progress: { primaryKey: 'progress_id', prefix: 'P', width: 3 },
  lecturer: { primaryKey: 'lecturer_id' },
  course_category: { primaryKey: 'category_id' },
  course: { primaryKey: 'course_id' },
  course_chapter: { primaryKey: 'chapter_id' },
  learning_resource: { primaryKey: 'resource_id' },
  task_scope: { primaryKey: 'scope_id' },
  learning_checkin: { primaryKey: 'checkin_id' },
  learning_note: { primaryKey: 'note_id' },
  administrator: { primaryKey: 'admin_id' },
  exam: { primaryKey: 'exam_id' },
  exam_question: { primaryKey: 'question_id' },
  answer_sheet: { primaryKey: 'sheet_id' },
  exam_score: { primaryKey: 'score_id' },
};

export const internalTableConfig = {
  monthly_stats_archive: { primaryKey: 'archive_id' },
  sys_role_audit_log: { primaryKey: 'log_id' },
  exam_fail_log: { primaryKey: 'log_id' },
};

export function getTableConfig(table, allowInternal = false) {
  return tableConfig[table] || (allowInternal ? internalTableConfig[table] : undefined);
}

