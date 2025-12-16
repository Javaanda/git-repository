package com.example.librarymanagementsystem.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import com.example.librarymanagementsystem.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    /**
     * 请求日志过滤器
     */
    @Bean
    public RequestLoggingFilter requestLoggingFilter() {
        return new RequestLoggingFilter();
    }
    
    /**
     * 安全过滤链
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        System.out.println("=== SecurityConfig.filterChain() 被调用 ===");
        
        http
            .csrf().disable()
            .cors().and() // 启用CORS支持
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests(authorize -> {
                System.out.println("=== 配置URL授权规则 ===");
                authorize
                    .antMatchers("/api/users/**").permitAll() // 允许所有用户接口
                    .antMatchers("/api/books/**").permitAll() // 暂时允许所有图书接口，后续可根据需求调整
                    .antMatchers("/api/categories/**").permitAll() // 允许分类接口
                    .antMatchers("/api/borrow-records/**").authenticated() // 改为需要认证才能访问借阅记录接口
                    .antMatchers("/api/upload/**").permitAll() // 允许文件上传接口
                    .anyRequest().authenticated();
            })
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(requestLoggingFilter(), JwtAuthenticationFilter.class);
        
        System.out.println("=== 安全过滤链配置完成 ===");
        return http.build();
    }
    
    /**
     * CORS配置
     */
    @Bean
    public org.springframework.web.filter.CorsFilter corsFilter() {
        System.out.println("=== 配置CORS过滤链 ===");
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        org.springframework.web.cors.CorsConfiguration config = new org.springframework.web.cors.CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:5173"); // 允许来自前端的请求
        config.addAllowedOrigin("http://localhost:5174"); // 允许来自前端的请求
        config.addAllowedOrigin("http://localhost:5175"); // 允许来自前端的请求
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new org.springframework.web.filter.CorsFilter(source);
    }
    
    /**
     * 自定义请求日志过滤器
     */
    public static class RequestLoggingFilter implements Filter {
        @Override
        public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            String requestURI = httpRequest.getRequestURI();
            
            System.out.println("=== 请求开始 ===");
            System.out.println("请求URL: " + httpRequest.getRequestURL());
            System.out.println("请求方法: " + httpRequest.getMethod());
            System.out.println("请求路径: " + httpRequest.getServletPath());
            System.out.println("请求参数: " + httpRequest.getQueryString());
            System.out.println("请求URI: " + requestURI);
            
            // 检查是否是登录请求
            if (requestURI.equals("/api/users/login")) {
                System.out.println("=== 检测到登录请求 ===");
            }
            
            // 继续处理请求
            chain.doFilter(request, response);
            
            int statusCode = ((javax.servlet.http.HttpServletResponse)response).getStatus();
            System.out.println("=== 请求结束 - 状态码: " + statusCode + " ===");
            
            // 检查登录请求的响应状态
            if (requestURI.equals("/api/users/login")) {
                System.out.println("=== 登录请求响应状态码: " + statusCode + " ===");
            }
        }
        
        @Override
        public void init(FilterConfig filterConfig) throws ServletException {
            System.out.println("=== RequestLoggingFilter.init() 被调用 ===");
        }
        
        @Override
        public void destroy() {
            System.out.println("=== RequestLoggingFilter.destroy() 被调用 ===");
        }
    }
}



