package com.example.librarymanagementsystem.repository;

import com.example.librarymanagementsystem.entity.Book;
import com.example.librarymanagementsystem.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    
    // 根据书名查询图书
    List<Book> findByTitleContaining(String title);
    
    // 根据作者查询图书
    List<Book> findByAuthorContaining(String author);
    
    // 根据ISBN查询图书
    Optional<Book> findByIsbn(String isbn);
    
    // 根据分类查询图书
    List<Book> findByCategory(Category category);
    
    // 根据分类名称查询图书
    List<Book> findByCategory_Name(String categoryName);
    
    // 根据状态查询图书（可用/已借出）
    List<Book> findByStatus(Boolean status);
    
    // 根据出版社查询图书
    List<Book> findByPublisherContaining(String publisher);
}
