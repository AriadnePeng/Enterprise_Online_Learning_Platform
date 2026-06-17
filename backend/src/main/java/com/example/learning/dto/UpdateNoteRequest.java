package com.example.learning.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateNoteRequest(
        @JsonAlias("p_note_id")
        @NotNull Integer noteId,
        @JsonAlias("p_new_content")
        @NotBlank String newContent
) {
}
