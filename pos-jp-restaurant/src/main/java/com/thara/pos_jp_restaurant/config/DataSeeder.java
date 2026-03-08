package com.thara.pos_jp_restaurant.config;

import com.thara.pos_jp_restaurant.model.User;
import com.thara.pos_jp_restaurant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args){
        if (userRepository.count() == 0) {

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setName("admin admin");
            admin.setRole(User.Role.ROLE_ADMIN);
            userRepository.save(admin);

            User cashier = new User();
            cashier.setUsername("cashier");
            cashier.setPassword(passwordEncoder.encode("cashier123"));
            cashier.setName("cashier cashier");
            cashier.setRole(User.Role.ROLE_CASHIER);
            userRepository.save(cashier);

            System.out.println("สร้างข้อมูล Default Users สำเร็จแล้ว!");
            System.out.println("Admin Username: admin | Password: admin123");
            System.out.println("Cashier Username: cashier | Password: cashier123");
        }
    }
}
