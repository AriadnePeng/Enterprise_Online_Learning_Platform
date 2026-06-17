package com.example.learning;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.example.learning.mapper")
@SpringBootApplication
public class EnterpriseLearningApplication {

    public static void main(String[] args) {
        SpringApplication.run(EnterpriseLearningApplication.class, args);
    }
}
