USE enterprise_learning_db;

CREATE OR REPLACE VIEW `v_user_safe` AS
SELECT
    user_id,
    username,
    '******' AS user_pwd,
    CONCAT(SUBSTRING(contact, 1, 3), '****', SUBSTRING(contact, 8, 4)) AS contact,
    position AS `岗位`
FROM user_info;

CREATE OR REPLACE VIEW `v_lecturer_student_notes` AS
SELECT
    ln.note_id,
    ln.scope_id,
    ln.note_content,
    ln.note_create_time,
    ln.note_update_time
FROM learning_note ln;

CREATE OR REPLACE VIEW `v_task_progress_overview` AS
SELECT
    t.task_id AS `任务编号`,
    t.task_name AS `任务名称`,
    t.task_deadline AS `要求学时(小时)`,
    COUNT(p.progress_id) AS `参与总人数`,
    SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) AS `已完成人数`,
    ROUND(IFNULL(SUM(CASE WHEN p.status = 1 THEN 1 ELSE 0 END) / NULLIF(COUNT(p.progress_id), 0) * 100, 0), 2) AS `任务完成率(%)`
FROM training_task t
LEFT JOIN learning_progress p ON t.task_id = p.task_id
GROUP BY t.task_id, t.task_name, t.task_deadline;

CREATE OR REPLACE VIEW `v_delay_user_warning` AS
SELECT
    SUBSTRING(p.progress_id, 1, 8) AS `进度精简码`,
    u.user_id AS `学员编号`,
    u.username AS `学员姓名`,
    u.position AS `当前岗位`,
    t.task_name AS `高危未动工任务`,
    p.duration AS `已学时长(分钟)`,
    t.user_create_time AS `任务下发时间`
FROM user_info u
JOIN learning_progress p ON u.user_id = p.user_id
JOIN training_task t ON p.task_id = t.task_id
WHERE p.status = 0 AND p.duration = 0;

CREATE OR REPLACE VIEW `v_全体学员学习考试统计` AS
SELECT
    COUNT(DISTINCT u.user_id) AS `学员总数`,
    COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) AS `活跃学习人数`,
    ROUND(COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) * 100.0 / NULLIF(COUNT(DISTINCT u.user_id), 0), 2) AS `学习活跃率`,
    COUNT(DISTINCT CASE WHEN lp.status = 2 THEN u.user_id END) AS `完成任务人数`,
    COUNT(DISTINCT lp.progress_id) AS `总学习记录数`,
    IFNULL(ROUND(AVG(lp.duration), 0), 0) AS `人均学习时长分钟`,
    COUNT(DISTINCT es.score_id) AS `总考试人次`,
    COUNT(DISTINCT CASE WHEN es.pass_status = 1 THEN es.score_id END) AS `及格人次`,
    ROUND(COUNT(DISTINCT CASE WHEN es.pass_status = 1 THEN es.score_id END) * 100.0 / NULLIF(COUNT(DISTINCT es.score_id), 0), 2) AS `考试及格率`,
    IFNULL(ROUND(AVG(es.final_score), 2), 0) AS `全体平均分`,
    CASE
        WHEN ROUND(COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) * 100.0 / NULLIF(COUNT(DISTINCT u.user_id), 0), 2) >= 80
         AND ROUND(COUNT(DISTINCT CASE WHEN es.pass_status = 1 THEN es.score_id END) * 100.0 / NULLIF(COUNT(DISTINCT es.score_id), 0), 2) >= 85 THEN '优秀'
        WHEN ROUND(COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) * 100.0 / NULLIF(COUNT(DISTINCT u.user_id), 0), 2) >= 60
         AND ROUND(COUNT(DISTINCT CASE WHEN es.pass_status = 1 THEN es.score_id END) * 100.0 / NULLIF(COUNT(DISTINCT es.score_id), 0), 2) >= 70 THEN '良好'
        WHEN ROUND(COUNT(DISTINCT CASE WHEN lp.status IN (1, 2) THEN u.user_id END) * 100.0 / NULLIF(COUNT(DISTINCT u.user_id), 0), 2) >= 40
         AND ROUND(COUNT(DISTINCT CASE WHEN es.pass_status = 1 THEN es.score_id END) * 100.0 / NULLIF(COUNT(DISTINCT es.score_id), 0), 2) >= 50 THEN '合格'
        ELSE '待改进'
    END AS `综合评级`,
    NOW() AS `统计时间`
