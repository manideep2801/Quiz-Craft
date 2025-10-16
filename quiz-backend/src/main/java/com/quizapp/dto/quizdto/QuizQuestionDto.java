package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Question sent to user during quiz

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDto {

    private Long questionId;
    private String questionText;
    private String topicName;
    private List<QuizOptionDto> options;
}
