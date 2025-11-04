// ========== MENU HAMBURGER MOBILE SISTEMA ==========
window.toggleMobileMenu = function() {
    console.log('=== TOGGLE MOBILE MENU SIMPLES ===');
    
    const overlay = document.getElementById('mobileMenuOverlay');
    console.log('Overlay encontrado:', overlay);
    
    if (overlay) {
        const isVisible = overlay.style.display === 'block';
        console.log('Menu visível:', isVisible);
        
        if (isVisible) {
            // Fechar menu
            overlay.style.setProperty('display', 'none', 'important');
            overlay.style.setProperty('opacity', '0', 'important');
            overlay.style.setProperty('visibility', 'hidden', 'important');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            console.log('Menu fechado');
        } else {
            // Abrir menu - forçar TUDO com !important
            overlay.style.setProperty('display', 'block', 'important');
            overlay.style.setProperty('opacity', '1', 'important');
            overlay.style.setProperty('visibility', 'visible', 'important');
            overlay.style.setProperty('position', 'fixed', 'important');
            overlay.style.setProperty('top', '0', 'important');
            overlay.style.setProperty('left', '0', 'important');
            overlay.style.setProperty('width', '100vw', 'important');
            overlay.style.setProperty('height', '100vh', 'important');
            overlay.style.setProperty('z-index', '999999', 'important');
            overlay.style.setProperty('background', 'rgba(9, 29, 51, 0.98)', 'important');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Forçar TODOS os elementos filhos a serem visíveis
            const allChildren = overlay.querySelectorAll('*');
            allChildren.forEach(child => {
                child.style.setProperty('display', 'block', 'important');
                child.style.setProperty('visibility', 'visible', 'important');
                child.style.setProperty('opacity', '1', 'important');
                child.style.setProperty('color', 'white', 'important');
            });
            
            // Forçar estilo do menu interno especificamente
            const mobileMenu = overlay.querySelector('.mobile-menu');
            if (mobileMenu) {
                mobileMenu.style.setProperty('display', 'flex', 'important');
                mobileMenu.style.setProperty('flex-direction', 'column', 'important');
                mobileMenu.style.setProperty('width', '100%', 'important');
                mobileMenu.style.setProperty('height', '100%', 'important');
                mobileMenu.style.setProperty('padding', '1.5rem', 'important');
                mobileMenu.style.setProperty('color', 'white', 'important');
                mobileMenu.style.setProperty('overflow-y', 'auto', 'important');
            }
            
            // Forçar botões mobile específicos
            const mobileButtons = overlay.querySelectorAll('.mobile-nav-btn');
            mobileButtons.forEach(btn => {
                btn.style.setProperty('display', 'flex', 'important');
                btn.style.setProperty('color', 'white', 'important');
                btn.style.setProperty('padding', '1rem', 'important');
                btn.style.setProperty('border', '2px solid rgba(255, 255, 255, 0.1)', 'important');
                btn.style.setProperty('margin-bottom', '0.5rem', 'important');
                btn.style.setProperty('background', 'rgba(255, 255, 255, 0.1)', 'important');
            });
            
            console.log('Menu aberto com TODOS os estilos forçados');
            console.log('Elementos encontrados:', {
                overlay: !!overlay,
                mobileMenu: !!mobileMenu,
                buttonsCount: mobileButtons.length
            });
        }
    } else {
        console.error('Elemento mobileMenuOverlay não encontrado!');
    }
}

