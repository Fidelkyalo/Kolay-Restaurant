package com.kolay.api;

import com.kolay.api.model.Role;
import com.kolay.api.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            for (Role.RoleName roleName : Role.RoleName.values()) {
                roleRepository.save(Role.builder().name(roleName).build());
            }
            System.out.println("Finished seeding roles.");
        }
    }
}
