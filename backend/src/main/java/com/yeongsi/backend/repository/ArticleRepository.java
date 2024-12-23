package com.yeongsi.backend.repository;

import com.yeongsi.backend.domain.Article;
import com.yeongsi.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findAllByOrderByCreatedAtDesc();
    Optional<Article> findById(Long id);
    List<Article> findByAuthorOrderByCreatedAtDesc(User user);
    boolean existsByIdAndGuestPassword(Long id, String password);
    void deleteByIdAndGuestPassword(Long id, String password);
}
