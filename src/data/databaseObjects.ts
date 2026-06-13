import type { DbTable, DbView, DbProcedure, DbTrigger } from '@/types/database';

// ==================== 16张数据表 ====================
export const tables: DbTable[] = [
  {
    id: 'user_info',
    name: 'user_info',
    nameCn: '用户表',
    description: '存储系统所有用户的基本信息，包括学员、讲师、管理员',
    recordCount: 10,
    relatedTables: ['training_task', 'learning_progress', 'answer_sheet', 'exam_score', 'administrator'],
    fields: [
      { name: 'user_id', type: 'VARCHAR(32)', isPrimary: true, isForeign: false, isNullable: false, description: '用户编号，业务编码主键' },
      { name: 'username', type: 'VARCHAR(64)', isPrimary: false, isForeign: false, isNullable: false, description: '用户名' },
      { name: 'password', type: 'VARCHAR(128)', isPrimary: false, isForeign: false, isNullable: false, description: '密码' },
      { name: 'role', type: 'VARCHAR(16)', isPrimary: false, isForeign: false, isNullable: false, description: '角色（学员/管理员）' },
      { name: 'position', type: 'VARCHAR(64)', isPrimary: false, isForeign: false, isNullable: false, description: '岗位' },
      { name: 'learning_status', type: 'SMALLINT', isPrimary: false, isForeign: false, isNullable: false, description: '学习状态' },
      { name: 'avatar', type: 'VARCHAR(255)', isPrimary: false, isForeign: false, isNullable: true, description: '头像' },
      { name: 'contact', type: 'VARCHAR(64)', isPrimary: false, isForeign: false, isNullable: true, description: '联系方式' },
      { name: 'user_create_time', type: 'TIMESTAMP', isPrimary: false, isForeign: false, isNullable: false, default: 'CURRENT_TIMESTAMP', description: '创建时间' },
    ]
  },
  {
    id: 'training_task',
    name: 'training_task',
    nameCn: '培训任务表',
    description: '存储企业发布的培训任务信息',
    recordCount: 10,
    relatedTables: ['user_info', 'learning_progress', 'task_scope'],
    fields: [
      { name: 'task_id', type: 'VARCHAR(32)', isPrimary: true, isForeign: false, isNullable: false, description: '任务编号' },
      { name: 'user_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: true, description: '发布人编号，外键关联用户表' },
      { name: 'task_name', type: 'VARCHAR(128)', isPrimary: false, isForeign: false, isNullable: false, description: '任务名称' },
      { name: 'task_scope_type', type: 'VARCHAR(16)', isPrimary: false, isForeign: false, isNullable: false, description: '参与范围类型（部门/岗位/个人）' },
      { name: 'task_deadline', type: 'DECIMAL(5,2)', isPrimary: false, isForeign: false, isNullable: false, description: '截止时间（小时）' },
      { name: 'learning_status', type: 'SMALLINT', isPrimary: false, isForeign: false, isNullable: false, description: '任务状态' },
      { name: 'user_create_time', type: 'TIMESTAMP', isPrimary: false, isForeign: false, isNullable: false, default: 'CURRENT_TIMESTAMP', description: '创建时间' },
    ]
  },
  {
    id: 'learning_progress',
    name: 'learning_progress',
    nameCn: '学习进度表',
    description: '记录学员的学习进度和完成情况',
    recordCount: 10,
    relatedTables: ['user_info', 'training_task', 'learning_checkin', 'learning_note'],
    fields: [
      { name: 'progress_id', type: 'VARCHAR(32)', isPrimary: true, isForeign: false, isNullable: false, description: '记录编号' },
      { name: 'user_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: true, description: '学员编号' },
      { name: 'task_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: true, description: '任务编号' },
      { name: 'duration', type: 'INT', isPrimary: false, isForeign: false, isNullable: true, description: '学习时长（分钟）' },
      { name: 'deadline', type: 'DECIMAL(5,2)', isPrimary: false, isForeign: false, isNullable: true, description: '截止时间' },
      { name: 'status', type: 'SMALLINT', isPrimary: false, isForeign: false, isNullable: false, description: '完成状态' },
      { name: 'create_time', type: 'TIMESTAMP', isPrimary: false, isForeign: false, isNullable: false, default: 'CURRENT_TIMESTAMP', description: '创建时间' },
    ]
  },
  {
    id: 'lecturer',
    name: 'lecturer',
    nameCn: '讲师表',
    description: '存储讲师基本信息',
    recordCount: 10,
    relatedTables: ['course'],
    fields: [
      { name: 'lecturer_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '讲师ID' },
      { name: 'lecturer_name', type: 'VARCHAR(10)', isPrimary: false, isForeign: false, isNullable: true, description: '讲师姓名' },
      { name: 'title', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: '职称' },
      { name: 'department', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: '所属部门' },
      { name: 'phone', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: false, description: '手机号' },
      { name: 'intro', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '简介' },
    ]
  },
  {
    id: 'course_category',
    name: 'course_category',
    nameCn: '课程分类表',
    description: '课程分类层级管理',
    recordCount: 10,
    relatedTables: ['course'],
    fields: [
      { name: 'category_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '分类ID' },
      { name: 'category_name', type: 'VARCHAR(100)', isPrimary: false, isForeign: false, isNullable: true, description: '分类名称' },
      { name: 'level', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: true, description: '分类层级' },
      { name: 'sort', type: 'INT', isPrimary: false, isForeign: false, isNullable: true, description: '排序号' },
      { name: 'create_time', type: 'TIME', isPrimary: false, isForeign: false, isNullable: true, description: '创建时间' },
    ]
  },
  {
    id: 'course',
    name: 'course',
    nameCn: '课程表',
    description: '存储课程基本信息',
    recordCount: 10,
    relatedTables: ['course_category', 'lecturer', 'course_chapter', 'learning_resource'],
    fields: [
      { name: 'course_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '课程ID' },
      { name: 'course_name', type: 'VARCHAR(10)', isPrimary: false, isForeign: false, isNullable: false, description: '课程名称' },
      { name: 'course_code', type: 'VARCHAR(10)', isPrimary: false, isForeign: false, isNullable: false, description: '课程编码' },
      { name: 'course_status', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: false, description: '课程状态' },
      { name: 'course_desc', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '课程描述' },
    ]
  },
  {
    id: 'course_chapter',
    name: 'course_chapter',
    nameCn: '课程章节表',
    description: '课程章节信息',
    recordCount: 10,
    relatedTables: ['course', 'learning_resource'],
    fields: [
      { name: 'chapter_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '章节ID' },
      { name: 'chapter_name', type: 'VARCHAR(10)', isPrimary: false, isForeign: false, isNullable: false, description: '章节名称' },
      { name: 'duration', type: 'INT', isPrimary: false, isForeign: false, isNullable: true, description: '章节时长' },
      { name: 'sort', type: 'INT', isPrimary: false, isForeign: false, isNullable: false, description: '排序号' },
      { name: 'is_free', type: 'BOOLEAN', isPrimary: false, isForeign: false, isNullable: true, description: '是否免费' },
    ]
  },
  {
    id: 'learning_resource',
    name: 'learning_resource',
    nameCn: '学习资源表',
    description: '学习资源文件管理',
    recordCount: 10,
    relatedTables: ['course', 'course_chapter'],
    fields: [
      { name: 'resource_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '资源ID' },
      { name: 'resource_name', type: 'VARCHAR(10)', isPrimary: false, isForeign: false, isNullable: false, description: '资源名称' },
      { name: 'resource_type', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: false, description: '资源类型' },
      { name: 'file_size', type: 'LONGTEXT', isPrimary: false, isForeign: false, isNullable: false, description: '文件大小' },
      { name: 'upload_time', type: 'DATE', isPrimary: false, isForeign: false, isNullable: false, description: '上传时间' },
    ]
  },
  {
    id: 'task_scope',
    name: 'task_scope',
    nameCn: '参与范围表',
    description: '培训任务的参与范围定义',
    recordCount: 10,
    relatedTables: ['training_task'],
    fields: [
      { name: 'scope_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '范围ID' },
      { name: 'task_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: true, description: '任务ID' },
      { name: 'scope_type', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: true, description: '范围类型' },
      { name: 'scope_ref_id', type: 'INT', isPrimary: false, isForeign: false, isNullable: true, description: '关联ID' },
      { name: 'scope_name', type: 'VARCHAR(20)', isPrimary: false, isForeign: false, isNullable: true, description: '范围名称' },
    ]
  },
  {
    id: 'learning_checkin',
    name: 'learning_checkin',
    nameCn: '学习打卡表',
    description: '学员学习打卡记录',
    recordCount: 10,
    relatedTables: ['learning_progress'],
    fields: [
      { name: 'checkin_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '打卡ID' },
      { name: 'note_id', type: 'INT', isPrimary: false, isForeign: false, isNullable: true, description: '笔记ID' },
      { name: 'record_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: true, description: '学习进度ID' },
      { name: 'checkin_time', type: 'TIME', isPrimary: false, isForeign: false, isNullable: false, description: '打卡时间' },
      { name: 'device_info', type: 'VARCHAR(10)', isPrimary: false, isForeign: false, isNullable: true, description: '设备信息' },
    ]
  },
  {
    id: 'learning_note',
    name: 'learning_note',
    nameCn: '学习笔记表',
    description: '学员学习笔记',
    recordCount: 10,
    relatedTables: ['task_scope'],
    fields: [
      { name: 'note_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '笔记ID' },
      { name: 'scope_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: true, description: '参与范围ID' },
      { name: 'note_content', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '笔记内容' },
      { name: 'note_create_time', type: 'TIMESTAMP', isPrimary: false, isForeign: false, isNullable: false, default: 'CURRENT_TIMESTAMP', description: '创建时间' },
      { name: 'note_update_time', type: 'TIMESTAMP', isPrimary: false, isForeign: false, isNullable: false, default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', description: '更新时间' },
    ]
  },
  {
    id: 'administrator',
    name: 'administrator',
    nameCn: '管理员表',
    description: '系统管理员信息',
    recordCount: 10,
    relatedTables: ['exam', 'answer_sheet', 'exam_score'],
    fields: [
      { name: 'admin_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '管理员编号' },
      { name: 'admin_name', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: false, description: '姓名' },
      { name: 'role', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: false, description: '角色' },
      { name: 'permission_scope', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: true, description: '权限范围' },
    ]
  },
  {
    id: 'exam',
    name: 'exam',
    nameCn: '考试表',
    description: '考试基本信息',
    recordCount: 10,
    relatedTables: ['administrator', 'exam_question', 'answer_sheet', 'exam_score'],
    fields: [
      { name: 'exam_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '考试编号' },
      { name: 'exam_name', type: 'VARCHAR(50)', isPrimary: false, isForeign: false, isNullable: false, description: '考试名称' },
      { name: 'exam_desc', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '考试说明' },
      { name: 'exam_rule', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '考试规则' },
      { name: 'exam_duration', type: 'INT', isPrimary: false, isForeign: false, isNullable: false, description: '考试时长' },
      { name: 'start_time', type: 'DATETIME', isPrimary: false, isForeign: false, isNullable: false, description: '开考时间' },
      { name: 'end_time', type: 'DATETIME', isPrimary: false, isForeign: false, isNullable: false, description: '结束时间' },
      { name: 'pass_score', type: 'DECIMAL(5,2)', isPrimary: false, isForeign: false, isNullable: false, description: '及格分数' },
      { name: 'exam_status', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: false, description: '考试状态' },
      { name: 'admin_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: false, description: '管理员编号' },
    ]
  },
  {
    id: 'exam_question',
    name: 'exam_question',
    nameCn: '试题表',
    description: '考试题目信息',
    recordCount: 10,
    relatedTables: ['exam'],
    fields: [
      { name: 'question_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '试题编号' },
      { name: 'exam_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: false, description: '考试编号' },
      { name: 'question_content', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: false, description: '题目内容' },
      { name: 'question_type', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: false, description: '题型' },
      { name: 'options', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '选项' },
      { name: 'answer', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: true, description: '标准答案' },
      { name: 'score', type: 'DECIMAL(5,2)', isPrimary: false, isForeign: false, isNullable: false, description: '分值' },
    ]
  },
  {
    id: 'answer_sheet',
    name: 'answer_sheet',
    nameCn: '答卷表',
    description: '学员考试答卷',
    recordCount: 10,
    relatedTables: ['user_info', 'exam', 'administrator'],
    fields: [
      { name: 'sheet_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '答卷编号' },
      { name: 'user_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: false, description: '学员编号' },
      { name: 'exam_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: false, description: '考试编号' },
      { name: 'answer_content', type: 'TEXT', isPrimary: false, isForeign: false, isNullable: false, description: '答案内容' },
      { name: 'submit_time', type: 'DATETIME', isPrimary: false, isForeign: false, isNullable: false, description: '提交时间' },
      { name: 'review_status', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: false, description: '批阅状态' },
      { name: 'admin_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: true, description: '批阅管理员' },
    ]
  },
  {
    id: 'exam_score',
    name: 'exam_score',
    nameCn: '成绩表',
    description: '学员考试成绩',
    recordCount: 10,
    relatedTables: ['user_info', 'exam', 'administrator'],
    fields: [
      { name: 'score_id', type: 'INT', isPrimary: true, isForeign: false, isNullable: false, default: 'AUTO_INCREMENT', description: '成绩编号' },
      { name: 'user_id', type: 'VARCHAR(32)', isPrimary: false, isForeign: true, isNullable: false, description: '学员编号' },
      { name: 'exam_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: false, description: '考试编号' },
      { name: 'final_score', type: 'DECIMAL(5,2)', isPrimary: false, isForeign: false, isNullable: false, description: '最终得分' },
      { name: 'pass_status', type: 'TINYINT', isPrimary: false, isForeign: false, isNullable: false, description: '及格状态' },
      { name: 'review_time', type: 'DATETIME', isPrimary: false, isForeign: false, isNullable: false, description: '批阅时间' },
      { name: 'admin_id', type: 'INT', isPrimary: false, isForeign: true, isNullable: false, description: '批阅管理员' },
    ]
  },
];

// ==================== 10个视图 ====================
export const views: DbView[] = [
  {
    id: 'v_task_progress_overview',
    name: 'v_task_progress_overview',
    nameCn: '培训任务全局进度视图',
    description: '展示所有培训任务的参与人数、已完成人数、完成率等全局统计信息',
    endpoint: '/api/views/tasks/progress-overview',
    columns: ['任务编号', '任务名称', '要求学时', '参与总人数', '已完成人数', '任务完成率(%)'],
    relatedTables: ['training_task', 'learning_progress'],
    sql: `CREATE OR REPLACE VIEW v_task_progress_overview AS
SELECT 
  t.task_id AS '任务编号',
  t.task_name AS '任务名称',
  t.task_deadline AS '要求学时(小时)',
  COUNT(p.progress_id) AS '参与总人数',
  SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) AS '已完成人数',
  ROUND(IFNULL(SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) / COUNT(p.progress_id) * 100, 0), 2) AS '任务完成率(%)'
FROM training_task t
LEFT JOIN learning_progress p ON t.task_id = p.task_id
GROUP BY t.task_id, t.task_name, t.task_deadline;`
  },
  {
    id: 'v_delay_user_warning',
    name: 'v_delay_user_warning',
    nameCn: '未动工学员预警视图',
    description: '筛选出学习时长为0且状态未完成的学员，用于预警提醒',
    endpoint: '/api/views/tasks/delay-warnings',
    columns: ['进度精简码', '学员编号', '学员姓名', '当前岗位', '高危未动工任务', '已学时长', '任务下发时间'],
    relatedTables: ['user_info', 'learning_progress', 'training_task'],
    sql: `CREATE OR REPLACE VIEW v_delay_user_warning AS
SELECT 
  SUBSTRING(p.progress_id, 1, 8) AS '进度精简码',
  u.user_id AS '学员编号',
  u.username AS '学员姓名',
  u.position AS '当前岗位',
  t.task_name AS '高危未动工任务',
  p.duration AS '已学时长(分钟)',
  t.user_create_time AS '任务下发时间'
FROM user_info u
JOIN learning_progress p ON u.user_id = p.user_id
JOIN training_task t ON p.task_id = t.task_id
WHERE p.status = 0 AND p.duration = 0;`
  },
  {
    id: 'vw_exam_score_summary',
    name: 'vw_exam_score_summary',
    nameCn: '考试成绩汇总视图',
    description: '汇总学员考试成绩，展示学员信息、考试名称、得分、及格状态及批阅管理员',
    endpoint: '/api/views/exams/score-summary',
    columns: ['score_id', 'user_id', 'username', 'position', 'exam_id', 'exam_name', 'final_score', 'pass_result', 'review_time', 'reviewer_name'],
    relatedTables: ['exam_score', 'user_info', 'exam', 'administrator'],
    sql: `CREATE OR REPLACE VIEW vw_exam_score_summary AS
SELECT 
  s.score_id, u.user_id, u.username, u.position,
  e.exam_id, e.exam_name, s.final_score,
  CASE WHEN s.pass_status = 1 THEN '及格' ELSE '不及格' END AS pass_result,
  s.review_time, a.admin_name AS reviewer_name
FROM exam_score s
JOIN user_info u ON s.user_id = u.user_id
JOIN exam e ON s.exam_id = e.exam_id
JOIN administrator a ON s.admin_id = a.admin_id;`
  },
  {
    id: 'vw_answer_sheet_detail',
    name: 'vw_answer_sheet_detail',
    nameCn: '考试答卷详情视图',
    description: '查看学员提交的答卷内容、提交时间和批阅状态，用于答卷审阅和追踪',
    endpoint: '/api/views/exams/answer-sheets',
    columns: ['sheet_id', 'user_id', 'username', 'exam_id', 'exam_name', 'answer_content', 'submit_time', 'review_status_name', 'reviewer_name'],
    relatedTables: ['answer_sheet', 'user_info', 'exam', 'administrator'],
    sql: `CREATE OR REPLACE VIEW vw_answer_sheet_detail AS
SELECT 
  sh.sheet_id, u.user_id, u.username,
  e.exam_id, e.exam_name, sh.answer_content, sh.submit_time,
  CASE WHEN sh.review_status = 1 THEN '已批阅' ELSE '未批阅' END AS review_status_name,
  a.admin_name AS reviewer_name
FROM answer_sheet sh
JOIN user_info u ON sh.user_id = u.user_id
JOIN exam e ON sh.exam_id = e.exam_id
LEFT JOIN administrator a ON sh.admin_id = a.admin_id;`
  },
  {
    id: 'v_全体学员学习考试统计',
    name: 'v_全体学员学习考试统计',
    nameCn: '全体学员学习考试统计视图',
    description: '全局统计学员总数、活跃学习人数、考试及格率、综合评级等核心指标',
    endpoint: '/api/views/stats/learning-exam',
    columns: ['学员总数', '活跃学习人数', '学习活跃率', '完成任务人数', '总学习记录数', '人均学习时长', '总考试人次', '及格人次', '考试及格率', '全体平均分', '综合评级', '统计时间'],
    relatedTables: ['user_info', 'learning_progress', 'exam_score'],
    sql: `CREATE OR REPLACE VIEW v_全体学员学习考试统计 AS
SELECT 
  COUNT(DISTINCT u.user_id) AS 学员总数,
  COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) AS 活跃学习人数,
  ROUND(COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) * 100.0 / NULLIF(COUNT(DISTINCT u.user_id), 0), 2) AS 学习活跃率,
  -- ... 综合评级逻辑 ...
  NOW() AS 统计时间
FROM user_info u
LEFT JOIN learning_progress lp ON u.user_id = lp.user_id
LEFT JOIN exam_score es ON u.user_id = es.user_id;`
  },
  {
    id: 'v_employee_anomaly_behavior',
    name: 'v_employee_anomaly_behavior',
    nameCn: '员工异常行为视图',
    description: '识别员工异常学习行为（未学先考、长期休眠、疑似刷课时、连续不及格等）',
    endpoint: '/api/views/stats/employee-anomalies',
    columns: ['user_id', 'username', '所属部门', '参与任务数', '总学习时长_小时', '学习天数', '最近学习日期', '距最近学习天数', '参加考试数', '平均成绩', '最低分', '最高分', '打卡次数', '异常标签', '风险等级', '统计时间'],
    relatedTables: ['user_info', 'learning_progress', 'exam_score', 'learning_checkin'],
    sql: `CREATE OR REPLACE VIEW v_employee_anomaly_behavior AS
SELECT 
  ui.user_id, ui.username, ui.position AS 所属部门,
  COUNT(DISTINCT lp.task_id) AS 参与任务数,
  ROUND(COALESCE(SUM(lp.duration), 0) / 60.0, 2) AS 总学习时长_小时,
  -- ... 异常标签和风险等级判断逻辑 ...
  NOW() AS 统计时间
FROM user_info ui
LEFT JOIN learning_progress lp ON ui.user_id = lp.user_id
LEFT JOIN exam_score es ON ui.user_id = es.user_id
LEFT JOIN learning_checkin lc ON lp.progress_id = lc.record_id
GROUP BY ui.user_id, ui.username, ui.position;`
  },
  {
    id: 'v_user_safe',
    name: 'v_user_safe',
    nameCn: '脱敏用户信息视图',
    description: '对用户密码、手机号等隐私数据进行脱敏处理，面向普通员工展示',
    endpoint: '/api/views/users/safe',
    columns: ['user_id', 'username', 'user_pwd', 'contact', '岗位'],
    relatedTables: ['user_info'],
    sql: `CREATE OR REPLACE VIEW v_user_safe AS
SELECT 
  user_id, username,
  '******' AS user_pwd,
  CONCAT(SUBSTRING(contact, 1, 3), '****', SUBSTRING(contact, 8, 4)) AS contact,
  position AS 岗位
FROM user_info;`
  },
  {
    id: 'v_lecturer_student_notes',
    name: 'v_lecturer_student_notes',
    nameCn: '讲师学员笔记视图',
    description: '封装学习笔记核心业务字段，统一笔记数据展示格式，配合权限控制',
    endpoint: '/api/views/notes/lecturer-student',
    columns: ['note_id', 'scope_id', 'note_content', 'note_create_time', 'note_update_time'],
    relatedTables: ['learning_note'],
    sql: `CREATE OR REPLACE VIEW v_lecturer_student_notes AS
SELECT note_id, scope_id, note_content, note_create_time, note_update_time
FROM learning_note;`
  },
  {
    id: 'view_course_category_stats',
    name: 'view_course_category_stats',
    nameCn: '课程分类统计视图',
    description: '统计每个分类下的课程数量、总时长、资源大小',
    endpoint: '/api/views/courses/category-stats',
    columns: ['category_id', 'category_name', 'total_courses', 'total_duration', 'total_resource_size'],
    relatedTables: ['course_category', 'course', 'course_chapter', 'learning_resource'],
    sql: `CREATE VIEW view_course_category_stats AS
SELECT 
  cc.category_id, cc.category_name,
  COUNT(DISTINCT c.course_id) AS total_courses,
  SUM(IFNULL(ch.duration, 0)) AS total_duration,
  SUM(IFNULL(lr.file_size, 0)) AS total_resource_size
FROM course_category cc
LEFT JOIN course c ON c.category_id = cc.category_id
LEFT JOIN course_chapter ch ON ch.course_id = c.course_id
LEFT JOIN learning_resource lr ON lr.course_id = c.course_id
GROUP BY cc.category_id, cc.category_name;`
  },
  {
    id: 'v_course_list_extended',
    name: 'v_course_list_extended',
    nameCn: '课程扩展信息视图',
    description: '展示课程的完整信息，包含分类名称和讲师姓名',
    endpoint: '/api/views/courses/list-extended',
    columns: ['course_id', 'course_name', 'course_code', 'category_name', 'lecturer_name', 'course_status', 'course_desc'],
    relatedTables: ['course', 'course_category', 'lecturer'],
    sql: `CREATE OR REPLACE VIEW v_course_list_extended AS
SELECT 
  c.course_id, c.course_name, c.course_code,
  cc.category_name, l.lecturer_name,
  c.course_status, c.course_desc
FROM course c
LEFT JOIN course_category cc ON c.course_id = cc.category_id
LEFT JOIN lecturer l ON c.course_id = l.lecturer_id;`
  },
];

// ==================== 10个存储过程 ====================
export const procedures: DbProcedure[] = [
  {
    id: 'sp_batch_assign_task',
    name: 'sp_batch_assign_task',
    nameCn: '批量派发任务',
    description: '按岗位批量创建培训任务并为该岗位所有学员初始化学习进度',
    endpoint: '/api/procedures/tasks/batch-assign',
    method: 'POST',
    relatedTables: ['training_task', 'learning_progress', 'user_info'],
    params: [
      { name: 'p_task_id', type: 'VARCHAR(32)', mode: 'IN', description: '任务编号', required: true },
      { name: 'p_task_name', type: 'VARCHAR(128)', mode: 'IN', description: '任务名称', required: true },
      { name: 'p_creator_id', type: 'VARCHAR(32)', mode: 'IN', description: '创建人编号', required: true },
      { name: 'p_target_position', type: 'VARCHAR(64)', mode: 'IN', description: '目标岗位', required: true },
      { name: 'p_deadline', type: 'DECIMAL(5,2)', mode: 'IN', description: '截止时间（小时）', required: true },
      { name: 'p_message', type: 'VARCHAR(100)', mode: 'OUT', description: '操作结果消息' },
    ],
    sql: `CREATE PROCEDURE sp_batch_assign_task(
  IN p_task_id VARCHAR(32), IN p_task_name VARCHAR(128),
  IN p_creator_id VARCHAR(32), IN p_target_position VARCHAR(64),
  IN p_deadline DECIMAL(5,2), OUT p_message VARCHAR(100)
)
BEGIN
  DECLARE v_user_count INT DEFAULT 0;
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN ROLLBACK; SET p_message = '执行失败：数据库异常，事务已回滚'; END;
  START TRANSACTION;
  SELECT COUNT(*) INTO v_user_count FROM user_info 
  WHERE position = p_target_position AND role = '学员';
  IF v_user_count = 0 THEN
    SET p_message = CONCAT('派发取消：未找到岗位[', p_target_position, ']的学员');
    ROLLBACK;
  ELSE
    INSERT INTO training_task VALUES (p_task_id, p_creator_id, p_task_name, '岗位', p_deadline, 1);
    INSERT INTO learning_progress(progress_id, user_id, task_id, duration, deadline, status)
    SELECT REPLACE(UUID(), '-', ''), user_id, p_task_id, 0, p_deadline, 0
    FROM user_info WHERE position = p_target_position AND role = '学员';
    COMMIT;
    SET p_message = CONCAT('派发成功！已初始化', v_user_count, '名学员的进度档案');
  END IF;
END;`
  },
  {
    id: 'sp_update_task_time',
    name: 'sp_update_task_time',
    nameCn: '统一延期调整',
    description: '修改培训任务截止时间并级联更新所有关联的学习进度deadline',
    endpoint: '/api/procedures/tasks/update-time',
    method: 'POST',
    relatedTables: ['training_task', 'learning_progress'],
    params: [
      { name: 'p_task_id', type: 'VARCHAR(32)', mode: 'IN', description: '任务编号', required: true },
      { name: 'p_new_deadline', type: 'DECIMAL(5,2)', mode: 'IN', description: '新的截止时间', required: true },
      { name: 'p_result_msg', type: 'VARCHAR(100)', mode: 'OUT', description: '操作结果' },
    ],
    sql: `CREATE PROCEDURE sp_update_task_time(
  IN p_task_id VARCHAR(32), IN p_new_deadline DECIMAL(5,2), OUT p_result_msg VARCHAR(100)
)
BEGIN
  DECLARE v_task_exists INT DEFAULT 0;
  -- ... 事务处理，级联更新 ...
END;`
  },
  {
    id: 'sp_course_offline',
    name: 'sp_course_offline',
    nameCn: '课程下架处理',
    description: '课程下架时级联隐藏章节和学习资源',
    endpoint: '/api/procedures/courses/{courseId}/offline',
    method: 'POST',
    relatedTables: ['course', 'course_chapter', 'learning_resource'],
    params: [
      { name: 'p_course_id', type: 'INT', mode: 'IN', description: '课程ID', required: true },
    ],
    sql: `CREATE PROCEDURE sp_course_offline(IN p_course_id INT)
BEGIN
  -- 锁定课程 -> 循环隐藏章节 -> 隐藏学习资源 -> 保留学习进度
END;`
  },
  {
    id: 'auto_submit_exam',
    name: 'auto_submit_exam',
    nameCn: '自动交卷',
    description: '根据考试编号和用户编号，匹配答案计算客观题得分并写入临时结果表',
    endpoint: '/api/procedures/exams/auto-submit',
    method: 'POST',
    relatedTables: ['exam', 'exam_question', 'answer_sheet', 'exam_temp_result'],
    params: [
      { name: 'p_exam_id', type: 'INT', mode: 'IN', description: '考试编号', required: true },
      { name: 'p_user_id', type: 'VARCHAR(32)', mode: 'IN', description: '学员编号', required: true },
    ],
    sql: `CREATE PROCEDURE auto_submit_exam(IN p_exam_id INT, IN p_user_id VARCHAR(32))
BEGIN
  -- 计算客观题得分 -> 写入临时结果表 -> 更新批阅状态
END;`
  },
  {
    id: 'exam_pass_rate',
    name: 'exam_pass_rate',
    nameCn: '考试通过率统计',
    description: '统计指定考试的参考人数、通过人数和通过率',
    endpoint: '/api/procedures/exams/{examId}/pass-rate',
    method: 'GET',
    relatedTables: ['exam_score', 'exam'],
    params: [
      { name: 'p_exam_id', type: 'INT', mode: 'IN', description: '考试编号', required: true },
    ],
    sql: `CREATE PROCEDURE exam_pass_rate(IN p_exam_id INT)
BEGIN
  SELECT e.exam_id, e.exam_name, COUNT(s.score_id) AS total_students,
    SUM(s.pass_status) AS pass_students,
    ROUND(SUM(s.pass_status) * 100.0 / COUNT(s.score_id), 2) AS pass_rate_percent
  FROM exam_score s JOIN exam e ON s.exam_id = e.exam_id
  WHERE s.exam_id = p_exam_id GROUP BY e.exam_id, e.exam_name;
END;`
  },
  {
    id: 'sp_export_anomaly_employees',
    name: 'sp_export_anomaly_employees',
    nameCn: '导出异常行为员工报表',
    description: '按风险等级、部门、时间范围筛选导出异常行为员工数据',
    endpoint: '/api/procedures/stats/export-anomaly-employees',
    method: 'GET',
    relatedTables: ['user_info', 'learning_progress', 'exam_score'],
    params: [
      { name: 'p_risk_level', type: 'VARCHAR(10)', mode: 'IN', description: '风险等级（高危/中危/低危）' },
      { name: 'p_department', type: 'VARCHAR(64)', mode: 'IN', description: '部门名称' },
      { name: 'p_start_date', type: 'DATE', mode: 'IN', description: '开始日期' },
      { name: 'p_end_date', type: 'DATE', mode: 'IN', description: '结束日期' },
    ],
    sql: `-- 存储过程：导出异常行为员工报表
CREATE PROCEDURE sp_export_anomaly_employees(...)`
  },
  {
    id: 'sp_archive_monthly_stats',
    name: 'sp_archive_monthly_stats',
    nameCn: '月度统计归档',
    description: '自动归档学习考试综合统计月报到归档表',
    endpoint: '/api/procedures/stats/archive-monthly/{statMonth}',
    method: 'POST',
    relatedTables: ['monthly_stats_archive', 'user_info', 'learning_progress', 'exam_score'],
    params: [
      { name: 'p_stat_month', type: 'VARCHAR(7)', mode: 'IN', description: '统计月份（YYYY-MM）', required: true },
    ],
    sql: `CREATE PROCEDURE sp_archive_monthly_stats(IN p_stat_month VARCHAR(7))
BEGIN
  -- 查询统计数据 -> 插入归档表
END;`
  },
  {
    id: 'sp_emp_update_note',
    name: 'sp_emp_update_note',
    nameCn: '员工修改笔记',
    description: '员工更新笔记内容并自动记录审计日志',
    endpoint: '/api/procedures/notes/update',
    method: 'POST',
    relatedTables: ['learning_note', 'sys_role_audit_log'],
    params: [
      { name: 'p_note_id', type: 'INT', mode: 'IN', description: '笔记ID', required: true },
      { name: 'p_new_content', type: 'TEXT', mode: 'IN', description: '新内容', required: true },
    ],
    sql: `CREATE PROCEDURE sp_emp_update_note(IN p_note_id INT, IN p_new_content TEXT)
BEGIN
  UPDATE learning_note SET note_content = p_new_content, note_update_time = NOW() WHERE note_id = p_note_id;
  INSERT INTO sys_role_audit_log (...) VALUES (...);
END;`
  },
  {
    id: 'sp_admin_get_all_notes',
    name: 'sp_admin_get_all_notes',
    nameCn: 'DBA查询所有笔记',
    description: '面向DBA运维角色，一键查询平台所有学员的学习笔记数据',
    endpoint: '/api/procedures/notes/admin-all',
    method: 'GET',
    relatedTables: ['learning_note'],
    params: [],
    sql: `CREATE PROCEDURE sp_admin_get_all_notes()
BEGIN
  SELECT note_id, scope_id, note_content, note_create_time, note_update_time FROM learning_note;
END;`
  },
  {
    id: 'sp_learning_checkin',
    name: 'sp_learning_checkin',
    nameCn: '学习打卡处理',
    description: '处理学员打卡，联动更新学习进度，包含防作弊检测',
    endpoint: '/api/procedures/checkin/process',
    method: 'POST',
    relatedTables: ['learning_checkin', 'learning_progress'],
    params: [
      { name: 'p_record_id', type: 'VARCHAR(32)', mode: 'IN', description: '学习进度ID', required: true },
      { name: 'p_note_id', type: 'INT', mode: 'IN', description: '笔记ID' },
      { name: 'p_device_info', type: 'VARCHAR(10)', mode: 'IN', description: '设备信息' },
    ],
    sql: `-- 打卡处理逻辑，联动触发器更新进度`
  },
];

// ==================== 10个触发器 ====================
export const triggers: DbTrigger[] = [
  {
    id: 'trg_update_progress_after_checkin',
    name: 'trg_update_progress_after_checkin',
    nameCn: '打卡联动进度更新',
    description: '学员打卡后自动更新学习进度时长和完成状态',
    event: 'INSERT',
    timing: 'AFTER',
    table: 'learning_checkin',
    relatedTables: ['learning_checkin', 'learning_progress'],
    sql: `CREATE TRIGGER trg_update_progress_after_checkin
AFTER INSERT ON learning_checkin
FOR EACH ROW
BEGIN
  DECLARE v_current_duration INT;
  DECLARE v_target_deadline DECIMAL(5,2);
  DECLARE v_add_duration INT DEFAULT 30;
  SELECT duration, deadline INTO v_current_duration, v_target_deadline
  FROM learning_progress WHERE progress_id = NEW.record_id;
  IF (v_current_duration + v_add_duration) >= (v_target_deadline * 60) THEN
    UPDATE learning_progress SET duration = duration + v_add_duration, status = 1
    WHERE progress_id = NEW.record_id;
  ELSE
    UPDATE learning_progress SET duration = duration + v_add_duration
    WHERE progress_id = NEW.record_id;
  END IF;
END;`
  },
  {
    id: 'trg_prevent_cheating_checkin',
    name: 'trg_prevent_cheating_checkin',
    nameCn: '打卡防作弊校验',
    description: '检测两次打卡间隔是否小于5分钟，防止刷课行为',
    event: 'INSERT',
    timing: 'BEFORE',
    table: 'learning_checkin',
    relatedTables: ['learning_checkin'],
    sql: `CREATE TRIGGER trg_prevent_cheating_checkin
BEFORE INSERT ON learning_checkin
FOR EACH ROW
BEGIN
  DECLARE v_last_checkin_time TIME;
  DECLARE v_time_diff INT;
  SELECT checkin_time INTO v_last_checkin_time FROM learning_checkin
  WHERE record_id = NEW.record_id ORDER BY checkin_id DESC LIMIT 1;
  IF v_last_checkin_time IS NOT NULL THEN
    SET v_time_diff = TIME_TO_SEC(TIMEDIFF(NEW.checkin_time, v_last_checkin_time));
    IF v_time_diff < 300 AND v_time_diff >= 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '打卡拒绝：两次打卡间隔不得少于5分钟！';
    END IF;
  END IF;
END;`
  },
  {
    id: 'trg_prevent_answer_update',
    name: 'trg_prevent_answer_update',
    nameCn: '防止修改标准答案',
    description: '考试进行中或已结束时，禁止修改试题标准答案',
    event: 'UPDATE',
    timing: 'BEFORE',
    table: 'exam_question',
    relatedTables: ['exam_question', 'exam'],
    sql: `CREATE TRIGGER trg_prevent_answer_update
BEFORE UPDATE ON exam_question
FOR EACH ROW
BEGIN
  DECLARE v_status TINYINT;
  SELECT exam_status INTO v_status FROM exam WHERE exam_id = OLD.exam_id;
  IF v_status IN (1, 2) AND OLD.answer <> NEW.answer THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '考试进行中或已结束，禁止修改试题标准答案';
  END IF;
END;`
  },
  {
    id: 'trg_exam_score_review_time',
    name: 'trg_exam_score_review_time',
    nameCn: '成绩批阅时间自动填充',
    description: '新增成绩记录时，如果review_time为空则自动写入当前时间',
    event: 'INSERT',
    timing: 'BEFORE',
    table: 'exam_score',
    relatedTables: ['exam_score'],
    sql: `CREATE TRIGGER trg_exam_score_review_time
BEFORE INSERT ON exam_score
FOR EACH ROW
BEGIN
  IF NEW.review_time IS NULL THEN
    SET NEW.review_time = NOW();
  END IF;
END;`
  },
  {
    id: 'trg_exam_score_after_insert',
    name: 'trg_exam_score_after_insert',
    nameCn: '不及格自动记录日志',
    description: '成绩录入后，如果不及格则自动记录到异常日志表',
    event: 'INSERT',
    timing: 'AFTER',
    table: 'exam_score',
    relatedTables: ['exam_score', 'exam_fail_log'],
    sql: `CREATE TRIGGER trg_exam_score_after_insert
AFTER INSERT ON exam_score
FOR EACH ROW
BEGIN
  DECLARE v_fail_count INT;
  IF NEW.final_score < 60 THEN
    SELECT COUNT(*) INTO v_fail_count FROM exam_score
    WHERE user_id = NEW.user_id AND final_score < 60;
    INSERT INTO exam_fail_log (user_id, exam_id, fail_score, fail_count, log_time)
    VALUES (NEW.user_id, NEW.exam_id, NEW.final_score, v_fail_count, NOW());
  END IF;
END;`
  },
  {
    id: 'trg_learning_progress_after_update',
    name: 'trg_learning_progress_after_update',
    nameCn: '学习进度完成联动',
    description: '学习进度状态变为已完成时，联动更新培训任务状态',
    event: 'UPDATE',
    timing: 'AFTER',
    table: 'learning_progress',
    relatedTables: ['learning_progress', 'training_task'],
    sql: `CREATE TRIGGER trg_learning_progress_after_update
AFTER UPDATE ON learning_progress
FOR EACH ROW
BEGIN
  DECLARE v_total_count INT;
  DECLARE v_complete_count INT;
  IF NEW.status = 2 AND (OLD.status != 2 OR OLD.status IS NULL) THEN
    -- 统计并更新培训任务状态
  END IF;
END;`
  },
  {
    id: 'tri_user_role_check',
    name: 'tri_user_role_check',
    nameCn: '用户角色非法修改拦截',
    description: '拦截普通用户私自升级为超级管理员的非法操作',
    event: 'UPDATE',
    timing: 'BEFORE',
    table: 'user_info',
    relatedTables: ['user_info', 'sys_role_audit_log'],
    sql: `CREATE TRIGGER tri_user_role_check
BEFORE UPDATE ON user_info
FOR EACH ROW
BEGIN
  IF OLD.role NOT IN ('超级管理员', '系统管理员') AND NEW.role IN ('超级管理员', '系统管理员') THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '非法操作：禁止私自将角色修改为管理员';
  ELSE
    INSERT INTO sys_role_audit_log (...) VALUES (...);
  END IF;
END;`
  },
  {
    id: 'tri_admin_role_check',
    name: 'tri_admin_role_check',
    nameCn: '管理员升级拦截',
    description: '禁止普通管理员私自升级为超级管理员',
    event: 'UPDATE',
    timing: 'BEFORE',
    table: 'administrator',
    relatedTables: ['administrator', 'sys_role_audit_log'],
    sql: `CREATE TRIGGER tri_admin_role_check
BEFORE UPDATE ON administrator
FOR EACH ROW
BEGIN
  IF OLD.role != '超级管理员' AND NEW.role = '超级管理员' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = '非法操作：普通管理员无法私自升级超级管理员';
  ELSE
    INSERT INTO sys_role_audit_log (...) VALUES (...);
  END IF;
END;`
  },
  {
    id: 'trg_chapter_insert',
    name: 'trg_chapter_insert',
    nameCn: '章节新增更新总学时',
    description: '新增课程章节时自动更新课程总学时',
    event: 'INSERT',
    timing: 'AFTER',
    table: 'course_chapter',
    relatedTables: ['course_chapter', 'course'],
    sql: `CREATE TRIGGER trg_chapter_insert
AFTER INSERT ON course_chapter
FOR EACH ROW
BEGIN
  UPDATE course c INNER JOIN (
    SELECT course_id, SUM(duration) AS total_duration FROM course_chapter GROUP BY course_id
  ) AS t ON c.course_id = t.course_id
  SET c.total_duration = t.total_duration;
END;`
  },
  {
    id: 'trg_course_status_change',
    name: 'trg_course_status_change',
    nameCn: '课程状态变更联动',
    description: '课程上架/下架时联动更新章节和学习资源的状态',
    event: 'UPDATE',
    timing: 'AFTER',
    table: 'course',
    relatedTables: ['course', 'course_chapter', 'learning_resource'],
    sql: `CREATE TRIGGER trg_course_status_change
AFTER UPDATE ON course
FOR EACH ROW
BEGIN
  IF OLD.course_status <> NEW.course_status THEN
    IF NEW.course_status = 0 THEN
      UPDATE course_chapter SET is_free = 0 WHERE course_id = NEW.course_id;
      UPDATE learning_resource SET resource_type = 0 WHERE course_id = NEW.course_id;
    ELSEIF NEW.course_status = 1 THEN
      UPDATE course_chapter SET is_free = 1 WHERE course_id = NEW.course_id;
      UPDATE learning_resource SET resource_type = 1 WHERE course_id = NEW.course_id;
    END IF;
  END IF;
END;`
  },
];

// 统计信息
export const dbStats = {
  totalTables: tables.length,
  totalViews: views.length,
  totalProcedures: procedures.length,
  totalTriggers: triggers.length,
  totalObjects: tables.length + views.length + procedures.length + triggers.length,
  totalFields: tables.reduce((acc, t) => acc + t.fields.length, 0),
  totalIndexes: 16, // 从文档中统计
  totalRelations: tables.reduce((acc, t) => acc + t.relatedTables.length, 0),
};
