package com.example.librarymanagementsystem.service;

import com.example.librarymanagementsystem.entity.Book;
import com.example.librarymanagementsystem.entity.Category;
import com.example.librarymanagementsystem.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private CategoryService categoryService;
    
    /**
     * 获取所有图书
     */
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    /**
     * 根据ID获取图书
     */
    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }
    
    /**
     * 根据书名搜索图书
     */
    public List<Book> searchBooksByTitle(String title) {
        return bookRepository.findByTitleContaining(title);
    }
    
    /**
     * 根据作者搜索图书
     */
    public List<Book> searchBooksByAuthor(String author) {
        return bookRepository.findByAuthorContaining(author);
    }
    
    /**
     * 根据ISBN查询图书
     */
    public Optional<Book> getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }
    
    /**
     * 根据分类查询图书
     */
    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategory_Name(category);
    }
    
    /**
     * 获取所有可用图书
     */
    public List<Book> getAvailableBooks() {
        return bookRepository.findByStatus(true);
    }
    
    /**
     * 添加图书
     */
    @Transactional
    public Book addBook(Book book) {
        // 检查ISBN是否已存在
        if (book.getIsbn() != null && !book.getIsbn().isEmpty()) {
            Optional<Book> existingBook = bookRepository.findByIsbn(book.getIsbn());
            if (existingBook.isPresent()) {
                throw new IllegalArgumentException("图书ISBN已存在: " + book.getIsbn());
            }
        }
        
        // 检查是否有categoryId字段，如果有则设置分类
        if (book.getCategoryId() != null) {
            Category category = categoryService.getCategoryById(book.getCategoryId());
            book.setCategory(category);
        }
        
        return bookRepository.save(book);
    }
    
    /**
     * 更新图书信息
     */
    @Transactional
    public Book updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("图书不存在，ID: " + id));
        
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setPublisher(bookDetails.getPublisher());
        book.setPublishDate(bookDetails.getPublishDate());
        book.setPrice(bookDetails.getPrice());
        book.setDescription(bookDetails.getDescription());
        book.setStock(bookDetails.getStock());
        book.setStatus(bookDetails.getStatus());
        
        // 检查是否有categoryId字段，如果有则设置分类
        if (bookDetails.getCategoryId() != null) {
            Category category = categoryService.getCategoryById(bookDetails.getCategoryId());
            book.setCategory(category);
        } else if (bookDetails.getCategory() != null) {
            book.setCategory(bookDetails.getCategory());
        }
        
        return bookRepository.save(book);
    }
    
    /**
     * 删除图书
     */
    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("图书不存在，ID: " + id));
        bookRepository.delete(book);
    }
    
    /**
     * 借阅图书
     */
    @Transactional
    public Book borrowBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("图书不存在，ID: " + id));
        
        if (!book.getStatus()) {
            throw new RuntimeException("图书已被借出: " + book.getTitle());
        }
        
        if (book.getStock() <= 0) {
            throw new RuntimeException("图书库存不足: " + book.getTitle());
        }
        
        book.setStatus(false);
        book.setStock(book.getStock() - 1);
        
        return bookRepository.save(book);
    }
    
    /**
     * 归还图书
     */
    @Transactional
    public Book returnBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("图书不存在，ID: " + id));
        
        if (book.getStatus()) {
            throw new RuntimeException("图书未被借出: " + book.getTitle());
        }
        
        book.setStatus(true);
        book.setStock(book.getStock() + 1);
        
        return bookRepository.save(book);
    }
    
    /**
     * 更新图书库存
     */
    @Transactional
    public Book updateStock(Long id, Integer stock) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("图书不存在，ID: " + id));
        
        if (stock < 0) {
            throw new IllegalArgumentException("库存数量不能为负数");
        }
        
        book.setStock(stock);
        
        // 如果库存大于0，设置状态为可用
        if (stock > 0) {
            book.setStatus(true);
        }
        
        return bookRepository.save(book);
    }
}
