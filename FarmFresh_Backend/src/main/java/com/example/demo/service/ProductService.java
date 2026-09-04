package com.example.demo.service;

import com.example.demo.entity.Farmer;
import com.example.demo.entity.Product;
import com.example.demo.repository.FarmerRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FarmerRepository farmerRepository;

    public ProductService(ProductRepository productRepository,
                          FarmerRepository farmerRepository) {
        this.productRepository = productRepository;
        this.farmerRepository = farmerRepository;
    }

    public Product createProduct(Product product, Long farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found with ID: " + farmerId));

        product.setFarmer(farmer);

        if (product.getLocation() == null || product.getLocation().trim().isEmpty()) {
            product.setLocation(farmer.getLocation());
        }
        if (product.getGrade() == null || product.getGrade().trim().isEmpty()) {
            product.setGrade("Grade A");
        }
        if (product.getStatus() == null || product.getStatus().trim().isEmpty()) {
            product.setStatus("AVAILABLE");
        }
        if (product.getQualityScore() == null) {
            product.setQualityScore(85);
        }

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByFarmer(Long farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
    }

    public Product updateProductStatus(Long id, String status) {
        Product product = getProductById(id);
        product.setStatus(status.toUpperCase());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
