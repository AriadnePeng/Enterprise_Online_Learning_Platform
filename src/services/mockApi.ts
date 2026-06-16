import type {
  BusinessRecord,
  CourseRecord,
  ExamRecord,
  LoginResult,
  TrainingTaskRecord,
  UserRecord,
} from '@/types/business';

const STORAGE_KEY = 'enterprise-learning-mock-db';
const MOCK_DELAY = 180;

const seedUsers: UserRecord[] = [
  { user_id: 'U001', username: '李勇', role: '学员', position: '安全工程师', learning_status: 1, contact: '13500002222', user_create_time: '2026-01-08 09:30:00' },
  { user_id: 'U002', username: '刘诗晨', role: '学员', position: '合规专员', learning_status: 1, contact: '13500003333', user_create_time: '2026-01-12 10:20:00' },
  { user_id: 'U003', username: '王一鸣', role: '学员', position: 'Java开发', learning_status: 1, contact: '13500004444', user_create_time: '2026-02-03 14:10:00' },
  { user_id: 'U004', username: '周雪', role: '学员', position: '产品经理', learning_status: 1, contact: '13600005555', user_create_time: '2026-02-15 16:40:00' },
  { user_id: 'U005', username: '赵凯', role: '讲师', position: '技术讲师', learning_status: 1, contact: '13600006666', user_create_time: '2026-03-01 11:00:00' },
  { user_id: 'U006', username: '贾向东', role: '学员', position: '运维工程师', learning_status: 0, contact: '13700007777', user_create_time: '2026-03-18 08:50:00' },
  { user_id: 'U007', username: '陈宝玉', role: '学员', position: 'UI设计师', learning_status: 1, contact: '13700008888', user_create_time: '2026-04-02 13:25:00' },
  { user_id: 'U008', username: '孙悦', role: '学员', position: '安全工程师', learning_status: 1, contact: '13800009999', user_create_time: '2026-04-20 15:15:00' },
];

const seedCourses: CourseRecord[] = [
  { course_id: 1, course_name: '网络安全合规必修课', course_code: 'SEC-101', category_name: '安全合规', lecturer_name: '赵凯', course_status: 1, course_desc: '企业信息安全、数据保护与合规基础。' },
  { course_id: 2, course_name: '高效产品设计规范', course_code: 'PM-204', category_name: '产品设计', lecturer_name: '林妍', course_status: 1, course_desc: '从需求洞察到交互验收的完整方法。' },
  { course_id: 3, course_name: 'React 工程化实战', course_code: 'FE-305', category_name: '研发技术', lecturer_name: '赵凯', course_status: 1, course_desc: '现代前端工程、组件设计与质量保障。' },
  { course_id: 4, course_name: 'Linux 安全运维基线', course_code: 'OPS-210', category_name: '运维管理', lecturer_name: '韩松', course_status: 0, course_desc: 'Linux 主机加固与日常巡检规范。' },
  { course_id: 5, course_name: '企业数据分析入门', course_code: 'DATA-110', category_name: '数据能力', lecturer_name: '何琳', course_status: 1, course_desc: '业务指标、数据清洗和可视化基础。' },
  { course_id: 6, course_name: '管理者沟通训练营', course_code: 'MGT-201', category_name: '通用管理', lecturer_name: '吴敏', course_status: 1, course_desc: '目标对齐、反馈与跨团队沟通。' },
];

