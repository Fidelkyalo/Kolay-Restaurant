package com.kolay.api.controller;

import com.kolay.api.model.User;
import com.kolay.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public Map<String, String> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Kolay Restaurant Management System API is running");
        return response;
    }

    // Temporary diagnostic endpoint — remove after fixing auth
    @GetMapping("/auth-debug")
    public Map<String, Object> authDebug(@RequestParam String username,
                                          @RequestParam String password) {
        Map<String, Object> result = new HashMap<>();
        try {
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isEmpty()) {
                result.put("found", false);
                result.put("error", "User not found");
                return result;
            }
            User user = userOpt.get();
            result.put("found", true);
            result.put("username", user.getUsername());
            result.put("passwordHashPrefix", user.getPassword().substring(0, 20));
            result.put("rolesCount", user.getRoles().size());
            result.put("roles", user.getRoles().stream()
                    .map(r -> r.getName().name())
                    .collect(Collectors.toList()));
            result.put("passwordMatches", passwordEncoder.matches(password, user.getPassword()));
        } catch (Exception e) {
            result.put("error", e.getClass().getSimpleName() + ": " + e.getMessage());
        }
        return result;
    }
}
