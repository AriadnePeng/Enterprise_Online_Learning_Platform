package com.example.learning.service;

import com.example.learning.dto.LoginRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AuthService {

    public Map<String, Object> login(LoginRequest request) {
        return Map.of(
                "token", "dev-token-" + System.currentTimeMillis(),
                "user", Map.of(
                        "id", request.username(),
                        "name", "admin".equalsIgnoreCase(request.username()) ? "系统管理员" : request.username(),
                        "role", "平台管理员"
                )
        );
    }
}
