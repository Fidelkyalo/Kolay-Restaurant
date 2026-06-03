package com.kolay.api.repository;

import com.kolay.api.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findAllByOrderBySubmittedAtDesc();
    List<Application> findByStatus(String status);
}
