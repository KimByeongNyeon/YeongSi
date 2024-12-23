package com.yeongsi.backend.service;

import com.yeongsi.backend.config.UserDetailsImpl;
import com.yeongsi.backend.domain.*;
import com.yeongsi.backend.dto.ArticleDto;
import com.yeongsi.backend.exception.CustomException;
import com.yeongsi.backend.exception.ErrorCode;
import com.yeongsi.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {
    private final ArticleRepository articleRepository;
    private final ArticleImageRepository articleImageRepository;
    private final ArticleLikeRepository articleLikeRepository;
    private final ArticleViewRepository articleViewRepository;
    private final CommentRepository commentRepository;
    private final FileService fileService;
    private final PasswordEncoder passwordEncoder;


    private void validateMemberAuthority(Article article, UserDetailsImpl userDetails) {
        if (!article.getAuthor().getId().equals(userDetails.getUser().getId())) {
            throw  new CustomException(ErrorCode.UNAUTHORIZED_POST_ACCESS);
        }
    }

    private void validateGuestPassword(Article article, String password) {
        if(!passwordEncoder.matches(password, article.getGuestPassword())) {
            throw new CustomException(ErrorCode.INVALID_GUEST_PASSWORD);
        }
    }

    public List<ArticleDto.Response> getArticles() {
        return articleRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ArticleDto.Response::fromEntity)
                .collect(Collectors.toList());
    }

    private void uploadImages(Article article, List<MultipartFile> images) {
        images.forEach(image -> {
            try {
                String storedFileName = fileService.uploadFile(image);
                String imageUrl = "/uploads/" + storedFileName;

                PostImage articleImage = PostImage.builder()
                        .article(article)
                        .originalFileName(image.getOriginalFilename())
                        .storedFileName(storedFileName)
                        .imageUrl(imageUrl)
                        .fileSize(image.getSize())
                        .build();

                article.addImage(articleImage);
                articleImageRepository.save(articleImage);
            }catch (Exception e) {
                throw new CustomException(ErrorCode.FILE_UPLOAD_ERROR);
            }
        });
    }

    @Transactional
    public ArticleDto.Response getArticle(Long articleId, String ipAddress) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        boolean hasRecentView = articleViewRepository.existsByArticleAndViewerIpAndViewedAtAfter(
                article, ipAddress, LocalDateTime.now().minusHours(24)
        );

        if (!hasRecentView) {
            ArticleView articleView = ArticleView.builder()
                    .article(article)
                    .viewerIp(ipAddress)
                    .build();
            articleViewRepository.save(articleView);
            article.incrementViewCount();
        }
        return ArticleDto.Response.fromEntity(article);
    }

    @Transactional
    public ArticleDto.Response createMemberArticle(User user, ArticleDto.Request request, List<MultipartFile> images) {
        Article article = Article.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(user)
                .build();

        Article saveArticle = articleRepository.save(article);

        if (images != null && !images.isEmpty()) {
            uploadImages(saveArticle, images);
        }

        return ArticleDto.Response.fromEntity(saveArticle);
    }

    @Transactional
    public ArticleDto.Response createGuestArticle(ArticleDto.Request request, List<MultipartFile> images) {
        Article article = Article.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .guestName(request.getGuestName())
                .guestPassword(passwordEncoder.encode(request.getGuestPassword()))
                .build();
        Article saveArticle = articleRepository.save(article);

        if(images != null && !images.isEmpty()) {
            uploadImages(saveArticle, images);
        }

        return ArticleDto.Response.fromEntity(saveArticle);
    }

    public ArticleDto.Response updateArticle(Long articleId, ArticleDto.Request request,
                                             List<MultipartFile> newImages, List<Long> deleteImageIds, UserDetailsImpl userDetails) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        if (article.isWrittenByMember()) {
            validateMemberAuthority(article, userDetails);
        } else {
            validateGuestPassword(article, request.getGuestPassword());
        }

        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            deleteImages(article, deleteImageIds);
        }

        if (newImages != null && !newImages.isEmpty()) {
            uploadImages(article, newImages);
        }

        article.update(request.getTitle(), request.getContent());
        return ArticleDto.Response.fromEntity(article);
    }

    public void deleteArticle(Long articleId, String guestPassword, UserDetailsImpl userDetails) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        if (article.isWrittenByMember()) {
            validateMemberAuthority(article, userDetails);
        } else {
            validateGuestPassword(article, guestPassword);
        }

        articleImageRepository.deleteByArticle(article);
        articleRepository.delete(article);
    }

    public boolean toggleLike(Long articleId, User user) {
        Article article = articleRepository.findById(articleId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        Optional<ArticleLike> articleLike = articleLikeRepository.findByArticleAndUser(article, user);

        if (articleLike.isPresent()) {
            articleLikeRepository.delete(articleLike.get());
            article.decrementLikeCount();
            return false;
        } else {
            articleLikeRepository.save(ArticleLike.builder()
                    .article(article)
                    .user(user)
                    .build());
            article.incrementLikeCount();
            return true;
        }
    }

    private void deleteImages(Article article, List<Long> imageIds) {
        imageIds.forEach(imageId -> {
            PostImage image = articleImageRepository.findById(imageId)
                    .orElseThrow(() -> new CustomException(ErrorCode.IMAGE_NOT_FOUND));
            if (!image.getArticle().getId().equals(article.getId())) {
                throw new CustomException(ErrorCode.UNAUTHORIZED_IMAGE_ACCESS);
            }

            fileService.deleteFile(image.getStoredFileName());
            article.removeImage(image);
            articleImageRepository.delete(image);
        });
    }
}
