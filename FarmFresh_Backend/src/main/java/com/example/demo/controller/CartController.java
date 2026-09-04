package com.example.demo.controller;

import com.example.demo.entity.Cart;
import com.example.demo.entity.Order;
import com.example.demo.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    // =====================================================
    // ADD TO CART
    // =====================================================

    @PostMapping
    public Cart addToCart(
            @RequestParam Long consumerId,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        return cartService.addToCart(
                consumerId,
                productId,
                quantity
        );
    }


    // =====================================================
    // GET ALL CART ITEMS
    // =====================================================

    @GetMapping
    public List<Cart> getAllCartItems() {

        return cartService.getAllCartItems();
    }


    // =====================================================
    // GET CART BY CONSUMER
    // =====================================================

    @GetMapping("/consumer/{consumerId}")
    public List<Cart> getCartByConsumer(
            @PathVariable Long consumerId) {

        return cartService.getCartByConsumer(
                consumerId
        );
    }


    // =====================================================
    // DELETE CART ITEM
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteCartItem(
            @PathVariable Long id) {

        cartService.deleteCartItem(id);

        return "Cart item deleted successfully";
    }


    // =====================================================
    // CHECKOUT
    // =====================================================

    @PostMapping("/checkout/{consumerId}")
    public List<Order> checkout(
            @PathVariable Long consumerId) {

        return cartService.checkout(consumerId);
    }
}