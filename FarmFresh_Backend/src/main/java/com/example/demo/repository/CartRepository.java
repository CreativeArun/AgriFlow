package com.example.demo.repository;

import com.example.demo.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByConsumerId(Long consumerId);

    Optional<Cart> findByConsumerIdAndProductId(Long consumerId, Long productId);
}