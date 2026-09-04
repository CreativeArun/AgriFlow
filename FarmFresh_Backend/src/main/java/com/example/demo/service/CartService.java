package com.example.demo.service;

import com.example.demo.entity.Cart;
import com.example.demo.entity.Consumer;
import com.example.demo.entity.Order;
import com.example.demo.entity.Product;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.ConsumerRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ConsumerRepository consumerRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public CartService(
            CartRepository cartRepository,
            ConsumerRepository consumerRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository) {

        this.cartRepository = cartRepository;
        this.consumerRepository = consumerRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }


    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================

    public Cart addToCart(
            Long consumerId,
            Long productId,
            int quantity) {

        Consumer consumer = consumerRepository
                .findById(consumerId)
                .orElseThrow(() ->
                        new RuntimeException("Consumer not found"));


        Product product = productRepository
                .findById(productId)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));


        // Quantity validation
        if (quantity <= 0) {
            throw new RuntimeException(
                    "Quantity must be greater than 0"
            );
        }


        // Stock validation
        if (quantity > product.getQuantity()) {
            throw new RuntimeException(
                    "Not enough product available"
            );
        }


        // Check if product already exists in cart
        Optional<Cart> existingCart =
                cartRepository.findByConsumerIdAndProductId(
                        consumerId,
                        productId
                );


        if (existingCart.isPresent()) {

            Cart cart = existingCart.get();

            int newQuantity =
                    cart.getQuantity() + quantity;


            // Check total quantity against stock
            if (newQuantity > product.getQuantity()) {

                throw new RuntimeException(
                        "Not enough product available"
                );
            }


            cart.setQuantity(newQuantity);

            return cartRepository.save(cart);
        }


        // Create new cart item
        Cart cart = new Cart();

        cart.setConsumer(consumer);

        cart.setProduct(product);

        cart.setQuantity(quantity);


        return cartRepository.save(cart);
    }


    // =====================================================
    // GET ALL CART ITEMS
    // =====================================================

    public List<Cart> getAllCartItems() {

        return cartRepository.findAll();
    }


    // =====================================================
    // GET CART BY CONSUMER
    // =====================================================

    public List<Cart> getCartByConsumer(
            Long consumerId) {

        // Check consumer exists
        consumerRepository
                .findById(consumerId)
                .orElseThrow(() ->
                        new RuntimeException("Consumer not found"));


        return cartRepository.findByConsumerId(
                consumerId
        );
    }


    // =====================================================
    // DELETE CART ITEM
    // =====================================================

    public void deleteCartItem(Long id) {

        Cart cart = cartRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Cart item not found"));


        cartRepository.delete(cart);
    }


    // =====================================================
    // CHECKOUT
    // =====================================================

    @Transactional
    public List<Order> checkout(Long consumerId) {

        // -------------------------------------------------
        // STEP 1: Check consumer
        // -------------------------------------------------

        Consumer consumer = consumerRepository
                .findById(consumerId)
                .orElseThrow(() ->
                        new RuntimeException("Consumer not found"));


        // -------------------------------------------------
        // STEP 2: Get consumer cart
        // -------------------------------------------------

        List<Cart> cartItems =
                cartRepository.findByConsumerId(
                        consumerId
                );


        // -------------------------------------------------
        // STEP 3: Check cart
        // -------------------------------------------------

        if (cartItems.isEmpty()) {

            throw new RuntimeException(
                    "Cart is empty"
            );
        }


        // -------------------------------------------------
        // STEP 4:
        // Check ALL products before making changes
        // -------------------------------------------------

        for (Cart cart : cartItems) {

            Product product = cart.getProduct();

            int cartQuantity =
                    cart.getQuantity();


            // Quantity validation
            if (cartQuantity <= 0) {

                throw new RuntimeException(
                        "Invalid cart quantity for product: "
                                + product.getName()
                );
            }


            // Stock validation
            if (cartQuantity > product.getQuantity()) {

                throw new RuntimeException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }
        }


        // -------------------------------------------------
        // STEP 5:
        // Create orders
        // -------------------------------------------------

        List<Order> orders = new ArrayList<>();


        for (Cart cart : cartItems) {

            Product product = cart.getProduct();

            int quantity =
                    cart.getQuantity();


            // Create Order
            Order order = new Order();


            order.setConsumer(consumer);

            order.setProduct(product);

            order.setQuantity(quantity);


            // Calculate total price
            double totalPrice =
                    product.getPrice() * quantity;


            order.setTotalPrice(totalPrice);


            // Initial status
            order.setStatus("PENDING");


            // -------------------------------------------------
            // STEP 6:
            // Reduce product stock
            // -------------------------------------------------

            product.setQuantity(
                    product.getQuantity() - quantity
            );


            productRepository.save(product);


            // -------------------------------------------------
            // STEP 7:
            // Save order
            // -------------------------------------------------

            Order savedOrder =
                    orderRepository.save(order);


            orders.add(savedOrder);
        }


        // -------------------------------------------------
        // STEP 8:
        // Clear cart
        // -------------------------------------------------

        cartRepository.deleteAll(cartItems);


        // -------------------------------------------------
        // STEP 9:
        // Return created orders
        // -------------------------------------------------

        return orders;
    }
}