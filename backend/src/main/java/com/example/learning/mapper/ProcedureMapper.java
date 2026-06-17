package com.example.learning.mapper;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface ProcedureMapper {
    void batchAssignTask(Map<String, Object> params);

    void updateTaskTime(Map<String, Object> params);

    List<Map<String, Object>> exportAnomalyEmployees(Map<String, Object> params);

    List<Map<String, Object>> archiveMonthlyStats(Map<String, Object> params);

    void updateEmployeeNote(Map<String, Object> params);

    List<Map<String, Object>> adminGetAllNotes();

    void courseOffline(Map<String, Object> params);

    void autoSubmitExam(Map<String, Object> params);

    List<Map<String, Object>> examPassRate(Map<String, Object> params);
}
