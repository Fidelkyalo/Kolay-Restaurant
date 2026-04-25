package com.kolay.api.repository;

import com.kolay.api.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(Order.OrderStatus status);

    List<Order> findByTableNumber(String tableNumber);
}
