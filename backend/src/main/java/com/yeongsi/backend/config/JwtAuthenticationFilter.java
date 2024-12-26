package com.yeongsi.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yeongsi.backend.exception.CustomException;
import com.yeongsi.backend.exception.ErrorCode;
import com.yeongsi.backend.exception.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtConfig jwtConfig;
    private final UserDetailsService userDetailsService;
    private final AntPathMatcher antPathMatcher = new AntPathMatcher();
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 인증이 필요없는 경로는 바로 통과
        if (request.getServletPath().contains("/api/auth/login") ||
                request.getServletPath().contains("/api/auth/signup") ||
                antPathMatcher.match("/api/files/**", request.getServletPath()) ||
                antPathMatcher.match("/uploads/**", request.getServletPath()) ||
                antPathMatcher.match("/api/articles/**", request.getServletPath()) && request.getMethod().equals("GET") ||
        (request.getServletPath().contains("/api/articles/guest") && request.getMethod().equals("POST"))
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        // 토큰이 없는 경우 인증 실패 처리
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.warn("Missing or invalid Authorization header");
            handleAuthenticationException(response, new CustomException(ErrorCode.UNAUTHORIZED_USER));
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String username = jwtConfig.extractUsername(jwt);

            if (username == null) {
                handleAuthenticationException(response, new CustomException(ErrorCode.INVALID_TOKEN));
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtConfig.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    handleAuthenticationException(response, new CustomException(ErrorCode.INVALID_TOKEN));
                    return;
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Authentication error: ", e);
            handleAuthenticationException(response, e);
        }
    }

    private void handleAuthenticationException(HttpServletResponse response, Exception e) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ErrorResponse errorResponse;
        if (e instanceof CustomException) {
            CustomException ce = (CustomException) e;
            response.setStatus(ce.getErrorCode().getStatus().value());
            errorResponse = ErrorResponse.builder()
                    .status(ce.getErrorCode().getStatus())
                    .message(ce.getMessage())
                    .build();
        } else {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            errorResponse = ErrorResponse.builder()
                    .status(HttpStatus.UNAUTHORIZED)
                    .message("인증에 실패했습니다.")
                    .build();
        }

        ObjectMapper mapper = new ObjectMapper();
        response.getWriter().write(mapper.writeValueAsString(errorResponse));
    }
}