// src/main/java/net/insure/springboot/service/MyService.java

package net.insureservice.springboot.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class MyService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public String getProbability(int age, String gender) {
        String sql;
        if (gender.equalsIgnoreCase("Male")) {
            sql = "SELECT Death FROM insurefair_sql WHERE Age = ?";
        } else {
            sql = "SELECT Death FROM female_database WHERE Age = ?";
        }
        try {
            return jdbcTemplate.queryForObject(sql, String.class, age);
        } catch (Exception e) {
            e.printStackTrace();
            return "0.0"; // Return default value or handle as needed
        }
    }
}
