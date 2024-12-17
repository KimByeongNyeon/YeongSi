package com.yeongsi.backend.domain;

import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String username;

    private String gender;

    private LocalDateTime createAt;
    @PrePersist
    public void prePersist() {
        this.createAt = LocalDateTime.now();
        if (this.profileImageUrl == null || this.profileImageUrl.isBlank()) {
            this.profileImageUrl = "https://ssl.pstatic.net/static/pwe/address/img_profile.png";
        }
    }
    private String password;


    private String profileImageUrl;
    private String role;
}
