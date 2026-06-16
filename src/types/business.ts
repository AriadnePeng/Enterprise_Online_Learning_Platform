export type BusinessRecord = Record<string, unknown>;

export interface UserRecord extends BusinessRecord {
  user_id: string;
  username: string;
  role: string;
  position: string;
  learning_status: number;
  contact: string;
  user_create_time: string;
}

export interface CourseRecord extends BusinessRecord {
  course_id: number;
  course_name: string;
  course_code: string;
  category_name: string;
  lecturer_name: string;
  course_status: number;
  course_desc: string;
}

export interface ExamRecord extends BusinessRecord {
  exam_id: number;
  exam_name: string;
  exam_desc: string;
  exam_duration: number;
  start_time: string;
  end_time: string;
  pass_score: number;
  exam_status: number;
  admin_id: number;
}

export interface TrainingTaskRecord extends BusinessRecord {
  task_id: string;
  task_name: string;
  creator_id: string;
  target_position: string;
  task_deadline: number;
  assigned_count: number;
  completed_count: number;
  learning_status: number;
  user_create_time: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: string;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
}

