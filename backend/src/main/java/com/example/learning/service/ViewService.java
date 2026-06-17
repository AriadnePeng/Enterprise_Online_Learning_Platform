package com.example.learning.service;

import com.example.learning.mapper.ViewMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ViewService {
    private final ViewMapper viewMapper;

    public ViewService(ViewMapper viewMapper) {
        this.viewMapper = viewMapper;
    }

    public List<Map<String, Object>> taskProgressOverview() {
        return viewMapper.selectTaskProgressOverview();
    }

    public List<Map<String, Object>> delayUserWarning() {
        return viewMapper.selectDelayUserWarning();
    }

    public List<Map<String, Object>> allStudentLearningExamStats() {
        return viewMapper.selectAllStudentLearningExamStats();
    }

    public List<Map<String, Object>> employeeAnomalyBehavior() {
        return viewMapper.selectEmployeeAnomalyBehavior();
    }

    public List<Map<String, Object>> userSafe() {
        return viewMapper.selectUserSafe();
    }

    public List<Map<String, Object>> lecturerStudentNotes() {
        return viewMapper.selectLecturerStudentNotes();
    }

    public List<Map<String, Object>> courseCategoryStats() {
        return viewMapper.selectCourseCategoryStats();
    }

    public List<Map<String, Object>> courseListExtended() {
        return viewMapper.selectCourseListExtended();
    }

    public List<Map<String, Object>> examScoreSummary() {
        return viewMapper.selectExamScoreSummary();
    }

    public List<Map<String, Object>> answerSheetDetail() {
        return viewMapper.selectAnswerSheetDetail();
    }
}
