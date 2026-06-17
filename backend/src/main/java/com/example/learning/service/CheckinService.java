package com.example.learning.service;

import com.example.learning.dto.ProcessCheckinRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class CheckinService {
    private final JdbcTemplate jdbcTemplate;

    public CheckinService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void process(ProcessCheckinRequest request) {
        jdbcTemplate.update("""
                INSERT INTO learning_checkin(note_id, record_id, checkin_time, device_info)
                VALUES (?, ?, CURRENT_TIME, ?)
                """, request.noteId(), request.recordId(), request.deviceInfo());
    }
}
