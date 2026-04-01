package com.kushal.backend.repository;

import com.kushal.backend.entity.ReviewJob;
import com.kushal.backend.entity.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewJobRepository extends JpaRepository<ReviewJob, Long> {
    List<ReviewJob> findByRepositoryNameOrderByCreatedAtDesc(String repositoryName);
    List<ReviewJob> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ReviewJob> findByIdAndUserId(Long id, Long userId);
    List<ReviewJob> findByUserIdAndRepositoryNameOrderByCreatedAtDesc(Long userId, String repositoryName);
    Optional<ReviewJob> findFirstByStatusOrderByCreatedAtAsc(ReviewStatus status);
}
