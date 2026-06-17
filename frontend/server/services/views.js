function indexBy(rows, key) {
  return new Map(rows.map((row) => [String(row[key]), row]));
}

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function taskProgress(database) {
  const progressByTask = new Map();
  for (const row of database.learning_progress) {
    const values = progressByTask.get(row.task_id) || [];
    values.push(row);
    progressByTask.set(row.task_id, values);
  }
  return database.training_task.map((task) => {
    const rows = progressByTask.get(task.task_id) || [];
    const assigned = rows.length || Number(task.assigned_count || 0);
    const completed = rows.length
      ? rows.filter((row) => Number(row.status) === 2).length
      : Number(task.completed_count || 0);
    return {
      task_id: task.task_id,
      task_name: task.task_name,
      target_position: task.target_position || task.task_scope_type,
      assigned_count: assigned,
      completed_count: completed,
      completion_rate: assigned ? round(completed / assigned * 100) : 0,
      deadline_hours: Number(task.task_deadline || 0),
    };
  });
}

function employeeAnomalies(database) {
  const learners = database.user_info.filter((user) => user.role === '学员');
  const progressByUser = new Map();
  const scoresByUser = new Map();
  const checkinsByProgress = new Map(database.learning_checkin.map((item) => [item.record_id, item]));

  for (const row of database.learning_progress) {
    const values = progressByUser.get(row.user_id) || [];
    values.push(row);
    progressByUser.set(row.user_id, values);
  }
  for (const row of database.exam_score) {
    const values = scoresByUser.get(row.user_id) || [];
    values.push(row);
    scoresByUser.set(row.user_id, values);
  }

  return learners.map((user) => {
    const progressRows = progressByUser.get(user.user_id) || [];
    const scoreRows = scoresByUser.get(user.user_id) || [];
    const learningMinutes = progressRows.reduce((sum, row) => sum + Number(row.duration || 0), 0);
    const averageScore = scoreRows.length
      ? round(scoreRows.reduce((sum, row) => sum + Number(row.final_score || 0), 0) / scoreRows.length)
      : 0;
    const lastCheckin = progressRows
      .map((row) => checkinsByProgress.get(row.progress_id)?.checkin_time)
      .filter(Boolean)
      .sort()
      .at(-1) || '-';
    let anomalyTag = '正常';
    let riskLevel = '低危';
    if (learningMinutes === 0) {
      anomalyTag = '从未学习';
      riskLevel = '高危';
    } else if (averageScore > 0 && averageScore < 60) {
      anomalyTag = '考试连续不及格';
      riskLevel = '中危';
    } else if (learningMinutes < 60) {
      anomalyTag = '休眠学员';
      riskLevel = '中危';
    }
    return {
      user_id: user.user_id,
      username: user.username,
      department: user.position,
      participated_tasks: progressRows.length,
      learning_hours: round(learningMinutes / 60, 2),
      exam_count: scoreRows.length,
      average_score: averageScore,
      anomaly_tag: anomalyTag,
      risk_level: riskLevel,
      last_learning_date: lastCheckin === '-' ? '-' : String(lastCheckin).slice(0, 10),
    };
  }).filter((row) => row.risk_level !== '低危');
}

