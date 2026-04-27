package com.kolay.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "ingredients")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String name;

    @NotBlank
    private String unit; // e.g., kg, L, pcs

    @NotNull
    private BigDecimal currentStock;

    @NotNull
    private BigDecimal minimumThreshold;

    public Ingredient() {
    }

    public Ingredient(String name, String unit, BigDecimal currentStock, BigDecimal minimumThreshold) {
        this.name = name;
        this.unit = unit;
        this.currentStock = currentStock;
        this.minimumThreshold = minimumThreshold;
    }

    public static IngredientBuilder builder() {
        return new IngredientBuilder();
    }

    public static class IngredientBuilder {
        private String name;
        private String unit;
        private BigDecimal currentStock;
        private BigDecimal minimumThreshold;

        public IngredientBuilder name(String name) {
            this.name = name;
            return this;
        }

        public IngredientBuilder unit(String unit) {
            this.unit = unit;
            return this;
        }

        public IngredientBuilder currentStock(BigDecimal currentStock) {
            this.currentStock = currentStock;
            return this;
        }

        public IngredientBuilder minimumThreshold(BigDecimal minimumThreshold) {
            this.minimumThreshold = minimumThreshold;
            return this;
        }

        public Ingredient build() {
            return new Ingredient(name, unit, currentStock, minimumThreshold);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public BigDecimal getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(BigDecimal currentStock) {
        this.currentStock = currentStock;
    }

    public BigDecimal getMinimumThreshold() {
        return minimumThreshold;
    }

    public void setMinimumThreshold(BigDecimal minimumThreshold) {
        this.minimumThreshold = minimumThreshold;
    }
}
