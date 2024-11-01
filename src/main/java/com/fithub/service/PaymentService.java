package com.fithub.service;

import com.fithub.dto.PaymentDTO;
import com.fithub.model.Member;
import com.fithub.model.Payment;
import com.fithub.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final MemberService memberService;

    public Page<Payment> getAllPayments(Pageable pageable) {
        return paymentRepository.findAll(pageable);
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    @Transactional
    public Payment createPayment(PaymentDTO paymentDTO) {
        Member member = memberService.getMemberById(paymentDTO.getMemberId());
        
        Payment payment = Payment.builder()
            .member(member)
            .amount(paymentDTO.getAmount())
            .dueDate(paymentDTO.getDueDate())
            .status(paymentDTO.getStatus())
            .type(paymentDTO.getType())
            .description(paymentDTO.getDescription())
            .build();
        
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment updatePayment(Long id, PaymentDTO paymentDTO) {
        Payment payment = getPaymentById(id);
        
        payment.setAmount(paymentDTO.getAmount());
        payment.setDueDate(paymentDTO.getDueDate());
        payment.setStatus(paymentDTO.getStatus());
        payment.setType(paymentDTO.getType());
        payment.setDescription(paymentDTO.getDescription());
        
        if (paymentDTO.getPaymentDate() != null) {
            payment.setPaymentDate(paymentDTO.getPaymentDate());
        }
        
        return paymentRepository.save(payment);
    }

    @Transactional
    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    public Page<Payment> getMemberPayments(Long memberId, Pageable pageable) {
        return paymentRepository.findByMemberId(memberId, pageable);
    }
}