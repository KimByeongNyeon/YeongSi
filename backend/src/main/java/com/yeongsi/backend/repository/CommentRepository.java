package com.yeongsi.backend.repository;

import com.yeongsi.backend.domain.Article;
import com.yeongsi.backend.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByArticleOrderByCreatedAtAsc(Article article);
    List<Comment> findByArticleAndParentIsNullOrderByCreatedAtAsc(Article article);
    int countByArticle(Article article);
}
