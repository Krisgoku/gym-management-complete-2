package com.fithub.repository;

import com.fithub.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Basic queries
    Page<Payment> findByMemberId(Long memberId, Pageable pageable);
    List<Payment> findByStatus(String status);
    
    // Date range queries
    List<Payment> findByDueDateBetweenAndStatus(LocalDate startDate, LocalDate endDate, String status);
    List<Payment> findByDueDateBeforeAndStatus(LocalDate date, String status);
    
    // Statistics queries
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = :status")
    long countByStatus(@Param("status") String status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = :status")
    BigDecimal sumAmountByStatus(@Param("status") String status);
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.dueDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Advanced search
    @Query("SELECT p FROM Payment p WHERE " +
           "LOWER(p.member.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "CAST(p.amount AS string) LIKE CONCAT('%', :search, '%')")
    Page<Payment> searchPayments(@Param("search") String search, Pageable pageable);
    
    // Overdue payments
    @Query("SELECT p FROM Payment p WHERE p.dueDate < :date AND p.status = 'PENDING'")
    List<Payment> findOverduePayments(@Param("date") LocalDate date);
    
    // Recent payments
    @Query("SELECT p FROM Payment p WHERE p.member.id = :memberId " +
           "ORDER BY p.createdAt DESC")
    List<Payment> findRecentPaymentsByMember(
        @Param("memberId") Long memberId,
        Pageable pageable
    );
    
    // Payment statistics by date range
    @Query("SELECT NEW map(" +
           "COUNT(p) as count, " +
           "SUM(p.amount) as total, " +
           "p.status as status) " +
           "FROM Payment p " +
           "WHERE p.dueDate BETWEEN :startDate AND :endDate " +
           "GROUP BY p.status")
    List<Object[]> getPaymentStatsByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}