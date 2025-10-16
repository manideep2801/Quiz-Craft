package com.quizapp.repository;

import com.quizapp.model.ActiveQuiz;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActiveQuizRepository extends JpaRepository<ActiveQuiz, String> {}
