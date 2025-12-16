package com.example.librarymanagementsystem.security;

import com.example.librarymanagementsystem.entity.User;
import com.example.librarymanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private UserService userService;
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("=== UserDetailsServiceImpl.loadUserByUsername 开始 ===");
        System.out.println("查询用户名: " + username);
        
        User user = userService.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("用户不存在: " + username);
                    return new UsernameNotFoundException("用户不存在: " + username);
                });
        
        System.out.println("找到用户: " + user.getUsername());
        System.out.println("用户状态: " + user.getStatus());
        System.out.println("用户密码: " + user.getPassword());
        System.out.println("用户角色: " + user.getRole());
        
        // 检查用户状态
        if (!user.getStatus()) {
            System.out.println("用户已被禁用: " + username);
            throw new UsernameNotFoundException("用户已被禁用");
        }
        
        // 创建权限列表
        List<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority(user.getRole())
        );
        System.out.println("用户权限: " + authorities);
        
        // 返回Spring Security需要的UserDetails对象
        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(authorities)
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .disabled(false)
                .build();
        
        System.out.println("构建的UserDetails: " + userDetails);
        System.out.println("=== UserDetailsServiceImpl.loadUserByUsername 结束 ===");
        return userDetails;
    }
}
