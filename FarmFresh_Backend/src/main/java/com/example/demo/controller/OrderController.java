package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public Order createOrder(
            @RequestParam Long consumerId,
            @RequestParam Long productId,
            @RequestParam int quantity,
            @RequestParam(required = false) String pickupLocation,
            @RequestParam(required = false) String deliveryLocation) {

        return orderService.createOrder(
                consumerId,
                productId,
                quantity,
                pickupLocation,
                deliveryLocation
        );
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @GetMapping("/consumer/{consumerId}")
    public List<Order> getOrdersByConsumer(@PathVariable Long consumerId) {
        return orderService.getOrdersByConsumer(consumerId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Order> getOrdersByFarmer(@PathVariable Long farmerId) {
        return orderService.getOrdersByFarmer(farmerId);
    }

    @PatchMapping("/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }

    @PatchMapping("/{id}/shipment")
    public Order assignShipment(
            @PathVariable Long id,
            @RequestParam String shipmentId) {
        return orderService.assignShipment(id, shipmentId);
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return "Order deleted successfully";
    }
}