package com.quizapp.dto.admindto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This dto is used when admin adds options to a question

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionRequest {

    @NotBlank(message = "Option text is required")
    private String optionText;

    @NotNull(message = "Must specify if option is correct")
    private Boolean isCorrect;
}