function syncMobileMenuActive() {
    const activeDesktop = document.querySelector('.desktop-nav .nav-btn.active');
    const mobileButtons = document.querySelectorAll('.mobile-nav-btn');
    
    // Remover active de todos os botões mobile
    mobileButtons.forEach(btn => btn.classList.remove('active'));
    
    // Adicionar active ao botão correspondente no mobile
    if (activeDesktop) {
        const page = activeDesktop.getAttribute('data-page');
        const activeMobile = document.querySelector(`.mobile-nav-btn[data-page="${page}"]`);
        if (activeMobile) {
            activeMobile.classList.add('active');
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

// Sincronizar clique nos botões mobile com desktop
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando menu mobile...'); // Debug
    
    // Usar delegação de eventos para o botão hamburger
    document.addEventListener('click', function(e) {
        // Verificar se o clique foi no botão hamburger
        if (e.target.closest('.mobile-menu-toggle')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botão hamburger clicado!'); // Debug
            toggleMobileMenu();
            return;
        }
        
        // Verificar se o clique foi no botão de fechar
        if (e.target.closest('.mobile-menu-close')) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Botão fechar menu clicado!'); // Debug
            toggleMobileMenu();
            return;
        }
        
        // Verificar se o clique foi em um botão de navegação mobile
        const mobileNavBtn = e.target.closest('.mobile-nav-btn');
        if (mobileNavBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const page = mobileNavBtn.getAttribute('data-page');
            console.log('Botão mobile clicado:', page);
            
            // Fechar menu primeiro
            toggleMobileMenu();
            
            // Então navegar
            setTimeout(() => {
                const desktopBtn = document.querySelector(`.desktop-nav .nav-btn[data-page="${page}"]`);
                if (desktopBtn) {
                    desktopBtn.click();
                }
            }, 100);
            return;
        }
    });
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
        
        // Inicializar outros sistemas
        this.initModal();
        this.initUtils();
        
        console.log('Aplicação inicializada com sucesso!');
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
            
            showNotification: function(message, type = 'info') {
                const notification = document.createElement('div');
                notification.className = `notification ${type}`;
                notification.textContent = message;
                
                document.body.appendChild(notification);
                
                // Remover após 4 segundos
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.animation = 'slideInRight 0.3s ease reverse';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }
                }, 4000);
            },
            
            confirm: function(message, callback) {
                const confirmed = window.confirm(message);
                if (confirmed && callback) {
                    callback();
                }
                return confirmed;
            },
            
            generateId: function() {
                return Date.now().toString(36) + Math.random().toString(36).substr(2);
            },
            
            debounce: function(func, wait) {
                let timeout;
                return function executedFunction(...args) {
                    const later = () => {
                        clearTimeout(timeout);
                        func(...args);
                    };
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                };
            }
        };
        
        // Storage Helper
        window.Storage = {
            get: function(key) {
                try {
                    const item = localStorage.getItem(key);
                    return item ? JSON.parse(item) : null;
                } catch (error) {
                    console.error('Erro ao ler do localStorage:', error);
                    return null;
                }
            },
            
            set: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (error) {
                    console.error('Erro ao escrever no localStorage:', error);
                    return false;
                }
            },
            
            remove: function(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (error) {
                    console.error('Erro ao remover do localStorage:', error);
                    return false;
                }
            }
        };
        
        // Data Manager
        window.DataManager = {
            // Dados simulados para demonstração
            agendamentos: [
                {
                    id: 1,
                    data: '2025-10-31',
                    hora: '09:00',
                    cliente: 'João Silva',
                    veiculo: 'Honda Civic 2020',
                    servico: 'Troca de Óleo',
                    status: 'agendado'
                },
                {
                    id: 2,
                    data: '2025-10-31',
                    hora: '14:00',
                    cliente: 'Maria Santos',
                    veiculo: 'Toyota Corolla 2019',
                    servico: 'Revisão Completa',
                    status: 'em-andamento'
                }
            ],
            
            clientes: [
                {
                    id: 1,
                    nome: 'João Silva',
                    telefone: '(11) 99999-9999',
                    email: 'joao@email.com',
                    veiculos: 1,
                    ultimaVisita: '2025-10-25'
                },
                {
                    id: 2,
                    nome: 'Maria Santos',
                    telefone: '(11) 88888-8888',
                    email: 'maria@email.com',
                    veiculos: 2,
                    ultimaVisita: '2025-10-30'
                }
            ],
            
            servicos: [
                {
                    id: 1,
                    nome: 'Troca de Óleo',
                    descricao: 'Troca de óleo do motor e filtro',
                    preco: 80.00,
                    tempo: 30
                },
                {
                    id: 2,
                    nome: 'Revisão Completa',
                    descricao: 'Revisão geral do veículo',
                    preco: 250.00,
                    tempo: 120
                }
            ],
            
            // Métodos CRUD básicos
            add: function(entity, item) {
                if (!this[entity]) this[entity] = [];
                item.id = this.getNextId(entity);
                this[entity].push(item);
                this.save(entity);
                return item;
            },
            
            update: function(entity, id, updates) {
                const index = this[entity].findIndex(item => item.id == id);
                if (index !== -1) {
                    this[entity][index] = { ...this[entity][index], ...updates };
                    this.save(entity);
                    return this[entity][index];
                }
                return null;
            },
            
            delete: function(entity, id) {
                const index = this[entity].findIndex(item => item.id == id);
                if (index !== -1) {
                    const deleted = this[entity].splice(index, 1)[0];
                    this.save(entity);
                    return deleted;
                }
                return null;
            },
            
            getAll: function(entity) {
                return this[entity] || [];
            },
            
            getById: function(entity, id) {
                return this[entity].find(item => item.id == id) || null;
            },
            
            getNextId: function(entity) {
                const items = this[entity] || [];
                return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
            },
            
            save: function(entity) {
                Storage.set(`oficina_${entity}`, this[entity]);
            },
            
            load: function(entity) {
                const data = Storage.get(`oficina_${entity}`);
                if (data) {
                    this[entity] = data;
                }
            },
            
            init: function() {
                // Carregar dados salvos
                ['agendamentos', 'clientes', 'servicos', 'veiculos', 'estoque', 'movimentacoes'].forEach(entity => {
                    this.load(entity);
                });
                
                // Sincronizar contadores de veículos
                this.sincronizarContadoresVeiculos();
            },
            
            sincronizarContadoresVeiculos: function() {
                const clientes = this.getAll('clientes');
                const veiculos = this.getAll('veiculos') || [];
                
                clientes.forEach(cliente => {
                    const contadorVeiculos = veiculos.filter(v => v.proprietario === cliente.nome).length;
                    if (cliente.veiculos !== contadorVeiculos) {
                        this.update('clientes', cliente.id, { veiculos: contadorVeiculos });
                    }
                });
            }
        };
        
        // Inicializar DataManager
        DataManager.init();
    }
}

// Inicializar aplicação
new App();