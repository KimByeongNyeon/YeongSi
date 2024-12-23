package com.yeongsi.backend.domain;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "article_id")
    private Article article;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User author;

    private String guestName;
    private String guestPassword;

    @Column(nullable = false)
    private String content;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Comment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Comment> children = new ArrayList<>();

    @Builder
    public Comment(
            Article article,
            User author,
            String guestName,
            String guestPassword,
            String content,
            Comment parent
    ) {
        this.article = article;
        this.author = author;
        this.guestName = guestName;
        this.guestPassword = guestPassword;
        this.content = content;
        this.parent = parent;
    }

    public void update(String content) {
        this.content = content;
    }

    public boolean isWrittenByMember() {
        return author != null;
    }
}