export const viewService = {
  taskProgress,
  delayWarnings(database) {
    const users = indexBy(database.user_info, 'user_id');
    const tasks = indexBy(database.training_task, 'task_id');
    return database.learning_progress
      .filter((row) => Number(row.duration || 0) === 0 && Number(row.status) === 0)
      .map((row) => ({
        progress_id: row.progress_id,
        user_id: row.user_id,
        username: users.get(row.user_id)?.username || '-',
        position: users.get(row.user_id)?.position || '-',
        task_name: tasks.get(row.task_id)?.task_name || '-',
        duration: Number(row.duration || 0),
        task_create_time: tasks.get(row.task_id)?.user_create_time || '-',
      }));
  },
  examScoreSummary(database) {
    const users = indexBy(database.user_info, 'user_id');
    const exams = indexBy(database.exam, 'exam_id');
    const admins = indexBy(database.administrator, 'admin_id');
    return database.exam_score.map((score) => ({
      score_id: score.score_id,
      user_id: score.user_id,
      username: users.get(score.user_id)?.username || '-',
      position: users.get(score.user_id)?.position || '-',
      exam_id: score.exam_id,
      exam_name: exams.get(String(score.exam_id))?.exam_name || '-',
      final_score: score.final_score,
      pass_result: Number(score.pass_status) === 1 ? '及格' : '不及格',
      review_time: score.review_time,
      reviewer_name: admins.get(String(score.admin_id))?.admin_name || '-',
    }));
  },
  answerSheets(database) {
    const users = indexBy(database.user_info, 'user_id');
    const exams = indexBy(database.exam, 'exam_id');
    const admins = indexBy(database.administrator, 'admin_id');
    return database.answer_sheet.map((sheet) => ({
      sheet_id: sheet.sheet_id,
      user_id: sheet.user_id,
      username: users.get(sheet.user_id)?.username || '-',
      exam_id: sheet.exam_id,
      exam_name: exams.get(String(sheet.exam_id))?.exam_name || '-',
      answer_content: sheet.answer_content,
      submit_time: sheet.submit_time,
      review_status_name: Number(sheet.review_status) === 1 ? '已批阅' : '待批阅',
      reviewer_name: sheet.admin_id ? admins.get(String(sheet.admin_id))?.admin_name || '-' : '-',
    }));
  },
  learningExamStats(database) {
    const learners = database.user_info.filter((user) => user.role === '学员');
    const activeUsers = new Set(database.learning_progress.filter((row) => Number(row.duration || 0) > 0).map((row) => row.user_id));
    const completed = database.learning_progress.filter((row) => Number(row.status) === 2).length;
    const scores = database.exam_score;
    const passed = scores.filter((score) => Number(score.pass_status) === 1).length;
    const learningMinutes = database.learning_progress.reduce((sum, row) => sum + Number(row.duration || 0), 0);
    const averageScore = scores.length ? scores.reduce((sum, row) => sum + Number(row.final_score || 0), 0) / scores.length : 0;
    return [
      { metric: '学员总数', value: learners.length, unit: '人', trend: '+2' },
      { metric: '学习活跃率', value: learners.length ? round(activeUsers.size / learners.length * 100) : 0, unit: '%', trend: '+5.2%' },
      { metric: '任务完成率', value: database.learning_progress.length ? round(completed / database.learning_progress.length * 100) : 0, unit: '%', trend: '+8.1%' },
      { metric: '考试及格率', value: scores.length ? round(passed / scores.length * 100) : 0, unit: '%', trend: '-2.0%' },
      { metric: '人均学习时长', value: learners.length ? round(learningMinutes / 60 / learners.length) : 0, unit: '小时', trend: '+3.4' },
      { metric: '全体平均分', value: round(averageScore), unit: '分', trend: '+1.8' },
    ];
  },
  employeeAnomalies,
  safeUsers(database) {
    return database.user_info.map(({ password, contact, ...user }) => ({
      ...user,
      password: '******',
      contact: String(contact || '').replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    }));
  },
  lecturerNotes(database) {
    const users = indexBy(database.user_info, 'user_id');
    const lecturers = indexBy(database.lecturer, 'lecturer_id');
    const courses = indexBy(database.course, 'course_id');
    return database.learning_note.map((note) => ({
      note_id: note.note_id,
      lecturer_name: lecturers.get(String(note.lecturer_id))?.lecturer_name || '-',
      student_name: users.get(note.user_id)?.username || '-',
      course_name: courses.get(String(note.course_id))?.course_name || '-',
      note_content: note.note_content,
      note_update_time: note.note_update_time,
    }));
  },
  courseCategoryStats(database) {
    const counts = new Map();
    for (const course of database.course) {
      counts.set(course.category_name, (counts.get(course.category_name) || 0) + 1);
    }
    return Array.from(counts, ([category_name, course_count]) => ({ category_name, course_count }));
  },
  courseListExtended(database) {
    return structuredClone(database.course);
  },
};

