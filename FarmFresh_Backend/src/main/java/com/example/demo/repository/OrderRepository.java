package com.example.demo.repository;

import com.example.demo.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByConsumerId(Long consumerId);

    List<Order> findByProductFarmerId(Long farmerId);

    List<Order> findByStatus(String status);
}