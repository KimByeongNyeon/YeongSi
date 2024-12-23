package com.yeongsi.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PostImage {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Article_id")
    private Article article;

    private String originalFileName;

    private String storedFileName;

    private String imageUrl;

    private Long fileSize;

    @Builder
    public PostImage(Article article, String originalFileName, String storedFileName, String imageUrl, Long fileSize) {
        this.article = article;
        this.originalFileName = originalFileName;
        this.storedFileName = storedFileName;
        this.imageUrl = imageUrl;
        this.fileSize = fileSize;

    }
}
