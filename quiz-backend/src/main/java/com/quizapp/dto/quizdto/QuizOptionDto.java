package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Option sent to user without isCorrect flag

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizOptionDto {

    private Long optionId;
    private String optionText;
}
