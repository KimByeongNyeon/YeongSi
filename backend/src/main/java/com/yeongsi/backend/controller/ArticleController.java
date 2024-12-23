package com.yeongsi.backend.controller;

import com.yeongsi.backend.config.UserDetailsImpl;
import com.yeongsi.backend.dto.ArticleDto;
import com.yeongsi.backend.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final PostService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleDto.Response>> getArticles () {
        return ResponseEntity.ok(articleService.getArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDto.Response> getArticle(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        String ipAddress = request.getRemoteAddr();
        return ResponseEntity.ok(articleService.getArticle(id, ipAddress));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticleDto.Response> createMemberArticle(
            @RequestPart(value = "data") ArticleDto.Request request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal UserDetailsImpl userDetails
            ){
        return ResponseEntity.ok(articleService.createMemberArticle(userDetails.getUser(), request, images));
    }

    @PostMapping(value = "/guest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticleDto.Response> createGuestArticle(
            @RequestPart(value = "data") ArticleDto.Request request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        return ResponseEntity.ok(articleService.createGuestArticle(request, images));
    }
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ArticleDto.Response> updateArticle(
            @PathVariable Long id,
            @RequestPart(value = "id") ArticleDto.Request request,
            @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
            @RequestParam(required = false) List<Long> deleteImageIds,
            @AuthenticationPrincipal UserDetailsImpl userDetails)
    {
        return ResponseEntity.ok(articleService.updateArticle(id, request, newImages, deleteImageIds, userDetails));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle (
            @PathVariable Long id,
            @RequestParam(required = false) String guestPassword,
            @AuthenticationPrincipal UserDetailsImpl userDetails)
    {
        articleService.deleteArticle(id, guestPassword, userDetails);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Boolean> toggleLike(
        @PathVariable Long id,
        @AuthenticationPrincipal UserDetailsImpl userDetails
    ) {
        boolean isLiked = articleService.toggleLike(id, userDetails.getUser());
        return ResponseEntity.ok(isLiked);
    }

}
