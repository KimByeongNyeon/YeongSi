package com.yeongsi.backend.dto;

import com.yeongsi.backend.domain.Article;
import com.yeongsi.backend.domain.PostImage;
import com.yeongsi.backend.domain.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class ArticleDto {
    @Getter @Setter
    public static class Request {
        private String title;
        private String content;
        private String guestName;
        private String guestPassword;
    }

    @Getter @Setter
    @Builder    // 이 부분 추가!
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private String authorEmail;
        private String authorName;
        private String authorProfile;
        private boolean isMemberPost;
        private List<String> imageUrls;
        private int likeCount;
        private int commentCount;
        private LocalDateTime createdAt;

        public static Response fromEntity(Article article) {
            return Response.builder()
                    .id(article.getId())
                    .authorEmail(article.isWrittenByMember() ? article.getAuthor().getEmail() : "")
                    .title(article.getTitle())
                    .content(article.getContent())
                    .authorName(article.isWrittenByMember() ?
                            article.getAuthor().getUsername() : article.getGuestName())
                    .authorProfile(article.isWrittenByMember() ?
                            article.getAuthor().getProfileImageUrl() : "https://ssl.pstatic.net/static/pwe/address/img_profile.png")
                    .isMemberPost(article.isWrittenByMember())
                    .imageUrls(article.getImages().stream()
                            .map(image -> "http://localhost:8080/uploads/" + image.getStoredFileName())
                            .collect(Collectors.toList())) // 추가된 부분
                    .likeCount(article.getLikeCount())
                    .commentCount(article.getCommentCount())
                    .createdAt(article.getCreatedAt())
                    .build();
        }
    }
}
