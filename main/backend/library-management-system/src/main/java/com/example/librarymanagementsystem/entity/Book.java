package com.example.librarymanagementsystem.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;
import com.example.librarymanagementsystem.entity.Category;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "books")
public class Book {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "author", nullable = false, length = 100)
    private String author;
    
    @Column(name = "isbn", unique = true, length = 20)
    private String isbn;
    
    @Column(name = "publisher", length = 100)
    private String publisher;
    
    @Column(name = "publish_date")
    @Temporal(TemporalType.DATE)
    private Date publishDate;
    
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Category category;
    
    // 用于JSON序列化的分类名称
    @Transient
    private String categoryName;
    
    // 用于接收前端传递的分类ID
    @Transient
    private Long categoryId;
    
    // 自定义getter方法，从category中获取名称
    public String getCategoryName() {
        if (this.category != null) {
            return this.category.getName();
        }
        return null;
    }
    
    // 自定义getter方法，从category中获取ID
    public Long getCategoryId() {
        if (this.category != null) {
            return this.category.getId();
        }
        return this.categoryId;
    }
    
    @Column(name = "price", precision = 10, scale = 2)
    private Double price;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "stock")
    private Integer stock;
    
    @Column(name = "status")
    private Boolean status; // true: available, false: borrowed
    
    @Column(name = "cover_image")
    private String coverImage; // 封面图片路径
    
    @Column(name = "create_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;
    
    @Column(name = "update_time")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateTime;
    
    @PrePersist
    protected void onCreate() {
        createTime = new Date();
        updateTime = new Date();
        if (status == null) {
            status = true;
        }
        if (stock == null) {
            stock = 0;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updateTime = new Date();
    }
}

