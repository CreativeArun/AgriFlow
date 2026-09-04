package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.MarketplaceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marketplace")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;

    public MarketplaceController(MarketplaceService marketplaceService) {
        this.marketplaceService = marketplaceService;
    }

    @GetMapping("/products")
    public List<Product> getAvailableProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Integer minScore,
            @RequestParam(required = false) String sort) {
        return marketplaceService.getFilteredProducts(search, grade, location, minScore, sort);
    }
}