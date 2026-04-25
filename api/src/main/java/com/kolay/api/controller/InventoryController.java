package com.kolay.api.controller;

import com.kolay.api.model.Ingredient;
import com.kolay.api.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('STOREKEEPER')")
    public ResponseEntity<List<Ingredient>> getAllIngredients() {
        return ResponseEntity.ok(inventoryService.getAllIngredients());
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('STOREKEEPER')")
    public ResponseEntity<List<Ingredient>> getLowStock() {
        return ResponseEntity.ok(inventoryService.getLowStockIngredients());
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('STOREKEEPER')")
    public ResponseEntity<Ingredient> updateStock(
            @PathVariable Long id,
            @RequestParam BigDecimal amount,
            @RequestParam boolean isAddition) {
        return ResponseEntity.ok(inventoryService.updateStock(id, amount, isAddition));
    }
}
