package com.quizapp.dto.admindto;

import com.quizapp.model.Question;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {

    @NotNull(message = "Topic ID is required")
    private Long topicId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @NotNull(message = "Difficulty level is required")
    private Question.DifficultyLevel difficultyLevel;

    @NotNull(message = "Options are required")
    @Size(min = 2, max = 6, message = "Must have between 2 and 6 options")
    private List<OptionRequest> options;
}
