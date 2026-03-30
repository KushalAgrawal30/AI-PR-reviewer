package com.kushal.backend.controller;

import com.kushal.backend.dto.UserMeDto;
import com.kushal.backend.entity.User;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<UserMeDto> me(Authentication authentication) {

        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
                UserMeDto.builder()
                        .id(user.getId())
                        .githubLogin(user.getGithubLogin())
                        .name(user.getName())
                        .avatarUrl(user.getAvatarUrl())
                        .build()
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("app_token", "")
                .httpOnly(true)
                .secure(false) // local dev only
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok("Logged out successfully");
    }

}
