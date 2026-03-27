package com.kushal.backend.service;

import com.kushal.backend.dto.GitHubAPIDto.GitHubRepositoryDto;
import com.kushal.backend.dto.UserRepositoryViewDto;
import com.kushal.backend.entity.ConnectedRepository;
import com.kushal.backend.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GithubRepositoryService {

    private final ConnectedRepositoryService connectedRepositoryService;
    private final GitHubAuthService gitHubAuthService;
    private final UserService userService;

    public List<UserRepositoryViewDto> getGithubRepositoriesForUser(Long userId) {
        User user = userService.getUserById(userId);

        if (user.getGithubAccessToken() == null || user.getGithubAccessToken().isBlank()) {
            throw new RuntimeException("User does not have a GitHub access token");
        }

        List<GitHubRepositoryDto> githubRepos =
                gitHubAuthService.getUserRepositories(user.getGithubAccessToken());

        List<ConnectedRepository> connectedRepos =
                connectedRepositoryService.getRepositoriesForUser(userId);

        Map<String, ConnectedRepository> connectedMap = connectedRepos.stream()
                .collect(Collectors.toMap(ConnectedRepository::getFullName, repo -> repo));

        return githubRepos.stream()
                .map(repo -> {
                    ConnectedRepository connectedRepo = connectedMap.get(repo.getFullName());

                    UserRepositoryViewDto dto = new UserRepositoryViewDto();
                    dto.setGithubRepoId(repo.getGithubRepoId());
                    dto.setName(repo.getName());
                    dto.setFullName(repo.getFullName());
                    dto.setOwnerName(repo.getOwner() != null ? repo.getOwner().getLogin() : "");
                    dto.setIsPrivate(repo.getIsPrivate());
                    dto.setInstallationId(connectedRepo != null ? connectedRepo.getInstallationId() : null);
                    dto.setConnected(connectedRepo != null);

                    return dto;
                })
                .toList();
    }

}
