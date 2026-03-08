package com.thara.pos_jp_restaurant.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Boolean isAvailable;

    private Long categoryId;
    private String categoryName;
}
