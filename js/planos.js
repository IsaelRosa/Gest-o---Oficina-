class PlanosManager {
    constructor() {
        this.currentPlan = 'basico'; // Plano atual do usuário
        this.init();
    }

    init() {
        this.createPlanosPage();
    }

    createPlanosPage() {
        const pageContainer = document.getElementById('page-container');
        pageContainer.innerHTML = `
            <div class="page" id="page-planos">
                <h2 class="page-title">
                    <i class="fas fa-crown"></i>
                    Nossos Planos
                </h2>
                
                <div class="plans-intro">
                    <p class="intro-text">
                        Escolha o plano ideal para sua oficina automotiva. 
                        Todos os planos incluem suporte técnico e atualizações gratuitas.
                    </p>
                    
                    <div class="billing-toggle">
                        <span class="billing-label">Mensal</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="billingToggle">
                            <span class="toggle-slider"></span>
                        </label>
                        <span class="billing-label">Anual <span class="discount-badge">-20%</span></span>
                    </div>
                </div>

                <div class="plans-grid" id="plansGrid">
                    ${this.generatePlansHTML()}
                </div>

                <div class="plans-comparison">
                    <h3>Comparação de Funcionalidades</h3>
                    <div class="comparison-table-container">
                        <table class="comparison-table">
                            <thead>
                                <tr>
                                    <th>Funcionalidades</th>
                                    <th>Básico</th>
                                    <th>Profissional</th>
                                    <th>Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateComparisonTableHTML()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="plans-benefits">
                    <h3>Todos os planos incluem:</h3>
                    <div class="benefits-grid">
                        <div class="benefit-item">
                            <i class="fas fa-cloud"></i>
                            <h4>Sistema em Nuvem</h4>
                            <p>Acesso de qualquer lugar, backup automático</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-headset"></i>
                            <h4>Suporte Técnico</h4>
                            <p>Atendimento via WhatsApp e telefone</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-mobile-alt"></i>
                            <h4>Responsivo</h4>
                            <p>Funciona em computadores, tablets e celulares</p>
                        </div>
                        <div class="benefit-item">
                            <i class="fas fa-shield-alt"></i>
                            <h4>Dados Seguros</h4>
                            <p>Criptografia e backup diário automático</p>
                        </div>
                    </div>
                </div>

                <div class="contact-support">
                    <div class="support-card">
                        <h3>Precisa de ajuda para escolher?</h3>
                        <p>Nossa equipe está pronta para te auxiliar na escolha do melhor plano</p>
                        <div class="support-buttons">
                            <button class="btn btn-primary" onclick="planosManager.contactSupport('whatsapp')">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </button>
                            <button class="btn btn-secondary" onclick="planosManager.contactSupport('phone')">
                                <i class="fas fa-phone"></i> Telefone
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    generatePlansHTML() {
        const plans = [
            {
                id: 'basico',
                name: 'Básico',
                icon: 'fas fa-car',
                description: 'Ideal para oficinas pequenas que estão começando',
                price: { monthly: 89, yearly: 856 },
                originalPrice: { monthly: 89, yearly: 1068 },
                features: [
                    'Gestão de Agendamentos',
                    'Cadastro de Clientes',
                    'Cadastro de Veículos',
                    'Ordens de Serviço Básicas',
                    'Controle Financeiro Simples',
                    '1 Usuário',
                    'Suporte por Email'
                ],
                limitations: ['WhatsApp Integração', 'Relatórios Avançados', 'Checklist de Avarias'],
                badge: '',
                buttonClass: 'btn-secondary'
            },
            {
                id: 'profissional',
                name: 'Profissional',
                icon: 'fas fa-tools',
                description: 'Perfeito para oficinas estabelecidas com movimento constante',
                price: { monthly: 149, yearly: 1428 },
                originalPrice: { monthly: 149, yearly: 1788 },
                features: [
                    'Tudo do Plano Básico',
                    'WhatsApp Integração',
                    'Checklist de Avarias',
                    'Registro Fotográfico',
                    'Controle de Estoque',
                    'Relatórios Detalhados',
                    'Até 3 Usuários',
                    'Suporte Prioritário'
                ],
                limitations: ['Marketing Automático', 'Pacotes de Serviços'],
                badge: 'Mais Popular',
                buttonClass: 'btn-primary'
            },
            {
                id: 'premium',
                name: 'Premium',
                icon: 'fas fa-crown',
                description: 'Solução completa para oficinas que querem crescer',
                price: { monthly: 249, yearly: 2388 },
                originalPrice: { monthly: 249, yearly: 2988 },
                features: [
                    'Tudo do Plano Profissional',
                    'Marketing Automático',
                    'Pacotes de Serviços',
                    'Gestão Pós-Pago',
                    'Controle de Comissões',
                    'Relatórios Operacionais',
                    'Usuários Ilimitados',
                    'Suporte Premium 24/7'
                ],
                limitations: [],
                badge: 'Completo',
                buttonClass: 'btn-success'
            }
        ];

        return plans.map(plan => `
            <div class="plan-card ${plan.id === this.currentPlan ? 'current-plan' : ''}" data-plan="${plan.id}">
                ${plan.badge ? `<div class="plan-badge">${plan.badge}</div>` : ''}
                
                <div class="plan-header">
                    <div class="plan-icon">
                        <i class="${plan.icon}"></i>
                    </div>
                    <h3 class="plan-name">${plan.name}</h3>
                    <p class="plan-description">${plan.description}</p>
                </div>

                <div class="plan-pricing">
                    <div class="price-display">
                        <span class="currency">R$</span>
                        <span class="price-value" data-monthly="${plan.price.monthly}" data-yearly="${Math.floor(plan.price.yearly/12)}">${plan.price.monthly}</span>
                        <span class="price-period">/mês</span>
                    </div>
                    <div class="yearly-savings" style="display: none;">
                        Economize R$ ${plan.originalPrice.yearly - plan.price.yearly} no ano
                    </div>
                </div>

                <div class="plan-features">
                    <ul class="features-list">
                        ${plan.features.map(feature => `
                            <li class="feature-included">
                                <i class="fas fa-check"></i>
                                <span>${feature}</span>
                            </li>
                        `).join('')}
                        ${plan.limitations.map(limitation => `
                            <li class="feature-not-included">
                                <i class="fas fa-times"></i>
                                <span>${limitation}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="plan-actions">
                    ${plan.id === this.currentPlan ? 
                        '<button class="btn btn-current" disabled><i class="fas fa-check"></i> Plano Atual</button>' :
                        `<button class="btn ${plan.buttonClass}" onclick="planosManager.selectPlan('${plan.id}')">
                            <i class="fas fa-arrow-right"></i> Escolher Plano
                        </button>`
                    }
                </div>
            </div>
        `).join('');
    }

    generateComparisonTableHTML() {
        const features = [
            { name: 'Gestão de Agendamentos', basico: true, profissional: true, premium: true },
            { name: 'Cadastro de Clientes/Veículos', basico: true, profissional: true, premium: true },
            { name: 'Ordens de Serviço', basico: 'Básicas', profissional: 'Completas', premium: 'Avançadas' },
            { name: 'Controle Financeiro', basico: 'Simples', profissional: 'Detalhado', premium: 'Completo' },
            { name: 'WhatsApp Integração', basico: false, profissional: true, premium: true },
            { name: 'Checklist de Avarias', basico: false, profissional: true, premium: true },
            { name: 'Controle de Estoque', basico: false, profissional: true, premium: true },
            { name: 'Relatórios', basico: 'Básicos', profissional: 'Detalhados', premium: 'Operacionais' },
            { name: 'Marketing Automático', basico: false, profissional: false, premium: true },
            { name: 'Pacotes de Serviços', basico: false, profissional: false, premium: true },
            { name: 'Gestão Pós-Pago', basico: false, profissional: false, premium: true },
            { name: 'Controle de Comissões', basico: false, profissional: false, premium: true },
            { name: 'Número de Usuários', basico: '1', profissional: '3', premium: 'Ilimitado' },
            { name: 'Suporte', basico: 'Email', profissional: 'Prioritário', premium: '24/7' }
        ];

        return features.map(feature => `
            <tr>
                <td class="feature-name">${feature.name}</td>
                <td class="feature-cell">${this.formatFeatureValue(feature.basico)}</td>
                <td class="feature-cell">${this.formatFeatureValue(feature.profissional)}</td>
                <td class="feature-cell">${this.formatFeatureValue(feature.premium)}</td>
            </tr>
        `).join('');
    }

    formatFeatureValue(value) {
        if (value === true) {
            return '<i class="fas fa-check feature-check"></i>';
        } else if (value === false) {
            return '<i class="fas fa-times feature-times"></i>';
        } else {
            return `<span class="feature-text">${value}</span>`;
        }
    }

    setupEventListeners() {
        // Toggle de cobrança anual/mensal
        const billingToggle = document.getElementById('billingToggle');
        if (billingToggle) {
            billingToggle.addEventListener('change', (e) => {
                this.toggleBilling(e.target.checked);
            });
        }
    }

    toggleBilling(isYearly) {
        const priceValues = document.querySelectorAll('.price-value');
        const yearlySavings = document.querySelectorAll('.yearly-savings');
        
        priceValues.forEach(priceEl => {
            const monthly = priceEl.dataset.monthly;
            const yearly = priceEl.dataset.yearly;
            
            if (isYearly) {
                priceEl.textContent = yearly;
                priceEl.parentNode.querySelector('.price-period').textContent = '/mês (anual)';
            } else {
                priceEl.textContent = monthly;
                priceEl.parentNode.querySelector('.price-period').textContent = '/mês';
            }
        });

        yearlySavings.forEach(savings => {
            savings.style.display = isYearly ? 'block' : 'none';
        });
    }

    selectPlan(planId) {
        const confirmMessage = `Tem certeza que deseja contratar o plano ${planId.charAt(0).toUpperCase() + planId.slice(1)}?`;
        
        if (confirm(confirmMessage)) {
            // Aqui seria integrado com sistema de pagamento
            alert(`Redirecionando para checkout do plano ${planId.charAt(0).toUpperCase() + planId.slice(1)}...`);
            
            // Simular upgrade do plano
            this.currentPlan = planId;
            this.createPlanosPage();
            
            // Salvar no localStorage
            localStorage.setItem('carservice_current_plan', planId);
            
            this.showSuccessMessage(planId);
        }
    }

    showSuccessMessage(planId) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Parabéns!</h3>
                <p>Seu plano foi atualizado para <strong>${planId.charAt(0).toUpperCase() + planId.slice(1)}</strong></p>
                <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">
                    Continuar
                </button>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 5000);
    }

    contactSupport(type) {
        if (type === 'whatsapp') {
            const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os planos do CarService Pro.');
            window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
        } else if (type === 'phone') {
            alert('Entre em contato pelo telefone: (11) 99999-9999');
        }
    }

    // Carregar plano atual do localStorage
    loadCurrentPlan() {
        const savedPlan = localStorage.getItem('carservice_current_plan');
        if (savedPlan) {
            this.currentPlan = savedPlan;
        }
    }
}

// Inicializar quando a página de planos for carregada
let planosManager;

// Função chamada pelo navigation.js
function showPlanos() {
    if (!planosManager) {
        planosManager = new PlanosManager();
    } else {
        planosManager.createPlanosPage();
    }
}