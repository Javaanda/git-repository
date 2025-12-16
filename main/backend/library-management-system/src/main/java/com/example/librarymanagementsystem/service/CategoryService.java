package com.example.librarymanagementsystem.service;

import com.example.librarymanagementsystem.entity.Category;
import java.util.List;

public interface CategoryService {
    // 创建分类
    Category createCategory(Category category);
    
    // 获取所有分类
    List<Category> getAllCategories();
    
    // 根据ID获取分类
    Category getCategoryById(Long id);
    
    // 更新分类
    Category updateCategory(Long id, Category category);
    
    // 删除分类
    void deleteCategory(Long id);
    
    // 根据名称获取分类
    Category getCategoryByName(String name);
    
    // 检查分类是否存在
    boolean categoryExists(String name);
}