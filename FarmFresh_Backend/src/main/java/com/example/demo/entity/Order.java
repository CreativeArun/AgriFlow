package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    private double totalPrice;

    private String status = "ORDER_PLACED";

    private Integer lifecycleStep = 0; // 0: Order placed, 1: Pickup, 2: Transit, 3: Delivery, 4: Quality verification, 5: Payment release

    private String pickupLocation;

    private String deliveryLocation;

    private String orderDate;

    private String expectedDeliveryDate;

    private String shipmentId;

    @ManyToOne
    @JoinColumn(name = "consumer_id")
    private Consumer consumer;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public Order() {
        this.orderDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        this.status = "ORDER_PLACED";
        this.lifecycleStep = 0;
    }

    public static int mapStatusToStep(String status) {
        if (status == null) return 0;
        switch (status.toUpperCase().replace(" ", "_")) {
            case "ORDER_PLACED":
            case "PENDING":
                return 0;
            case "PICKUP":
                return 1;
            case "TRANSIT":
            case "IN_TRANSIT":
                return 2;
            case "DELIVERY":
            case "DELIVERED":
                return 3;
            case "QUALITY_VERIFICATION":
                return 4;
            case "PAYMENT_RELEASE":
            case "COMPLETED":
                return 5;
            default:
                return 0;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.lifecycleStep = mapStatusToStep(status);
    }

    public Integer getLifecycleStep() {
        return lifecycleStep;
    }

    public void setLifecycleStep(Integer lifecycleStep) {
        this.lifecycleStep = lifecycleStep;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDeliveryLocation() {
        return deliveryLocation;
    }

    public void setDeliveryLocation(String deliveryLocation) {
        this.deliveryLocation = deliveryLocation;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(String orderDate) {
        this.orderDate = orderDate;
    }

    public String getExpectedDeliveryDate() {
        return expectedDeliveryDate;
    }

    public void setExpectedDeliveryDate(String expectedDeliveryDate) {
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    public String getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(String shipmentId) {
        this.shipmentId = shipmentId;
    }

    public Consumer getConsumer() {
        return consumer;
    }

    public void setConsumer(Consumer consumer) {
        this.consumer = consumer;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}