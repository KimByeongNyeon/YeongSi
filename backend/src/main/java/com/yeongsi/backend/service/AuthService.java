package com.yeongsi.backend.service;

import com.yeongsi.backend.config.JwtConfig;
import com.yeongsi.backend.config.UserDetailsImpl;
import com.yeongsi.backend.domain.User;
import com.yeongsi.backend.dto.AuthDto;
import com.yeongsi.backend.exception.CustomException;
import com.yeongsi.backend.exception.ErrorCode;
import com.yeongsi.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
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
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_EMAIL));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        String token = jwtConfig.generateToken(new UserDetailsImpl(user));

        return AuthDto.AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }

    public AuthDto.UserInfoResponse getUserInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_EMAIL));

        return AuthDto.UserInfoResponse.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}