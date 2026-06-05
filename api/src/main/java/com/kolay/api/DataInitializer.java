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
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private RoleRepository roleRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    // The canonical 10 meals that must exist in both the website and POS
    private static final Object[][] MENU = {
        // { name, description, price, categoryName, imageUrl }
        { "Gourmet Beef Burger",  "Aged wagyu beef, truffle aioli, melted brie on brioche.",      "1200", "Main Dish",  "/assets/burger.png" },
        { "Signature Ribeye",     "Prime ribeye, garlic herb butter & truffle fries.",             "3500", "Main Dish",  "/assets/steak.png" },
        { "Herb-Crusted Salmon",  "Fresh Atlantic salmon with sesame glaze & greens.",             "2100", "Main Dish",  "/assets/salmon.png" },
        { "Margherita Pizza",     "Fresh mozzarella, basil, tomato sauce.",                       "1100", "Main Dish",  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600" },
        { "Crispy Calamari",      "Golden fried with spicy marinara.",                             "850",  "Starters",   "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600" },
        { "Bruschetta",           "Fresh tomatoes, garlic, hand-torn basil on grilled sourdough.","650",  "Starters",   "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=600" },
        { "French Fries",         "Crispy golden fries with sea salt.",                            "300",  "Side Dish",  "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600" },
        { "Chocolate Fondant",    "Warm dark chocolate lava cake with vanilla gelato.",            "700",  "Desserts",   "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600" },
        { "Iced Latte",           "Chilled espresso over milk.",                                   "450",  "Beverages",  "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600" },
        { "Pancakes",             "Fluffy stack with maple syrup.",                                "550",  "BreakFast",  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600" },
    };

    @Override
    public void run(String... args) throws Exception {

        // ── 1. Roles ──────────────────────────────────────────────────────────
        for (Role.RoleName roleName : Role.RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                System.out.println("Seeded missing role: " + roleName);
            }
        }
        System.out.println("Role seeding complete.");

        // ── 2. Categories (ensure all required ones exist) ────────────────────
        Set<String> requiredCategories = new LinkedHashSet<>(Arrays.asList(
                "Main Dish", "Starters", "Side Dish", "Desserts", "Beverages", "BreakFast"
        ));
        Map<String, Category> categoryMap = new HashMap<>();
        categoryRepository.findAll().forEach(c -> categoryMap.put(c.getName(), c));

        for (String catName : requiredCategories) {
            if (!categoryMap.containsKey(catName)) {
                Category newCat = Category.builder()
                        .name(catName)
                        .description(catName + " items")
                        .build();
                newCat = categoryRepository.save(newCat);
                categoryMap.put(catName, newCat);
                System.out.println("Seeded missing category: " + catName);
            }
        }

        // ── 3. Products — ensure all 10 canonical meals exist ─────────────────
        // Build a set of existing product names (lowercased) for fast lookup
        Set<String> existingNames = new HashSet<>();
        productRepository.findAll().forEach(p -> existingNames.add(p.getName().toLowerCase()));

        int added = 0;
        for (Object[] row : MENU) {
            String name        = (String) row[0];
            String description = (String) row[1];
            String price       = (String) row[2];
            String catName     = (String) row[3];
            String imageUrl    = (String) row[4];

            if (!existingNames.contains(name.toLowerCase())) {
                Category cat = categoryMap.get(catName);
                if (cat == null) {
                    // Fallback: create category if still missing
                    cat = categoryRepository.save(
                            Category.builder().name(catName).description(catName + " items").build());
                    categoryMap.put(catName, cat);
                }
                productRepository.save(Product.builder()
                        .name(name)
                        .description(description)
                        .price(new BigDecimal(price))
                        .category(cat)
                        .available(true)
                        .imageUrl(imageUrl)
                        .build());
                added++;
                System.out.println("Seeded missing product: " + name);
            }
        }

        // Also fix any existing products with null imageUrl
        productRepository.findAll().forEach(product -> {
            if (product.getImageUrl() == null || product.getImageUrl().isEmpty()) {
                String lower = product.getName().toLowerCase();
                if      (lower.contains("burger"))                        product.setImageUrl("/assets/burger.png");
                else if (lower.contains("ribeye") || lower.contains("steak")) product.setImageUrl("/assets/steak.png");
                else if (lower.contains("salmon"))                        product.setImageUrl("/assets/salmon.png");
                else if (lower.contains("pizza"))                         product.setImageUrl("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600");
                else if (lower.contains("calamari"))                      product.setImageUrl("https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=600");
                else if (lower.contains("bruschetta"))                    product.setImageUrl("https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=600");
                else if (lower.contains("fries"))                         product.setImageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=600");
                else if (lower.contains("fondant") || lower.contains("chocolate")) product.setImageUrl("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600");
                else if (lower.contains("latte") || lower.contains("tea") || lower.contains("coffee")) product.setImageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600");
                else if (lower.contains("pancake"))                       product.setImageUrl("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&q=80&w=600");
                else                                                      product.setImageUrl("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600");
                productRepository.save(product);
            }
        });

        System.out.println("Menu seeding complete. Added " + added + " new product(s). Total: " + productRepository.count());

        // ── 4. Admin user ─────────────────────────────────────────────────────
        Role adminRole = roleRepository.findByName(Role.RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role Admin is not found."));

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
