package com.thara.pos_jp_restaurant.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}
