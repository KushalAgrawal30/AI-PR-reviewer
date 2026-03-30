package com.kushal.backend.controller;

import com.kushal.backend.dto.GitHubAPIDto.GitHubUserDto;
import com.kushal.backend.entity.User;
import com.kushal.backend.security.AppJwtService;
import com.kushal.backend.service.GitHubAuthService;
import com.kushal.backend.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@RestController
@RequestMapping("/api/auth/github")
@RequiredArgsConstructor
public class AuthController {

    private final GitHubAuthService gitHubAuthService;
    private final UserService userService;
    private final AppJwtService appJwtService;

    @GetMapping("/callback")
    public RedirectView githubCallback(
            @RequestParam("code") String code,
            HttpServletResponse response
    ){
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

        String appToken = appJwtService.generateToken(user);

        ResponseCookie cookie = ResponseCookie.from("app_token", appToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        System.out.println("Cookie set");

        return new RedirectView("http://localhost:3000/dashboard");
    }

    private String encode(String value) {
        return URLEncoder.encode(
                value == null ? "" : value,
                StandardCharsets.UTF_8
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("app_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }
}
