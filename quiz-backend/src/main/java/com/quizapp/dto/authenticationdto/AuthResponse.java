package com.quizapp.dto.authenticationdto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// This dto returned after successful login/register

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String tokenType = "Bearer";
    private String email;
    private String fullName;
    private String role;
    private boolean isEmailVerified;

    public AuthResponse(String token,  String email, String fullName, String role, boolean isEmailVerified) {
        this.token = token;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.isEmailVerified = isEmailVerified;
    }
}
