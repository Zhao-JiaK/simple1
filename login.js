// 密码显示切换
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function() {
        const input = this.parentElement.querySelector('input');
        const icon = this.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// 验证码倒计时
const sendCodeBtn = document.querySelector('.send-code');
if (sendCodeBtn) {
    sendCodeBtn.addEventListener('click', function() {
        let countdown = 60;
        this.disabled = true;
        const originalText = this.textContent;
        
        const timer = setInterval(() => {
            this.textContent = `${countdown}秒后重试`;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(timer);
                this.disabled = false;
                this.textContent = originalText;
            }
        }, 1000);
    });
}

// 表单验证
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const password = this.querySelector('input[name="password"]').value;
        const confirmPassword = this.querySelector('input[name="confirm_password"]').value;
        
        if (password !== confirmPassword) {
            alert('两次输入的密码不一致');
            return;
        }
        
        // 这里添加其他验证逻辑
        
        this.submit();
    });
}