package com.example.librarymanagementsystem.config;

import com.example.librarymanagementsystem.entity.User;
import com.example.librarymanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 数据初始化类，用于在应用启动时创建默认的管理员用户
 */
@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserService userService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 检查是否已经存在admin用户
        if (!userService.existsByUsername("admin")) {
            // 创建默认管理员用户
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setPassword("123456"); // 密码会在UserService中自动加密
            adminUser.setEmail("admin@example.com");
            adminUser.setFullName("系统管理员");
            adminUser.setRole("ROLE_ADMIN");
            adminUser.setStatus(true);
            
            // 保存管理员用户
            userService.registerUser(adminUser);
            System.out.println("默认管理员用户已创建: 用户名=admin, 密码=123456");
        }
    }
}
