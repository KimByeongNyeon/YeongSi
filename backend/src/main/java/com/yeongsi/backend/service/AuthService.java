package com.yeongsi.backend.service;

import com.yeongsi.backend.config.JwtConfig;
import com.yeongsi.backend.config.UserDetailsImpl;
import com.yeongsi.backend.domain.User;
import com.yeongsi.backend.dto.AuthDto;
import com.yeongsi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtConfig jwtConfig;

    @Transactional
    public AuthDto.AuthResponse signUp(AuthDto.SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .username(request.getUsername())
                .profileImageUrl(request.getProfileImageUrl())
                .role("ROLE_USER")
                .build();

        User savedUser = userRepository.save(user);
        String token = jwtConfig.generateToken(new UserDetailsImpl(savedUser));

        return AuthDto.AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .username(savedUser.getUsername())
                .build();
    }

    public AuthDto.AuthResponse login(AuthDto.LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("잘못된 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("잘못된 비밀번호입니다.");
        }

        String token = jwtConfig.generateToken(new UserDetailsImpl(user));

        return AuthDto.AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }
}
