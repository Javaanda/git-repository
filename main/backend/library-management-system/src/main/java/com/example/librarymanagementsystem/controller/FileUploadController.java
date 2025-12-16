package com.example.librarymanagementsystem.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {
    
    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);
    
    // 配置文件上传路径
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    // 支持的图片格式
    private static final String[] ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif"};
    
    // 上传图书封面图片
    @PostMapping("/book-cover")
    public ResponseEntity<?> uploadBookCover(@RequestParam("file") MultipartFile file) {
        try {
            logger.info("Received request to upload book cover");
            
            // 检查文件是否为空
            if (file.isEmpty()) {
                logger.error("Uploaded file is empty");
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("error", "上传的文件为空");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 检查文件大小（最大5MB）
            if (file.getSize() > 5 * 1024 * 1024) {
                logger.error("File size exceeds limit: {} bytes", file.getSize());
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("error", "文件大小超过限制（最大5MB）");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 检查文件格式
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = getFileExtension(originalFilename).toLowerCase();
            
            if (!isAllowedExtension(fileExtension)) {
                logger.error("File extension not allowed: {}", fileExtension);
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("error", "不支持的文件格式，仅支持jpg、jpeg、png、gif格式");
                return ResponseEntity.badRequest().body(response);
            }
            
            // 生成唯一的文件名
            String uniqueFilename = UUID.randomUUID().toString() + "." + fileExtension;
            
            // 确保上传目录存在
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                logger.info("Created upload directory: {}", uploadDir);
            }
            
            // 保存文件到指定路径
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);
            
            // 返回文件路径
            String fileUrl = "/uploads/" + uniqueFilename;
            logger.info("Book cover uploaded successfully: {}", fileUrl);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("url", fileUrl);
            response.put("filename", uniqueFilename);
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error uploading file: {}", e.getMessage(), e);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", "文件上传失败：" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
    
    // 删除文件
    @DeleteMapping("/book-cover/{filename}")
    public ResponseEntity<?> deleteBookCover(@PathVariable String filename) {
        try {
            logger.info("Received request to delete book cover: {}", filename);
            
            Path filePath = Paths.get(uploadDir).resolve(filename);
            
            if (!Files.exists(filePath)) {
                logger.error("File not found: {}", filename);
                Map<String, Object> response = new java.util.HashMap<>();
                response.put("error", "文件不存在");
                return ResponseEntity.badRequest().body(response);
            }
            
            Files.delete(filePath);
            logger.info("Book cover deleted successfully: {}", filename);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "文件删除成功");
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            logger.error("Error deleting file: {}", e.getMessage(), e);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", "文件删除失败：" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(response);
        }
    }
    
    // 获取文件扩展名
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
    
    // 检查文件扩展名是否允许
    private boolean isAllowedExtension(String extension) {
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (allowedExt.equals(extension)) {
                return true;
            }
        }
        return false;
    }
}