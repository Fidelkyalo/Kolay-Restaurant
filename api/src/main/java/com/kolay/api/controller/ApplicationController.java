package com.kolay.api.controller;

import com.kolay.api.model.Application;
import com.kolay.api.payload.response.MessageResponse;
import com.kolay.api.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    // Public — anyone can submit an application
    @PostMapping
    public ResponseEntity<?> submit(@RequestBody Application application) {
        Application saved = applicationRepository.save(application);
        return ResponseEntity.ok(saved);
    }

    // Admin only — view all applications
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<Application>> getAll() {
        return ResponseEntity.ok(applicationRepository.findAllByOrderBySubmittedAtDesc());
    }

    // Admin only — update status (Pending / Approved / Rejected)
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(body.get("status"));
            applicationRepository.save(app);
            return ResponseEntity.ok(new MessageResponse("Status updated to " + body.get("status")));
        }).orElse(ResponseEntity.notFound().build());
    }
}
