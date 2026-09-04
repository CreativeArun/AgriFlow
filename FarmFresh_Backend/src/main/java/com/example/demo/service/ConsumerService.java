package com.example.demo.service;

import com.example.demo.entity.Consumer;
import com.example.demo.repository.ConsumerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsumerService {

    private final ConsumerRepository consumerRepository;

    public ConsumerService(ConsumerRepository consumerRepository) {
        this.consumerRepository = consumerRepository;
    }


    public Consumer createConsumer(Consumer consumer) {
        return consumerRepository.save(consumer);
    }


    public List<Consumer> getAllConsumers() {
        return consumerRepository.findAll();
    }


    public Optional<Consumer> getConsumerById(Long id) {
        return consumerRepository.findById(id);
    }


    public void deleteConsumer(Long id) {
        consumerRepository.deleteById(id);
    }
}