package com.quizapp.dto.admindto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This dto is used to send option details to the admin

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OptionResponseDTO {

    private Long id;
    private String optionText;
    private Boolean isCorrect;
}
