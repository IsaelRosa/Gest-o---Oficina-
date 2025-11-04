// ========== SISTEMA MOBILE MENU ULTRA SIMPLES ==========

function toggleMobileMenu() {
    console.log('🔄 Toggle menu mobile');
    
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (!overlay) {
        console.error('❌ Overlay não encontrado');
        return;
    }
    
    // Toggle simples
    overlay.classList.toggle('active');
    console.log('📱 Menu toggled. Ativo:', overlay.classList.contains('active'));
}

function closeMobileMenu() {
    console.log('🔒 Fechando menu mobile');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function navigateToPage(page) {
    console.log('🔄 Navegando para:', page);
    closeMobileMenu();
    
    // Implementar navegação
    if (typeof showPage === 'function') {
        showPage(page);
    } else {
        console.log('Página solicitada:', page);
    }
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Sistema iniciado');
    
    // Event listener para hamburger
    const hamburger = document.querySelector('.mobile-menu-toggle');
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMobileMenu();
        });
        console.log('✅ Event listener adicionado');
    }
    
    // Fechar menu ao clicar no overlay
    const overlay = document.getElementById('mobileMenuOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeMobileMenu();
            }
        });
    }
});