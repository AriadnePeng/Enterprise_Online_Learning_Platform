// 数据库对象类型定义

export interface DbTable {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  fields: DbField[];
  recordCount: number;
  relatedTables: string[];
}

export interface DbField {
  name: string;
  type: string;
  isPrimary: boolean;
  isForeign: boolean;
  isNullable: boolean;
  default?: string;
  description: string;
}

export interface DbView {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  sql: string;
  columns: string[];
  relatedTables: string[];
  endpoint: string;
  data?: any[];
}

export interface DbProcedure {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  sql: string;
  params: DbParam[];
  endpoint: string;
  method: 'GET' | 'POST';
  relatedTables: string[];
}

export interface DbParam {
  name: string;
  type: string;
  mode: 'IN' | 'OUT' | 'INOUT';
  description: string;
  required?: boolean;
}

export interface DbTrigger {
  id: string;
  name: string;
  nameCn: string;
  description: string;
  sql: string;
  event: string;
  timing: string;
  table: string;
  relatedTables: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

// 业务数据类型
export interface User {
  user_id: string;
  username: string;
  password: string;
  role: string;
  position: string;
  learning_status: number;
  avatar?: string;
  contact?: string;
  user_create_time: string;
}

export interface TrainingTask {
  task_id: string;
  user_id: string;
  task_name: string;
  task_scope_type: string;
  task_deadline: number;
  learning_status: number;
  user_create_time: string;
}

export interface LearningProgress {
  progress_id: string;
  user_id: string;
  task_id: string;
  duration?: number;
  deadline?: number;
  status: number;
  create_time: string;
}

export interface Course {
  course_id: number;
  course_name: string;
  course_code: string;
  course_status: number;
  course_desc?: string;
}

export interface Exam {
  exam_id: number;
  exam_name: string;
  exam_desc?: string;
  exam_rule?: string;
  exam_duration: number;
  start_time: string;
  end_time: string;
  pass_score: number;
  exam_status: number;
  admin_id: number;
}

export interface ExamScore {
  score_id: number;
  user_id: string;
  exam_id: number;
  final_score: number;
  pass_status: number;
  review_time: string;
  admin_id: number;
}
