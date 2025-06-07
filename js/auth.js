 // 注册表单特定功能
class RegisterForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        if (this.form) {
            this.initializeForm();
        }
    }

    initializeForm() {
        this.setupPasswordStrength();
        this.setupVerificationCode();
        this.setupFormValidation();
    }

    setupPasswordStrength() {
        const passwordInput = this.form.querySelector('input[name="password"]');
        const strengthBars = this.form.querySelector('.strength-bars');

        passwordInput.addEventListener('input', (e) => {
            const strength = this.calculatePasswordStrength(e.target.value);
            this.updateStrengthIndicator(strengthBars, strength);
        });
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        // 长度检查
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        
        // 复杂性检查
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        return score >= 5 ? 'strong' : score >= 3 ? 'medium' : 'weak';
    }

    updateStrengthIndicator(barsElement, strength) {
        barsElement.className = 'strength-bars ' + strength;
    }

    setupVerificationCode() {
        const sendCodeBtn = this.form.querySelector('.send-code-btn');
        const phoneInput = this.form.querySelector('input[name="phone"]');

        sendCodeBtn.addEventListener('click', () => {
            if (this.validatePhone(phoneInput.value)) {
                this.startVerificationCountdown(sendCodeBtn);
                this.sendVerificationCode(phoneInput.value);
            } else {
                this.showError(phoneInput, '请输入有效的手机号码');
            }
        });
    }

    validatePhone(phone) {
        return /^1[3-9]\d{9}$/.test(phone);
    }

    startVerificationCountdown(button) {
        let countdown = 60;
        button.disabled = true;
        
        const timer = setInterval(() => {
            button.textContent = `${countdown}秒后重试`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(timer);
                button.disabled = false;
                button.textContent = '获取验证码';
            }
        }, 1000);
    }

    async sendVerificationCode(phone) {
        try {
            const response = await fetch('send_verification.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone })
            });
            
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message);
            }
        } catch (error) {
            this.showError(null, error.message || '发送验证码失败，请稍后重试');
        }
    }

    setupFormValidation() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    validateForm() {
        let isValid = true;
        
        // 用户名验证
        const username = this.form.querySelector('input[name="username"]');
        if (!/^[a-zA-Z0-9_]{4,16}$/.test(username.value)) {
            this.showError(username, '用户名必须是4-16个字符，只能包含字母、数字和下划线');
            isValid = false;
        }

        // 密码验证
        const password = this.form.querySelector('input[name="password"]');
        const confirmPassword = this.form.querySelector('input[name="confirm_password"]');
        
        if (this.calculatePasswordStrength(password.value) === 'weak') {
            this.showError(password, '密码强度太弱，请设置更复杂的密码');
            isValid = false;
        }

        if (password.value !== confirmPassword.value) {
            this.showError(confirmPassword, '两次输入的密码不一致');
            isValid = false;
        }

        return isValid;
    }

    showError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        if (input) {
            const formGroup = input.closest('.form-group');
            formGroup.appendChild(errorDiv);
            formGroup.classList.add('has-error');
        } else {
            this.form.insertBefore(errorDiv, this.form.firstChild);
        }

        setTimeout(() => {
            errorDiv.remove();
            if (input) {
                input.closest('.form-group').classList.remove('has-error');
            }
        }, 3000);
    }

    async submitForm() {
        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                window.location.href = data.redirect || 'login.html';
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            this.showError(null, error.message || '注册失败，请稍后重试');
        }
    }
}

// 初始化注册表单
document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});