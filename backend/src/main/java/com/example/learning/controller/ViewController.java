package com.example.learning.controller;

import com.example.learning.common.ApiResponse;
import com.example.learning.service.ViewService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/views")
public class ViewController {
    private final ViewService viewService;

    public ViewController(ViewService viewService) {
        this.viewService = viewService;
    }

    @GetMapping("/tasks/progress-overview")
    public ApiResponse<List<Map<String, Object>>> taskProgressOverview() {
        return ApiResponse.ok(viewService.taskProgressOverview());
    }

    @GetMapping("/tasks/delay-warnings")
    public ApiResponse<List<Map<String, Object>>> delayUserWarning() {
        return ApiResponse.ok(viewService.delayUserWarning());
    }

    @GetMapping("/stats/learning-exam")
    public ApiResponse<List<Map<String, Object>>> allStudentLearningExamStats() {
        return ApiResponse.ok(viewService.allStudentLearningExamStats());
    }

    @GetMapping("/stats/employee-anomalies")
    public ApiResponse<List<Map<String, Object>>> employeeAnomalyBehavior() {
        return ApiResponse.ok(viewService.employeeAnomalyBehavior());
    }

    @GetMapping("/users/safe")
    public ApiResponse<List<Map<String, Object>>> userSafe() {
        return ApiResponse.ok(viewService.userSafe());
    }

    @GetMapping("/notes/lecturer-student")
    public ApiResponse<List<Map<String, Object>>> lecturerStudentNotes() {
        return ApiResponse.ok(viewService.lecturerStudentNotes());
    }

    @GetMapping("/courses/category-stats")
    public ApiResponse<List<Map<String, Object>>> courseCategoryStats() {
        return ApiResponse.ok(viewService.courseCategoryStats());
    }

    @GetMapping("/courses/list-extended")
    public ApiResponse<List<Map<String, Object>>> courseListExtended() {
        return ApiResponse.ok(viewService.courseListExtended());
    }

    @GetMapping("/exams/score-summary")
    public ApiResponse<List<Map<String, Object>>> examScoreSummary() {
        return ApiResponse.ok(viewService.examScoreSummary());
    }

    @GetMapping("/exams/answer-sheets")
    public ApiResponse<List<Map<String, Object>>> answerSheetDetail() {
        return ApiResponse.ok(viewService.answerSheetDetail());
    }
}