FROM user_info u
LEFT JOIN learning_progress lp ON u.user_id = lp.user_id
LEFT JOIN exam_score es ON u.user_id = es.user_id;

CREATE OR REPLACE VIEW `v_employee_anomaly_behavior` AS
SELECT
    ui.user_id,
    ui.username,
    ui.position AS `所属部门`,
    COUNT(DISTINCT lp.task_id) AS `参与任务数`,
    ROUND(COALESCE(SUM(lp.duration), 0) / 60.0, 2) AS `总学习时长_小时`,
    COUNT(DISTINCT DATE(lp.create_time)) AS `学习天数`,
    MAX(DATE(lp.create_time)) AS `最近学习日期`,
    CASE WHEN MAX(DATE(lp.create_time)) IS NULL THEN NULL ELSE DATEDIFF(NOW(), MAX(DATE(lp.create_time))) END AS `距最近学习天数`,
    COUNT(DISTINCT es.exam_id) AS `参加考试数`,
    ROUND(COALESCE(AVG(es.final_score), 0), 2) AS `平均成绩`,
    COALESCE(MIN(es.final_score), 0) AS `最低分`,
    COALESCE(MAX(es.final_score), 0) AS `最高分`,
    COUNT(DISTINCT lc.checkin_id) AS `打卡次数`,
    CASE
        WHEN MAX(DATE(lp.create_time)) IS NULL AND COUNT(DISTINCT es.exam_id) > 0 THEN '未学先考'
        WHEN MAX(DATE(lp.create_time)) IS NULL THEN '从未学习'
        WHEN DATEDIFF(NOW(), MAX(DATE(lp.create_time))) > 60 THEN '长期休眠'
        WHEN DATEDIFF(NOW(), MAX(DATE(lp.create_time))) > 30 THEN '休眠学员'
        WHEN ROUND(COALESCE(SUM(lp.duration), 0) / 60.0, 2) > 5 AND COUNT(DISTINCT DATE(lp.create_time)) < 3 THEN '疑似刷课时'
        WHEN ROUND(COALESCE(AVG(es.final_score), 0), 2) < 60 AND COUNT(DISTINCT es.exam_id) >= 2 THEN '连续不及格'
        WHEN COALESCE(MIN(es.final_score), 0) >= 90 AND COALESCE(MAX(es.final_score), 0) >= 90
         AND COUNT(DISTINCT es.exam_id) >= 1 AND ROUND(COALESCE(SUM(lp.duration), 0) / 60.0, 2) < 1 THEN '高分低学时-疑似作弊'
        ELSE '正常'
    END AS `异常标签`,
    CASE
        WHEN MAX(DATE(lp.create_time)) IS NULL THEN '高危'
        WHEN DATEDIFF(NOW(), MAX(DATE(lp.create_time))) > 60 THEN '高危'
        WHEN DATEDIFF(NOW(), MAX(DATE(lp.create_time))) > 30 THEN '中危'
        WHEN ROUND(COALESCE(SUM(lp.duration), 0) / 60.0, 2) > 5 AND COUNT(DISTINCT DATE(lp.create_time)) < 3 THEN '高危'
        WHEN COALESCE(MIN(es.final_score), 0) >= 90 AND ROUND(COALESCE(SUM(lp.duration), 0) / 60.0, 2) < 1 THEN '高危'
        ELSE '低危'
    END AS `风险等级`,
    NOW() AS `统计时间`
FROM user_info ui
LEFT JOIN learning_progress lp ON ui.user_id = lp.user_id
LEFT JOIN exam_score es ON ui.user_id = es.user_id
LEFT JOIN learning_checkin lc ON lp.progress_id = lc.record_id
GROUP BY ui.user_id, ui.username, ui.position;

CREATE OR REPLACE VIEW `vw_exam_score_summary` AS
SELECT
    s.score_id,
    u.user_id,
    u.username,
    u.position,
    e.exam_id,
    e.exam_name,
    s.final_score,
    CASE WHEN s.pass_status = 1 THEN '及格' ELSE '不及格' END AS pass_result,
    s.review_time,
    a.admin_name AS reviewer_name
