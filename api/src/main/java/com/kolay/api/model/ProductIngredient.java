package com.kolay.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@Entity
@Table(name = "product_ingredients")
public class ProductIngredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_id")
    private Ingredient ingredient;

    @NotNull
    private BigDecimal quantityRequired; // amount of ingredient needed for 1 unit of product

    public ProductIngredient() {
    }

    public ProductIngredient(Product product, Ingredient ingredient, BigDecimal quantityRequired) {
        this.product = product;
        this.ingredient = ingredient;
        this.quantityRequired = quantityRequired;
    }

    public static ProductIngredientBuilder builder() {
        return new ProductIngredientBuilder();
    }

    public static class ProductIngredientBuilder {
        private Product product;
        private Ingredient ingredient;
        private BigDecimal quantityRequired;

        public ProductIngredientBuilder product(Product product) {
            this.product = product;
            return this;
        }

        public ProductIngredientBuilder ingredient(Ingredient ingredient) {
            this.ingredient = ingredient;
            return this;
        }

        public ProductIngredientBuilder quantityRequired(BigDecimal quantityRequired) {
            this.quantityRequired = quantityRequired;
            return this;
        }

        public ProductIngredient build() {
            return new ProductIngredient(product, ingredient, quantityRequired);
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Ingredient getIngredient() {
        return ingredient;
    }

    public void setIngredient(Ingredient ingredient) {
        this.ingredient = ingredient;
    }

    public BigDecimal getQuantityRequired() {
        return quantityRequired;
    }

    public void setQuantityRequired(BigDecimal quantityRequired) {
        this.quantityRequired = quantityRequired;
    }
}
