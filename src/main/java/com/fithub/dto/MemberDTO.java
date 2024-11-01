package com.fithub.dto;

import com.fithub.model.MembershipType;
import com.fithub.model.MemberStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Please provide a valid phone number")
    private String phone;

    @NotNull(message = "Membership type is required")
    private MembershipType membershipType;

    private MemberStatus status;

    @NotNull(message = "Join date is required")
    private LocalDate joinDate;

    @NotNull(message = "Membership expiry date is required")
    private LocalDate membershipExpiry;

    private String photo;

    // Emergency contact information
    private String emergencyContact;
    private String emergencyPhone;

    // Additional member details
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String healthConditions;

    // Membership details
    private Integer remainingFreezedays;
    private Integer remainingGuestPasses;
    private Integer remainingTrainerSessions;

    // Preferences
    private String preferredNotificationMethod; // email, whatsapp, both

    // Statistics
    private LocalDate lastVisitDate;
    private Integer totalVisits;

    private String notes;

    // For response only - nested user information
    private UserDTO user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String name;
        private String email;
        private String role;
    }
}