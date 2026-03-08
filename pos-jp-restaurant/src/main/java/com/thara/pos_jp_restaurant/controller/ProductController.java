package com.thara.pos_jp_restaurant.controller;

import com.thara.pos_jp_restaurant.dto.ProductDTO;
import com.thara.pos_jp_restaurant.model.Category;
import com.thara.pos_jp_restaurant.model.Product;
import com.thara.pos_jp_restaurant.repository.CategoryRepository;
import com.thara.pos_jp_restaurant.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAllWithCategory();

        return products.stream().map(product -> {
            ProductDTO dto = new ProductDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setPrice(product.getPrice());
            dto.setImageUrl(product.getImageUrl());
            dto.setIsAvailable(product.getIsAvailable());

            if (product.getCategory() != null) {
                dto.setCategoryId(product.getCategory().getId());
                dto.setCategoryName(product.getCategory().getName());
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบหมวดหมู่นี้ในระบบ"));

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setPrice(productDTO.getPrice());
        product.setImageUrl(productDTO.getImageUrl());
        product.setIsAvailable(productDTO.getIsAvailable() != null ? productDTO.getIsAvailable() : true);

        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        ProductDTO responseDTO = new ProductDTO();
        responseDTO.setId(savedProduct.getId());
        responseDTO.setName(savedProduct.getName());
        responseDTO.setPrice(savedProduct.getPrice());
        responseDTO.setImageUrl(savedProduct.getImageUrl());
        responseDTO.setIsAvailable(savedProduct.getIsAvailable());
        responseDTO.setCategoryId(savedProduct.getCategory().getId());
        responseDTO.setCategoryName(savedProduct.getCategory().getName());

        return responseDTO;
    }

    @Transactional
    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบสินค้า ID: " + id));

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบหมวดหมู่นี้ในระบบ"));

        existingProduct.setName(productDTO.getName());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setImageUrl(productDTO.getImageUrl());
        existingProduct.setIsAvailable(productDTO.getIsAvailable() != null ? productDTO.getIsAvailable() : true);
        existingProduct.setCategory(category);

        Product updatedProduct = productRepository.save(existingProduct);

        ProductDTO responseDTO = new ProductDTO();
        responseDTO.setId(updatedProduct.getId());
        responseDTO.setName(updatedProduct.getName());
        responseDTO.setPrice(updatedProduct.getPrice());
        responseDTO.setImageUrl(updatedProduct.getImageUrl());
        responseDTO.setIsAvailable(updatedProduct.getIsAvailable());
        responseDTO.setCategoryId(updatedProduct.getCategory().getId());
        responseDTO.setCategoryName(updatedProduct.getCategory().getName());

        return responseDTO;
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบสินค้า ID: " + id));

        productRepository.delete(product);
    }
}
