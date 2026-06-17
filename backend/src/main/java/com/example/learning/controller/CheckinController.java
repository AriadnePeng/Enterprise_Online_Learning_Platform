package com.example.learning.controller;

import com.example.learning.common.ApiResponse;
import com.example.learning.dto.ProcessCheckinRequest;
import com.example.learning.service.CheckinService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/procedures/checkin")
public class CheckinController {
    private final CheckinService checkinService;

    public CheckinController(CheckinService checkinService) {
        this.checkinService = checkinService;
    }

    @PostMapping("/process")
    public ApiResponse<Void> process(@Valid @RequestBody ProcessCheckinRequest request) {
        checkinService.process(request);
        return ApiResponse.ok("打卡处理完成", null);
    }
}
