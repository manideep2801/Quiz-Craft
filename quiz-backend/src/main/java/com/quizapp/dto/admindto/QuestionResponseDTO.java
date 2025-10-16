package com.quizapp.dto.admindto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// This dto is used to send question details to admin
// includes correct answer information

@Data
@NoArgsConstructor@AllArgsConstructor
public class QuestionResponseDTO {

    private Long id;
    private String questionText;
    private String topicName;
    private String difficultyLevel;
    private List<OptionResponseDTO> options;

}
