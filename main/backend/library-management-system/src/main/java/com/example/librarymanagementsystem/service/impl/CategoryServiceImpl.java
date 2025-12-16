package com.example.librarymanagementsystem.service.impl;

import com.example.librarymanagementsystem.entity.Category;
import com.example.librarymanagementsystem.repository.CategoryRepository;
import com.example.librarymanagementsystem.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    private static final Logger logger = LoggerFactory.getLogger(CategoryServiceImpl.class);
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Override
    public Category createCategory(Category category) {
        logger.info("Creating category: {}", category.getName());
        
        // 检查分类名称是否已存在
        if (categoryRepository.existsByName(category.getName())) {
            logger.error("Category name already exists: {}", category.getName());
            throw new RuntimeException("分类名称已存在");
        }
        
        // 设置创建和更新时间
        Date now = new Date();
        category.setCreateTime(now);
        category.setUpdateTime(now);
        
        // 默认状态为活跃
        if (category.getStatus() == null) {
            category.setStatus(true);
        }
        
        Category savedCategory = categoryRepository.save(category);
        logger.info("Category created successfully with ID: {}", savedCategory.getId());
        return savedCategory;
    }
    
    @Override
    public List<Category> getAllCategories() {
        logger.info("Retrieving all categories");
        return categoryRepository.findAll();
    }
    
    @Override
    public Category getCategoryById(Long id) {
        logger.info("Retrieving category by ID: {}", id);
        return categoryRepository.findById(id)
                .orElseThrow(() -> {
                    logger.error("Category not found with ID: {}", id);
                    return new RuntimeException("分类不存在");
                });
    }
    
    @Override
    public Category updateCategory(Long id, Category categoryDetails) {
        logger.info("Updating category with ID: {}", id);
        
        Category existingCategory = getCategoryById(id);
        
        // 如果分类名称改变，检查新名称是否已存在
        if (!existingCategory.getName().equals(categoryDetails.getName()) && 
            categoryRepository.existsByName(categoryDetails.getName())) {
            logger.error("Category name already exists: {}", categoryDetails.getName());
            throw new RuntimeException("分类名称已存在");
        }
        
        // 更新分类信息
        existingCategory.setName(categoryDetails.getName());
        existingCategory.setDescription(categoryDetails.getDescription());
        existingCategory.setStatus(categoryDetails.getStatus());
        existingCategory.setUpdateTime(new Date());
        
        Category updatedCategory = categoryRepository.save(existingCategory);
        logger.info("Category updated successfully: {}", updatedCategory.getId());
        return updatedCategory;
    }
    
    @Override
    public void deleteCategory(Long id) {
        logger.info("Deleting category with ID: {}", id);
        
        Category category = getCategoryById(id);
        
        // 检查分类是否有关联的图书
        if (category.getBooks() != null && !category.getBooks().isEmpty()) {
            logger.error("Cannot delete category with books associated: {}", id);
            throw new RuntimeException("该分类下有图书，无法删除");
        }
        
        categoryRepository.delete(category);
        logger.info("Category deleted successfully: {}", id);
    }
    
    @Override
    public Category getCategoryByName(String name) {
        logger.info("Retrieving category by name: {}", name);
        Category category = categoryRepository.findByName(name);
        if (category == null) {
            logger.error("Category not found with name: {}", name);
            throw new RuntimeException("分类不存在");
        }
        return category;
    }
    
    @Override
    public boolean categoryExists(String name) {
        logger.info("Checking if category exists: {}", name);
        return categoryRepository.existsByName(name);
    }
}