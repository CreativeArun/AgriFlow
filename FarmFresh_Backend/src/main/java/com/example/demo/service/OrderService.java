package com.example.demo.service;

import com.example.demo.entity.Consumer;
import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.repository.ConsumerRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ConsumerRepository consumerRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        ConsumerRepository consumerRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.consumerRepository = consumerRepository;
        this.productRepository = productRepository;
    }

    public Order createOrder(Long consumerId, Long productId, int quantity) {
        return createOrder(consumerId, productId, quantity, null, null);
    }

    public Order createOrder(Long consumerId, Long productId, int quantity,
                             String pickupLocation, String deliveryLocation) {

        Consumer consumer = consumerRepository.findById(consumerId)
                .orElseThrow(() -> new RuntimeException("Consumer not found with ID: " + consumerId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productId));

        if (quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (quantity > product.getQuantity()) {
            throw new RuntimeException("Not enough product quantity available");
        }

        Order order = new Order();
        order.setConsumer(consumer);
        order.setProduct(product);
        order.setQuantity(quantity);

        double totalPrice = product.getPrice() * quantity;
        order.setTotalPrice(totalPrice);

        // Initial 6-stage lifecycle
        order.setStatus("ORDER_PLACED");

        // Locations
        if (pickupLocation != null && !pickupLocation.trim().isEmpty()) {
            order.setPickupLocation(pickupLocation.trim());
        } else {
            order.setPickupLocation(product.getLocation());
        }

        if (deliveryLocation != null && !deliveryLocation.trim().isEmpty()) {
            order.setDeliveryLocation(deliveryLocation.trim());
        } else {
            String cLoc = consumer.getAddress() != null ? consumer.getAddress() : consumer.getCity();
            order.setDeliveryLocation(cLoc);
        }

        // Deduct inventory
        product.setQuantity(product.getQuantity() - quantity);
        if (product.getQuantity() == 0) {
            product.setStatus("SOLD");
        }
        productRepository.save(product);

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    public List<Order> getOrdersByConsumer(Long consumerId) {
        return orderRepository.findByConsumerId(consumerId);
    }

    public List<Order> getOrdersByFarmer(Long farmerId) {
        return orderRepository.findByProductFarmerId(farmerId);
    }

    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = getOrderById(orderId);
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    public Order assignShipment(Long orderId, String shipmentId) {
        Order order = getOrderById(orderId);
        order.setShipmentId(shipmentId);
        if (order.getLifecycleStep() < 2) {
            order.setStatus("TRANSIT");
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}