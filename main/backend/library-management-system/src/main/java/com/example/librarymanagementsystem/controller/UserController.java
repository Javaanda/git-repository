package com.example.librarymanagementsystem.controller;

import com.example.librarymanagementsystem.entity.User;
import com.example.librarymanagementsystem.repository.UserRepository;
import com.example.librarymanagementsystem.security.JwtTokenProvider;
import com.example.librarymanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Collections;
import java.util.List;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User registeredUser = userService.registerUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用户注册成功");
            response.put("user", registeredUser);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> loginData) {
        System.out.println("=== loginUser方法被调用 ===");
        System.out.println("请求体: " + loginData);
        
        String username = loginData.get("username");
        String password = loginData.get("password");
        
        System.out.println("登录请求: username=" + username + ", password=" + password);
        
        if (username == null || password == null) {
            System.out.println("=== 登录失败: 用户名或密码为空 ===");
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用户名和密码不能为空");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
        
        try {
            // 1. 先验证用户存在且密码正确
            Optional<User> userOptional = userService.findByUsername(username);
            if (!userOptional.isPresent()) {
                System.out.println("用户不存在: " + username);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "用户名或密码错误");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
            
            User user = userOptional.get();
            System.out.println("找到用户: " + user.getUsername());
            
            // 2. 验证密码
            if (!passwordEncoder.matches(password, user.getPassword())) {
                System.out.println("密码错误");
                Map<String, Object> response = new HashMap<>();
                response.put("message", "用户名或密码错误");
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
            
            System.out.println("密码验证成功");
            
            // 3. 检查用户状态
            if (!user.getStatus()) {
                System.out.println("用户已被禁用");
                Map<String, Object> response = new HashMap<>();
                response.put("message", "用户已被禁用");
                return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
            }
            
            System.out.println("用户状态正常");
            
            // 4. 手动创建Authentication对象
            List<GrantedAuthority> authorities = Collections.singletonList(
                    new SimpleGrantedAuthority(user.getRole())
            );
            
            UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .authorities(authorities)
                    .accountExpired(false)
                    .accountLocked(false)
                    .credentialsExpired(false)
                    .disabled(false)
                    .build();
            
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, authorities
            );
            
            System.out.println("创建Authentication对象成功: " + authentication);
            
            // 5. 生成JWT令牌
            String token = tokenProvider.generateToken(authentication);
            System.out.println("生成JWT令牌成功: " + token);
            
            // 6. 构建响应
            Map<String, Object> response = new HashMap<>();
            response.put("message", "登录成功");
            response.put("token", token);
            response.put("user", user);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println("登录失败: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> response = new HashMap<>();
            response.put("message", "登录失败: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 获取用户信息
     */
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> userOptional = userService.findById(id);
        if (userOptional.isPresent()) {
            return new ResponseEntity<>(userOptional.get(), HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用户不存在");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * 测试密码加密和验证
     */
    @PostMapping("/test-password")
    public ResponseEntity<?> testPassword(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        
        System.out.println("测试密码: username=" + username + ", password=" + password);
        
        try {
            // 查找用户
            Optional<User> userOptional = userService.findByUsername(username);
            if (!userOptional.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "用户不存在");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            User user = userOptional.get();
            System.out.println("数据库中的密码: " + user.getPassword());
            
            // 测试密码验证
            boolean matches = passwordEncoder.matches(password, user.getPassword());
            System.out.println("密码匹配结果: " + matches);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "密码测试完成");
            response.put("username", username);
            response.put("password", password);
            response.put("storedPassword", user.getPassword());
            response.put("passwordMatches", matches);
            response.put("userStatus", user.getStatus());
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "测试失败: " + e.getMessage());
            e.printStackTrace();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 简单测试端点，验证控制器是否能正常接收请求
     */
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        System.out.println("=== 测试端点被调用 ===");
        return ResponseEntity.ok("Test endpoint is working!");
    }
    
    /**
     * 更新用户信息
     */
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            user.setId(id);
            User updatedUser = userService.updateUser(user);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用户信息更新成功");
            response.put("user", updatedUser);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    
    /**
     * 删除用户
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用户删除成功");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "用户删除失败: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 获取所有用户
     */
    @GetMapping("/")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
}
