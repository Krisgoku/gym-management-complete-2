package com.fithub.dto;

import com.fithub.model.PaymentStatus;
import com.fithub.model.PaymentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    
    @NotNull(message = "Member ID is required")
    private Long memberId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Due date is required")
    private LocalDate dueDate;
    
    private LocalDate paymentDate;
    
    @NotNull(message = "Payment status is required")
    private PaymentStatus status;
    
    @NotNull(message = "Payment type is required")
    private PaymentType type;
    
    private String description;
    
    // Reminder settings
    private Boolean enableReminders;
    private List<String> reminderTypes;  // email, whatsapp
    private List<Integer> reminderDays;  // days before due date
    
    // For response only
    private MemberDTO member;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MemberDTO {
        private Long id;
        private String name;
        private String email;
        private String phone;
    }
}