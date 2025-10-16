package com.quizapp.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base.url:http://localhost:5173}")
    private String baseUrl;

    // =============================================================
    // ✉️ EMAIL VERIFICATION
    // =============================================================
    public void sendVerificationEmail(String toEmail, String fullName, String verificationToken) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email - Quiz Craft");

            String verificationLink = baseUrl + "/verify-email?token=" + verificationToken;

            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family:'Segoe UI',Arial,sans-serif; background:#f3f4f6; margin:0; padding:0; color:#333; }
                        .container { max-width:620px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden;
                                     box-shadow:0 4px 20px rgba(0,0,0,0.1);}
                        .header { background:linear-gradient(135deg,#6366F1,#4F46E5); color:#fff; text-align:center; padding:25px;}
                        .content { padding:35px 40px; font-size:16px; line-height:1.6;}
                        .button {
                            display:inline-block; background:#4F46E5; color:#fff!important; text-decoration:none!important;
                            padding:12px 30px; border-radius:6px; font-weight:600; margin:20px 0; font-family:'Segoe UI',Arial,sans-serif;
                        }
                        .button:hover { background:#4338CA; }
                        .link { color:#4F46E5; word-break:break-all; font-size:14px; }
                        .footer { text-align:center; color:#888; font-size:13px; padding:20px; background:#f9fafb;
                                  border-top:1px solid #e5e7eb;}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><h1>Welcome to Quiz Craft 🎓</h1></div>
                        <div class="content">
                            <p>Hi <strong>%s</strong>,</p>
                            <p>Thank you for joining Quiz Craft! Please verify your email to activate your account:</p>
                            <a href="%s" class="button">Verify Email</a>
                            <p>If the button doesn’t work, copy and paste this link in your browser:</p>
                            <p class="link">%s</p>
                            <p>This link will expire in 24 hours.</p>
                        </div>
                        <div class="footer">© 2025 Quiz Craft – Empowering Learners Worldwide</div>
                    </div>
                </body>
                </html>
                """, fullName, verificationLink, verificationLink);

            helper.setText(htmlContent, true);
            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    // =============================================================
    // 🔐 PASSWORD RESET
    // =============================================================
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetToken) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Reset Your Password - Quiz Craft");

            String resetLink = baseUrl + "/reset-password?token=" + resetToken;

            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family:'Segoe UI',Arial,sans-serif; background:#f3f4f6; margin:0; padding:0; color:#333;}
                        .container { max-width:620px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden;
                                     box-shadow:0 4px 20px rgba(0,0,0,0.1);}
                        .header { background:linear-gradient(135deg,#4F46E5,#4338CA); color:#fff; text-align:center; padding:25px;}
                        .content { padding:35px 40px; font-size:16px;}
                        .button {
                            display:inline-block; background:#4F46E5; color:#fff!important; text-decoration:none!important;
                            padding:12px 30px; border-radius:6px; font-weight:600; margin:20px 0; font-family:'Segoe UI',Arial,sans-serif;
                        }
                        .button:hover { background:#4338CA; }
                        .warning { background:#FEF2F2; border-left:4px solid #EF4444; padding:12px 15px; border-radius:6px;
                                   font-size:14px; margin-top:25px;}
                        .link { color:#4F46E5; word-break:break-all; font-size:14px;}
                        .footer { text-align:center; color:#888; font-size:13px; padding:20px; background:#f9fafb;
                                  border-top:1px solid #e5e7eb;}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><h1>Password Reset Request 🔒</h1></div>
                        <div class="content">
                            <p>Hi <strong>%s</strong>,</p>
                            <p>We received a request to reset your Quiz Craft password. Click below to set a new one:</p>
                            <a href="%s" class="button">Reset Password</a>
                            <p>If the button doesn’t work, copy and paste this link in your browser:</p>
                            <p class="link">%s</p>
                            <div class="warning">⚠️ This link will expire in 1 hour. If you didn’t request a reset, ignore this email.</div>
                        </div>
                        <div class="footer">© 2025 Quiz Craft. All rights reserved.</div>
                    </div>
                </body>
                </html>
                """, fullName, resetLink, resetLink);

            helper.setText(htmlContent, true);
            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    // =============================================================
    // 🧠 QUIZ RESULT
    // =============================================================
    public void sendQuizResultEmail(String toEmail, String fullName, String topicName,
                                    int score, int totalQuestions, int correctAnswers,
                                    int wrongAnswers, double percentage) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Quiz Results - " + topicName);

            String status = percentage >= 70 ? "Excellent Work!" :
                    percentage >= 50 ? "Good Job!" : "Keep Learning!";
            String statusColor = percentage >= 70 ? "#10B981" :
                    percentage >= 50 ? "#F59E0B" : "#EF4444";

            String htmlContent = String.format("""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>
                        body { font-family:'Segoe UI',Arial,sans-serif; background:#f3f4f6; margin:0; padding:0; color:#333;}
                        .container { max-width:620px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden;
                                     box-shadow:0 4px 20px rgba(0,0,0,0.1);}
                        .header { background:linear-gradient(135deg,#4F46E5,#6366F1); color:#fff; text-align:center; padding:25px;}
                        .content { padding:35px 40px; font-size:16px;}
                        .result-box { background:#f9fafb; padding:25px; border-radius:8px; margin-top:20px; text-align:center;}
                        .status { font-size:22px; font-weight:bold; color:%s; margin-bottom:10px;}
                        .score { font-size:36px; font-weight:700; color:#4F46E5; }
                        .stats { display:flex; justify-content:space-around; margin-top:20px;}
                        .stat-item { text-align:center; }
                        .stat-value { font-size:28px; font-weight:bold; }
                        .correct { color:#10B981; }
                        .wrong { color:#EF4444; }
                        .footer { text-align:center; color:#888; font-size:13px; padding:20px; background:#f9fafb;
                                  border-top:1px solid #e5e7eb;}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header"><h1>Quiz Results – %s</h1></div>
                        <div class="content">
                            <p>Hi <strong>%s</strong>,</p>
                            <p>You’ve completed your quiz on <strong>%s</strong>. Here’s how you did:</p>
                            <div class="result-box">
                                <div class="status">%s</div>
                                <div class="score">%d / %d</div>
                                <p style="font-size:18px;">Accuracy: %.1f%%</p>
                                <div class="stats">
                                    <div class="stat-item">
                                        <div class="stat-value correct">%d</div><div>Correct</div>
                                    </div>
                                    <div class="stat-item">
                                        <div class="stat-value wrong">%d</div><div>Wrong</div>
                                    </div>
                                </div>
                            </div>
                            <p style="margin-top:25px;">Keep practicing to sharpen your skills with Quiz Craft 🚀</p>
                        </div>
                        <div class="footer">© 2025 Quiz Craft. All rights reserved.</div>
                    </div>
                </body>
                </html>
                """, statusColor, topicName, fullName, topicName, status, score, totalQuestions,
                    percentage, correctAnswers, wrongAnswers);

            helper.setText(htmlContent, true);
            javaMailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send quiz result email", e);
        }
    }
}
