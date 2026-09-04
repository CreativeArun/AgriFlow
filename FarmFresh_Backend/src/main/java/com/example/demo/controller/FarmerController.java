package com.example.demo.controller;

import com.example.demo.entity.Farmer;
import com.example.demo.service.FarmerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    @PostMapping
    public Farmer createFarmer(
            @RequestParam Long userId,
            @RequestBody Farmer farmer) {

        return farmerService.createFarmer(userId, farmer);
    }

    @GetMapping
    public List<Farmer> getAllFarmers() {
        return farmerService.getAllFarmers();
    }

    @GetMapping("/{id}")
    public Farmer getFarmerById(@PathVariable Long id) {
        return farmerService.getFarmerById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteFarmer(@PathVariable Long id) {
        farmerService.deleteFarmer(id);
        return "Farmer deleted successfully";
    }
}