package com.example.learning.controller;

import com.example.learning.common.ApiResponse;
import com.example.learning.service.CrudService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/{table}")
public class CrudController {
    private final CrudService crudService;

    public CrudController(CrudService crudService) {
        this.crudService = crudService;
    }

    @GetMapping("/list")
    public ApiResponse<List<Map<String, Object>>> list(@PathVariable String table,
                                                       @RequestParam(required = false) String keyword,
                                                       @RequestParam(required = false) String search) {
        return ApiResponse.ok(crudService.list(table, keyword != null ? keyword : search));
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<Map<String, Object>> detail(@PathVariable String table, @PathVariable String id) {
        return ApiResponse.ok(crudService.detail(table, id));
    }

    @PostMapping("/add")
    public ApiResponse<Map<String, Object>> add(@PathVariable String table, @RequestBody Map<String, Object> data) {
        return ApiResponse.ok("新增成功", crudService.add(table, data));
    }

    @PostMapping("/update")
    public ApiResponse<Map<String, Object>> update(@PathVariable String table, @RequestBody Map<String, Object> data) {
        return ApiResponse.ok("更新成功", crudService.update(table, data));
    }

    @PostMapping("/delete/{id}")
    public ApiResponse<Void> delete(@PathVariable String table, @PathVariable String id) {
        crudService.delete(table, id);
        return ApiResponse.ok("删除成功", null);
    }
}
