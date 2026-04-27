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
        if (roleRepository.count() == 0) {
            for (Role.RoleName roleName : Role.RoleName.values()) {
                roleRepository.save(Role.builder().name(roleName).build());
            }
            System.out.println("Finished seeding roles.");
        }

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
                    .build());

            productRepository.save(Product.builder()
                    .name("Margherita Pizza")
                    .description("Fresh mozzarella, basil, tomato sauce")
                    .price(new BigDecimal("1200"))
                    .category(pizza)
                    .available(true)
                    .build());

            productRepository.save(Product.builder()
                    .name("Iced Tea")
                    .description("House-brewed peach iced tea")
                    .price(new BigDecimal("250"))
                    .category(drinks)
                    .available(true)
                    .build());

            System.out.println("Finished seeding menu data.");
        }

        if (userRepository.count() == 0) {
            Role adminRole = roleRepository.findByName(Role.RoleName.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role Admin is not found."));

            User admin = User.builder()
                    .username("admin")
                    .email("admin@kolay.com")
                    .password(passwordEncoder.encode("admin123"))
                    .roles(new HashSet<>(Collections.singletonList(adminRole)))
                    .build();

            userRepository.save(admin);
            System.out.println("Finished seeding default admin user (admin / admin123).");
        }
    }
}
