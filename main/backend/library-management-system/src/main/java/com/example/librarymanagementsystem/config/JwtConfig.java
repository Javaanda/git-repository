package com.example.librarymanagementsystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {
    
    @Value("${jwt.secret:ThisIsASecureSecretKeyForJWTGenerationWithAtLeast512BitsOfEntropyToMeetTheHS512AlgorithmRequirements12345678901234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn}")
    private String secretKey;
    
    @Value("${jwt.expiration:86400000}")
    private long expirationTime;
    
    @Value("${jwt.refresh.expiration:604800000}")
    private long refreshExpirationTime;
    
    public String getSecretKey() {
        return secretKey;
    }
    
    public long getExpirationTime() {
        return expirationTime;
    }
    
    public long getRefreshExpirationTime() {
        return refreshExpirationTime;
    }
    
    public String getTokenPrefix() {
        return "Bearer ";
    }
    
    public String getAuthorizationHeader() {
        return "Authorization";
    }
}
