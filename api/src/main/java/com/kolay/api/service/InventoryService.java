package com.kolay.api.service;

import com.kolay.api.model.Ingredient;
import com.kolay.api.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private IngredientRepository ingredientRepository;

    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    public List<Ingredient> getLowStockIngredients() {
        return ingredientRepository.findLowStockIngredients();
    }

    @Transactional
    public Ingredient updateStock(Long id, BigDecimal amount, boolean isAddition) {
        Ingredient ingredient = ingredientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingredient not found"));

        if (isAddition) {
            ingredient.setCurrentStock(ingredient.getCurrentStock().add(amount));
        } else {
            ingredient.setCurrentStock(ingredient.getCurrentStock().subtract(amount));
        }

        return ingredientRepository.save(ingredient);
    }
}
