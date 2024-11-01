package com.fithub.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "members")
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String phone;
    
    @Enumerated(EnumType.STRING)
    private MembershipType membershipType;
    
    @Enumerated(EnumType.STRING)
    private MemberStatus status;
    
    private LocalDate joinDate;
    private LocalDate membershipExpiry;
    private String photo;
    
    @OneToOne
    private User user;
}