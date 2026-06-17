package com.example.learning.service;

import com.example.learning.dto.AutoSubmitExamRequest;
import com.example.learning.dto.BatchAssignTaskRequest;
import com.example.learning.dto.UpdateNoteRequest;
import com.example.learning.dto.UpdateTaskTimeRequest;
import com.example.learning.mapper.ProcedureMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ProcedureService {
    private final ProcedureMapper procedureMapper;

    public ProcedureService(ProcedureMapper procedureMapper) {
        this.procedureMapper = procedureMapper;
    }

    public String batchAssignTask(BatchAssignTaskRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("taskId", request.taskId());
        params.put("taskName", request.taskName());
        params.put("creatorId", request.creatorId());
        params.put("targetPosition", request.targetPosition());
        params.put("deadline", request.deadline());
        procedureMapper.batchAssignTask(params);
        return String.valueOf(params.getOrDefault("message", "批量派发任务已执行"));
    }

    public String updateTaskTime(UpdateTaskTimeRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("taskId", request.taskId());
        params.put("newDeadline", request.newDeadline());
        procedureMapper.updateTaskTime(params);
        return String.valueOf(params.getOrDefault("message", "任务期限已更新"));
    }

    public List<Map<String, Object>> exportAnomalyEmployees(String riskLevel, String department,
                                                            LocalDate startDate, LocalDate endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("riskLevel", blankToNull(riskLevel));
        params.put("department", blankToNull(department));
        params.put("startDate", startDate);
        params.put("endDate", endDate);
        return procedureMapper.exportAnomalyEmployees(params);
    }

    public List<Map<String, Object>> archiveMonthlyStats(String statMonth) {
        Map<String, Object> params = Map.of("statMonth", statMonth);
        return procedureMapper.archiveMonthlyStats(params);
    }

    public void updateEmployeeNote(UpdateNoteRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("noteId", request.noteId());
        params.put("newContent", request.newContent());
        procedureMapper.updateEmployeeNote(params);
    }

    public List<Map<String, Object>> adminGetAllNotes() {
        return procedureMapper.adminGetAllNotes();
    }

    public void courseOffline(Integer courseId) {
        procedureMapper.courseOffline(Map.of("courseId", courseId));
    }

    public void autoSubmitExam(AutoSubmitExamRequest request) {
        Map<String, Object> params = new HashMap<>();
        params.put("examId", request.examId());
        params.put("userId", request.userId());
        procedureMapper.autoSubmitExam(params);
    }

    public List<Map<String, Object>> examPassRate(Integer examId) {
        return procedureMapper.examPassRate(Map.of("examId", examId));
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value;
    }
}
