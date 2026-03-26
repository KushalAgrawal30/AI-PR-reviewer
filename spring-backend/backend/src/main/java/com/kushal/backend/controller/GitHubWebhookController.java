package com.kushal.backend.controller;

import com.kushal.backend.service.GitHubWebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/github")
@RequiredArgsConstructor
public class GitHubWebhookController {

    private final GitHubWebhookService gitHubWebhookService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestHeader("X-GitHub-Event") String event,
            @RequestHeader(value = "X-Hub-Signature-256", required = false) String signature,
            @RequestBody String payload
    ){
        boolean valid = gitHubWebhookService.isValidSignature(payload, signature);

        if (!valid) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid webhook signature");
        }
        System.out.println(payload);
        gitHubWebhookService.processWebhook(event, payload);

        return ResponseEntity.ok("Webhook received successfully");
    }
}
