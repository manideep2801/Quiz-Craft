package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Single answer from user

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAnswerDto {

    private Long questionId;
    private Long selectedOptionId;
}
