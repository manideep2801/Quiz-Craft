package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// User's answers for a quiz

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionRequest {

    private String quizId;
    private List<UserAnswerDto> answers;
}
