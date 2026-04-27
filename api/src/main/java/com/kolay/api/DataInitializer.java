package com.kolay.api;

import com.kolay.api.model.Category;
import com.kolay.api.model.Product;
import com.kolay.api.model.Role;
import com.kolay.api.repository.CategoryRepository;
import com.kolay.api.repository.ProductRepository;
import com.kolay.api.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

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
    }
}
