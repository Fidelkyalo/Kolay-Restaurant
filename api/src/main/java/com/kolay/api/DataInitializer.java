package com.kolay.api;

import com.kolay.api.model.Category;
import com.kolay.api.model.Product;
import com.kolay.api.model.Role;
import com.kolay.api.model.User;
import com.kolay.api.repository.CategoryRepository;
import com.kolay.api.repository.ProductRepository;
import com.kolay.api.repository.RoleRepository;
import com.kolay.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Ensure every role in the enum exists — safe to run on every startup
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                System.out.println("Seeded missing role: " + roleName);
            }
        }
        System.out.println("Role seeding check complete.");

        if (categoryRepository.count() == 0) {
            Category burgers = Category.builder().name("Burgers").description("Juicy handcrafted burgers").build();
            Category pizza = Category.builder().name("Pizza").description("Freshly baked pizzas").build();
            Category drinks = Category.builder().name("Drinks").description("Refreshing beverages").build();

            categoryRepository.saveAll(Arrays.asList(burgers, pizza, drinks));

            productRepository.save(Product.builder()
                    .name("Classic Beef Burger")
                    .description("Grass-fed beef, cheddar, secret sauce")
                    .price(new BigDecimal("850"))
                    .category(burgers)
                    .available(true)
                    .imageUrl("/assets/burger.png")
                    .build());

            productRepository.save(Product.builder()
                    .name("Margherita Pizza")
                    .description("Fresh mozzarella, basil, tomato sauce")
                    .price(new BigDecimal("1200"))
                    .category(pizza)
                    .available(true)
                    .imageUrl("/assets/burger.png")
                    .build());

            productRepository.save(Product.builder()
                    .name("Iced Tea")
                    .description("House-brewed peach iced tea")
                    .price(new BigDecimal("250"))
                    .category(drinks)
                    .available(true)
                    .imageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600")
                    .build());

            System.out.println("Finished seeding menu data.");
        } else {
            // Update existing products that have null imageUrl
            productRepository.findAll().forEach(product -> {
                if (product.getImageUrl() == null) {
                    String lower = product.getName().toLowerCase();
                    if (lower.contains("burger")) product.setImageUrl("/assets/burger.png");
                    else if (lower.contains("pizza")) product.setImageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600");
                    else if (lower.contains("tea") || lower.contains("drink") || lower.contains("latte") || lower.contains("beverage"))
                        product.setImageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600");
                    else if (lower.contains("salmon")) product.setImageUrl("/assets/salmon.png");
                    else if (lower.contains("steak") || lower.contains("ribeye")) product.setImageUrl("/assets/steak.png");
                    else product.setImageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600");
                    productRepository.save(product);
                }
            });
        }

        // Always ensure the admin user exists with the correct credentials
        Role adminRole = roleRepository.findByName(Role.RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role Admin is not found."));

        // If old lowercase "admin" exists, update it in-place (avoids FK constraint issues)
        // Otherwise look for "Admin", or create a brand new user
        User admin = userRepository.findByUsername("admin")
                .orElse(userRepository.findByUsername("Admin")
                        .orElse(new User()));

        admin.setUsername("Admin");
        admin.setEmail("admin@kolay.com");
        admin.setPassword(passwordEncoder.encode("Admin123"));
        admin.setRoles(new HashSet<>(Collections.singletonList(adminRole)));
        userRepository.save(admin);
        System.out.println("Admin user ensured: Admin / Admin123");
    }
}
