package com.fithub.controller;

import com.fithub.model.Payment;
import com.fithub.model.ReminderType;
import com.fithub.service.PaymentService;
import com.fithub.service.ReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {
    private final ReminderService reminderService;
    private final PaymentService paymentService;

    @PostMapping("/{paymentId}/{type}")
    public ResponseEntity<Void> sendReminder(
            @PathVariable Long paymentId,
            @PathVariable ReminderType type) {
        Payment payment = paymentService.getPaymentById(paymentId);
        reminderService.sendReminder(payment, type);
        return ResponseEntity.ok().build();
    }
}