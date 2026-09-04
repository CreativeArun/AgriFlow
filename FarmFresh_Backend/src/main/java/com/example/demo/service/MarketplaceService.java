package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream;

@Service
public class MarketplaceService {

    private final ProductRepository productRepository;

    public MarketplaceService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAvailableProducts() {
        return getFilteredProducts(null, null, null, null, null);
    }

    public List<Product> getFilteredProducts(
            String search,
            String grade,
            String location,
            Integer minScore,
            String sort) {

        Stream<Product> stream = productRepository.findAll().stream()
                // Must have stock and not be marked SOLD
                .filter(p -> p.getQuantity() > 0)
                .filter(p -> p.getStatus() == null || !p.getStatus().equalsIgnoreCase("SOLD"));

        // Filter by search query (crop / product name or category)
        if (search != null && !search.trim().isEmpty()) {
            String s = search.trim().toLowerCase();
            stream = stream.filter(p ->
                    (p.getName() != null && p.getName().toLowerCase().contains(s)) ||
                    (p.getCategory() != null && p.getCategory().toLowerCase().contains(s)) ||
                    (p.getDescription() != null && p.getDescription().toLowerCase().contains(s))
            );
        }

        // Filter by grade
        if (grade != null && !grade.trim().isEmpty()) {
            stream = stream.filter(p ->
                    p.getGrade() != null && p.getGrade().equalsIgnoreCase(grade.trim())
            );
        }

        // Filter by location
        if (location != null && !location.trim().isEmpty()) {
            String loc = location.trim().toLowerCase();
            stream = stream.filter(p ->
                    p.getLocation() != null && p.getLocation().toLowerCase().contains(loc)
            );
        }

        // Filter by quality score
        if (minScore != null) {
            stream = stream.filter(p ->
                    p.getQualityScore() != null && p.getQualityScore() >= minScore
            );
        }

        // Sort results
        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "price_asc":
                    stream = stream.sorted(Comparator.comparingDouble(Product::getPrice));
                    break;
                case "price_desc":
                    stream = stream.sorted(Comparator.comparingDouble(Product::getPrice).reversed());
                    break;
                case "score_desc":
                    stream = stream.sorted(Comparator.comparing(
                            p -> p.getQualityScore() != null ? p.getQualityScore() : 0,
                            Comparator.reverseOrder()
                    ));
                    break;
                case "recent":
                case "harvest_recent":
                    stream = stream.sorted(Comparator.comparing(
                            p -> p.getId() != null ? p.getId() : 0L,
                            Comparator.reverseOrder()
                    ));
                    break;
                default:
                    break;
            }
        }

        return stream.toList();
    }
}
