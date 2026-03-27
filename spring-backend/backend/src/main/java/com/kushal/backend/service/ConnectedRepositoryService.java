package com.kushal.backend.service;

import com.kushal.backend.entity.ConnectedRepository;
import com.kushal.backend.entity.User;
import com.kushal.backend.repository.ConnectedRepositoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ConnectedRepositoryService {

    private final ConnectedRepositoryRepository connectedRepositoryRepository;



    public ConnectedRepository connectRepository(
            User user,
            Long githubRepoId,
            String repoName,
            String ownerName,
            String fullName,
            Long installationId,
            Boolean isPrivate
    ){
        return connectedRepositoryRepository.findByFullName(fullName)
                .map(existingRepo -> {
                    existingRepo.setUser(user);
                    existingRepo.setGithubRepoId(githubRepoId);
                    existingRepo.setRepoName(repoName);
                    existingRepo.setOwnerName(ownerName);
                    existingRepo.setInstallationId(installationId);
                    existingRepo.setIsPrivate(isPrivate);
                    existingRepo.setActive(true);
                    return connectedRepositoryRepository.save(existingRepo);
                })
                .orElseGet(() -> connectedRepositoryRepository.save(
                        ConnectedRepository.builder()
                                .user(user)
                                .githubRepoId(githubRepoId)
                                .repoName(repoName)
                                .ownerName(ownerName)
                                .fullName(fullName)
                                .installationId(installationId)
                                .isPrivate(isPrivate)
                                .active(true)
                                .build()
                ));
    }

    public List<ConnectedRepository> getRepositoriesForUser(Long userId) {
        return connectedRepositoryRepository.findByUserId(userId);
    }

    public ConnectedRepository getByFullName(String fullName) {
        return connectedRepositoryRepository.findByFullName(fullName)
                .orElseThrow(() -> new RuntimeException("Connected repository not found: " + fullName));
    }

    public boolean isRepositoryActive(String fullName) {
        return connectedRepositoryRepository.findByFullNameAndActiveTrue(fullName).isPresent();
    }

    public ConnectedRepository activateRepository(String fullName) {
        ConnectedRepository repository = getByFullName(fullName);
        repository.setActive(true);
        return connectedRepositoryRepository.save(repository);
    }

    public ConnectedRepository deactivateRepository(String fullName) {
        ConnectedRepository repository = getByFullName(fullName);
        repository.setActive(false);
        return connectedRepositoryRepository.save(repository);
    }

}
