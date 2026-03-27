package com.kushal.backend.service;

import com.kushal.backend.dto.AiDto.ChangedFileDto;
import com.kushal.backend.dto.RequestDto.CreateReviewRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GitHubWebhookService {

    @Value("${github.webhook.secret}")
    private String gitWebhookSecret;

    private final GitHubAppService gitHubAppService;
    private final ReviewOrchestrationService reviewOrchestrationService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public boolean isValidSignature(String payload, String signatureHeader){
        try{
            if(signatureHeader == null || signatureHeader.isBlank()){
                return false;
            }

            String expectedSignature = "sha256=" + hmacSha256(payload, gitWebhookSecret);

            return constantTimeEquals(expectedSignature, signatureHeader);

        }catch (Exception e){
            return false;
        }
    }

    public String hmacSha256(String payload, String secret) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKeySpec = new SecretKeySpec(
                secret.getBytes(StandardCharsets.UTF_8),
                "HmacSHA256"
        );
        mac.init(secretKeySpec);

        byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));

        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            hexString.append(String.format("%02x", b));
        }

        return hexString.toString();
    }

    private boolean constantTimeEquals(String a, String b) {
        if (a.length() != b.length()) {
            return false;
        }

        int result = 0;
        for (int i = 0; i < a.length(); i++) {
            result |= a.charAt(i) ^ b.charAt(i);
        }

        return result == 0;
    }

    public void processWebhook(String event, String payload){
        try {
            if (!event.equals("pull_request")) {
                System.out.println("Ignoring non-pull_request event: " + event);
                return;
            }

            JsonNode root = objectMapper.readTree(payload);

            String action = root.path("action").asString();
            Long installationId = root.path("installation").path("id").asLong();
            String repoFullName = root.path("repository").path("full_name").asString();
            int prNumber = root.path("pull_request").path("number").asInt();
            String title = root.path("pull_request").path("title").asString();
            String body = root.path("pull_request").path("body").asString();

            if (!List.of("opened", "reopened", "synchronize").contains(action)) {
                return;
            }

            System.out.println("Processing pull request webhook...");
            System.out.println("Action: " + action);
            System.out.println("Installation ID: " + installationId);
            System.out.println("Repository: " + repoFullName);
            System.out.println("PR Number: " + prNumber);
            System.out.println("Title: " + title);
            System.out.println("Body: " + body);


            List<ChangedFileDto> changedFileList = gitHubAppService.getPullRequestFiles(
                    installationId,
                    repoFullName,
                    prNumber
            );



            CreateReviewRequestDto reviewRequestDto = CreateReviewRequestDto.builder()
                    .repositoryName(repoFullName)
                    .prNumber(prNumber)
                    .title(title)
                    .description(body)
                    .changedFiles(changedFileList)
                    .build();

            if (changedFileList.isEmpty()) {
                System.out.println("No reviewable changed files found for PR #" + prNumber);
                return;
            }

            reviewOrchestrationService.startReview(reviewRequestDto);


        }catch (Exception e){
            throw new RuntimeException("Failed to process GitHub webhook", e);
        }
    }

}
