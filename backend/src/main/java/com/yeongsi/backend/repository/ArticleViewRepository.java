package com.yeongsi.backend.repository;

import com.yeongsi.backend.domain.Article;
import com.yeongsi.backend.domain.ArticleView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ArticleViewRepository extends JpaRepository<ArticleView, Long> {
    boolean existsByArticleAndViewerIpAndViewedAtAfter(
            Article article, String viewerIp, LocalDateTime dateTime
    );
}
