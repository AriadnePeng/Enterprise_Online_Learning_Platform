package com.example.learning.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record UpdateTaskTimeRequest(
        @JsonAlias("p_task_id")
        @NotBlank String taskId,
        @JsonAlias("p_new_deadline")
        @NotNull @DecimalMin("0.01") BigDecimal newDeadline
) {
}
