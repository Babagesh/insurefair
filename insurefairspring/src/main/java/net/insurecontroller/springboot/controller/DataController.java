package net.insurecontroller.springboot.controller;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import net.insureservice.springboot.service.MyService;
import org.springframework.http.ResponseEntity;


@RestController
@RequestMapping("/api")
public class DataController {

    @Autowired
    private MyService myService;

    @PostMapping("/endpoint")
    public ResponseEntity<Map<String, Object>> processData(@RequestBody Map<String, Object> formData) {
        Map<String, Object> result = new HashMap<>();
        try {
            int age = Integer.parseInt(formData.get("age").toString());
            String gender = formData.get("gender").toString();
            double monthlyCost = Double.parseDouble(formData.get("monthlyPayment").toString());
            double reimbursement = Double.parseDouble(formData.get("reimbursement").toString());
            System.out.println("Received data " + formData);

            double profit = expectedProfit(age, gender, monthlyCost, reimbursement);
            String rating = calculateRating(profit, reimbursement, gender, age);
            System.out.println(profit);
            System.out.println(rating);
            result.put("profit", profit);
            result.put("rating", rating);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            result.put("error", "An error occurred while processing your request.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
        }
    }

    private double expectedProfit(int age, String gender, double monthlyCost, double reimbursement) {
        String probabilityStr = myService.getProbability(age, gender);
        double probability = Double.parseDouble(probabilityStr);
        double profit = (1 - probability) * 290 + (reimbursement - monthlyCost) * monthlyCost;
        return profit;
    }

    private String calculateRating(double profit, double reimbursement, String gender, int age) {
        double lifeExpectancy = gender.equalsIgnoreCase("Male") ? 74.8 : 80.2;
        double expectedProfit = profit * (lifeExpectancy - age);

        if (expectedProfit <= 0) {
            return "Good";
        } else if (expectedProfit <= reimbursement * 1.5) {
            return "Medium";
        } else {
            return "Bad";
        }
    }
}