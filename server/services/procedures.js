import { HttpError } from '../lib/http.js';
import { createId } from '../lib/store.js';
import { viewService } from './views.js';

function now() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

export const procedureService = {
  async batchAssignTask(store, input) {
    return store.mutate((database) => {
      const taskId = input.p_task_id || createId('training_task', database.training_task);
      if (database.training_task.some((item) => item.task_id === taskId)) {
        throw new HttpError(409, '任务编号已存在');
      }
      const target = String(input.p_target_position || '全员');
      const learners = database.user_info.filter((user) => user.role === '学员' && (target === '全员' || user.position === target));
      const task = {
        task_id: taskId,
        user_id: input.p_creator_id || 'A001',
        creator_id: input.p_creator_id || 'A001',
        task_name: input.p_task_name,
        task_scope_type: target === '全员' ? '全员' : '岗位',
        target_position: target,
        task_deadline: Number(input.p_deadline || 24),
        assigned_count: learners.length,
        completed_count: 0,
        learning_status: 1,
        user_create_time: now().slice(0, 10),
      };
      if (!task.task_name) throw new HttpError(400, '任务名称不能为空');
      database.training_task.unshift(task);
      database.task_scope.unshift({
        scope_id: createId('task_scope', database.task_scope),
        task_id: taskId,
        scope_type: target === '全员' ? 1 : 2,
        scope_ref_id: 0,
        scope_name: target,
      });
      for (const learner of learners) {
        database.learning_progress.unshift({
          progress_id: createId('learning_progress', database.learning_progress),
          user_id: learner.user_id,
          task_id: taskId,
          duration: 0,
          deadline: task.task_deadline,
          status: 0,
          create_time: now(),
        });
      }
      return `派发成功，已为 ${learners.length} 名学员创建学习任务`;
    });
  },

  async updateTaskTime(store, input) {
    return store.mutate((database) => {
      const task = database.training_task.find((item) => item.task_id === input.p_task_id);
      if (!task) throw new HttpError(404, '任务不存在');
      const deadline = Number(input.p_new_deadline);
      if (!Number.isFinite(deadline) || deadline <= 0) throw new HttpError(400, '新时限必须大于 0');
      task.task_deadline = deadline;
      database.learning_progress
        .filter((item) => item.task_id === task.task_id)
        .forEach((item) => { item.deadline = deadline; });
      return `任务 ${task.task_id} 已延期至 ${deadline} 小时`;
    });
  },

  async offlineCourse(store, courseId) {
    return store.mutate((database) => {
      const course = database.course.find((item) => String(item.course_id) === String(courseId));
      if (!course) throw new HttpError(404, '课程不存在');
      course.course_status = 0;
      database.course_chapter
        .filter((item) => String(item.course_id) === String(courseId))
        .forEach((item) => { item.is_free = 0; });
      database.learning_resource
        .filter((item) => String(item.course_id) === String(courseId))
        .forEach((item) => { item.resource_status = 0; });
      return null;
    });
  },

  async autoSubmitExam(store, input) {
    return store.mutate((database) => {
      const exam = database.exam.find((item) => String(item.exam_id) === String(input.p_exam_id));
      const user = database.user_info.find((item) => item.user_id === input.p_user_id);
      if (!exam || !user) throw new HttpError(404, '考试或学员不存在');
      let sheet = database.answer_sheet.find((item) => String(item.exam_id) === String(exam.exam_id) && item.user_id === user.user_id);
      if (!sheet) {
        sheet = {
          sheet_id: createId('answer_sheet', database.answer_sheet),
          user_id: user.user_id,
          exam_id: exam.exam_id,
          answer_content: '',
          submit_time: now(),
          review_status: 0,
          admin_id: null,
        };
        database.answer_sheet.push(sheet);
      } else if (!sheet.submit_time) {
        sheet.submit_time = now();
      }
      return null;
    });
  },

  passRate(store, examId) {
    const database = store.snapshot();
    const exam = database.exam.find((item) => String(item.exam_id) === String(examId));
    if (!exam) throw new HttpError(404, '考试不存在');
    const scores = database.exam_score.filter((item) => String(item.exam_id) === String(examId));
    const passed = scores.filter((item) => Number(item.pass_status) === 1).length;
    return [{
      exam_id: exam.exam_id,
      exam_name: exam.exam_name,
      total_students: scores.length,
      pass_students: passed,
      pass_rate: scores.length ? Math.round(passed / scores.length * 10000) / 100 : 0,
    }];
  },

  anomalyEmployees(store, query) {
    const database = store.snapshot();
    return viewService.employeeAnomalies(database).filter((row) => {
      const risk = query.get('p_risk_level');
      const department = query.get('p_department');
      return (!risk || row.risk_level === risk) && (!department || row.department === department);
    });
  },

  async archiveMonthly(store, statMonth) {
    return store.mutate((database) => {
      const existing = database.monthly_stats_archive.find((item) => item.stat_month === statMonth);
      const metrics = viewService.learningExamStats(database);
      const archive = {
        archive_id: existing?.archive_id || createId('monthly_stats_archive', database.monthly_stats_archive),
        stat_month: statMonth,
        metrics,
        archive_time: now(),
      };
      if (existing) Object.assign(existing, archive);
      else database.monthly_stats_archive.push(archive);
      return null;
    });
  },

  async updateNote(store, input) {
    return store.mutate((database) => {
      const note = database.learning_note.find((item) => String(item.note_id) === String(input.p_note_id));
      if (!note) throw new HttpError(404, '笔记不存在');
      note.note_content = String(input.p_new_content || '');
      note.note_update_time = now();
      return null;
    });
  },

  allNotes(store) {
    return store.table('learning_note');
  },

  async processCheckin(store, input) {
    return store.mutate((database) => {
      const progress = database.learning_progress.find((item) => item.progress_id === input.p_record_id);
      if (!progress) throw new HttpError(404, '学习进度不存在');
      const previous = database.learning_checkin
        .filter((item) => item.record_id === progress.progress_id)
        .sort((a, b) => String(b.checkin_time).localeCompare(String(a.checkin_time)))[0];
      if (previous) {
        const elapsed = Date.now() - new Date(String(previous.checkin_time).replace(' ', 'T')).getTime();
        if (Number.isFinite(elapsed) && elapsed < 5 * 60 * 1000) {
          throw new HttpError(409, '两次打卡间隔不能少于 5 分钟');
        }
      }
      const checkin = {
        checkin_id: createId('learning_checkin', database.learning_checkin),
        note_id: input.p_note_id || null,
        record_id: progress.progress_id,
        checkin_time: now(),
        device_info: input.p_device_info || 'Web',
      };
      database.learning_checkin.push(checkin);
      progress.duration = Number(progress.duration || 0) + 30;
      if (progress.duration >= Number(progress.deadline || 0) * 60) progress.status = 2;
      return null;
    });
  },
};

