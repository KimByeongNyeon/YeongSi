package com.yeongsi.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)

public class ArticleView extends BaseTimeEntity{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="artice_id")
    private Article article;

    private String viewerIp;

    @Column(columnDefinition = "timestamp")
    private LocalDateTime viewedAt;

    @Builder
    public ArticleView(
            Article article,
            String viewerIp
    ) {
        this.article = article;
        this.viewerIp = viewerIp;
    }
}
