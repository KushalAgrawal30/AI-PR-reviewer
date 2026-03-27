package com.kushal.backend.controller;

import com.kushal.backend.dto.GitHubAPIDto.GitHubUserDto;
import com.kushal.backend.entity.User;
import com.kushal.backend.service.GitHubAuthService;
import com.kushal.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth/github")
@RequiredArgsConstructor
public class AuthController {

    private final GitHubAuthService gitHubAuthService;
    private final UserService userService;

    @GetMapping("/callback")
    public RedirectView githubCallback(@RequestParam("code") String code){

        String accessToken = gitHubAuthService.getAccessToken(code);
        GitHubUserDto githubUser = gitHubAuthService.getGithubUser(accessToken);

        User user = userService.createOrUpdateGithubUser(
                githubUser.getId(),
                githubUser.getLogin(),
                githubUser.getName(),
                githubUser.getEmail(),
                githubUser.getAvatarUrl(),
                accessToken
        );

        String redirectUrl =
                "http://localhost:3000/auth/success" +
                        "?id=" + user.getId() +
                        "&githubLogin=" + encode(user.getGithubLogin()) +
                        "&name=" + encode(user.getName()) +
                        "&avatarUrl=" + encode(user.getAvatarUrl());

        return new RedirectView(redirectUrl);
    }

    private String encode(String value) {
        return URLEncoder.encode(
                value == null ? "" : value,
                StandardCharsets.UTF_8
        );
    }
}
