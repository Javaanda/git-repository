package com.example.librarymanagementsystem.controller;

import com.example.librarymanagementsystem.entity.BorrowRecord;
import com.example.librarymanagementsystem.service.BorrowRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.HashMap;

@RestController
@RequestMapping("/api/borrow-records")
public class BorrowRecordController {
    
    @Autowired
    private BorrowRecordService borrowRecordService;
    
    /**
     * 借阅图书
     */
    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(@RequestBody Map<String, Object> data) {
        try {
            // 检查请求数据是否包含必要的字段
            if (!data.containsKey("bookId")) {
                throw new RuntimeException("请求缺少bookId字段");
            }
            
            if (!data.containsKey("userId")) {
                throw new RuntimeException("请求缺少userId字段");
            }
            
            Long bookId = Long.valueOf(data.get("bookId").toString());
            Long userId = Long.valueOf(data.get("userId").toString());
            int days = data.containsKey("days") ? Integer.valueOf(data.get("days").toString()) : 14;
            
            BorrowRecord record = borrowRecordService.borrowBook(bookId, userId, days);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "借阅成功");
            response.put("record", record);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "借阅失败: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 归还图书
     */
    @PutMapping("/return/{id}")
    public ResponseEntity<?> returnBook(@PathVariable Long id) {
        try {
            BorrowRecord record = borrowRecordService.returnBook(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "归还成功");
            response.put("record", record);
            
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "归还失败: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 根据ID查询借阅记录
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBorrowRecord(@PathVariable Long id) {
        Optional<BorrowRecord> recordOptional = borrowRecordService.findById(id);
        if (recordOptional.isPresent()) {
            return new ResponseEntity<>(recordOptional.get(), HttpStatus.OK);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "借阅记录不存在");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }
    
    /**
     * 根据图书ID查询借阅记录
     */
    @GetMapping("/book/{bookId}")
    public ResponseEntity<?> getBorrowRecordsByBookId(@PathVariable Long bookId) {
        List<BorrowRecord> records = borrowRecordService.findByBookId(bookId);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }
    
    /**
     * 根据用户ID查询借阅记录
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBorrowRecordsByUserId(@PathVariable Long userId) {
        List<BorrowRecord> records = borrowRecordService.findByUserId(userId);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }
    
    /**
     * 查询所有借阅记录
     */
    @GetMapping
    public ResponseEntity<?> getAllBorrowRecords() {
        List<BorrowRecord> records = borrowRecordService.findAll();
        return new ResponseEntity<>(records, HttpStatus.OK);
    }
    
    /**
     * 根据状态查询借阅记录
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getBorrowRecordsByStatus(@PathVariable String status) {
        List<BorrowRecord> records = borrowRecordService.findByStatus(status);
        return new ResponseEntity<>(records, HttpStatus.OK);
    }
    
    /**
     * 更新借阅记录
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBorrowRecord(@PathVariable Long id, @RequestBody BorrowRecord borrowRecord) {
        try {
            Optional<BorrowRecord> existingRecord = borrowRecordService.findById(id);
            if (existingRecord.isPresent()) {
                borrowRecord.setId(id);
                BorrowRecord updatedRecord = borrowRecordService.updateBorrowRecord(borrowRecord);
                return new ResponseEntity<>(updatedRecord, HttpStatus.OK);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("message", "借阅记录不存在");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "更新失败: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * 删除借阅记录
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBorrowRecord(@PathVariable Long id) {
        try {
            borrowRecordService.deleteBorrowRecord(id);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "删除成功");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "删除失败: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}