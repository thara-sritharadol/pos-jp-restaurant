package com.thara.pos_jp_restaurant.controller;

import com.thara.pos_jp_restaurant.dto.OrderDTO;
import com.thara.pos_jp_restaurant.dto.OrderItemDTO;
import com.thara.pos_jp_restaurant.model.Order;
import com.thara.pos_jp_restaurant.model.OrderItem;
import com.thara.pos_jp_restaurant.model.Product;
import com.thara.pos_jp_restaurant.model.User;
import com.thara.pos_jp_restaurant.repository.OrderRepository;
import com.thara.pos_jp_restaurant.repository.ProductRepository;
import com.thara.pos_jp_restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public OrderDTO createOrder(@RequestBody OrderDTO orderRequest) {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String currentUsername;

        if (principal instanceof UserDetails) {
            currentUsername = ((UserDetails) principal).getUsername();
        } else {
            currentUsername = principal.toString();
        }

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ไม่พบข้อมูลพนักงานในระบบ"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Order.OrderStatus.COMPLETED);

        if (orderRequest.getPaymentMethod() != null) {
            order.setPaymentMethod(Order.PaymentMethod.valueOf(orderRequest.getPaymentMethod()));
        } else {
            order.setPaymentMethod(Order.PaymentMethod.CASH);
        }

        order.setCreatedAt(LocalDateTime.now());
        order.setOrderItems(new ArrayList<>());

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemDTO itemDTO : orderRequest.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบสินค้า ID: " + itemDTO.getProductId()));

            if (!product.getIsAvailable()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "สินค้า " + product.getName() + " หมดชั่วคราว");
            }

            BigDecimal unitPrice = product.getPrice();
            BigDecimal subTotal = unitPrice.multiply(new BigDecimal(itemDTO.getQuantity()));
            totalAmount = totalAmount.add(subTotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubTotal(subTotal);

            order.getOrderItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return convertToDTO(savedOrder);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus().name());
        dto.setPaymentMethod(order.getPaymentMethod() != null ? order.getPaymentMethod().name() : null);
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUserId(order.getUser().getId());

        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setId(item.getId());
            itemDTO.setProductId(item.getProduct().getId());
            itemDTO.setProductName(item.getProduct().getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setUnitPrice(item.getUnitPrice());
            itemDTO.setSubTotal(item.getSubTotal());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderRepository.findAllWithItems();
        return orders.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
}
