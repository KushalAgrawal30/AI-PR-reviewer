package com.kushal.backend.repository;

import com.kushal.backend.entity.ConnectedRepository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectedRepositoryRepository extends JpaRepository<ConnectedRepository, Long> {

    Optional<ConnectedRepository> findByFullName(String fullName);
    List<ConnectedRepository> findByUserId(Long userId);
    List<ConnectedRepository> findByActiveTrue();
    Optional<ConnectedRepository> findByFullNameAndActiveTrue(String fullName);
}
