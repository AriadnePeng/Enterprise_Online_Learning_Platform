package com.example.learning.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BatchAssignTaskRequest(
        @JsonAlias("p_task_id")
        @NotBlank String taskId,
        @JsonAlias("p_task_name")
        @NotBlank String taskName,
        @JsonAlias("p_creator_id")
        @NotBlank String creatorId,
        @JsonAlias("p_target_position")
        @NotBlank String targetPosition,
        @JsonAlias("p_deadline")
        @NotNull @DecimalMin("0.01") BigDecimal deadline
) {
}
