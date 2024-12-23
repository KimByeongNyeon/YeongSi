package com.yeongsi.backend.repository;

import com.yeongsi.backend.domain.Article;
import com.yeongsi.backend.domain.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleImageRepository extends JpaRepository<PostImage, Long> {
    List<PostImage> findByArticleOrderByIdAsc(Article article);
    void deleteByArticle(Article article);
}
