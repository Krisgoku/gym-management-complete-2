package com.fithub.service;

import com.fithub.model.Member;
import com.fithub.model.Payment;
import com.fithub.model.ReminderType;
import com.fithub.repository.MemberRepository;
import com.fithub.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderSchedulerService {
    private final MemberRepository memberRepository;
    private final PaymentRepository paymentRepository;
    private final ReminderService reminderService;
    
    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void checkAndSendReminders() {
        sendMembershipExpirationReminders();
        sendPaymentReminders();
    }
    
    private void sendMembershipExpirationReminders() {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);
        LocalDate sevenDaysFromNow = today.plusDays(7);
        LocalDate threeDaysFromNow = today.plusDays(3);
        
        List<Member> expiringMembers = memberRepository.findByMembershipExpiryBetween(
            today, thirtyDaysFromNow);
        
        for (Member member : expiringMembers) {
            LocalDate expiryDate = member.getMembershipExpiry();
            
            if (expiryDate.equals(thirtyDaysFromNow)) {
                // Send email only for 30-day reminder
                reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 30);
            } else if (expiryDate.equals(sevenDaysFromNow)) {
                // Send both email and WhatsApp for 7-day reminder
                reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 7);
                reminderService.sendMembershipExpirationReminder(member, ReminderType.WHATSAPP, 7);
            } else if (expiryDate.equals(threeDaysFromNow)) {
                // Send both for 3-day reminder
                reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 3);
                reminderService.sendMembershipExpirationReminder(member, ReminderType.WHATSAPP, 3);
            } else if (expiryDate.equals(today)) {
                // Send final reminder on expiration day
                reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 0);
                reminderService.sendMembershipExpirationReminder(member, ReminderType.WHATSAPP, 0);
            }
        }
    }
    
    private void sendPaymentReminders() {
        LocalDate today = LocalDate.now();
        LocalDate threeDaysFromNow = today.plusDays(3);
        
        List<Payment> upcomingPayments = paymentRepository.findByDueDateBetweenAndStatus(
            today, threeDaysFromNow, "pending");
        
        for (Payment payment : upcomingPayments) {
            LocalDate dueDate = payment.getDueDate();
            
            if (dueDate.equals(threeDaysFromNow)) {
                // Send email for 3-day reminder
                reminderService.sendPaymentReminder(payment, ReminderType.EMAIL);
            } else if (dueDate.equals(today)) {
                // Send both email and WhatsApp on due date
                reminderService.sendPaymentReminder(payment, ReminderType.EMAIL);
                reminderService.sendPaymentReminder(payment, ReminderType.WHATSAPP);
            }
        }
    }
}