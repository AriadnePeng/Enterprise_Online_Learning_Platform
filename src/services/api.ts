// API 服务层 - 严格对接后端接口规范

const API_BASE = 'http://localhost:8080';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

async function request<T>(url: string, method: 'GET' | 'POST' = 'GET', body?: any): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE}${url}`, options);
  const json: ApiResponse<T> = await response.json();

  if (!json.success) {
    throw new Error(json.message || '请求失败');
  }
  return json.data as T;
}

// ========== 视图查询接口 ==========
export const viewApi = {
  // 培训任务全局进度
  getTaskProgress: () => request<any[]>('/api/views/tasks/progress-overview'),
  
  // 高危学员预警
  getDelayWarnings: () => request<any[]>('/api/views/tasks/delay-warnings'),
  
  // 考试成绩汇总
  getExamScoreSummary: () => request<any[]>('/api/views/exams/score-summary'),
  
  // 答卷详情
  getAnswerSheets: () => request<any[]>('/api/views/exams/answer-sheets'),
  
  // 全体学员学习考试统计
  getLearningExamStats: () => request<any[]>('/api/views/stats/learning-exam'),
  
  // 员工异常行为
  getEmployeeAnomalies: () => request<any[]>('/api/views/stats/employee-anomalies'),
  
  // 脱敏用户信息
  getSafeUsers: () => request<any[]>('/api/views/users/safe'),
  
  // 讲师学员笔记
  getLecturerNotes: () => request<any[]>('/api/views/notes/lecturer-student'),
  
  // 课程分类统计
  getCourseCategoryStats: () => request<any[]>('/api/views/courses/category-stats'),
  
  // 课程扩展信息
  getCourseListExtended: () => request<any[]>('/api/views/courses/list-extended'),
};

// ========== 存储过程接口 ==========
export const procedureApi = {
  // 批量派发任务
  batchAssignTask: (data: { p_task_id: string; p_task_name: string; p_creator_id: string; p_target_position: string; p_deadline: number }) =>
    request<string>('/api/procedures/tasks/batch-assign', 'POST', data),
  
  // 延期调整
  updateTaskTime: (data: { p_task_id: string; p_new_deadline: number }) =>
    request<string>('/api/procedures/tasks/update-time', 'POST', data),
  
  // 课程下架
  offlineCourse: (courseId: number) =>
    request<void>(`/api/procedures/courses/${courseId}/offline`, 'POST'),
  
  // 自动交卷
  autoSubmitExam: (data: { p_exam_id: number; p_user_id: string }) =>
    request<void>('/api/procedures/exams/auto-submit', 'POST', data),
  
  // 通过率统计
  getPassRate: (examId: number) =>
    request<any[]>(`/api/procedures/exams/${examId}/pass-rate`),
  
  // 导出异常员工
  exportAnomalyEmployees: (params?: { p_risk_level?: string; p_department?: string; p_start_date?: string; p_end_date?: string }) =>
    request<any[]>('/api/procedures/stats/export-anomaly-employees', 'GET', params),
  
  // 月报归档
  archiveMonthly: (statMonth: string) =>
    request<void>(`/api/procedures/stats/archive-monthly/${statMonth}`, 'POST'),
  
  // 员工修改笔记
  updateNote: (data: { p_note_id: number; p_new_content: string }) =>
    request<void>('/api/procedures/notes/update', 'POST', data),
  
  // DBA查所有笔记
  getAllNotesAdmin: () => request<any[]>('/api/procedures/notes/admin-all'),
  
  // 打卡处理
  processCheckin: (data: { p_record_id: string; p_note_id?: number; p_device_info?: string }) =>
    request<void>('/api/procedures/checkin/process', 'POST', data),
};

// ========== 基础CRUD接口（16张表） ==========
export const crudApi = {
  // 通用CRUD
  list: (table: string, params?: Record<string, any>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<any[]>(`/api/${table}/list${query}`);
  },
  
  detail: (table: string, id: string | number) =>
    request<any>(`/api/${table}/detail/${id}`),
  
  add: (table: string, data: any) =>
    request<any>(`/api/${table}/add`, 'POST', data),
  
  update: (table: string, data: any) =>
    request<any>(`/api/${table}/update`, 'POST', data),
  
  delete: (table: string, id: string | number) =>
    request<void>(`/api/${table}/delete/${id}`, 'POST'),
};

// 导出所有API
export const api = {
  view: viewApi,
  procedure: procedureApi,
  crud: crudApi,
};

export default api;
