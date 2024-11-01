package com.fithub.service;

import com.fithub.model.Member;
import com.fithub.model.Payment;
import com.fithub.model.ReminderType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {
    private final JavaMailSender mailSender;
    
    @Value("${twilio.account-sid}")
    private String twilioAccountSid;
    
    @Value("${twilio.auth-token}")
    private String twilioAuthToken;
    
    @Value("${twilio.whatsapp-number}")
    private String twilioWhatsappNumber;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final String GYM_LOGO_URL = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300";
    
    public void sendMembershipExpirationReminder(Member member, ReminderType type, int daysRemaining) {
        switch (type) {
            case EMAIL:
                sendExpirationEmailReminder(member, daysRemaining);
                break;
            case WHATSAPP:
                sendExpirationWhatsAppReminder(member, daysRemaining);
                break;
        }
    }

    private void sendExpirationEmailReminder(Member member, int daysRemaining) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(fromEmail);
            helper.setTo(member.getEmail());
            helper.setSubject("Membership Expiration Reminder - FitHub");
            
            String emailContent = String.format("""
                Dear %s,
                
                Your FitHub membership is expiring %s.
                
                Membership Details:
                Type: %s
                Expiry Date: %s
                
                To ensure uninterrupted access to our facilities, please renew your membership before it expires.
                
                Best regards,
                FitHub Team
                """,
                member.getName(),
                daysRemaining > 0 ? "in " + daysRemaining + " days" : "today",
                member.getMembershipType(),
                member.getMembershipExpiry().format(DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH))
            );
            
            helper.setText(emailContent);
            mailSender.send(message);
            
            log.info("Membership expiration email reminder sent to: {}", member.getEmail());
        } catch (MessagingException e) {
            log.error("Failed to send expiration email reminder", e);
            throw new RuntimeException("Failed to send expiration email reminder", e);
        }
    }

    private void sendExpirationWhatsAppReminder(Member member, int daysRemaining) {
        try {
            Twilio.init(twilioAccountSid, twilioAuthToken);
            
            String messageContent = String.format("""
                Hello %s! 👋
                
                Your FitHub membership is expiring %s.
                
                🏋️‍♂️ *Membership Details*
                Type: %s
                Expiry: %s
                
                Don't miss out on your fitness journey! Renew your membership to keep enjoying our facilities.
                
                Need help? Reply to this message and we'll assist you.
                
                Stay fit! 💪
                *FitHub Team*
                """,
                member.getName(),
                daysRemaining > 0 ? "in " + daysRemaining + " days" : "today",
                member.getMembershipType(),
                member.getMembershipExpiry().format(DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH))
            );
            
            Message.creator(
                new PhoneNumber("whatsapp:" + member.getPhone()),
                new PhoneNumber("whatsapp:" + twilioWhatsappNumber),
                messageContent
            ).setMediaUrl(Arrays.asList(GYM_LOGO_URL))
             .create();
            
            log.info("Membership expiration WhatsApp reminder sent to: {}", member.getPhone());
        } catch (Exception e) {
            log.error("Failed to send expiration WhatsApp reminder", e);
            throw new RuntimeException("Failed to send expiration WhatsApp reminder", e);
        }
    }

    public void sendPaymentReminder(Payment payment, ReminderType type) {
        switch (type) {
            case EMAIL:
                sendPaymentEmailReminder(payment);
                break;
            case WHATSAPP:
                sendPaymentWhatsAppReminder(payment);
                break;
        }
    }

    private void sendPaymentEmailReminder(Payment payment) {
        // Existing payment email reminder implementation
    }

    private void sendPaymentWhatsAppReminder(Payment payment) {
        // Existing payment WhatsApp reminder implementation
    }
}