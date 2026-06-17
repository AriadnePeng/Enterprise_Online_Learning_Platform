package com.example.learning.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ViewMapper {
    List<Map<String, Object>> selectTaskProgressOverview();

    List<Map<String, Object>> selectDelayUserWarning();

    List<Map<String, Object>> selectAllStudentLearningExamStats();

    List<Map<String, Object>> selectEmployeeAnomalyBehavior();

    List<Map<String, Object>> selectUserSafe();

    List<Map<String, Object>> selectLecturerStudentNotes();

    List<Map<String, Object>> selectCourseCategoryStats();

    List<Map<String, Object>> selectCourseListExtended();

    List<Map<String, Object>> selectExamScoreSummary();

    List<Map<String, Object>> selectAnswerSheetDetail();
}
