package com.kushal.backend.service;

import com.kushal.backend.dto.ChangedFileDto;
import com.kushal.backend.dto.GitHubInstallationTokenResponseDto;
import com.kushal.backend.dto.GitHubPullRequestFileDto;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GitHubAppService {

    private final RestTemplate restTemplate;

    @Value("${github.app.id}")
    private String githubAppId;

    @Value("${github.app.private-key-path}")
    private String privateKeyPath;

    private PrivateKey loadPrivateKey() throws Exception{

        String privateKeyPem = Files.readString(Paths.get(privateKeyPath));

        privateKeyPem = privateKeyPem
                .replaceAll("-----BEGIN [A-Z ]+-----", "")
                .replaceAll("-----END [A-Z ]+-----", "")
                .replaceAll("\\s", "");

        byte[] keyBytes = Base64.getDecoder().decode(privateKeyPem);

        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyBytes);
        KeyFactory keyFactory = KeyFactory.getInstance("RSA");

        return keyFactory.generatePrivate(keySpec);
    }

    public String generateAppJwt(){
        try{
            PrivateKey privateKey = loadPrivateKey();

            Instant now = Instant.now();

            return Jwts.builder()
                    .issuer(String.valueOf(githubAppId))
                    .issuedAt(Date.from(now.minusSeconds(60)))
                    .expiration(Date.from(now.plusSeconds(540)))
                    .signWith(privateKey, Jwts.SIG.RS256)
                    .compact();

        }catch (Exception e){
            throw new RuntimeException("Failed to generate GitHub App JWT", e);
        }
    }

    public String getInstallationAccessToken(Long installationId){
        try {
            String githubJwt = generateAppJwt();

            String url = "https://api.github.com/app/installations/" + installationId + "/access_tokens";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(githubJwt);
            headers.set("Accept", "application/vnd.github+json");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<GitHubInstallationTokenResponseDto> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            GitHubInstallationTokenResponseDto.class
                    );

            if (response.getBody() == null || response.getBody().getToken() == null) {
                throw new RuntimeException("GitHub installation token response was empty");
            }

            return response.getBody().getToken();
        }catch (Exception e){
            throw new RuntimeException("Failed to get GitHub installation access token", e);
        }
    }

    public List<ChangedFileDto> getPullRequestFiles(
            Long installationId,
            String repoFullName,
            int prNumberLong
    ){
        try {
            String installationToken = getInstallationAccessToken(installationId);
            String[] parts = repoFullName.split("/");

            if (parts.length != 2) {
                throw new RuntimeException("Invalid repo full name: " + repoFullName);
            }

            String owner = parts[0];
            String repo = parts[1];

            String url = "https://api.github.com/repos/" + owner + "/" + repo + "/pulls/" + prNumberLong + "/files";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(installationToken);
            headers.set("Accept", "application/vnd.github+json");

            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<GitHubPullRequestFileDto[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    GitHubPullRequestFileDto[].class
            );


            GitHubPullRequestFileDto[] files = response.getBody();

            if (files == null) {
                return List.of();
            }

            List<ChangedFileDto> changedFileList = new ArrayList<>();

            for (GitHubPullRequestFileDto file : files) {
                if (file.getPatch() == null || file.getPatch().isBlank()) {
                    continue;
                }

                ChangedFileDto changedFile = ChangedFileDto.builder()
                        .path(file.getFilename())
                        .patch(file.getPatch())
                        .build();

                changedFileList.add(changedFile);
            }

            return changedFileList;
        }catch (Exception e){
            throw new RuntimeException("Failed to fetch pull request files", e);

        }
    }


}
