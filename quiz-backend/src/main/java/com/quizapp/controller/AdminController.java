package com.quizapp.controller;

import com.quizapp.dto.admindto.QuestionRequest;
import com.quizapp.dto.admindto.QuestionResponseDTO;
import com.quizapp.dto.admindto.TopicRequest;
import com.quizapp.dto.authenticationdto.ApiResponse;
import com.quizapp.model.Topic;
import com.quizapp.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// This controller handles all admin operations

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // create new topic
    @PostMapping("/topics")
    public ResponseEntity<?> createTopic(@Valid @RequestBody TopicRequest request) {
        try {
            Topic topic = adminService.createTopic(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(topic);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // get all topics
    @GetMapping("/topics")
    public ResponseEntity<List<Topic>> getAllTopics() {
        List<Topic> topics = adminService.getAllTopics();
        return ResponseEntity.ok(topics);
    }

    // get topic by id
    @GetMapping("/topics/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable Long id) {
        try {
            Topic topic = adminService.getTopicById(id);
            return ResponseEntity.ok(topic);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // update topic
    @PutMapping("/topics/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable Long id,
                                         @Valid @RequestBody TopicRequest request) {
        try {
            Topic topic = adminService.updateTopic(id, request);
            return ResponseEntity.ok(topic);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // delete topic
    @DeleteMapping("/topics/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable Long id) {
        try {
            adminService.deleteTopic(id);
            return ResponseEntity.ok(new ApiResponse(true, "Topic deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // create new question
    @PostMapping("/questions")
    public ResponseEntity<?> createQuestion(@Valid @RequestBody QuestionRequest request) {
        try {
            QuestionResponseDTO question = adminService.createQuestion(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(question);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // get all questions
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionResponseDTO>> getAllQuestions() {
        List<QuestionResponseDTO> questions = adminService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    // get question by topic
    @GetMapping("/questions/topic/{topicId}")
    public ResponseEntity<?> getQuestionsByTopic(@PathVariable Long topicId) {
        try {
            List<QuestionResponseDTO> questions = adminService.getQuestionsByTopic(topicId);
            return ResponseEntity.ok(questions);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // get question by id
    @GetMapping("/questions/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {
        try {
            QuestionResponseDTO question = adminService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // update question
    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id,
                                            @Valid @RequestBody QuestionRequest request) {
        try {
            QuestionResponseDTO question = adminService.updateQuestion(id, request);
            return ResponseEntity.ok(question);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    // delete question
    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        try {
            adminService.deleteQuestion(id);
            return ResponseEntity.ok(new ApiResponse(true, "Question deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
