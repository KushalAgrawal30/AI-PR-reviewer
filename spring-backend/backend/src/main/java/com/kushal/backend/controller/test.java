package com.kushal.backend.controller;

import com.kushal.backend.dto.ChangedFileDto;
import com.kushal.backend.dto.PRfilesRequestDTO;
import com.kushal.backend.service.GitHubAppService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class test {

    private final GitHubAppService gitHubAppService;

    @GetMapping("/api/health")
    public String health() {

        System.out.println(gitHubAppService.generateAppJwt());
        System.out.println(gitHubAppService.getInstallationAccessToken(119025644L));
        return "Backend is running";
    }

    @GetMapping("/api/pr-files")
    public ResponseEntity<List<ChangedFileDto>> getPullRequestFiles(
            @RequestBody PRfilesRequestDTO pRfilesRequestDTO
            ){
        return ResponseEntity.ok().body(gitHubAppService.getPullRequestFiles(
                pRfilesRequestDTO.getInstallationId(),
                pRfilesRequestDTO.getRepoFullName(),
                pRfilesRequestDTO.getPrNumberLong()
        ));
    }

}
