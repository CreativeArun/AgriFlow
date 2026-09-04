package com.example.demo.repository;

import com.example.demo.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByFarmerId(Long farmerId);

    List<Product> findByFarmerIdAndStatus(Long farmerId, String status);

    List<Product> findByQuantityGreaterThan(int quantity);

    List<Product> findByQuantityGreaterThanAndStatus(int quantity, String status);
}