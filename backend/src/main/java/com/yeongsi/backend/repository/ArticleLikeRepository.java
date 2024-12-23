package com.yeongsi.backend.repository;

import com.yeongsi.backend.domain.Article;
import com.yeongsi.backend.domain.ArticleLike;
import com.yeongsi.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleLikeRepository extends JpaRepository<ArticleLike, Long> {
    Optional<ArticleLike> findByArticleAndUser(Article article, User user);
    boolean existsByArticleAndUser(Article article, User user);
    void deleteByArticleAndUser(Article article, User user);
    int countByArticle(Article article);

}
