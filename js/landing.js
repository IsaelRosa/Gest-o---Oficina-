// Landing Page JavaScript

// ========== MENU HAMBURGER MOBILE ==========
function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (overlay && toggle) {
        const isActive = overlay.classList.contains('active');
        
        if (isActive) {
            // Fechar menu
            overlay.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        } else {
            // Abrir menu
            overlay.classList.add('active');
            toggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Fechar menu ao clicar fora
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    if (overlay && overlay.classList.contains('active') && 
        !menu.contains(e.target) && 
        !toggle.contains(e.target)) {
        toggleMobileMenu();
    }
});

// Fechar menu ao redimensionar para desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const overlay = document.getElementById('mobileMenuOverlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling para os links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Auto-preencher campos de demo
    populateDemoCredentials();
});

function showLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Focus no campo de usuário
        setTimeout(() => {
            const usernameField = document.getElementById('username');
            if (usernameField) {
                usernameField.focus();
            }
        }, 300);
    }
}

function hideLogin() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showContact() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function hideContact() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Sistema de login com roles
    let userRole = null;
    let userName = '';
    
    if ((username === 'admin' && password === '123456') || 
        (username === 'gerente' && password === 'gerente')) {
        userRole = 'gerente';
        userName = username === 'admin' ? 'Administrador' : 'Gerente';
    } else if ((username === 'funcionario' && password === 'funcionario') ||
               (username === 'atendente' && password === 'atendente')) {
        userRole = 'funcionario';
        userName = username === 'funcionario' ? 'Funcionário' : 'Atendente';
    } else if (username === 'demo' && password === 'demo') {
        userRole = 'gerente';
        userName = 'Demo (Gerente)';
    } else if (username === 'teste' && password === 'teste') {
        userRole = 'funcionario';
        userName = 'Demo (Funcionário)';
    }
    
    if (userRole) {
        // Simular loading
        const button = event.target.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        button.disabled = true;
        
        // Salvar estado de login com role
        localStorage.setItem('carservice_logged_in', 'true');
        localStorage.setItem('carservice_user', userName);
        localStorage.setItem('carservice_user_role', userRole);
        localStorage.setItem('carservice_login_time', Date.now());
        
        setTimeout(() => {
            // Redirecionar para o sistema principal
            window.location.href = 'index.html';
        }, 1500);
        
    } else {
        // Erro de login
        showLoginError('Usuário ou senha incorretos.<br>Gerente: admin/123456 ou gerente/gerente<br>Funcionário: funcionario/funcionario');
    }
}

function showLoginError(message) {
    // Remove erro anterior se existir
    const existingError = document.querySelector('.login-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Cria novo elemento de erro
    const errorDiv = document.createElement('div');
    errorDiv.className = 'login-error';
    errorDiv.style.cssText = `
        background: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 1px solid #f5c6cb;
        animation: shake 0.5s ease-in-out;
    `;
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    // Adiciona CSS para animação de shake
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    const loginForm = document.getElementById('loginForm');
    loginForm.insertBefore(errorDiv, loginForm.firstChild);
    
    // Remove o erro após 5 segundos
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function populateDemoCredentials() {
    // Auto-preencher para facilitar o teste
    setTimeout(() => {
        const usernameField = document.getElementById('username');
        const passwordField = document.getElementById('password');
        
        if (usernameField && passwordField) {
            usernameField.value = 'admin';
            passwordField.value = '123456';
        }
    }, 500);
}

// Fechar modals ao clicar fora
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const contactModal = document.getElementById('contactModal');
    
    if (event.target === loginModal) {
        hideLogin();
    }
    
    if (event.target === contactModal) {
        hideContact();
    }
});

// Fechar modals com Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideLogin();
        hideContact();
    }
});

// Animação no scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.step, .feature-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Inicializar animações
window.addEventListener('scroll', animateOnScroll);

// Configurar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.step, .feature-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
    });
    
    // Executar animação inicial
    setTimeout(animateOnScroll, 100);
});

