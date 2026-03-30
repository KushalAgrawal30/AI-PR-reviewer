package com.kushal.backend.service;

import com.kushal.backend.dto.GitHubAPIDto.GitHubAccessTokenResponseDto;
import com.kushal.backend.dto.GitHubAPIDto.GitHubRepositoryDto;
import com.kushal.backend.dto.GitHubAPIDto.GitHubUserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GitHubAuthService {

    @Value("${github.oauth.client-id}")
    private String clientId;

    @Value("${github.oauth.client-secret}")
    private String clientSecret;

    @Value("${github.oauth.redirect-uri}")
    private String redirectUrl;

    private final RestTemplate restTemplate;

    public String getAccessToken(String code){
        try{
            String url = "https://github.com/login/oauth/access_token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("code", code);

            HttpEntity<MultiValueMap<String, String>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<GitHubAccessTokenResponseDto> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            requestEntity,
                            GitHubAccessTokenResponseDto.class
                    );


            if (response.getBody() == null || response.getBody().getAccessToken() == null) {
                throw new RuntimeException("GitHub access token response was empty");
            }

            return response.getBody().getAccessToken();
        }catch (Exception e){
            throw new RuntimeException("Failed to get GitHub access token", e);
        }
    }

    public GitHubUserDto getGithubUser(String accessToken){
        try{
            String url = "https://api.github.com/user";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<GitHubUserDto> responseEntity =
                    restTemplate.exchange(
                            url,
                            HttpMethod.GET,
                            entity,
                            GitHubUserDto.class
                    );

            if (responseEntity.getBody() == null) {
                throw new RuntimeException("GitHub user response was empty");
            }

            return responseEntity.getBody();
        }catch (Exception e){
            throw new RuntimeException("Failed to fetch GitHub user", e);
        }
    }

    public List<GitHubRepositoryDto> getUserRepositories(String accessToken){
        try {
            String url = "https://api.github.com/user/repos";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("Accept", "application/vnd.github+json");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<GitHubRepositoryDto[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    GitHubRepositoryDto[].class
            );
            GitHubRepositoryDto[] repositories = response.getBody();

            if (repositories == null) {
                return List.of();
            }

            return Arrays.asList(repositories);

        }catch (Exception e){
            throw new RuntimeException("Failed to fetch GitHub repositories", e);

        }
    }



}
