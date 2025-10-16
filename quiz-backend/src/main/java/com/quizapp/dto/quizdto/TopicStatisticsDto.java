package com.quizapp.dto.quizdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Topic with question count statistics

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopicStatisticsDto {

    private Long topicId;
    private String topicName;
    private String description;
    private Long beginnerQuestions;
    private Long moderateQuestions;
    private Long expertQuestions;
    private Long totalQuestions;
}
