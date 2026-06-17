export const seedDatabase = {
  user_info: [
    { user_id: 'U001', username: '李勇', password: '123456', role: '学员', position: '安全工程师', learning_status: 1, avatar: '', contact: '13500002222', user_create_time: '2026-01-08 09:30:00' },
    { user_id: 'U002', username: '刘诗晨', password: '123456', role: '学员', position: '合规专员', learning_status: 1, avatar: '', contact: '13500003333', user_create_time: '2026-01-12 10:20:00' },
    { user_id: 'U003', username: '王一鸣', password: '123456', role: '学员', position: 'Java开发', learning_status: 1, avatar: '', contact: '13500004444', user_create_time: '2026-02-03 14:10:00' },
    { user_id: 'U004', username: '周雪', password: '123456', role: '学员', position: '产品经理', learning_status: 1, avatar: '', contact: '13600005555', user_create_time: '2026-02-15 16:40:00' },
    { user_id: 'U005', username: '赵凯', password: '123456', role: '讲师', position: '技术讲师', learning_status: 1, avatar: '', contact: '13600006666', user_create_time: '2026-03-01 11:00:00' },
    { user_id: 'U006', username: '贾向东', password: '123456', role: '学员', position: '运维工程师', learning_status: 0, avatar: '', contact: '13700007777', user_create_time: '2026-03-18 08:50:00' },
    { user_id: 'U007', username: '陈宝玉', password: '123456', role: '学员', position: 'UI设计师', learning_status: 1, avatar: '', contact: '13700008888', user_create_time: '2026-04-02 13:25:00' },
    { user_id: 'U008', username: '孙悦', password: '123456', role: '学员', position: '安全工程师', learning_status: 1, avatar: '', contact: '13800009999', user_create_time: '2026-04-20 15:15:00' },
  ],
  training_task: [
    { task_id: 'T001', user_id: 'A001', creator_id: 'A001', task_name: '网络安全合规必备意识培训', task_scope_type: '岗位', target_position: '全员', task_deadline: 24, assigned_count: 7, completed_count: 4, learning_status: 1, user_create_time: '2026-05-01' },
    { task_id: 'T002', user_id: 'A001', creator_id: 'A001', task_name: '高效产品设计规范', task_scope_type: '岗位', target_position: '产品经理', task_deadline: 12, assigned_count: 1, completed_count: 1, learning_status: 1, user_create_time: '2026-05-06' },
    { task_id: 'T003', user_id: 'A002', creator_id: 'A002', task_name: '前端现代框架工程化实战', task_scope_type: '岗位', target_position: 'Java开发', task_deadline: 48, assigned_count: 1, completed_count: 0, learning_status: 1, user_create_time: '2026-05-10' },
    { task_id: 'T004', user_id: 'A001', creator_id: 'A001', task_name: 'Linux内核安全运维基线', task_scope_type: '岗位', target_position: '运维工程师', task_deadline: 20, assigned_count: 1, completed_count: 0, learning_status: 0, user_create_time: '2026-05-15' },
  ],
  learning_progress: [
    { progress_id: 'P001', user_id: 'U001', task_id: 'T001', duration: 1440, deadline: 24, status: 2, create_time: '2026-05-01 09:00:00' },
    { progress_id: 'P002', user_id: 'U002', task_id: 'T001', duration: 1440, deadline: 24, status: 2, create_time: '2026-05-01 09:00:00' },
    { progress_id: 'P003', user_id: 'U003', task_id: 'T001', duration: 960, deadline: 24, status: 1, create_time: '2026-05-01 09:00:00' },
    { progress_id: 'P004', user_id: 'U004', task_id: 'T001', duration: 1440, deadline: 24, status: 2, create_time: '2026-05-01 09:00:00' },
    { progress_id: 'P005', user_id: 'U006', task_id: 'T004', duration: 0, deadline: 20, status: 0, create_time: '2026-05-15 09:00:00' },
    { progress_id: 'P006', user_id: 'U007', task_id: 'T001', duration: 15, deadline: 24, status: 0, create_time: '2026-05-01 09:00:00' },
    { progress_id: 'P007', user_id: 'U008', task_id: 'T001', duration: 1440, deadline: 24, status: 2, create_time: '2026-05-01 09:00:00' },
    { progress_id: 'P008', user_id: 'U004', task_id: 'T002', duration: 720, deadline: 12, status: 2, create_time: '2026-05-06 09:00:00' },
    { progress_id: 'P009', user_id: 'U003', task_id: 'T003', duration: 120, deadline: 48, status: 1, create_time: '2026-05-10 09:00:00' },
  ],
  lecturer: [
    { lecturer_id: 1, lecturer_name: '赵凯', title: '高级技术讲师', department: '研发中心', phone: '13600006666', intro: '擅长前端工程化与软件安全。' },
    { lecturer_id: 2, lecturer_name: '林妍', title: '产品专家', department: '产品中心', phone: '13900001234', intro: '企业产品设计与用户研究专家。' },
    { lecturer_id: 3, lecturer_name: '韩松', title: '运维专家', department: '基础架构部', phone: '13900005678', intro: 'Linux 与云平台安全运维。' },
  ],
  course_category: [
    { category_id: 1, category_name: '安全合规', level: 1, sort: 1, create_time: '2026-01-01' },
    { category_id: 2, category_name: '产品设计', level: 1, sort: 2, create_time: '2026-01-01' },
    { category_id: 3, category_name: '研发技术', level: 1, sort: 3, create_time: '2026-01-01' },
    { category_id: 4, category_name: '运维管理', level: 1, sort: 4, create_time: '2026-01-01' },
    { category_id: 5, category_name: '数据能力', level: 1, sort: 5, create_time: '2026-01-01' },
    { category_id: 6, category_name: '通用管理', level: 1, sort: 6, create_time: '2026-01-01' },
  ],
  course: [
    { course_id: 1, category_id: 1, lecturer_id: 1, course_name: '网络安全合规必修课', course_code: 'SEC-101', category_name: '安全合规', lecturer_name: '赵凯', course_status: 1, course_desc: '企业信息安全、数据保护与合规基础。' },
    { course_id: 2, category_id: 2, lecturer_id: 2, course_name: '高效产品设计规范', course_code: 'PM-204', category_name: '产品设计', lecturer_name: '林妍', course_status: 1, course_desc: '从需求洞察到交互验收的完整方法。' },
    { course_id: 3, category_id: 3, lecturer_id: 1, course_name: 'React 工程化实战', course_code: 'FE-305', category_name: '研发技术', lecturer_name: '赵凯', course_status: 1, course_desc: '现代前端工程、组件设计与质量保障。' },
    { course_id: 4, category_id: 4, lecturer_id: 3, course_name: 'Linux 安全运维基线', course_code: 'OPS-210', category_name: '运维管理', lecturer_name: '韩松', course_status: 0, course_desc: 'Linux 主机加固与日常巡检规范。' },
    { course_id: 5, category_id: 5, lecturer_id: 1, course_name: '企业数据分析入门', course_code: 'DATA-110', category_name: '数据能力', lecturer_name: '何琳', course_status: 1, course_desc: '业务指标、数据清洗和可视化基础。' },
    { course_id: 6, category_id: 6, lecturer_id: 2, course_name: '管理者沟通训练营', course_code: 'MGT-201', category_name: '通用管理', lecturer_name: '吴敏', course_status: 1, course_desc: '目标对齐、反馈与跨团队沟通。' },
  ],
  course_chapter: [
    { chapter_id: 1, course_id: 1, chapter_name: '数据安全基础', duration: 45, sort: 1, is_free: 1 },
    { chapter_id: 2, course_id: 1, chapter_name: '企业合规要求', duration: 60, sort: 2, is_free: 1 },
    { chapter_id: 3, course_id: 2, chapter_name: '需求洞察', duration: 50, sort: 1, is_free: 1 },
    { chapter_id: 4, course_id: 3, chapter_name: '组件设计', duration: 90, sort: 1, is_free: 1 },
    { chapter_id: 5, course_id: 4, chapter_name: '主机加固', duration: 80, sort: 1, is_free: 0 },
  ],
  learning_resource: [
    { resource_id: 1, course_id: 1, chapter_id: 1, resource_name: '数据安全讲义', resource_type: 1, resource_status: 1, file_size: '3.2MB', upload_time: '2026-01-10' },
    { resource_id: 2, course_id: 1, chapter_id: 2, resource_name: '合规案例视频', resource_type: 2, resource_status: 1, file_size: '128MB', upload_time: '2026-01-11' },
    { resource_id: 3, course_id: 3, chapter_id: 4, resource_name: '工程化示例代码', resource_type: 3, resource_status: 1, file_size: '1.8MB', upload_time: '2026-03-03' },
    { resource_id: 4, course_id: 4, chapter_id: 5, resource_name: 'Linux 基线清单', resource_type: 1, resource_status: 0, file_size: '680KB', upload_time: '2026-03-12' },
  ],
  task_scope: [
    { scope_id: 1, task_id: 'T001', scope_type: 1, scope_ref_id: 0, scope_name: '全员' },
    { scope_id: 2, task_id: 'T002', scope_type: 2, scope_ref_id: 0, scope_name: '产品经理' },
    { scope_id: 3, task_id: 'T003', scope_type: 2, scope_ref_id: 0, scope_name: 'Java开发' },
    { scope_id: 4, task_id: 'T004', scope_type: 2, scope_ref_id: 0, scope_name: '运维工程师' },
  ],
  learning_checkin: [
    { checkin_id: 1, note_id: 1, record_id: 'P001', checkin_time: '2026-06-10 09:30:00', device_info: 'PC-Windows' },
    { checkin_id: 2, note_id: 2, record_id: 'P003', checkin_time: '2026-06-11 14:20:00', device_info: 'Mac' },
    { checkin_id: 3, note_id: null, record_id: 'P008', checkin_time: '2026-06-12 10:10:00', device_info: 'Mobile' },
  ],
  learning_note: [
    { note_id: 1, scope_id: 1, user_id: 'U001', lecturer_id: 1, course_id: 1, note_content: '数据分级分类是安全治理的基础。', note_create_time: '2026-06-10 09:30:00', note_update_time: '2026-06-10 09:30:00' },
    { note_id: 2, scope_id: 3, user_id: 'U003', lecturer_id: 1, course_id: 3, note_content: '组件边界与状态管理需要保持单向数据流。', note_create_time: '2026-06-11 14:20:00', note_update_time: '2026-06-11 14:20:00' },
  ],
  administrator: [
    { admin_id: 1, admin_code: 'A001', admin_name: '系统管理员', username: 'admin', password: '123456', role: '平台管理员', permission_scope: '全部' },
    { admin_id: 2, admin_code: 'A002', admin_name: '内容管理员', username: 'content', password: '123456', role: '内容管理员', permission_scope: '课程与任务' },
  ],
  exam: [
    { exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', exam_desc: '安全合规必修课结业考试', exam_rule: '闭卷，禁止切屏', exam_duration: 90, start_time: '2026-06-15 09:00', end_time: '2026-06-15 10:30', pass_score: 60, exam_status: 1, admin_id: 1 },
    { exam_id: 2, exam_name: '产品经理核心交互设计能力认证', exam_desc: '产品与交互设计综合测评', exam_rule: '在线作答', exam_duration: 120, start_time: '2026-06-16 14:00', end_time: '2026-06-16 16:00', pass_score: 70, exam_status: 1, admin_id: 1 },
    { exam_id: 3, exam_name: 'React 工程化阶段测试', exam_desc: '前端工程能力阶段测试', exam_rule: '在线作答', exam_duration: 60, start_time: '2026-06-22 10:00', end_time: '2026-06-22 11:00', pass_score: 60, exam_status: 0, admin_id: 1 },
  ],
  exam_question: [
    { question_id: 1, exam_id: 1, question_content: '以下哪项属于敏感个人信息？', question_type: 1, options: 'A.姓名 B.生物识别 C.部门 D.工号', answer: 'B', score: 25 },
    { question_id: 2, exam_id: 1, question_content: '最小权限原则的核心是什么？', question_type: 1, options: 'A.按需授权 B.永久授权 C.共享账号 D.关闭审计', answer: 'A', score: 25 },
    { question_id: 3, exam_id: 2, question_content: '用户旅程图主要用于？', question_type: 1, options: 'A.数据库建模 B.理解体验路径 C.服务部署 D.代码审查', answer: 'B', score: 30 },
  ],
  answer_sheet: [
    { sheet_id: 101, user_id: 'U001', exam_id: 1, answer_content: '1:B, 2:A', submit_time: '2026-06-15 10:18:00', review_status: 1, admin_id: 1 },
    { sheet_id: 102, user_id: 'U002', exam_id: 1, answer_content: '1:B, 2:A', submit_time: '2026-06-15 10:22:00', review_status: 1, admin_id: 1 },
    { sheet_id: 103, user_id: 'U003', exam_id: 1, answer_content: '1:A, 2:A', submit_time: '2026-06-15 10:25:00', review_status: 1, admin_id: 1 },
    { sheet_id: 201, user_id: 'U007', exam_id: 2, answer_content: '3:A', submit_time: '2026-06-16 15:56:00', review_status: 1, admin_id: 1 },
  ],
  exam_score: [
    { score_id: 1, user_id: 'U001', exam_id: 1, final_score: 95, pass_status: 1, review_time: '2026-06-15 14:00:00', admin_id: 1 },
    { score_id: 2, user_id: 'U002', exam_id: 1, final_score: 90, pass_status: 1, review_time: '2026-06-15 14:05:00', admin_id: 1 },
    { score_id: 3, user_id: 'U003', exam_id: 1, final_score: 78, pass_status: 1, review_time: '2026-06-15 14:10:00', admin_id: 1 },
    { score_id: 4, user_id: 'U007', exam_id: 2, final_score: 65, pass_status: 0, review_time: '2026-06-16 19:15:00', admin_id: 1 },
  ],
  monthly_stats_archive: [],
  sys_role_audit_log: [],
  exam_fail_log: [],
};

export function createSeedDatabase() {
  return structuredClone(seedDatabase);
}

