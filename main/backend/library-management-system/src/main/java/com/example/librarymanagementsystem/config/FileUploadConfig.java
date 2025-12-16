package com.example.librarymanagementsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

@Configuration
public class FileUploadConfig {
    
    @Bean
    public MultipartResolver multipartResolver() {
        CommonsMultipartResolver resolver = new CommonsMultipartResolver();
        // 设置最大上传文件大小为10MB
        resolver.setMaxUploadSize(10 * 1024 * 1024);
        // 设置单个文件大小限制为5MB
        resolver.setMaxUploadSizePerFile(5 * 1024 * 1024);
        // 设置默认编码
        resolver.setDefaultEncoding("UTF-8");
        return resolver;
    }
}