FROM exam_score s
JOIN user_info u ON s.user_id = u.user_id
JOIN exam e ON s.exam_id = e.exam_id
JOIN administrator a ON s.admin_id = a.admin_id;

CREATE OR REPLACE VIEW `vw_answer_sheet_detail` AS
SELECT
    sh.sheet_id,
    u.user_id,
    u.username,
    e.exam_id,
    e.exam_name,
    sh.answer_content,
    sh.submit_time,
    CASE WHEN sh.review_status = 1 THEN '已批阅' ELSE '未批阅' END AS review_status_name,
    a.admin_name AS reviewer_name
FROM answer_sheet sh
JOIN user_info u ON sh.user_id = u.user_id
JOIN exam e ON sh.exam_id = e.exam_id
LEFT JOIN administrator a ON sh.admin_id = a.admin_id;

CREATE OR REPLACE VIEW `view_course_category_stats` AS
SELECT
    cc.category_id,
    cc.category_name,
    COUNT(DISTINCT c.course_id) AS total_courses,
    SUM(IFNULL(ch.duration, 0)) AS total_duration,
    SUM(IFNULL(CAST(REGEXP_REPLACE(lr.file_size, '[^0-9.]', '') AS DECIMAL(10,2)), 0)) AS total_resource_size
FROM course_category cc
LEFT JOIN course c ON c.category_id = cc.category_id
LEFT JOIN course_chapter ch ON ch.course_id = c.course_id
LEFT JOIN learning_resource lr ON lr.course_id = c.course_id
GROUP BY cc.category_id, cc.category_name;

CREATE OR REPLACE VIEW `v_course_list_extended` AS
SELECT
    c.course_id,
    c.course_name,
    c.course_code,
    cc.category_name,
    l.lecturer_name,
    c.course_status,
    c.course_desc
FROM course c
LEFT JOIN course_category cc ON c.category_id = cc.category_id
LEFT JOIN lecturer l ON c.lecturer_id = l.lecturer_id;

DROP PROCEDURE IF EXISTS sp_emp_update_note;
DELIMITER $$
CREATE PROCEDURE sp_emp_update_note(IN p_note_id INT, IN p_new_content TEXT)
BEGIN
    UPDATE learning_note
    SET note_content = p_new_content,
        note_update_time = NOW()
    WHERE note_id = p_note_id;
END$$

DROP PROCEDURE IF EXISTS sp_admin_get_all_notes$$
CREATE PROCEDURE sp_admin_get_all_notes()
BEGIN
    SELECT note_id, scope_id, note_content, note_create_time, note_update_time
    FROM learning_note;
END$$

DROP PROCEDURE IF EXISTS auto_submit_exam$$
CREATE PROCEDURE auto_submit_exam(IN p_exam_id INT, IN p_user_id VARCHAR(32))
BEGIN
    DECLARE v_score DECIMAL(5,2) DEFAULT 0;
    DECLARE v_pass_score DECIMAL(5,2) DEFAULT 0;
    DECLARE v_pass_status TINYINT DEFAULT 0;

    SELECT pass_score INTO v_pass_score
    FROM exam
    WHERE exam_id = p_exam_id;

    SELECT IFNULL(SUM(q.score), 0) INTO v_score
    FROM answer_sheet s
    JOIN exam_question q ON s.exam_id = q.exam_id
    WHERE s.exam_id = p_exam_id
      AND s.user_id = p_user_id
      AND q.question_type IN (1, 2)
      AND LOCATE(q.answer, s.answer_content) > 0;

    SET v_pass_status = IF(v_score >= v_pass_score, 1, 0);

    DELETE FROM exam_temp_result
    WHERE exam_id = p_exam_id AND user_id = p_user_id;

    INSERT INTO exam_temp_result(user_id, exam_id, objective_score, pass_status, create_time)
    VALUES(p_user_id, p_exam_id, v_score, v_pass_status, NOW());

    UPDATE answer_sheet
    SET review_status = 1
    WHERE exam_id = p_exam_id AND user_id = p_user_id;
END$$

