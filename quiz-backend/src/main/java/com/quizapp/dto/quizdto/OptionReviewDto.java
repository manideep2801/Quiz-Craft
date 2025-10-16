package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Shows option with correct/selected flags

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionReviewDto {

    private Long optionId;
    private String optionText;
    private Boolean isCorrect;
    private Boolean wasSelected;
}
