package com.kolay.api.controller;

import com.kolay.api.model.Order;
import com.kolay.api.payload.request.OrderRequest;
import com.kolay.api.payload.response.MessageResponse;
import com.kolay.api.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('WAITER') or hasRole('ADMIN')")
    public ResponseEntity<?> placeOrder(@Valid @RequestBody OrderRequest orderRequest) {
        orderService.createOrder(orderRequest);
        return ResponseEntity.ok(new MessageResponse("Order placed successfully!"));
    }

    @GetMapping("/active")
    @PreAuthorize("hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrders());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('CHEF') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam Order.OrderStatus status) {
        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(new MessageResponse("Order status updated to " + status));
    }
}
