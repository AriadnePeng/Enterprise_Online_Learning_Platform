// API 服务层：优先连接真实后端，连接失败时回退到可持久化 Mock。

import { mockApi } from '@/services/mockApi';
import type { BusinessRecord, LoginResult } from '@/types/business';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8080';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

class ApiRequestError extends Error {
  readonly networkError: boolean;

  constructor(message: string, networkError = false) {
    super(message);
    this.networkError = networkError;
  }
}

async function request<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: unknown): Promise<T> {
  const token = localStorage.getItem('enterprise-learning-token');
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 2500);
  const options: RequestInit = {
    method,
    signal: controller.signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${url}`, options);
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError'
      ? '后端服务响应超时'
      : '后端服务不可用';
    throw new ApiRequestError(message, true);
  } finally {
    window.clearTimeout(timeoutId);
  }
  const json = await response.json() as ApiResponse<T>;
  if (!response.ok) {
    if (response.status === 401 && url !== '/api/auth/login') {
      localStorage.removeItem('enterprise-learning-token');
      localStorage.removeItem('enterprise-learning-user');
      window.dispatchEvent(new Event('enterprise-auth-expired'));
    }
    throw new ApiRequestError(json.message || `请求失败 (${response.status})`);
  }

  if (!json.success) {
    throw new ApiRequestError(json.message || '请求失败');
  }
  return json.data as T;
}

async function withFallback<T>(remote: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') return fallback();
  try {
    return await remote();
  } catch (error) {
    if (error instanceof ApiRequestError && error.networkError) return fallback();
    throw error;
  }
}

export const authApi = {
  login: (username: string, password: string) =>
    withFallback<LoginResult>(
      () => request<LoginResult>('/api/auth/login', 'POST', { username, password }),
      () => mockApi.auth.login(username, password),
    ),
};

// ========== 视图查询接口 ==========
export const viewApi = {
  // 培训任务全局进度
  getTaskProgress: () => withFallback(() => request<BusinessRecord[]>('/api/views/tasks/progress-overview'), mockApi.view.getTaskProgress),
  
  // 高危学员预警
  getDelayWarnings: () => withFallback(() => request<BusinessRecord[]>('/api/views/tasks/delay-warnings'), mockApi.view.getDelayWarnings),
  
  // 考试成绩汇总
  getExamScoreSummary: () => withFallback(() => request<BusinessRecord[]>('/api/views/exams/score-summary'), mockApi.view.getExamScoreSummary),
  
  // 答卷详情
  getAnswerSheets: () => withFallback(() => request<BusinessRecord[]>('/api/views/exams/answer-sheets'), mockApi.view.getAnswerSheets),
  
  // 全体学员学习考试统计
  getLearningExamStats: () => withFallback(() => request<BusinessRecord[]>('/api/views/stats/learning-exam'), mockApi.view.getLearningExamStats),
  
  // 员工异常行为
  getEmployeeAnomalies: () => withFallback(() => request<BusinessRecord[]>('/api/views/stats/employee-anomalies'), mockApi.view.getEmployeeAnomalies),
  
  // 脱敏用户信息
  getSafeUsers: () => withFallback(() => request<BusinessRecord[]>('/api/views/users/safe'), mockApi.view.getSafeUsers),
  
  // 讲师学员笔记
  getLecturerNotes: () => withFallback(() => request<BusinessRecord[]>('/api/views/notes/lecturer-student'), mockApi.view.getLecturerNotes),
  
  // 课程分类统计
  getCourseCategoryStats: () => withFallback(() => request<BusinessRecord[]>('/api/views/courses/category-stats'), mockApi.view.getCourseCategoryStats),
  
  // 课程扩展信息
  getCourseListExtended: () => withFallback(() => request<BusinessRecord[]>('/api/views/courses/list-extended'), mockApi.view.getCourseListExtended),
};

// ========== 存储过程接口 ==========
export const procedureApi = {
  // 批量派发任务
  batchAssignTask: (data: { p_task_id: string; p_task_name: string; p_creator_id: string; p_target_position: string; p_deadline: number }) =>
    withFallback(() => request<string>('/api/procedures/tasks/batch-assign', 'POST', data), () => mockApi.procedure.batchAssignTask(data)),
  
  // 延期调整
  updateTaskTime: (data: { p_task_id: string; p_new_deadline: number }) =>
    withFallback(() => request<string>('/api/procedures/tasks/update-time', 'POST', data), () => mockApi.procedure.updateTaskTime(data)),
  
  // 课程下架
  offlineCourse: (courseId: number) =>
    withFallback(() => request<void>(`/api/procedures/courses/${courseId}/offline`, 'POST'), () => mockApi.procedure.offlineCourse(courseId)),
  
  // 自动交卷
  autoSubmitExam: (data: { p_exam_id: number; p_user_id: string }) =>
    withFallback(() => request<void>('/api/procedures/exams/auto-submit', 'POST', data), () => mockApi.procedure.autoSubmitExam(data).then(() => undefined)),
  
  // 通过率统计
  getPassRate: (examId: number) =>
    withFallback(() => request<BusinessRecord[]>(`/api/procedures/exams/${examId}/pass-rate`), () => mockApi.procedure.getPassRate(examId)),
  
  // 导出异常员工
  exportAnomalyEmployees: (params?: { p_risk_level?: string; p_department?: string; p_start_date?: string; p_end_date?: string }) =>
    withFallback(
      () => request<BusinessRecord[]>(`/api/procedures/stats/export-anomaly-employees?${new URLSearchParams(params as Record<string, string>).toString()}`),
      mockApi.procedure.exportAnomalyEmployees,
    ),
  
  // 月报归档
  archiveMonthly: (statMonth: string) =>
    withFallback(() => request<void>(`/api/procedures/stats/archive-monthly/${statMonth}`, 'POST'), () => mockApi.procedure.archiveMonthly(statMonth).then(() => undefined)),
  
  // 员工修改笔记
  updateNote: (data: { p_note_id: number; p_new_content: string }) =>
    withFallback(() => request<void>('/api/procedures/notes/update', 'POST', data), () => mockApi.procedure.updateNote(data).then(() => undefined)),
  
  // DBA查所有笔记
  getAllNotesAdmin: () => withFallback(() => request<BusinessRecord[]>('/api/procedures/notes/admin-all'), mockApi.procedure.getAllNotesAdmin),
  
  // 打卡处理
  processCheckin: (data: { p_record_id: string; p_note_id?: number; p_device_info?: string }) =>
    withFallback(() => request<void>('/api/procedures/checkin/process', 'POST', data), () => mockApi.procedure.processCheckin(data).then(() => undefined)),
};

// ========== 基础CRUD接口（16张表） ==========
export const crudApi = {
  // 通用CRUD
  list: (table: string, params?: Record<string, unknown>) => {
    const stringParams = params
      ? Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]))
      : undefined;
    const query = stringParams ? '?' + new URLSearchParams(stringParams).toString() : '';
    return withFallback(() => request<BusinessRecord[]>(`/api/${table}/list${query}`), () => mockApi.crud.list(table, params));
  },
  
  detail: (table: string, id: string | number) =>
    withFallback(() => request<BusinessRecord>(`/api/${table}/detail/${id}`), () => mockApi.crud.detail(table, id)),
  
  add: (table: string, data: BusinessRecord) =>
    withFallback(() => request<BusinessRecord>(`/api/${table}/add`, 'POST', data), () => mockApi.crud.add(table, data)),
  
  update: (table: string, data: BusinessRecord) =>
    withFallback(() => request<BusinessRecord>(`/api/${table}/update`, 'POST', data), () => mockApi.crud.update(table, data)),
  
  delete: (table: string, id: string | number) =>
    withFallback(() => request<void>(`/api/${table}/delete/${id}`, 'POST'), () => mockApi.crud.delete(table, id)),
};

// 导出所有API
export const api = {
  auth: authApi,
  view: viewApi,
  procedure: procedureApi,
  crud: crudApi,
};

export default api;