const seedExams: ExamRecord[] = [
  { exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', exam_desc: '安全合规必修课结业考试', exam_duration: 90, start_time: '2026-06-15 09:00', end_time: '2026-06-15 10:30', pass_score: 60, exam_status: 1, admin_id: 1 },
  { exam_id: 2, exam_name: '产品经理核心交互设计能力认证', exam_desc: '产品与交互设计综合测评', exam_duration: 120, start_time: '2026-06-16 14:00', end_time: '2026-06-16 16:00', pass_score: 70, exam_status: 1, admin_id: 1 },
  { exam_id: 3, exam_name: 'React 工程化阶段测试', exam_desc: '前端工程能力阶段测试', exam_duration: 60, start_time: '2026-06-22 10:00', end_time: '2026-06-22 11:00', pass_score: 60, exam_status: 0, admin_id: 1 },
];

const seedTasks: TrainingTaskRecord[] = [
  { task_id: 'T001', task_name: '网络安全合规必备意识培训', creator_id: 'A001', target_position: '全员', task_deadline: 24, assigned_count: 8, completed_count: 5, learning_status: 1, user_create_time: '2026-05-01' },
  { task_id: 'T002', task_name: '高效产品设计规范', creator_id: 'A001', target_position: '产品经理', task_deadline: 12, assigned_count: 3, completed_count: 2, learning_status: 1, user_create_time: '2026-05-06' },
  { task_id: 'T003', task_name: '前端现代框架工程化实战', creator_id: 'A002', target_position: 'Java开发', task_deadline: 48, assigned_count: 4, completed_count: 1, learning_status: 1, user_create_time: '2026-05-10' },
  { task_id: 'T004', task_name: 'Linux内核安全运维基线', creator_id: 'A001', target_position: '运维工程师', task_deadline: 20, assigned_count: 2, completed_count: 0, learning_status: 0, user_create_time: '2026-05-15' },
];

const scoreSummary = [
  { score_id: 1, user_id: 'U001', username: '李勇', position: '安全工程师', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', final_score: 95, pass_result: '及格', review_time: '2026-06-15 14:00:00', reviewer_name: '向管理员' },
  { score_id: 2, user_id: 'U002', username: '刘诗晨', position: '合规专员', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', final_score: 90, pass_result: '及格', review_time: '2026-06-15 14:05:00', reviewer_name: '向管理员' },
  { score_id: 3, user_id: 'U003', username: '王一鸣', position: 'Java开发', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', final_score: 78, pass_result: '及格', review_time: '2026-06-15 14:10:00', reviewer_name: '向管理员' },
  { score_id: 4, user_id: 'U007', username: '陈宝玉', position: 'UI设计师', exam_id: 2, exam_name: '产品经理核心交互设计能力认证', final_score: 65, pass_result: '不及格', review_time: '2026-06-16 19:15:00', reviewer_name: '向管理员' },
];

const answerSheets = [
  { sheet_id: 101, user_id: 'U001', username: '李勇', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', answer_content: '1:A, 2:C, 3:B, 4:D', submit_time: '2026-06-15 10:18:00', review_status_name: '已批阅', reviewer_name: '向管理员' },
  { sheet_id: 102, user_id: 'U002', username: '刘诗晨', exam_id: 1, exam_name: '2026季度网络安全合规闭卷测评', answer_content: '1:A, 2:C, 3:A, 4:D', submit_time: '2026-06-15 10:22:00', review_status_name: '已批阅', reviewer_name: '向管理员' },
  { sheet_id: 201, user_id: 'U007', username: '陈宝玉', exam_id: 2, exam_name: '产品经理核心交互设计能力认证', answer_content: '1:B, 2:D, 3:C, 4:A', submit_time: '2026-06-16 15:56:00', review_status_name: '已批阅', reviewer_name: '向管理员' },
];

const employeeAnomalies = [
  { user_id: 'U006', username: '贾向东', department: '运维工程师', participated_tasks: 1, learning_hours: 0, exam_count: 0, average_score: 0, anomaly_tag: '从未学习', risk_level: '高危', last_learning_date: '-' },
  { user_id: 'U007', username: '陈宝玉', department: 'UI设计师', participated_tasks: 2, learning_hours: 0.25, exam_count: 1, average_score: 65, anomaly_tag: '休眠学员', risk_level: '中危', last_learning_date: '2026-05-01' },
  { user_id: 'U004', username: '周雪', department: '产品经理', participated_tasks: 3, learning_hours: 4.5, exam_count: 2, average_score: 58, anomaly_tag: '考试连续不及格', risk_level: '中危', last_learning_date: '2026-06-08' },
];

const learningStats = [
  { metric: '学员总数', value: 8, unit: '人', trend: '+2' },
  { metric: '学习活跃率', value: 87.5, unit: '%', trend: '+5.2%' },
  { metric: '任务完成率', value: 61.8, unit: '%', trend: '+8.1%' },
  { metric: '考试及格率', value: 75, unit: '%', trend: '-2.0%' },
  { metric: '人均学习时长', value: 18.6, unit: '小时', trend: '+3.4' },
  { metric: '全体平均分', value: 82, unit: '分', trend: '+1.8' },
];

interface MockDatabase {
  user_info: UserRecord[];
  course: CourseRecord[];
  exam: ExamRecord[];
  training_task: TrainingTaskRecord[];
  [key: string]: BusinessRecord[];
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function initialDatabase(): MockDatabase {
  return {
    user_info: clone(seedUsers),
    course: clone(seedCourses),
    exam: clone(seedExams),
    training_task: clone(seedTasks),
  };
}

function readDatabase(): MockDatabase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) as MockDatabase : initialDatabase();
  } catch {
    return initialDatabase();
  }
}

function writeDatabase(database: MockDatabase) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
  } catch {
    // Private browsing or non-browser execution can disable storage.
  }
}

function wait<T>(value: T): Promise<T> {
  return new Promise((resolve) => window.setTimeout(() => resolve(clone(value)), MOCK_DELAY));
}

function primaryKey(table: string) {
  const keys: Record<string, string> = {
    user_info: 'user_id',
    course: 'course_id',
    exam: 'exam_id',
    training_task: 'task_id',
  };
  return keys[table] ?? 'id';
}

function createId(table: string, rows: BusinessRecord[]) {
  if (table === 'user_info' || table === 'training_task') {
    const prefix = table === 'user_info' ? 'U' : 'T';
    const max = rows.reduce((value, row) => Math.max(value, Number(String(row[primaryKey(table)] ?? '').replace(/\D/g, '')) || 0), 0);
    return `${prefix}${String(max + 1).padStart(3, '0')}`;
  }
  return rows.reduce((value, row) => Math.max(value, Number(row[primaryKey(table)]) || 0), 0) + 1;
}

export const mockApi = {
  auth: {
    login: async (username: string, password: string): Promise<LoginResult> => {
      if (!username.trim() || !password.trim()) {
        throw new Error('请输入账号和密码');
      }
      if (password !== '123456' && password !== 'admin') {
        throw new Error('演示环境密码为 123456');
      }
      return wait({
        token: `mock-token-${Date.now()}`,
        user: { id: 'A001', name: username === 'admin' ? '系统管理员' : username, role: '平台管理员' },
      });
    },
  },
  crud: {
    list: async (table: string, params?: Record<string, unknown>) => {
      const database = readDatabase();
      let rows = clone(database[table] ?? []);
      const keyword = String(params?.keyword ?? params?.search ?? '').trim().toLowerCase();
      if (keyword) {
        rows = rows.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(keyword)));
      }
      return wait(rows);
    },
    detail: async (table: string, id: string | number) => {
      const database = readDatabase();
      const key = primaryKey(table);
      const row = (database[table] ?? []).find((item) => String(item[key]) === String(id));
      if (!row) throw new Error('记录不存在');
      return wait(row);
    },
    add: async (table: string, data: BusinessRecord) => {
      const database = readDatabase();
      const rows = database[table] ?? [];
      const key = primaryKey(table);
      const record = {
        ...data,
        [key]: data[key] || createId(table, rows),
      };
      if (rows.some((item) => String(item[key]) === String(record[key]))) {
        throw new Error(`${String(record[key])} 已存在`);
      }
      rows.unshift(record);
      database[table] = rows;
      writeDatabase(database);
      return wait(record);
    },
    update: async (table: string, data: BusinessRecord) => {
      const database = readDatabase();
      const key = primaryKey(table);
      const rows = database[table] ?? [];
      const index = rows.findIndex((item) => String(item[key]) === String(data[key]));
      if (index < 0) throw new Error('记录不存在');
      rows[index] = { ...rows[index], ...data };
      writeDatabase(database);
      return wait(rows[index]);
    },
    delete: async (table: string, id: string | number) => {
      const database = readDatabase();
      const key = primaryKey(table);
      database[table] = (database[table] ?? []).filter((item) => String(item[key]) !== String(id));
      writeDatabase(database);
      return wait(undefined);
    },
  },
  view: {
    getTaskProgress: async () => {
      const tasks = readDatabase().training_task;
      return wait(tasks.map((task) => ({
        task_id: task.task_id,
        task_name: task.task_name,
        target_position: task.target_position,
        assigned_count: task.assigned_count,
        completed_count: task.completed_count,
        completion_rate: task.assigned_count ? Math.round(task.completed_count / task.assigned_count * 100) : 0,
        deadline_hours: task.task_deadline,
      })));
    },
    getDelayWarnings: () => wait(employeeAnomalies.filter((item) => item.risk_level === '高危')),
    getExamScoreSummary: () => wait(scoreSummary),
    getAnswerSheets: () => wait(answerSheets),
    getLearningExamStats: () => wait(learningStats),
    getEmployeeAnomalies: () => wait(employeeAnomalies),
    getSafeUsers: () => wait(seedUsers.map(({ contact, ...user }) => ({ ...user, contact: contact.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') }))),
    getLecturerNotes: () => wait([{ lecturer_name: '赵凯', student_name: '王一鸣', course_name: 'React 工程化实战', note_count: 6, latest_note: '组件边界与状态管理' }]),
    getCourseCategoryStats: async () => {
      const courses = readDatabase().course;
      const counts = new Map<string, number>();
      courses.forEach((course) => counts.set(course.category_name, (counts.get(course.category_name) ?? 0) + 1));
      return wait(Array.from(counts, ([category_name, course_count]) => ({ category_name, course_count })));
    },
    getCourseListExtended: async () => wait(readDatabase().course),
  },
  procedure: {
    batchAssignTask: async (data: { p_task_id: string; p_task_name: string; p_creator_id: string; p_target_position: string; p_deadline: number }) => {
      const database = readDatabase();
      const users = database.user_info.filter((user) => user.role === '学员' && (data.p_target_position === '全员' || user.position === data.p_target_position));
      const task: TrainingTaskRecord = {
        task_id: data.p_task_id || String(createId('training_task', database.training_task)),
        task_name: data.p_task_name,
        creator_id: data.p_creator_id,
        target_position: data.p_target_position,
        task_deadline: data.p_deadline,
        assigned_count: users.length,
        completed_count: 0,
        learning_status: 1,
        user_create_time: new Date().toISOString().slice(0, 10),
      };
      if (database.training_task.some((item) => item.task_id === task.task_id)) throw new Error('任务编号已存在');
      database.training_task.unshift(task);
      writeDatabase(database);
      return wait(`派发成功，已为 ${users.length} 名学员创建学习任务`);
    },
    updateTaskTime: async (data: { p_task_id: string; p_new_deadline: number }) => {
      const database = readDatabase();
      const task = database.training_task.find((item) => item.task_id === data.p_task_id);
      if (!task) throw new Error('任务不存在');
      task.task_deadline = data.p_new_deadline;
      writeDatabase(database);
      return wait(`任务 ${data.p_task_id} 已延期至 ${data.p_new_deadline} 小时`);
    },
    offlineCourse: async (courseId: number) => {
      const database = readDatabase();
      const course = database.course.find((item) => item.course_id === courseId);
      if (!course) throw new Error('课程不存在');
      course.course_status = 0;
      writeDatabase(database);
      return wait(undefined);
    },
    autoSubmitExam: (data: BusinessRecord) => wait({ ...data, status: '已自动交卷' }),
    getPassRate: (examId: number) => {
      const rows = scoreSummary.filter((item) => item.exam_id === examId);
      const passed = rows.filter((item) => item.pass_result === '及格').length;
      return wait([{ exam_id: examId, total_students: rows.length, pass_students: passed, pass_rate: rows.length ? Math.round(passed / rows.length * 100) : 0 }]);
    },
    exportAnomalyEmployees: () => wait(employeeAnomalies),
    archiveMonthly: (statMonth: string) => wait({ stat_month: statMonth, archived: true }),
    updateNote: (data: BusinessRecord) => wait({ ...data, update_time: new Date().toISOString() }),
    getAllNotesAdmin: () => wait([{ note_id: 1, user_id: 'U003', note_content: 'React 状态管理学习笔记', update_time: '2026-06-10' }]),
    processCheckin: (data: BusinessRecord) => wait({ ...data, processed: true }),
  },
};

export default mockApi;