// Função para verificar se está logado (para usar em outras páginas)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('carservice_logged_in');
    const loginTime = localStorage.getItem('carservice_login_time');
    
    // Verificar se login expirou (24 horas)
    if (loginTime && Date.now() - parseInt(loginTime) > 24 * 60 * 60 * 1000) {
        localStorage.removeItem('carservice_logged_in');
        localStorage.removeItem('carservice_user');
        localStorage.removeItem('carservice_login_time');
        return false;
    }
    
    return isLoggedIn === 'true';
}

// Exportar funções para uso global
window.showLogin = showLogin;
window.hideLogin = hideLogin;
window.showContact = showContact;
window.hideContact = hideContact;
window.checkAuth = checkAuth;

// Adicionar handler para o formulário de contato
document.addEventListener('DOMContentLoaded', function() {
    const contatoForm = document.getElementById('contatoForm');
    if (contatoForm) {
        contatoForm.addEventListener('submit', handleContatoForm);
    }
});

function handleContatoForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dados = {
        nome: formData.get('nome'),
        telefone: formData.get('telefone'),
        email: formData.get('email'),
        empresa: formData.get('empresa'),
        interesse: formData.get('interesse'),
        mensagem: formData.get('mensagem')
    };
    
    // Simular envio do formulário
    const submitBtn = e.target.querySelector('.btn-enviar');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Simular sucesso
        showContatoSuccess();
        
        // Reset do formulário
        e.target.reset();
        
        // Restaurar botão
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Criar mensagem para WhatsApp com os dados
        const mensagemWhatsApp = createWhatsAppMessage(dados);
        
        // Opcional: redirecionar para WhatsApp após 3 segundos
        setTimeout(() => {
            if (confirm('Deseja ser redirecionado para o WhatsApp para continuar a conversa?')) {
                window.open(mensagemWhatsApp, '_blank');
            }
        }, 3000);
        
    }, 2000);
}

function createWhatsAppMessage(dados) {
    let mensagem = `*Solicitação de Contato - CarService Pro*\n\n`;
    mensagem += `*Nome:* ${dados.nome}\n`;
    mensagem += `*Telefone:* ${dados.telefone}\n`;
    mensagem += `*E-mail:* ${dados.email}\n`;
    
    if (dados.empresa) {
        mensagem += `*Oficina:* ${dados.empresa}\n`;
    }
    
    mensagem += `*Interesse:* ${dados.interesse}\n`;
    
    if (dados.mensagem) {
        mensagem += `*Mensagem:* ${dados.mensagem}\n`;
    }
    
    mensagem += `\nEnviado através do site CarService Pro`;
    
    return `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
}

function showContatoSuccess() {
    // Criar modal de sucesso
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Mensagem Enviada com Sucesso!</h3>
            <p>Obrigado pelo seu interesse no CarService Pro. Nossa equipe entrará em contato em breve.</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn-ok">
                <i class="fas fa-check"></i> OK
            </button>
        </div>
    `;
    
    // Adicionar CSS para o modal de sucesso
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(9, 29, 51, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 3000;
            animation: fadeIn 0.3s ease;
        }
        
        .success-content {
            background: white;
            padding: 3rem;
            border-radius: 20px;
            text-align: center;
            max-width: 400px;
            margin: 0 1rem;
            box-shadow: 0 25px 50px rgba(9, 29, 51, 0.3);
            animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .success-icon {
            font-size: 4rem;
            color: #10ac84;
            margin-bottom: 1rem;
        }
        
        .success-content h3 {
            color: #091d33;
            font-size: 1.5rem;
            margin-bottom: 1rem;
            font-family: 'Lato', sans-serif;
        }
        
        .success-content p {
            color: #404040;
            margin-bottom: 2rem;
            line-height: 1.5;
        }
        
        .btn-ok {
            background: linear-gradient(135deg, #10ac84, #1dd1a1);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-ok:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(16, 172, 132, 0.3);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(50px) scale(0.9);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(successModal);
    
    // Remover modal automaticamente após 10 segundos
    setTimeout(() => {
        if (successModal.parentNode) {
            successModal.remove();
            style.remove();
        }
    }, 10000);
}