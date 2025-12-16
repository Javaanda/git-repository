package com.example.librarymanagementsystem.service.impl;

import com.example.librarymanagementsystem.entity.Book;
import com.example.librarymanagementsystem.entity.BorrowRecord;
import com.example.librarymanagementsystem.entity.User;
import com.example.librarymanagementsystem.repository.BorrowRecordRepository;
import com.example.librarymanagementsystem.service.BookService;
import com.example.librarymanagementsystem.service.BorrowRecordService;
import com.example.librarymanagementsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BorrowRecordServiceImpl implements BorrowRecordService {
    
    @Autowired
    private BorrowRecordRepository borrowRecordRepository;
    
    @Autowired
    private BookService bookService;
    
    @Autowired
    private UserService userService;
    
    /**
     * 借阅图书
     */
    @Override
    @Transactional
    public BorrowRecord borrowBook(Long bookId, Long userId, int days) {
        // 1. 查找图书
        Optional<Book> bookOptional = bookService.getBookById(bookId);
        if (!bookOptional.isPresent()) {
            throw new RuntimeException("图书不存在");
        }
        
        Book book = bookOptional.get();
        
        // 2. 检查图书是否可借阅
        if (!book.getStatus() || book.getStock() <= 0) {
            throw new RuntimeException("图书已借出或库存不足");
        }
        
        // 3. 查找用户
        Optional<User> userOptional = userService.findById(userId);
        if (!userOptional.isPresent()) {
            throw new RuntimeException("用户不存在");
        }
        
        User user = userOptional.get();
        
        // 4. 更新图书库存
        book.setStock(book.getStock() - 1);
        
        // 5. 如果库存减到0，将图书状态设置为不可借阅
        if (book.getStock() <= 0) {
            book.setStatus(false);
        }
        
        bookService.updateBook(bookId, book);
        
        // 5. 创建借阅记录
        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setBook(book);
        borrowRecord.setUser(user);
        borrowRecord.setBorrowDate(new Date());
        
        // 设置到期日期
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, days);
        borrowRecord.setDueDate(calendar.getTime());
        
        borrowRecord.setStatus("BORROWED");
        borrowRecord.setCreateTime(new Date());
        borrowRecord.setUpdateTime(new Date());
        
        return borrowRecordRepository.save(borrowRecord);
    }
    
    /**
     * 归还图书
     */
    @Override
    @Transactional
    public BorrowRecord returnBook(Long recordId) {
        // 1. 查找借阅记录
        Optional<BorrowRecord> recordOptional = borrowRecordRepository.findById(recordId);
        if (!recordOptional.isPresent()) {
            throw new RuntimeException("借阅记录不存在");
        }
        
        BorrowRecord borrowRecord = recordOptional.get();
        
        // 2. 检查记录是否已归还
        if ("RETURNED".equals(borrowRecord.getStatus())) {
            throw new RuntimeException("图书已归还");
        }
        
        // 3. 更新图书状态和库存
        Book book = borrowRecord.getBook();
        book.setStatus(true);
        book.setStock(book.getStock() + 1);
        bookService.updateBook(book.getId(), book);
        
        // 4. 更新借阅记录
        borrowRecord.setReturnDate(new Date());
        
        // 5. 计算逾期罚款
        Date currentDate = new Date();
        if (currentDate.after(borrowRecord.getDueDate())) {
            long diff = currentDate.getTime() - borrowRecord.getDueDate().getTime();
            long daysLate = diff / (1000 * 60 * 60 * 24) + 1;
            borrowRecord.setFineAmount(daysLate * 1.0); // 每天罚款1元
            borrowRecord.setStatus("OVERDUE");
        } else {
            borrowRecord.setStatus("RETURNED");
        }
        
        borrowRecord.setUpdateTime(new Date());
        
        return borrowRecordRepository.save(borrowRecord);
    }
    
    /**
     * 根据ID查询借阅记录
     */
    @Override
    public Optional<BorrowRecord> findById(Long id) {
        return borrowRecordRepository.findById(id);
    }
    
    /**
     * 根据图书ID查询借阅记录
     */
    @Override
    public List<BorrowRecord> findByBookId(Long bookId) {
        return borrowRecordRepository.findByBookIdWithBookAndUser(bookId);
    }
    
    /**
     * 根据用户ID查询借阅记录
     */
    @Override
    public List<BorrowRecord> findByUserId(Long userId) {
        return borrowRecordRepository.findByUserIdWithBookAndUser(userId);
    }
    
    /**
     * 查询所有借阅记录
     */
    @Override
    public List<BorrowRecord> findAll() {
        return borrowRecordRepository.findAllWithBookAndUser();
    }
    
    /**
     * 查询所有特定状态的借阅记录
     */
    @Override
    public List<BorrowRecord> findByStatus(String status) {
        return borrowRecordRepository.findByStatusWithBookAndUser(status);
    }
    
    /**
     * 更新借阅记录
     */
    @Override
    public BorrowRecord updateBorrowRecord(BorrowRecord borrowRecord) {
        borrowRecord.setUpdateTime(new Date());
        return borrowRecordRepository.save(borrowRecord);
    }
    
    /**
     * 删除借阅记录
     */
    @Override
    public void deleteBorrowRecord(Long id) {
        borrowRecordRepository.deleteById(id);
    }
}