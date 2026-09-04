package com.example.demo.controller;

import com.example.demo.entity.Consumer;
import com.example.demo.service.ConsumerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consumers")
public class ConsumerController {

    private final ConsumerService consumerService;

    public ConsumerController(ConsumerService consumerService) {
        this.consumerService = consumerService;
    }

    @PostMapping
    public Consumer createConsumer(@RequestBody Consumer consumer) {
        return consumerService.createConsumer(consumer);
    }

    @GetMapping
    public List<Consumer> getAllConsumers() {
        return consumerService.getAllConsumers();
    }

    // GET CONSUMER BY ID
    @GetMapping("/{id}")
    public Optional<Consumer> getConsumerById(@PathVariable Long id) {
        return consumerService.getConsumerById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteConsumer(@PathVariable Long id) {
        consumerService.deleteConsumer(id);
        return "Consumer deleted successfully";
    }
}