package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Shows questions with correct answer after submission

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionReviewDto {

    private Long questionId;
    private String questionText;
    private String topicName;
    private Long selectedOptionId;
    private Long correctOptionId;
    private Boolean isCorrect;
    private List<OptionReviewDto> options;
}
