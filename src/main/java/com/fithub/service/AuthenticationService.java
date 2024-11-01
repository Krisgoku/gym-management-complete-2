package com.fithub.service;

import com.fithub.dto.AuthenticationRequest;
import com.fithub.dto.AuthenticationResponse;
import com.fithub.dto.RegisterRequest;
import com.fithub.model.Role;
import com.fithub.model.User;
import com.fithub.repository.UserRepository;
import com.fithub.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request, HttpServletResponse response) {
        var user = User.builder()
            .name(request.getName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(Role.USER)
            .build();
        
        userRepository.save(user);
        var jwtToken = jwtService.generateToken(user);
        jwtService.setJwtCookie(response, jwtToken);
        
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        
        var user = userRepository.findByEmail(request.getEmail())
            .orElseThrow();
            
        var jwtToken = jwtService.generateToken(user);
        jwtService.setJwtCookie(response, jwtToken);
        
        return AuthenticationResponse.builder()
            .token(jwtToken)
            .build();
    }

    public void logout(HttpServletResponse response) {
        jwtService.clearJwtCookie(response);
    }
}