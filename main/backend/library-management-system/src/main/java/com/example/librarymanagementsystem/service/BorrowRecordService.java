package com.example.librarymanagementsystem.service;

import com.example.librarymanagementsystem.entity.BorrowRecord;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface BorrowRecordService {
    
    /**
     * 借阅图书
     */
    BorrowRecord borrowBook(Long bookId, Long userId, int days);
    
    /**
     * 归还图书
     */
    BorrowRecord returnBook(Long recordId);
    
    /**
     * 根据ID查询借阅记录
     */
    Optional<BorrowRecord> findById(Long id);
    
    /**
     * 根据图书ID查询借阅记录
     */
    List<BorrowRecord> findByBookId(Long bookId);
    
    /**
     * 根据用户ID查询借阅记录
     */
    List<BorrowRecord> findByUserId(Long userId);
    
    /**
     * 查询所有借阅记录
     */
    List<BorrowRecord> findAll();
    
    /**
     * 查询所有特定状态的借阅记录
     */
    List<BorrowRecord> findByStatus(String status);
    
    /**
     * 更新借阅记录
     */
    BorrowRecord updateBorrowRecord(BorrowRecord borrowRecord);
    
    /**
     * 删除借阅记录
     */
    void deleteBorrowRecord(Long id);
}