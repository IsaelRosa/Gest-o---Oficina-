// ========== MENU HAMBURGER MOBILE (IGUAL LANDING PAGE) ==========
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
            console.log('📱 Menu fechado');
        } else {
            // Abrir menu
            overlay.classList.add('active');
            toggle.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('📱 Menu aberto');
        }
    }
}

function closeMobileMenu() {
    const overlay = document.getElementById('mobileMenuOverlay');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        toggle.classList.remove('active');
        document.body.style.overflow = 'auto';
        console.log('📱 Menu fechado via função close');
    }
}

function navigateToPage(page) {
    console.log('🔄 Navegando para página:', page);
    closeMobileMenu();
    
    // Usar o sistema de navegação existente
    if (window.navigation && typeof window.navigation.navigateTo === 'function') {
        window.navigation.navigateTo(page);
    } else {
        // Fallback: clicar no botão desktop correspondente
        const desktopBtn = document.querySelector(`.desktop-nav .nav-btn[data-page="${page}"]`);
        if (desktopBtn) {
            desktopBtn.click();
            console.log('✅ Navegação via botão desktop para:', page);
        } else {
            console.warn('❌ Página não encontrada:', page);
        }
    }
}

// Fechar menu ao clicar fora (igual landing page)
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

// Fechar menu ao redimensionar para desktop (igual landing page)
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const overlay = document.getElementById('mobileMenuOverlay');
        const toggle = document.querySelector('.mobile-menu-toggle');
        
        if (overlay && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = 'auto';
            console.log('📱 Menu fechado por redimensionamento');
        }
    }
});

// Event delegation para mobile navigation
document.addEventListener('click', function(e) {
    // Event delegation para todos os elementos interativos
    if (e.target.closest) {
        // Verificar se o clique foi no botão hamburger
        if (e.target.closest('.mobile-menu-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botão hamburger clicado!');
            toggleMobileMenu();
            return;
        }
        
        // Verificar se o clique foi no botão de fechar
        if (e.target.closest('.mobile-menu-close')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botão fechar menu clicado!');
            toggleMobileMenu();
            return;
        }
        
        // Verificar se o clique foi em um botão de navegação mobile
        const mobileNavBtn = e.target.closest('.mobile-nav-btn');
        if (mobileNavBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const page = mobileNavBtn.getAttribute('data-page');
            console.log('🎯 Botão mobile clicado:', page);
            
            // Navegar usando a função navigateToPage
            navigateToPage(page);
            return;
        }
    }
});

// Aplicação Principal
class App {
    constructor() {
        this.navigation = null;
        this.init();
    }

    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        // Inicializar sistema de navegação
        this.navigation = new Navigation();
        
        // Tornar navegação globalmente acessível
        window.navigation = this.navigation;
        
        // Inicializar outros sistemas
        this.initModal();
        this.initUtils();
        
        console.log('✅ Aplicação inicializada com sucesso!');
        console.log('✅ Sistema de navegação disponível globalmente');
    }

    initModal() {
        // Sistema de Modal Global
        window.Modal = {
            show: function(content, title = 'Modal') {
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.style.display = 'block';
                
                modal.innerHTML = `
                    <div class="modal-content">
                        <div class="modal-header">
                            <h2 class="modal-title">${title}</h2>
                            <span class="close">&times;</span>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                
                // Event listeners
                modal.querySelector('.close').onclick = () => this.hide(modal);
                modal.onclick = (e) => {
                    if (e.target === modal) this.hide(modal);
                };
                
                return modal;
            },
            
            hide: function(modal) {
                if (modal && modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }
        };
    }

    initUtils() {
        // Utilitários globais
        window.Utils = {
            formatCurrency: function(value) {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            },
            
            formatDate: function(date) {
                return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
            },
            
            formatDateTime: function(date) {
                return new Intl.DateTimeFormat('pt-BR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(new Date(date));
            },
            
            generateId: function() {
                return Date.now() + Math.random().toString(36).substr(2, 9);
            },
            
            sanitizeHtml: function(str) {
                const temp = document.createElement('div');
                temp.textContent = str;
                return temp.innerHTML;
            },
            
            validateEmail: function(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            },
            
            validateCPF: function(cpf) {
                cpf = cpf.replace(/[^\d]/g, '');
                if (cpf.length !== 11) return false;
                
                // Verificar se todos os dígitos são iguais
                if (/^(\d)\1{10}$/.test(cpf)) return false;
                
                // Validar dígitos verificadores
                let sum = 0;
                for (let i = 0; i < 9; i++) {
                    sum += parseInt(cpf.charAt(i)) * (10 - i);
                }
                let remainder = (sum * 10) % 11;
                if (remainder === 10 || remainder === 11) remainder = 0;
                if (remainder !== parseInt(cpf.charAt(9))) return false;
                
                sum = 0;
                for (let i = 0; i < 10; i++) {
                    sum += parseInt(cpf.charAt(i)) * (11 - i);
                }
                remainder = (sum * 10) % 11;
                if (remainder === 10 || remainder === 11) remainder = 0;
                if (remainder !== parseInt(cpf.charAt(10))) return false;
                
                return true;
            },
            
            formatCPF: function(cpf) {
                return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            },
            
            formatPhone: function(phone) {
                return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        };
    }
}

// Inicializar aplicação
const app = new App();

// Torna as funções globais para uso em HTML onclick
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;
window.navigateToPage = navigateToPage;