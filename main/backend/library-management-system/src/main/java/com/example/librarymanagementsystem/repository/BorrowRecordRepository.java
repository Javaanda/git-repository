package com.example.librarymanagementsystem.repository;

import com.example.librarymanagementsystem.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    
    /**
     * 查询所有借阅记录并加载关联的图书和用户
     */
    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book JOIN FETCH br.user")
    List<BorrowRecord> findAllWithBookAndUser();
    
    /**
     * 根据图书ID查询借阅记录并加载关联的图书和用户
     */
    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book JOIN FETCH br.user WHERE br.book.id = ?1")
    List<BorrowRecord> findByBookIdWithBookAndUser(Long bookId);
    
    /**
     * 根据用户ID查询借阅记录并加载关联的图书和用户
     */
    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book JOIN FETCH br.user WHERE br.user.id = ?1")
    List<BorrowRecord> findByUserIdWithBookAndUser(Long userId);
    
    /**
     * 根据图书ID查询借阅记录
     */
    List<BorrowRecord> findByBookId(Long bookId);
    
    /**
     * 根据用户ID查询借阅记录
     */
    List<BorrowRecord> findByUserId(Long userId);
    
    /**
     * 根据图书ID和状态查询借阅记录
     */
    Optional<BorrowRecord> findByBookIdAndStatus(Long bookId, String status);
    
    /**
     * 根据用户ID和状态查询借阅记录
     */
    List<BorrowRecord> findByUserIdAndStatus(Long userId, String status);
    
    /**
     * 查询所有特定状态的借阅记录并加载关联的图书和用户
     */
    @Query("SELECT br FROM BorrowRecord br JOIN FETCH br.book JOIN FETCH br.user WHERE br.status = ?1")
    List<BorrowRecord> findByStatusWithBookAndUser(String status);
    
    /**
     * 查询所有特定状态的借阅记录
     */
    List<BorrowRecord> findByStatus(String status);
}