DROP PROCEDURE IF EXISTS exam_pass_rate$$
CREATE PROCEDURE exam_pass_rate(IN p_exam_id INT)
BEGIN
    SELECT
        e.exam_id,
        e.exam_name,
        COUNT(s.score_id) AS total_students,
        SUM(s.pass_status) AS pass_students,
        ROUND(SUM(s.pass_status) * 100.0 / NULLIF(COUNT(s.score_id), 0), 2) AS pass_rate_percent
    FROM exam_score s
    JOIN exam e ON s.exam_id = e.exam_id
    WHERE s.exam_id = p_exam_id
    GROUP BY e.exam_id, e.exam_name;
END$$

DROP PROCEDURE IF EXISTS sp_course_offline$$
CREATE PROCEDURE sp_course_offline(IN p_course_id INT)
BEGIN
    UPDATE course SET course_status = 0 WHERE course_id = p_course_id;
    UPDATE course_chapter SET is_free = 0 WHERE course_id = p_course_id;
    UPDATE learning_resource SET resource_type = 0 WHERE course_id = p_course_id;
END$$

DROP PROCEDURE IF EXISTS sp_update_task_time$$
CREATE PROCEDURE sp_update_task_time(
    IN p_task_id VARCHAR(32),
    IN p_new_deadline DECIMAL(5,2),
    OUT p_result_msg VARCHAR(100)
)
BEGIN
    DECLARE v_task_exists INT DEFAULT 0;

    SELECT COUNT(*) INTO v_task_exists
    FROM training_task
    WHERE task_id = p_task_id;

    IF v_task_exists = 0 THEN
        SET p_result_msg = CONCAT('延期取消：未找到指定编号 [', p_task_id, ']。');
    ELSE
        UPDATE training_task SET task_deadline = p_new_deadline WHERE task_id = p_task_id;
        UPDATE learning_progress SET deadline = p_new_deadline WHERE task_id = p_task_id;
        SET p_result_msg = CONCAT('延期成功！指标已统一更新为 ', p_new_deadline);
    END IF;
END$$

DROP PROCEDURE IF EXISTS sp_batch_assign_task$$
CREATE PROCEDURE sp_batch_assign_task(
    IN p_task_id VARCHAR(32),
    IN p_task_name VARCHAR(128),
    IN p_creator_id VARCHAR(32),
    IN p_target_position VARCHAR(64),
    IN p_deadline DECIMAL(5,2),
    OUT p_message VARCHAR(100)
)
BEGIN
    DECLARE v_user_count INT DEFAULT 0;

    SELECT COUNT(*) INTO v_user_count
    FROM user_info
    WHERE position = p_target_position AND role = '学员';

    IF v_user_count = 0 THEN
        SET p_message = CONCAT('派发取消：未找到岗位为 [', p_target_position, '] 的学员。');
    ELSE
        INSERT INTO training_task(task_id, user_id, task_name, task_scope_type, task_deadline, learning_status)
        VALUES(p_task_id, p_creator_id, p_task_name, '岗位', p_deadline, 1);

        INSERT INTO learning_progress(progress_id, user_id, task_id, duration, deadline, status)
        SELECT REPLACE(UUID(), '-', ''), user_id, p_task_id, 0, p_deadline, 0
        FROM user_info
        WHERE position = p_target_position AND role = '学员';

        SET p_message = CONCAT('派发成功！任务已下发并初始化了 ', v_user_count, ' 名学员的进度档案。');
    END IF;
END$$

DROP PROCEDURE IF EXISTS sp_archive_monthly_stats$$
CREATE PROCEDURE sp_archive_monthly_stats(IN p_stat_month VARCHAR(7))
BEGIN
    SELECT
        p_stat_month AS `统计月份`,
        `学员总数`,
        `学习活跃率`,
        `考试及格率`,
        `综合评级`,
        NOW() AS `归档完成时间`
    FROM `v_全体学员学习考试统计`;
END$$

DROP PROCEDURE IF EXISTS sp_export_anomaly_employees$$
CREATE PROCEDURE sp_export_anomaly_employees(
    IN p_risk_level VARCHAR(10),
    IN p_department VARCHAR(64),
    IN p_start_date DATE,
    IN p_end_date DATE
)
BEGIN
    SELECT *
    FROM `v_employee_anomaly_behavior`
    WHERE `异常标签` <> '正常'
      AND (p_risk_level IS NULL OR `风险等级` = p_risk_level)
      AND (p_department IS NULL OR `所属部门` = p_department);
END$$

DELIMITER ;
