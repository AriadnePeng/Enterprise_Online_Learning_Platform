# Enterprise Learning Backend

Spring Boot + MyBatis 后端基础工程，用于把数据库课程设计中已写好的视图和存储过程暴露成 HTTP API。

## 环境

- JDK 17+
- Maven 3.8+
- MySQL 8.x
- 数据库名：`enterprise_learning_db`

数据库连接可通过环境变量覆盖：

```powershell
$env:DB_URL="jdbc:mysql://localhost:3306/enterprise_learning_db?useUnicode=true&characterEncoding=utf8&serverTimezone=Asia/Shanghai"
$env:DB_USERNAME="root"
$env:DB_PASSWORD="你的密码"
```

## 启动

```powershell
cd backend
mvn spring-boot:run
```

默认端口：`8080`。

## 视图接口

| 方法 | 路径 | 数据库视图 |
| --- | --- | --- |
| GET | `/api/views/tasks/progress-overview` | `v_task_progress_overview` |
| GET | `/api/views/tasks/delay-warnings` | `v_delay_user_warning` |
| GET | `/api/views/stats/learning-exam` | `v_全体学员学习考试统计` |
| GET | `/api/views/stats/employee-anomalies` | `v_employee_anomaly_behavior` |
| GET | `/api/views/users/safe` | `v_user_safe` |
| GET | `/api/views/notes/lecturer-student` | `v_lecturer_student_notes` |
| GET | `/api/views/courses/category-stats` | `view_course_category_stats` |
| GET | `/api/views/exams/score-summary` | `vw_exam_score_summary` |
| GET | `/api/views/exams/answer-sheets` | `vw_answer_sheet_detail` |

## 存储过程接口

| 方法 | 路径 | 存储过程 |
| --- | --- | --- |
| POST | `/api/procedures/tasks/batch-assign` | `sp_batch_assign_task` |
| POST | `/api/procedures/tasks/update-time` | `sp_update_task_time` |
| GET | `/api/procedures/stats/export-anomaly-employees` | `sp_export_anomaly_employees` |
| POST | `/api/procedures/stats/archive-monthly/{statMonth}` | `sp_archive_monthly_stats` |
| POST | `/api/procedures/notes/update` | `sp_emp_update_note` |
| GET | `/api/procedures/notes/admin-all` | `sp_admin_get_all_notes` |
| POST | `/api/procedures/courses/{courseId}/offline` | `sp_course_offline` |
| POST | `/api/procedures/exams/auto-submit` | `auto_submit_exam` |
| GET | `/api/procedures/exams/{examId}/pass-rate` | `exam_pass_rate` |

## 请求示例

```powershell
curl http://localhost:8080/api/views/exams/score-summary
```

```powershell
curl -X POST http://localhost:8080/api/procedures/tasks/update-time `
  -H "Content-Type: application/json" `
  -d "{\"taskId\":\"T001\",\"newDeadline\":30.00}"
```

```powershell
curl "http://localhost:8080/api/procedures/stats/export-anomaly-employees?riskLevel=高危&startDate=2026-01-01&endDate=2026-06-30"
```

统一响应格式：

```json
{
  "success": true,
  "message": "OK",
  "data": []
}
```
