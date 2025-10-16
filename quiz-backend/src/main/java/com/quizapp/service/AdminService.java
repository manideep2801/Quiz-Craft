package com.quizapp.service;

import com.quizapp.dto.admindto.*;
import com.quizapp.model.Option;
import com.quizapp.model.Question;
import com.quizapp.model.Topic;
import com.quizapp.repository.OptionRepository;
import com.quizapp.repository.QuestionRepository;
import com.quizapp.repository.TopicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private TopicRepository topicRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private OptionRepository optionRepository;

    // Creating a new topic
    public Topic createTopic(TopicRequest request) {
        if (topicRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Topic already exists with name: " + request.getName());
        }

        Topic topic = new Topic();
        topic.setName(request.getName());
        topic.setDescription(request.getDescription());

        return topicRepository.save(topic);
    }

    // Get all topics
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    // Get topic by id
    public Topic getTopicById(Long id) {
        return topicRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Topic not found with id: " + id));
    }

    // Update topic
    public Topic updateTopic(Long id, TopicRequest topicRequest) {
        Topic topic = getTopicById(id);

        topicRepository.findByName(topicRequest.getName())
                .ifPresent(existingTopic -> {
                    if(!existingTopic.getId().equals(id)) {
                        throw new RuntimeException("Topic already exists with name: " + topicRequest.getName());
                    }
                });

        topic.setName(topicRequest.getName());
        topic.setDescription(topicRequest.getDescription());

        return topicRepository.save(topic);
    }

    // Delete topic
    public void deleteTopic(Long id) {
        Topic topic = getTopicById(id);
        topicRepository.delete(topic);
    }

    // Creating new questions with options
    @Transactional
    public QuestionResponseDTO createQuestion(QuestionRequest request) {
        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        long correctOptionsCount = request.getOptions().stream()
                .filter(OptionRequest::getIsCorrect)
                .count();

        if (correctOptionsCount != 1) {
            throw new RuntimeException("Exactly one option must be marked as correct");
        }

        Question question = new Question();
        question.setTopic(topic);
        question.setQuestionText(request.getQuestionText());
        question.setDifficultyLevel(request.getDifficultyLevel());

        Question savedQuestion = questionRepository.save(question);

        List<Option> options = request.getOptions().stream()
                .map(optionReq -> {
                    Option option = new Option();
                    option.setQuestion(savedQuestion);
                    option.setOptionText(optionReq.getOptionText());
                    option.setIsCorrect(optionReq.getIsCorrect());
                    return option;
                })
                .collect(Collectors.toList());

        optionRepository.saveAll(options);
        savedQuestion.setOptions(options);

        return convertToQuestionResponseDTO(savedQuestion);
    }

    // Get all questions
    public List<QuestionResponseDTO> getAllQuestions() {
        return questionRepository.findAll().stream()
                .map(this::convertToQuestionResponseDTO)
                .collect(Collectors.toList());
    }

    // Get questions by topic
    public List<QuestionResponseDTO> getQuestionsByTopic(Long topicId) {
        Topic topic = getTopicById(topicId);
        return topic.getQuestions().stream()
                .map(this::convertToQuestionResponseDTO)
                .collect(Collectors.toList());
    }

    // Get question by id
    public QuestionResponseDTO getQuestionById(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
        return convertToQuestionResponseDTO(question);
    }

    // Update question
    @Transactional
    public QuestionResponseDTO updateQuestion(Long id, QuestionRequest request) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        Topic topic = topicRepository.findById(request.getTopicId())
                .orElseThrow(() -> new RuntimeException("Topic not found"));

        long correctOptionsCount = request.getOptions().stream()
                .filter(OptionRequest::getIsCorrect)
                .count();

        if (correctOptionsCount != 1) {
            throw new RuntimeException("Exactly one option must be marked as correct");
        }

        question.setTopic(topic);
        question.setQuestionText(request.getQuestionText());
        question.setDifficultyLevel(request.getDifficultyLevel());

        // ✅ Update existing options instead of deleting
        List<Option> existingOptions = question.getOptions();

        // If the count changed, adjust it
        while (existingOptions.size() < request.getOptions().size()) {
            Option newOpt = new Option();
            newOpt.setQuestion(question);
            existingOptions.add(newOpt);
        }
        while (existingOptions.size() > request.getOptions().size()) {
            existingOptions.remove(existingOptions.size() - 1);
        }

        // ✅ Update fields one by one
        for (int i = 0; i < request.getOptions().size(); i++) {
            OptionRequest reqOpt = request.getOptions().get(i);
            Option opt = existingOptions.get(i);
            opt.setOptionText(reqOpt.getOptionText());
            opt.setIsCorrect(reqOpt.getIsCorrect());
        }

        question.setOptions(existingOptions);
        Question saved = questionRepository.save(question);
        return convertToQuestionResponseDTO(saved);
    }


    // Delete question
    public void deleteQuestion(Long id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        questionRepository.delete(question);
    }

    // Converting question entity to QuestionResponseDTO
    private QuestionResponseDTO convertToQuestionResponseDTO(Question question) {
        List<OptionResponseDTO> optionDTOs = question.getOptions().stream()
                .map(option -> new OptionResponseDTO(
                        option.getId(),
                        option.getOptionText(),
                        option.getIsCorrect()
                ))
                .collect(Collectors.toList());

        return new QuestionResponseDTO(
                question.getId(),
                question.getQuestionText(),
                question.getTopic().getName(),
                question.getDifficultyLevel().name(),
                optionDTOs
        );
    }
}
