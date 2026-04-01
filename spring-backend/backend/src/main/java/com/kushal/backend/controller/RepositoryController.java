package com.kushal.backend.controller;

import com.kushal.backend.dto.ConnectAfterInstallRequestDto;
import com.kushal.backend.dto.RequestDto.RequestRepoConnectDTO;
import com.kushal.backend.dto.UserRepositoryViewDto;
import com.kushal.backend.entity.ConnectedRepository;
import com.kushal.backend.entity.User;
import com.kushal.backend.service.GitHubAppService;
import com.kushal.backend.service.GithubRepositoryService;
import com.kushal.backend.service.ConnectedRepositoryService;
import com.kushal.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/repositories")
@RequiredArgsConstructor
public class RepositoryController {

    private final ConnectedRepositoryService connectedRepositoryService;
    private final GithubRepositoryService githubRepositoryService;
    private final GitHubAppService gitHubAppService;
    private final UserService userService;

    @GetMapping("/user")
    public ResponseEntity<List<ConnectedRepository>> getRepositoriesForUser(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        List<ConnectedRepository> connectedRepositoryList = connectedRepositoryService.getRepositoriesForUser(user.getId());
        return ResponseEntity.ok(connectedRepositoryList);
    }

    @GetMapping("/github/user")
    public ResponseEntity<List<UserRepositoryViewDto>> getAllUserRepositories(Authentication authentication){
        User user = (User) authentication.getPrincipal();

        List<UserRepositoryViewDto> userRepositoryViewDtoList = githubRepositoryService.getGithubRepositoriesForUser(user.getId());

        return ResponseEntity.ok(userRepositoryViewDtoList);
    }

    @PostMapping("/connect")
    public ResponseEntity<List<ConnectedRepository>> connectRepo(@RequestBody ConnectAfterInstallRequestDto repoConnect){
        User user = userService.getUserById(repoConnect.getUserId());

        List<RequestRepoConnectDTO> repos = gitHubAppService.getInstallationRepositories(repoConnect.getInstallationId());

        List<ConnectedRepository> connectedRepositories = new ArrayList<>();

        for(RequestRepoConnectDTO repo : repos){
            ConnectedRepository connectedRepository =
                    connectedRepositoryService.connectRepository(
                            user,
                            repo.getGithubRepoId(),
                            repo.getRepoName(),
                            repo.getOwnerName(),
                            repo.getFullName(),
                            repo.getInstallationId(),
                            repo.getIsPrivate()
                    );
            connectedRepositories.add(connectedRepository);
        }

        return ResponseEntity.ok().body(connectedRepositories);
    }

}
