package com.thara.pos_jp_restaurant.controller;

import com.thara.pos_jp_restaurant.dto.CategoryDTO;
import com.thara.pos_jp_restaurant.model.Category;
import com.thara.pos_jp_restaurant.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<CategoryDTO> getAllCategory() {
        List<Category> categories = categoryRepository.findAll();

        return categories.stream().map(category -> {
            CategoryDTO dto = new CategoryDTO();
            dto.setId(category.getId());
            dto.setName(category.getName());
            dto.setDescription(category.getDescription());
            return dto;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setDescription(categoryDTO.getDescription());

        Category savedCategory = categoryRepository.save(category);

        CategoryDTO responseDTO = new CategoryDTO();
        responseDTO.setId(savedCategory.getId());
        responseDTO.setName(savedCategory.getName());
        responseDTO.setDescription(savedCategory.getDescription());

        return responseDTO;
    }
}
