package com.yeongsi.backend.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Article extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    private String guestName;
    private String guestPassword;

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticleLike> articleLikes = new ArrayList<>();

    @OneToMany(mappedBy = "article", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @Column(columnDefinition = "integer default 0")
    private int commentCount;

    @Column(columnDefinition = "integer default 0")
    private int likeCount;

    @Column(columnDefinition = "integer default 0")
    private int viewCount;

    private boolean hasImage;
    @Builder
    public Article(String title, String content, User author, String guestName, String guestPassword) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.guestName = guestName;
        this.guestPassword = guestPassword;
    }

    public boolean isWrittenByMember() {
        return author != null;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }

    public void addImage(PostImage image) {
        this.images.add(image);
    }

    public void removeImage(PostImage image) {
        this.images.remove(image);
    }

    public void incrementCommentCount() {
        this.commentCount++;
    }

    public void decrementCommentCount(){
        this.commentCount--;
    }

    public void incrementLikeCount() {
        this.likeCount++;
    }

    public void decrementLikeCount() {
        this.likeCount--;
    }

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void decrementViewCount() {
        this.viewCount--;
    }
}
