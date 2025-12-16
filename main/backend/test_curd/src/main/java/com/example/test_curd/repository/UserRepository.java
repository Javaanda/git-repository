package com.example.test_curd.repository;

import com.example.test_curd.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 可以在这里添加自定义的查询方法
    User findByUsername(String username);
    User findByEmail(String email);
}
