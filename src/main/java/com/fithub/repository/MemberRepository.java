package com.fithub.repository;

import com.fithub.model.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByMembershipExpiryBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT m FROM Member m WHERE m.membershipExpiry <= :expiryDate AND m.status = 'active'")
    List<Member> findExpiringMemberships(@Param("expiryDate") LocalDate expiryDate);
    
    Page<Member> findByStatus(String status, Pageable pageable);
    
    @Query("SELECT m FROM Member m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.phone) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Member> searchMembers(@Param("search") String search, Pageable pageable);
}