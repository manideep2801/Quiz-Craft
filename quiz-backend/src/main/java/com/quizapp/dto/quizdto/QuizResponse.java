package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Complete quiz sent to user

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResponse {

    private String quizId;
    private List<QuizQuestionDto> questions;
    private Integer totalQuestions;
    private List<String> topicNames;
    private String difficultyLevel;
}
