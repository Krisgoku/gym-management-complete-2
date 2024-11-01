package com.fithub.service;

import com.fithub.model.Member;
import com.fithub.model.ReminderType;
import com.fithub.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MembershipReminderService {
    private final MemberRepository memberRepository;
    private final ReminderService reminderService;

    @Transactional(readOnly = true)
    public List<Member> getExpiringMemberships() {
        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        return memberRepository.findExpiringMemberships(thirtyDaysFromNow);
    }

    @Transactional
    public void sendExpirationReminder(Long memberId, ReminderType type) {
        Member member = memberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Member not found"));

        LocalDate today = LocalDate.now();
        int daysRemaining = (int) today.until(member.getMembershipExpiry()).getDays();

        try {
            reminderService.sendMembershipExpirationReminder(member, type, daysRemaining);
            log.info("Sent membership expiration reminder to member: {} via {}", memberId, type);
        } catch (Exception e) {
            log.error("Failed to send membership expiration reminder to member: {} via {}", memberId, type, e);
            throw new RuntimeException("Failed to send reminder", e);
        }
    }

    @Transactional(readOnly = true)
    public List<Member> getMembersNeedingReminders() {
        LocalDate today = LocalDate.now();
        LocalDate thirtyDaysFromNow = today.plusDays(30);
        return memberRepository.findByMembershipExpiryBetween(today, thirtyDaysFromNow);
    }

    @Transactional
    public void processExpirationReminders() {
        List<Member> expiringMembers = getMembersNeedingReminders();
        LocalDate today = LocalDate.now();

        for (Member member : expiringMembers) {
            int daysUntilExpiry = (int) today.until(member.getMembershipExpiry()).getDays();

            try {
                switch (daysUntilExpiry) {
                    case 30:
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 30);
                        break;
                    case 7:
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 7);
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.WHATSAPP, 7);
                        break;
                    case 3:
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 3);
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.WHATSAPP, 3);
                        break;
                    case 0:
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.EMAIL, 0);
                        reminderService.sendMembershipExpirationReminder(member, ReminderType.WHATSAPP, 0);
                        break;
                }
            } catch (Exception e) {
                log.error("Failed to process expiration reminder for member: {}", member.getId(), e);
            }
        }
    }
}