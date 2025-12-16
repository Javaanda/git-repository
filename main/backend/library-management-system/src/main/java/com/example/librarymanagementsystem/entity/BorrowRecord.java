package com.example.librarymanagementsystem.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.ToString;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "borrow_records")
public class BorrowRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Book book;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private User user;
    
    @Column(name = "borrow_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date borrowDate;
    
    @Column(name = "due_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date dueDate;
    
    @Column(name = "return_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date returnDate;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status; // BORROWED, RETURNED, OVERDUE
    
    @Column(name = "fine_amount", precision = 10, scale = 2)
    private Double fineAmount;
    
    @Column(name = "create_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;
    
    @Column(name = "update_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateTime;
    
    // 用于JSON序列化的图书信息
    @Transient
    private String bookTitle;
    
    @Transient
    private String bookAuthor;
    
    // 用于JSON序列化的用户信息
    @Transient
    private String userFullName;
    
    // 获取图书标题
    public String getBookTitle() {
        if (book != null && bookTitle == null) {
            bookTitle = book.getTitle();
        }
        return bookTitle;
    }
    
    // 获取图书作者
    public String getBookAuthor() {
        if (book != null && bookAuthor == null) {
            bookAuthor = book.getAuthor();
        }
        return bookAuthor;
    }
    
    // 获取用户全名
    public String getUserFullName() {
        if (user != null && userFullName == null) {
            userFullName = user.getFullName();
        }
        return userFullName;
    }
}