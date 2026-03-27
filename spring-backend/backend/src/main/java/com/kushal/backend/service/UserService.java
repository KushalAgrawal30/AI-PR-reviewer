package com.kushal.backend.service;

import com.kushal.backend.entity.User;
import com.kushal.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createOrUpdateGithubUser(
            Long githubId,
            String githubLogin,
            String name,
            String email,
            String avatarUrl,
            String githubAccessToken
    ){

        User user = userRepository.findByGithubId(githubId)
                .or(() -> userRepository.findByGithubLogin(githubLogin))
                .orElseGet(User::new);

        user.setGithubId(githubId);
        user.setGithubLogin(githubLogin);
        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        user.setEmail(email);
        user.setGithubAccessToken(githubAccessToken);

        return userRepository.save(user);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByGithubLogin(String githubLogin) {
        return userRepository.findByGithubLogin(githubLogin)
                .orElseThrow(() -> new RuntimeException("User not found with github login: " + githubLogin));
    }

    public User getUserByGithubId(Long githubId) {
        return userRepository.findByGithubId(githubId)
                .orElseThrow(() -> new RuntimeException("User not found with github id: " + githubId));
    }

}
