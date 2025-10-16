package com.quizapp.controller;

import com.quizapp.dto.authenticationdto.ApiResponse;
import com.quizapp.dto.quizdto.*;
import com.quizapp.model.QuizAttempt;
import com.quizapp.model.User;
import com.quizapp.repository.UserRepository;
import com.quizapp.service.EmailService;
import com.quizapp.service.QuizService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This controller handles all quiz-related operations for users
// Requires USER role for all endpoints

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "*")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    // get all topics with question statistics
    @GetMapping("/topics")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<TopicStatisticsDto>> getAllTopicsWithStats() {
        List<TopicStatisticsDto> topics = quizService.getAllTopicsWithStats();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("=== TEST ENDPOINT CALLED ===");
        return ResponseEntity.ok("Test endpoint works!");
    }

    /**
     * TEST ENDPOINT 2 - With USER role
     * GET /api/quiz/test-auth
     */
    @GetMapping("/test-auth")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> testAuthEndpoint() {
        System.out.println("=== TEST AUTH ENDPOINT CALLED ===");
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication().getName();
        return ResponseEntity.ok("Authenticated as: " + email);
    }

    // generate new quiz
    @PostMapping("/generate")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> generateQuiz(@Valid @RequestBody QuizGenerationRequest request) {
        try {
            QuizResponse response = quizService.generateQuiz(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // submit quiz answers
    @PostMapping("/submit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> submitQuiz(@Valid @RequestBody QuizSubmissionRequest request) {
        try {
            QuizResultResponse response = quizService.submitQuiz(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            e.printStackTrace();
            String message = e.getMessage() != null ? e.getMessage() : "Error submitting quiz";
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // get user's quiz history
    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getQuizHistory() {
        try {
            List<QuizHistoryDto> history = quizService.getUserQuizHistory();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            e.printStackTrace(); // This will print the full error
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }

    @GetMapping("/result/{attemptId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getQuizResultByAttemptId(@PathVariable Long attemptId) {
        try {
            QuizResultResponse response = quizService.getQuizResultByAttemptId(attemptId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, "Error: " + e.getMessage()));
        }
    }

    @PostMapping("/send-quiz-result")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> sendQuizResult(@RequestBody QuizResultResponse resultRequest,
                                            @RequestParam("email") String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Topic name can be a list — take the first one if multiple
            String topicName = resultRequest.getTopicNames() != null && !resultRequest.getTopicNames().isEmpty()
                    ? resultRequest.getTopicNames().get(0)
                    : "Quiz";

            emailService.sendQuizResultEmail(
                    user.getEmail(),
                    user.getFullName(),
                    topicName,
                    resultRequest.getScore(),
                    resultRequest.getTotalQuestions(),
                    resultRequest.getCorrectAnswers(),
                    resultRequest.getWrongAnswers(),
                    resultRequest.getPercentage()
            );

            return ResponseEntity.ok(new ApiResponse(true, "Quiz results sent successfully to " + user.getEmail()));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to send quiz results: " + e.getMessage()));
        }
    }
}
