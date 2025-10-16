package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Result after quiz submission

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultResponse {

    private Long attemptId;
    private Integer score;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private Double percentage;
    private List<String> topicNames;
    private String difficultyLevel;
    private List<QuestionReviewDto> questionReviews;
    private Boolean emailSent;
}
