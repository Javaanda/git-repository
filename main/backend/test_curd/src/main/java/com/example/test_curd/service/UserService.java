package com.example.test_curd.service;

import com.example.test_curd.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User saveUser(User user);
    User updateUser(Long id, User userDetails);
    void deleteUser(Long id);
    User findByUsername(String username);
    User findByEmail(String email);
}
