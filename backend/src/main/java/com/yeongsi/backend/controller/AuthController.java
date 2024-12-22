package com.yeongsi.backend.controller;

import com.yeongsi.backend.config.UserDetailsImpl;
import com.yeongsi.backend.dto.AuthDto;
import com.yeongsi.backend.exception.CustomException;
import com.yeongsi.backend.exception.ErrorCode;
import com.yeongsi.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthDto.AuthResponse> signUp(@RequestBody AuthDto.SignupRequest request) {
        log.info("회원가입 요청 : {} ",request.getEmail());
        return ResponseEntity.ok(authService.signUp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDto.AuthResponse> login(@RequestBody AuthDto.LoginRequest request) {
        log.info("로그인 요청 : {} ",request.getEmail());
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthDto.UserInfoResponse> getUserInfo(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        log.debug("Get user info request received");  // 디버깅용 로그 추가
        if (userDetails == null) {
            log.warn("UserDetails is null in getUserInfo");  // 디버깅용 로그 추가
            throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
        }
        log.debug("UserDetails username: {}", userDetails.getUsername());  // 디버깅용 로그 추가
        return ResponseEntity.ok(authService.getUserInfo(userDetails.getUsername()));
    }

}
