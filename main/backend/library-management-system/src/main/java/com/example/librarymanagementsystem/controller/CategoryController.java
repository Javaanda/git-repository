package com.example.librarymanagementsystem.controller;

import com.example.librarymanagementsystem.entity.Category;
import com.example.librarymanagementsystem.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryController.class);
    
    @Autowired
    private CategoryService categoryService;
    
    // 创建分类
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        try {
            logger.info("Received request to create category: {}", category.getName());
            Category createdCategory = categoryService.createCategory(category);
            return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            logger.error("Error creating category: {}", e.getMessage());
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 获取所有分类
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        logger.info("Received request to get all categories");
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    // 根据ID获取分类
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            logger.info("Received request to get category by ID: {}", id);
            Category category = categoryService.getCategoryById(id);
            return ResponseEntity.ok(category);
        } catch (RuntimeException e) {
            logger.error("Error getting category by ID {}: {}", id, e.getMessage());
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 更新分类
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try {
            logger.info("Received request to update category with ID: {}", id);
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            logger.error("Error updating category with ID {}: {}", id, e.getMessage());
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 删除分类
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            logger.info("Received request to delete category with ID: {}", id);
            categoryService.deleteCategory(id);
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "分类删除成功");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            logger.error("Error deleting category with ID {}: {}", id, e.getMessage());
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // 根据名称获取分类
    @GetMapping("/name/{name}")
    public ResponseEntity<?> getCategoryByName(@PathVariable String name) {
        try {
            logger.info("Received request to get category by name: {}", name);
            Category category = categoryService.getCategoryByName(name);
            return ResponseEntity.ok(category);
        } catch (RuntimeException e) {
            logger.error("Error getting category by name {}: {}", name, e.getMessage());
            Map<String, Object> response = new java.util.HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}