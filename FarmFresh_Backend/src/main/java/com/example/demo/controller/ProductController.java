package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Product createProduct(
            @RequestBody Product product,
            @RequestParam(required = false) Long farmerId) {
        if (farmerId == null && product.getFarmer() != null) {
            farmerId = product.getFarmer().getId();
        }
        if (farmerId == null) {
            farmerId = 1L;
        }
        return productService.createProduct(product, farmerId);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Product> getProductsByFarmer(@PathVariable Long farmerId) {
        return productService.getProductsByFarmer(farmerId);
    }

    @PatchMapping("/{id}/status")
    public Product updateProductStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return productService.updateProductStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return "Product deleted successfully";
    }
}