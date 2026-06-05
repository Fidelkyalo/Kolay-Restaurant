package com.kolay.api.controller;

import com.kolay.api.model.Category;
import com.kolay.api.model.Product;
import com.kolay.api.repository.CategoryRepository;
import com.kolay.api.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findByAvailableTrue());
    }

    @GetMapping("/categories/{id}/products")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(category -> ResponseEntity.ok(productRepository.findByCategory(category)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/categories")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @PostMapping("/products")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> createProduct(@RequestBody java.util.Map<String, Object> body) {
        String name        = (String) body.getOrDefault("name", "");
        String description = (String) body.getOrDefault("desc", body.getOrDefault("description", ""));
        String categoryName= (String) body.getOrDefault("category", "Main Dish");
        String imageUrl    = (String) body.getOrDefault("image",    body.getOrDefault("imageUrl", ""));
        double price       = body.get("price") instanceof Number
                ? ((Number) body.get("price")).doubleValue() : 0.0;

        // Find or create category by name
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.save(
                        Category.builder().name(categoryName).description(categoryName).build()));

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(java.math.BigDecimal.valueOf(price));
        product.setCategory(category);
        product.setAvailable(true);
        product.setImageUrl(imageUrl);

        return ResponseEntity.ok(productRepository.save(product));
    }

    @PutMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                  @RequestBody java.util.Map<String, Object> body) {
        return productRepository.findById(id)
                .map(product -> {
                    if (body.containsKey("name"))        product.setName((String) body.get("name"));
                    if (body.containsKey("description")) product.setDescription((String) body.get("description"));
                    if (body.containsKey("desc"))        product.setDescription((String) body.get("desc"));
                    if (body.containsKey("price"))       product.setPrice(java.math.BigDecimal.valueOf(((Number) body.get("price")).doubleValue()));
                    if (body.containsKey("imageUrl"))    product.setImageUrl((String) body.get("imageUrl"));
                    if (body.containsKey("image"))       product.setImageUrl((String) body.get("image"));
                    if (body.containsKey("available"))   product.setAvailable((Boolean) body.get("available"));
                    if (body.containsKey("category")) {
                        String catName = (String) body.get("category");
                        categoryRepository.findByName(catName).ifPresent(product::setCategory);
                    }
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setAvailable(false);
                    productRepository.save(product);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
