package com.example.learning.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public record ProcessCheckinRequest(
        @JsonAlias("p_record_id")
        @NotBlank String recordId,
        @JsonAlias("p_note_id")
        Integer noteId,
        @JsonAlias("p_device_info")
        String deviceInfo
) {
}
