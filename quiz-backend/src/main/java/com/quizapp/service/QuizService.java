package com.quizapp.service;

import com.quizapp.dto.quizdto.*;
import com.quizapp.model.*;
import com.quizapp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ActiveQuizRepository activeQuizRepository;

    // Generating quiz based on user's selection
    // user can select multiple topics, difficulty level, and number of questions
    public QuizResponse generateQuiz(QuizGenerationRequest request) {

        List<Question> allQuestions = new ArrayList<>();

        for (Long topicId : request.getTopicIds()) {
            List<Question> topicQuestion = questionRepository
                    .findByTopicIdAndDifficultyLevel(topicId, request.getDifficultyLevel());
            allQuestions.addAll(topicQuestion);
        }

        if (allQuestions.isEmpty()) {
            throw new RuntimeException("No questions found for selected topics and difficulty level");
        }

        Collections.shuffle(allQuestions);
        int questionsToTake = Math.min(request.getNumberOfQuestions(), allQuestions.size());
        List<Question> selectedQuestions = allQuestions.subList(0, questionsToTake);

        String quizId = UUID.randomUUID().toString();
        ActiveQuiz activeQuiz = new ActiveQuiz(quizId, selectedQuestions, LocalDateTime.now());
        activeQuizRepository.save(activeQuiz);

        List<QuizQuestionDto> questionDTOs = selectedQuestions.stream()
                .map(this::convertToQuizQuestionDto)
                .collect(Collectors.toList());

        List<String> topicNames = topicRepository.findAllById(request.getTopicIds())
                .stream()
                .map(Topic::getName)
                .collect(Collectors.toList());

        return new QuizResponse(
                quizId,
                questionDTOs,
                questionDTOs.size(),
                topicNames,
                request.getDifficultyLevel().name()
        );
    }

    // Submitting the quiz and calculate results
    // Saves the quiz attempt, calculate scores, sends email to user
    @Transactional
    public QuizResultResponse submitQuiz(QuizSubmissionRequest request) {

        System.out.println("\n========== QUIZ SUBMISSION START ==========");
        System.out.println("Quiz ID: " + request.getQuizId());

        if (request.getAnswers() == null || request.getAnswers().isEmpty()) {
            throw new RuntimeException("No answers provided in the request");
        }

        // Debug log each answer received
        request.getAnswers().forEach(a -> System.out.println(
                " -> Question ID: " + a.getQuestionId() + ", Selected Option ID: " + a.getSelectedOptionId()
        ));

        // ✅ Validate that all answers contain both IDs
        boolean invalid = request.getAnswers().stream()
                .anyMatch(a -> a.getQuestionId() == null || a.getSelectedOptionId() == null);
        if (invalid) {
            throw new RuntimeException("Some answers have missing questionId or selectedOptionId");
        }

        // ✅ Load the quiz from DB
        ActiveQuiz activeQuiz = activeQuizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found or expired"));

        List<Question> questions = activeQuiz.getQuestions();
        if (questions == null || questions.isEmpty()) {
            throw new RuntimeException("No questions found for this quiz ID");
        }

        // ✅ Identify current user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found for email: " + email));

        // ✅ Map questionId -> selectedOptionId safely
        Map<Long, Long> userAnswerMap = request.getAnswers().stream()
                .filter(a -> a.getQuestionId() != null && a.getSelectedOptionId() != null)
                .collect(Collectors.toMap(
                        UserAnswerDto::getQuestionId,
                        UserAnswerDto::getSelectedOptionId
                ));

        int correctAnswers = 0;
        List<QuestionReviewDto> questionReviews = new ArrayList<>();

        // ✅ Evaluate answers
        for (Question question : questions) {
            Long selectedOptionId = userAnswerMap.get(question.getId());
            if (selectedOptionId == null) {
                System.out.println("⚠️ Skipping question " + question.getId() + " (no answer provided)");
                continue;
            }

            Option correctOption = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No correct option found for question " + question.getId()));

            boolean isCorrect = correctOption.getId().equals(selectedOptionId);
            if (isCorrect) correctAnswers++;

            questionReviews.add(createQuestionReviewDto(
                    question,
                    selectedOptionId,
                    correctOption.getId(),
                    isCorrect
            ));
        }

        int totalQuestions = questions.size();
        int wrongAnswers = totalQuestions - correctAnswers;
        double percentage = (double) correctAnswers * 100 / totalQuestions;

        Set<Topic> topics = questions.stream().map(Question::getTopic).collect(Collectors.toSet());
        List<String> topicNames = topics.stream().map(Topic::getName).toList();

        Topic firstTopic = questions.get(0).getTopic();
        QuizAttempt quizAttempt = new QuizAttempt();
        quizAttempt.setUser(user);
        quizAttempt.setTopic(firstTopic);
        quizAttempt.setDifficultyLevel(questions.get(0).getDifficultyLevel());
        quizAttempt.setScore(correctAnswers);
        quizAttempt.setTotalQuestions(totalQuestions);
        quizAttemptRepository.save(quizAttempt);

        // ✅ Save each answer
        for (Question question : questions) {
            Long selectedOptionId = userAnswerMap.get(question.getId());
            Option selectedOption = selectedOptionId != null ?
                    optionRepository.findById(selectedOptionId).orElse(null) : null;

            Option correctOption = question.getOptions().stream()
                    .filter(Option::getIsCorrect)
                    .findFirst().orElse(null);

            boolean isCorrect = correctOption != null &&
                    correctOption.getId().equals(selectedOptionId);

            UserAnswer userAnswer = new UserAnswer();
            userAnswer.setQuizAttempt(quizAttempt);
            userAnswer.setQuestion(question);
            userAnswer.setSelectedOption(selectedOption);
            userAnswer.setCorrect(isCorrect);
            userAnswerRepository.save(userAnswer);
        }

        // ✅ Try sending result email
        boolean emailSent = false;
        if (user.getIsEmailVerified() != null && user.getIsEmailVerified()) {
            try {
                emailService.sendQuizResultEmail(
                        user.getEmail(),
                        user.getFullName(),
                        String.join(", ", topicNames),
                        correctAnswers,
                        totalQuestions,
                        correctAnswers,
                        wrongAnswers,
                        percentage
                );
                emailSent = true;
            } catch (Exception e) {
                System.err.println("Failed to send quiz result email: " + e.getMessage());
            }
        }

        // ✅ Clean up this active quiz
        activeQuizRepository.delete(activeQuiz);

        System.out.println("✅ Quiz submission completed successfully!");
        System.out.println("Score: " + correctAnswers + "/" + totalQuestions);
        System.out.println("=========================================\n");

        return new QuizResultResponse(
                quizAttempt.getId(),
                correctAnswers,
                totalQuestions,
                correctAnswers,
                wrongAnswers,
                percentage,
                topicNames,
                questions.get(0).getDifficultyLevel().name(),
                questionReviews,
                emailSent
        );
    }


    // Get all topics with question statistics
    public List<TopicStatisticsDto> getAllTopicsWithStats() {
        List<Topic> topics = topicRepository.findAll();

        return topics.stream().map(topic -> {
            Long beginnerCount = questionRepository.countByTopicAndDifficultyLevel(
                    topic.getId(), Question.DifficultyLevel.BEGINNER);
            Long moderateCount = questionRepository.countByTopicAndDifficultyLevel(
                    topic.getId(), Question.DifficultyLevel.MODERATE);
            Long expertCount = questionRepository.countByTopicAndDifficultyLevel(
                    topic.getId(), Question.DifficultyLevel.EXPERT);

            return new TopicStatisticsDto(
                    topic.getId(),
                    topic.getName(),
                    topic.getDescription(),
                    beginnerCount,
                    moderateCount,
                    expertCount,
                    beginnerCount + moderateCount + expertCount
            );
        }).collect(Collectors.toList());
    }

    // Get user's quiz history
    @Transactional
    public List<QuizHistoryDto> getUserQuizHistory() {
        System.out.println("=== Getting Quiz History ===");

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("Email from context: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("User found: " + user.getId());

        List<QuizAttempt> attempts = quizAttemptRepository.findByUserIdOrderByAttemptedAtDesc(user.getId());
        System.out.println("Found " + attempts.size() + " quiz attempts");

        // Convert to DTOs
        List<QuizHistoryDto> historyList = new ArrayList<>();
        for (QuizAttempt attempt : attempts) {
            try {
                QuizHistoryDto dto = new QuizHistoryDto(
                        attempt.getId(),
                        attempt.getTopic().getName(),
                        attempt.getDifficultyLevel().name(),
                        attempt.getScore(),
                        attempt.getTotalQuestions(),
                        (attempt.getScore() * 100.0) / attempt.getTotalQuestions(),
                        attempt.getAttemptedAt()
                );
                historyList.add(dto);
            } catch (Exception e) {
                System.err.println("Error converting attempt " + attempt.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }

        System.out.println("Returning " + historyList.size() + " history items");
        return historyList;
    }

    // Converting Question to QuizQuestionDto(without correct answer)
    private QuizQuestionDto convertToQuizQuestionDto(Question question) {
        List<QuizOptionDto> optionDtos = question.getOptions().stream()
                .map(option -> new QuizOptionDto(option.getId(), option.getOptionText()))
                .collect(Collectors.toList());

        return new QuizQuestionDto(
                question.getId(),
                question.getQuestionText(),
                question.getTopic().getName(),
                optionDtos
        );
    }

    // Creating QuestionReviewDto(with correct answer shown)
    private QuestionReviewDto createQuestionReviewDto(
            Question question,
            Long selectedOptionId,
            Long correctOptionId,
            Boolean isCorrect) {
        List<OptionReviewDto> optionReviews = question.getOptions().stream()
                .map(option -> new OptionReviewDto(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsCorrect(),
                        option.getId().equals(selectedOptionId)
                ))
                .collect(Collectors.toList());

        return new QuestionReviewDto(
                question.getId(),
                question.getQuestionText(),
                question.getTopic().getName(),
                selectedOptionId,
                correctOptionId,
                isCorrect,
                optionReviews
        );
    }

    @Transactional(readOnly = true)
    public QuizResultResponse getQuizResultByAttemptId(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));

        // Fetch user answers for this attempt
        List<UserAnswer> userAnswers = userAnswerRepository.findByQuizAttemptId(attemptId);

        if (userAnswers.isEmpty()) {
            throw new RuntimeException("No answers found for this attempt");
        }

        int correctAnswers = (int) userAnswers.stream().filter(UserAnswer::isCorrect).count();
        int totalQuestions = attempt.getTotalQuestions();
        int wrongAnswers = totalQuestions - correctAnswers;
        double percentage = (double) correctAnswers * 100 / totalQuestions;

        List<QuestionReviewDto> questionReviews = userAnswers.stream()
                .map(userAnswer -> {
                    Question question = userAnswer.getQuestion();
                    Option selectedOption = userAnswer.getSelectedOption();
                    Option correctOption = question.getOptions().stream()
                            .filter(Option::getIsCorrect)
                            .findFirst()
                            .orElse(null);

                    List<OptionReviewDto> optionDtos = question.getOptions().stream()
                            .map(opt -> new OptionReviewDto(
                                    opt.getId(),
                                    opt.getOptionText(),
                                    opt.getIsCorrect(),
                                    selectedOption != null && opt.getId().equals(selectedOption.getId())
                            ))
                            .collect(Collectors.toList());

                    return new QuestionReviewDto(
                            question.getId(),
                            question.getQuestionText(),
                            question.getTopic().getName(),
                            selectedOption != null ? selectedOption.getId() : null,
                            correctOption != null ? correctOption.getId() : null,
                            userAnswer.isCorrect(),
                            optionDtos
                    );
                })
                .collect(Collectors.toList());

        List<String> topicNames = List.of(attempt.getTopic().getName());

        return new QuizResultResponse(
                attemptId,
                attempt.getScore(),
                totalQuestions,
                correctAnswers,
                wrongAnswers,
                percentage,
                topicNames,
                attempt.getDifficultyLevel().name(),
                questionReviews,
                false // Email not sent for history view
        );
    }

}