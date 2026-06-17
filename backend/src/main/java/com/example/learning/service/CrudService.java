package com.example.learning.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CrudService {
    private static final Map<String, TableConfig> TABLES = Map.ofEntries(
            entry("user_info", "user_id", false, "user_id", "username", "password", "role", "position", "learning_status", "avatar", "contact", "user_create_time"),
            entry("training_task", "task_id", false, "task_id", "user_id", "task_name", "task_scope_type", "task_deadline", "learning_status", "user_create_time"),
            entry("learning_progress", "progress_id", false, "progress_id", "user_id", "task_id", "duration", "deadline", "status", "create_time"),
            entry("lecturer", "lecturer_id", true, "lecturer_id", "lecturer_name", "title", "department", "phone", "intro"),
            entry("course_category", "category_id", true, "category_id", "category_name", "level", "sort", "create_time"),
            entry("course", "course_id", true, "course_id", "course_name", "course_code", "category_id", "lecturer_id", "course_status", "course_desc", "total_duration"),
            entry("course_chapter", "chapter_id", true, "chapter_id", "course_id", "chapter_name", "duration", "sort", "is_free"),
            entry("learning_resource", "resource_id", true, "resource_id", "course_id", "resource_name", "resource_type", "file_size", "upload_time"),
            entry("task_scope", "scope_id", true, "scope_id", "task_id", "scope_type", "scope_ref_id", "scope_name"),
            entry("learning_checkin", "checkin_id", true, "checkin_id", "note_id", "record_id", "checkin_time", "device_info"),
            entry("administrator", "admin_id", true, "admin_id", "admin_name", "role", "permission_scope"),
            entry("learning_note", "note_id", true, "note_id", "scope_id", "note_content", "note_create_time", "note_update_time"),
            entry("exam", "exam_id", true, "exam_id", "exam_name", "exam_desc", "exam_rule", "exam_duration", "start_time", "end_time", "pass_score", "exam_status", "admin_id"),
            entry("exam_question", "question_id", true, "question_id", "exam_id", "question_content", "question_type", "options", "answer", "score"),
            entry("answer_sheet", "sheet_id", true, "sheet_id", "user_id", "exam_id", "answer_content", "submit_time", "review_status", "admin_id"),
            entry("exam_score", "score_id", true, "score_id", "user_id", "exam_id", "final_score", "pass_status", "review_time", "admin_id"),
            entry("exam_temp_result", "result_id", true, "result_id", "user_id", "exam_id", "objective_score", "pass_status", "create_time")
    );

    private final JdbcTemplate jdbcTemplate;

    public CrudService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> list(String table, String keyword) {
        TableConfig config = config(table);
        if (!StringUtils.hasText(keyword)) {
            return jdbcTemplate.queryForList("SELECT * FROM `" + config.name() + "` LIMIT 500");
        }
        String where = config.columns().stream()
                .map(column -> "CAST(`" + column + "` AS CHAR) LIKE ?")
                .collect(Collectors.joining(" OR "));
        List<Object> args = config.columns().stream().map(column -> "%" + keyword + "%").collect(Collectors.toList());
        return jdbcTemplate.queryForList("SELECT * FROM `" + config.name() + "` WHERE " + where + " LIMIT 500", args.toArray());
    }

    public Map<String, Object> detail(String table, String id) {
        TableConfig config = config(table);
        List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                "SELECT * FROM `" + config.name() + "` WHERE `" + config.primaryKey() + "` = ? LIMIT 1",
                id
        );
        if (rows.isEmpty()) {
            throw new IllegalArgumentException("记录不存在");
        }
        return rows.get(0);
    }

    public Map<String, Object> add(String table, Map<String, Object> data) {
        TableConfig config = config(table);
        Map<String, Object> values = writableValues(config, data, true);
        if (values.isEmpty()) {
            throw new IllegalArgumentException("没有可新增的字段");
        }

        String columns = values.keySet().stream().map(column -> "`" + column + "`").collect(Collectors.joining(", "));
        String placeholders = values.keySet().stream().map(column -> "?").collect(Collectors.joining(", "));
        jdbcTemplate.update("INSERT INTO `" + config.name() + "` (" + columns + ") VALUES (" + placeholders + ")", values.values().toArray());

        Object id = values.get(config.primaryKey());
        if (id == null && config.autoIncrement()) {
            id = jdbcTemplate.queryForObject("SELECT LAST_INSERT_ID()", Object.class);
        }
        return id == null ? data : detail(table, String.valueOf(id));
    }

    public Map<String, Object> update(String table, Map<String, Object> data) {
        TableConfig config = config(table);
        Object id = data.get(config.primaryKey());
        if (id == null || !StringUtils.hasText(String.valueOf(id))) {
            throw new IllegalArgumentException("缺少主键字段：" + config.primaryKey());
        }

        Map<String, Object> values = writableValues(config, data, false);
        values.remove(config.primaryKey());
        if (values.isEmpty()) {
            throw new IllegalArgumentException("没有可更新的字段");
        }

        String setSql = values.keySet().stream().map(column -> "`" + column + "` = ?").collect(Collectors.joining(", "));
        List<Object> args = new ArrayList<>(values.values());
        args.add(id);
        jdbcTemplate.update("UPDATE `" + config.name() + "` SET " + setSql + " WHERE `" + config.primaryKey() + "` = ?", args.toArray());
        return detail(table, String.valueOf(id));
    }

    public void delete(String table, String id) {
        TableConfig config = config(table);
        jdbcTemplate.update("DELETE FROM `" + config.name() + "` WHERE `" + config.primaryKey() + "` = ?", id);
    }

    private Map<String, Object> writableValues(TableConfig config, Map<String, Object> data, boolean inserting) {
        Map<String, Object> values = new LinkedHashMap<>();
        for (String column : config.columns()) {
            if (!data.containsKey(column)) {
                continue;
            }
            Object value = data.get(column);
            if (inserting && config.autoIncrement() && config.primaryKey().equals(column)
                    && (value == null || "0".equals(String.valueOf(value)) || !StringUtils.hasText(String.valueOf(value)))) {
                continue;
            }
            values.put(column, value);
        }
        return values;
    }

    private TableConfig config(String table) {
        TableConfig config = TABLES.get(table);
        if (config == null) {
            throw new IllegalArgumentException("不支持的数据表：" + table);
        }
        return config;
    }

    private static Map.Entry<String, TableConfig> entry(String name, String primaryKey, boolean autoIncrement, String... columns) {
        return Map.entry(name, new TableConfig(name, primaryKey, autoIncrement, Set.of(columns)));
    }

    private record TableConfig(String name, String primaryKey, boolean autoIncrement, Set<String> columns) {
    }
}
