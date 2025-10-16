package com.quizapp.repository;

import com.quizapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByTopicIdAndDifficultyLevel(
            Long topicId,
            Question.DifficultyLevel difficultyLevel
    );

    @Query("SELECT COUNT(q) FROM Question q WHERE q.topic.id = :topicId AND q.difficultyLevel = :level")
    Long countByTopicAndDifficultyLevel(
            @Param("topicId") Long topicId,
            @Param("level") Question.DifficultyLevel level
    );

}
