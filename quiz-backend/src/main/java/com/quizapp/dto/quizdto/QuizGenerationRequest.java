package com.quizapp.dto.quizdto;

import com.quizapp.model.Question;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// This dto is used when the user wants to generate the quiz

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizGenerationRequest {

    @NotEmpty(message = "At least one topic must be selected")
    private List<Long> topicIds;

    @NotNull(message = "Difficulty level is required")
    private Question.DifficultyLevel difficultyLevel;

    @Min(value = 2, message = "Minimum 2 questions required")
    private Integer numberOfQuestions = 10;

}
