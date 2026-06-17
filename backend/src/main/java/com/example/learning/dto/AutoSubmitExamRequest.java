package com.example.learning.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AutoSubmitExamRequest(
        @JsonAlias("p_exam_id")
        @NotNull Integer examId,
        @JsonAlias("p_user_id")
        @NotBlank String userId
) {
}
