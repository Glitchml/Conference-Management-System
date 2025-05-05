document.addEventListener('DOMContentLoaded', () => {
    // API base URL - change this to match your backend server
    const API_BASE_URL = 'http://localhost:8000/api';

    // Function to show error messages
    const showError = (formElement, message) => {
        // Check if error element already exists
        let errorElement = formElement.querySelector('.error-message');
        
        if (!errorElement) {
            // Create error element if it doesn't exist
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    };

    // Function to clear error messages
    const clearError = (formElement) => {
        const errorElement = formElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    };

    // Function to store JWT token
    const storeToken = (token) => {
        localStorage.setItem('authToken', token);
    };

    // Function to get JWT token
    const getToken = () => {
        return localStorage.getItem('authToken');
    };

    // Function to check if user is authenticated
    const isAuthenticated = () => {
        return getToken() !== null;
    };

    // Function to logout user
    const logout = () => {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    };

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError(loginForm);
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    showError(loginForm, data.error || 'Login failed. Please try again.');
                    return;
                }
                
                // Store token and redirect to dashboard
                storeToken(data.access_token);
                window.location.href = 'dashboard.html';
                
            } catch (error) {
                showError(loginForm, 'Network error. Please try again later.');
                console.error('Login error:', error);
            }
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError(signupForm);
            
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showError(signupForm, 'Passwords do not match');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        fullname: fullName, 
                        email, 
                        password 
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    showError(signupForm, data.error || 'Registration failed. Please try again.');
                    return;
                }
                
                // Redirect to login page with success message
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
                
            } catch (error) {
                showError(signupForm, 'Network error. Please try again later.');
                console.error('Signup error:', error);
            }
        });
    }

    // Handle forgot password form submission
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError(forgotPasswordForm);
            
            const email = document.getElementById('email').value;
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    showError(forgotPasswordForm, data.error || 'Request failed. Please try again.');
                    return;
                }
                
                // Show success message
                forgotPasswordForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <p>Password reset link has been sent to your email.</p>
                        <a href="login.html" class="auth-button">Back to Login</a>
                    </div>
                `;
                
            } catch (error) {
                showError(forgotPasswordForm, 'Network error. Please try again later.');
                console.error('Forgot password error:', error);
            }
        });
    }

    // Handle reset password form submission
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError(resetPasswordForm);
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const token = document.getElementById('resetToken').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showError(resetPasswordForm, 'Passwords do not match');
                return;
            }
            
            try {
                const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        token,
                        password 
                    })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    showError(resetPasswordForm, data.error || 'Password reset failed. Please try again.');
                    return;
                }
                
                // Show success message and redirect to login
                alert('Password has been reset successfully!');
                window.location.href = 'login.html';
                
            } catch (error) {
                showError(resetPasswordForm, 'Network error. Please try again later.');
                console.error('Reset password error:', error);
            }
        });
    }

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            button.classList.toggle('fa-eye');
            button.classList.toggle('fa-eye-slash');
        });
    });
});