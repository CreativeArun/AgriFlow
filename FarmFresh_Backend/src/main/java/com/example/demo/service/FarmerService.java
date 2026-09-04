package com.example.demo.service;

import com.example.demo.entity.Farmer;
import com.example.demo.entity.User;
import com.example.demo.repository.FarmerRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;
    private final UserRepository userRepository;

    public FarmerService(FarmerRepository farmerRepository,
                         UserRepository userRepository) {
        this.farmerRepository = farmerRepository;
        this.userRepository = userRepository;
    }

    // CREATE FARMER
    public Farmer createFarmer(Long userId, Farmer farmer) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        farmer.setUser(user);

        return farmerRepository.save(farmer);
    }

    // GET ALL FARMERS
    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    // GET FARMER BY ID
    public Farmer getFarmerById(Long id) {
        return farmerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    // DELETE FARMER
    public void deleteFarmer(Long id) {
        farmerRepository.deleteById(id);
    }
}