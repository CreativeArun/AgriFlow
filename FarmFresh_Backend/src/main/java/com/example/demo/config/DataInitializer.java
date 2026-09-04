package com.example.demo.config;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FarmerRepository farmerRepository;
    private final ConsumerRepository consumerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public DataInitializer(UserRepository userRepository,
            FarmerRepository farmerRepository,
            ConsumerRepository consumerRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.farmerRepository = farmerRepository;
        this.consumerRepository = consumerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        System.out.println("Seeding default database records for AgriFlow...");

        // 1. Farmer User & Profile
        User farmerUser = new User();
        farmerUser.setName("Ramesh Kumar");
        farmerUser.setEmail("ramesh@agriflow.in");
        farmerUser.setPassword("password123");
        farmerUser.setPhone("9876543210");
        farmerUser.setRole("FARMER");
        farmerUser = userRepository.save(farmerUser);

        Farmer farmer = new Farmer();
        farmer.setUser(farmerUser);
        farmer.setFarmName("Ramesh Organic Farm");
        farmer.setLocation("Panipat, Haryana");
        farmer.setCrops("Onion, Potato, Wheat, Tomato");
        farmer.setLandArea(5.5);
        farmer = farmerRepository.save(farmer);

        // 2. Buyer User & Profile
        User buyerUser = new User();
        buyerUser.setName("FreshCart Foods");
        buyerUser.setEmail("freshcart@foods.com");
        buyerUser.setPassword("password123");
        buyerUser.setPhone("9123456780");
        buyerUser.setRole("CONSUMER");
        userRepository.save(buyerUser);

        Consumer consumer = new Consumer();
        consumer.setName("FreshCart Foods");
        consumer.setAddress("Shop 42, Azadpur Mandi");
        consumer.setCity("Delhi");
        consumer.setPhone("9123456780");
        consumer = consumerRepository.save(consumer);

        // 3. Products
        Product p1 = new Product();
        p1.setName("Onion");
        p1.setQuantity(1000);
        p1.setPrice(2750.0);
        p1.setGrade("Grade A");
        p1.setLocation("Panipat, Haryana");
        p1.setStatus("AVAILABLE");
        p1.setQualityScore(87);
        p1.setFarmer(farmer);
        p1 = productRepository.save(p1);

        Product p2 = new Product();
        p2.setName("Potato");
        p2.setQuantity(2400);
        p2.setPrice(2150.0);
        p2.setGrade("Grade A");
        p2.setLocation("Panipat, Haryana");
        p2.setStatus("AVAILABLE");
        p2.setQualityScore(91);
        p2.setFarmer(farmer);
        productRepository.save(p2);

        Product p3 = new Product();
        p3.setName("Wheat");
        p3.setQuantity(1200);
        p3.setPrice(2420.0);
        p3.setGrade("Grade B");
        p3.setLocation("Panipat, Haryana");
        p3.setStatus("AVAILABLE");
        p3.setQualityScore(82);
        p3.setFarmer(farmer);
        productRepository.save(p3);

        Product p4 = new Product();
        p4.setName("Tomato");
        p4.setQuantity(750);
        p4.setPrice(1980.0);
        p4.setGrade("Grade B");
        p4.setLocation("Panipat, Haryana");
        p4.setStatus("AVAILABLE");
        p4.setQualityScore(78);
        p4.setFarmer(farmer);
        productRepository.save(p4);

        // 4. Sample active Order
        Order order = new Order();
        order.setConsumer(consumer);
        order.setProduct(p1);
        order.setQuantity(500);
        order.setTotalPrice(13750.0);
        order.setStatus("IN_TRANSIT");
        order.setLifecycleStep(2);
        order.setShipmentId("SHP-001");
        order.setPickupLocation("Panipat, Haryana");
        order.setDeliveryLocation("Azadpur Mandi, Delhi");
        orderRepository.save(order);

        System.out.println("Default records seeded successfully!");
    }
}
