package com.example.learning.controller;

import com.example.learning.common.ApiResponse;
import com.example.learning.dto.AutoSubmitExamRequest;
import com.example.learning.dto.BatchAssignTaskRequest;
import com.example.learning.dto.UpdateNoteRequest;
import com.example.learning.dto.UpdateTaskTimeRequest;
import com.example.learning.service.ProcedureService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/procedures")
public class ProcedureController {
    private final ProcedureService procedureService;

    public ProcedureController(ProcedureService procedureService) {
        this.procedureService = procedureService;
    }

    @PostMapping("/tasks/batch-assign")
    public ApiResponse<Map<String, String>> batchAssignTask(@Valid @RequestBody BatchAssignTaskRequest request) {
        String message = procedureService.batchAssignTask(request);
        return ApiResponse.ok(message, Map.of("message", message));
    }

    @PostMapping("/tasks/update-time")
    public ApiResponse<Map<String, String>> updateTaskTime(@Valid @RequestBody UpdateTaskTimeRequest request) {
        String message = procedureService.updateTaskTime(request);
        return ApiResponse.ok(message, Map.of("message", message));
    }

    @GetMapping("/stats/export-anomaly-employees")
    public ApiResponse<List<Map<String, Object>>> exportAnomalyEmployees(
            @RequestParam(required = false) String riskLevel,
            @RequestParam(required = false, name = "p_risk_level") String pRiskLevel,
            @RequestParam(required = false) String department,
            @RequestParam(required = false, name = "p_department") String pDepartment,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false, name = "p_start_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate pStartDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false, name = "p_end_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate pEndDate) {
        LocalDate actualStartDate = startDate != null ? startDate : (pStartDate != null ? pStartDate : LocalDate.of(2026, 1, 1));
        LocalDate actualEndDate = endDate != null ? endDate : (pEndDate != null ? pEndDate : LocalDate.of(2026, 12, 31));
        return ApiResponse.ok(procedureService.exportAnomalyEmployees(
                riskLevel != null ? riskLevel : pRiskLevel,
                department != null ? department : pDepartment,
                actualStartDate,
                actualEndDate
        ));
    }

    @PostMapping("/stats/archive-monthly/{statMonth}")
    public ApiResponse<List<Map<String, Object>>> archiveMonthlyStats(
            @PathVariable @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}") String statMonth) {
        return ApiResponse.ok("月度统计归档完成", procedureService.archiveMonthlyStats(statMonth));
    }

    @PostMapping("/notes/update")
    public ApiResponse<Void> updateEmployeeNote(@Valid @RequestBody UpdateNoteRequest request) {
        procedureService.updateEmployeeNote(request);
        return ApiResponse.ok("笔记修改完成", null);
    }

    @GetMapping("/notes/admin-all")
    public ApiResponse<List<Map<String, Object>>> adminGetAllNotes() {
        return ApiResponse.ok(procedureService.adminGetAllNotes());
    }

    @PostMapping("/courses/{courseId}/offline")
    public ApiResponse<Void> courseOffline(@PathVariable @NotNull Integer courseId) {
        procedureService.courseOffline(courseId);
        return ApiResponse.ok("课程下线完成", null);
    }

    @PostMapping("/exams/auto-submit")
    public ApiResponse<Void> autoSubmitExam(@Valid @RequestBody AutoSubmitExamRequest request) {
        procedureService.autoSubmitExam(request);
        return ApiResponse.ok("自动交卷完成", null);
    }

    @GetMapping("/exams/{examId}/pass-rate")
    public ApiResponse<List<Map<String, Object>>> examPassRate(@PathVariable @NotNull Integer examId) {
        return ApiResponse.ok(procedureService.examPassRate(examId));
    }
}
