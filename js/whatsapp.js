// Sistema de WhatsApp Business - Inspirado no JumpCar
const WhatsApp = {
    init: function() {
        console.log('Inicializando Sistema de WhatsApp...');
        this.loadMensagens();
        this.loadStats();
        this.bindEvents();
    },

    bindEvents: function() {
        // Event listeners para os toggles
        const avisosToggle = document.getElementById('avisos-automaticos');
        const marketingToggle = document.getElementById('marketing-pos-venda');

        if (avisosToggle) {
            avisosToggle.addEventListener('change', (e) => {
                this.salvarConfiguracao('avisos-automaticos', e.target.checked);
                Utils.showNotification(
                    `Avisos automáticos ${e.target.checked ? 'ativados' : 'desativados'}!`, 
                    'success'
                );
            });
        }

        if (marketingToggle) {
            marketingToggle.addEventListener('change', (e) => {
                this.salvarConfiguracao('marketing-pos-venda', e.target.checked);
                Utils.showNotification(
                    `Marketing pós-venda ${e.target.checked ? 'ativado' : 'desativado'}!`, 
                    'success'
                );
            });
        }
    },

    loadMensagens: function() {
        const tbody = document.getElementById('mensagens-tbody');
        if (!tbody) return;

        let mensagens = DataManager.getAll('whatsapp-mensagens');
        
        if (mensagens.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma mensagem enviada ainda</td></tr>';
            return;
        }

        // Ordenar por data mais recente
        mensagens.sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio));

        const html = mensagens.map(msg => {
            const statusIcon = this.getStatusIcon(msg.status);
            const statusColor = this.getStatusColor(msg.status);
            
            return `
                <tr>
                    <td>${Utils.formatDateTime(msg.dataEnvio)}</td>
                    <td>${msg.cliente}</td>
                    <td><span class="message-type">${msg.tipo}</span></td>
                    <td>
                        <span class="status-badge" style="background-color: ${statusColor}">
                            ${statusIcon} ${msg.status}
                        </span>
                    </td>
                    <td class="message-preview" title="${msg.mensagem}">
                        ${this.truncateMessage(msg.mensagem)}
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;
    },

    loadStats: function() {
        const statsContainer = document.getElementById('whatsapp-stats');
        if (!statsContainer) return;

        const mensagens = DataManager.getAll('whatsapp-mensagens');
        const hoje = new Date().toISOString().split('T')[0];
        
        const mensagensHoje = mensagens.filter(msg => 
            msg.dataEnvio.startsWith(hoje)
        ).length;

        const mensagensEntregues = mensagens.filter(msg => 
            msg.status === 'Entregue'
        ).length;

        const taxaEntrega = mensagens.length > 0 
            ? Math.round((mensagensEntregues / mensagens.length) * 100)
            : 100;

        statsContainer.innerHTML = `
            <p>Mensagens enviadas hoje: <strong>${mensagensHoje}</strong></p>
            <p>Taxa de entrega: <strong>${taxaEntrega}%</strong></p>
            <p>Total de mensagens: <strong>${mensagens.length}</strong></p>
        `;
    },

    showConfigForm: function() {
        const config = this.getConfiguracoes();

        const content = `
            <div class="whatsapp-config">
                <form id="form-config-whatsapp">
                    <div class="form-group">
                        <label>Número do WhatsApp Business:</label>
                        <input type="tel" id="numero-whatsapp" class="form-control" 
                               value="${config.numero || ''}" 
                               placeholder="+55 11 99999-9999">
                    </div>
                    
                    <div class="form-group">
                        <label>Token da API (Simulado):</label>
                        <input type="text" id="api-token" class="form-control" 
                               value="${config.token || ''}" 
                               placeholder="Insira o token da API">
                    </div>
                    
                    <div class="form-group">
                        <label>Nome da Empresa:</label>
                        <input type="text" id="nome-empresa" class="form-control" 
                               value="${config.nomeEmpresa || 'Oficina Pro'}" 
                               placeholder="Nome da sua empresa">
                    </div>
                    
                    <div class="form-group">
                        <label>Horário de Funcionamento:</label>
                        <div class="form-row">
                            <input type="time" id="horario-inicio" class="form-control" 
                                   value="${config.horarioInicio || '08:00'}">
                            <span style="margin: 0 1rem; line-height: 2.5;">até</span>
                            <input type="time" id="horario-fim" class="form-control" 
                                   value="${config.horarioFim || '18:00'}">
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-save"></i> Salvar Configurações
                        </button>
                        <button type="button" class="btn" onclick="Modal.hide(this.closest('.modal'))">
                            <i class="fas fa-times"></i> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        `;

        const modal = Modal.show(content, 'Configurações do WhatsApp', 'medium');

        // Event listener para o formulário
        const form = document.getElementById('form-config-whatsapp');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.salvarConfiguracoes(modal);
        });
    },

    showTemplatesForm: function() {
        const templates = this.getTemplates();

        const content = `
            <div class="templates-config">
                <div class="templates-tabs">
                    <button class="tab-btn active" data-tab="inicio-servico">Início de Serviço</button>
                    <button class="tab-btn" data-tab="fim-servico">Fim de Serviço</button>
                    <button class="tab-btn" data-tab="pos-venda">Pós-Venda</button>
                </div>

                <div class="tab-content active" id="tab-inicio-servico">
                    <h4>Mensagem de Início de Serviço</h4>
                    <textarea id="template-inicio" class="form-control" rows="4" placeholder="Digite sua mensagem...">${templates.inicioServico || 'Olá {cliente}! 👋\n\nSeu {veiculo} acabou de entrar em nosso atendimento.\n\nServiço: {servico}\nTempo estimado: {tempo} minutos\n\nEm breve enviaremos atualizações!\n\n{empresa}'}</textarea>
                </div>

                <div class="tab-content" id="tab-fim-servico">
                    <h4>Mensagem de Fim de Serviço</h4>
                    <textarea id="template-fim" class="form-control" rows="4" placeholder="Digite sua mensagem...">${templates.fimServico || 'Oi {cliente}! ✅\n\nSeu {veiculo} está pronto!\n\nServiço realizado: {servico}\nValor total: {valor}\n\nVocê pode retirar seu veículo quando desejar.\n\nObrigado pela preferência!\n{empresa}'}</textarea>
                </div>

                <div class="tab-content" id="tab-pos-venda">
                    <h4>Mensagem de Pós-Venda</h4>
                    <textarea id="template-pos-venda" class="form-control" rows="4" placeholder="Digite sua mensagem...">${templates.posVenda || 'Olá {cliente}! 😊\n\nEsperamos que tenha ficado satisfeito com o {servico} realizado em seu {veiculo}.\n\nSua opinião é muito importante para nós!\n\nEm breve entraremos em contato para agendar sua próxima visita.\n\n{empresa}'}</textarea>
                </div>

                <div class="template-variables">
                    <h5>Variáveis disponíveis:</h5>
                    <div class="variables-list">
                        <span class="variable">{cliente}</span>
                        <span class="variable">{veiculo}</span>
                        <span class="variable">{servico}</span>
                        <span class="variable">{valor}</span>
                        <span class="variable">{tempo}</span>
                        <span class="variable">{empresa}</span>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-success" onclick="WhatsApp.salvarTemplates()">
                        <i class="fas fa-save"></i> Salvar Templates
                    </button>
                    <button type="button" class="btn" onclick="Modal.hide(this.closest('.modal'))">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
        `;

        const modal = Modal.show(content, 'Gerenciar Templates de Mensagens', 'large');

        // Event listeners para as abas
        const tabButtons = modal.querySelectorAll('.tab-btn');
        const tabContents = modal.querySelectorAll('.tab-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Remover ativo de todas as abas
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Ativar aba selecionada
                btn.classList.add('active');
                document.getElementById(`tab-${tab}`).classList.add('active');
            });
        });
    },

    salvarConfiguracoes: function(modal) {
        const config = {
            numero: document.getElementById('numero-whatsapp').value,
            token: document.getElementById('api-token').value,
            nomeEmpresa: document.getElementById('nome-empresa').value,
            horarioInicio: document.getElementById('horario-inicio').value,
            horarioFim: document.getElementById('horario-fim').value
        };

        localStorage.setItem('whatsapp-config', JSON.stringify(config));
        Utils.showNotification('Configurações salvas com sucesso!', 'success');
        Modal.hide(modal);
    },

    salvarTemplates: function() {
        const templates = {
            inicioServico: document.getElementById('template-inicio').value,
            fimServico: document.getElementById('template-fim').value,
            posVenda: document.getElementById('template-pos-venda').value
        };

        localStorage.setItem('whatsapp-templates', JSON.stringify(templates));
        Utils.showNotification('Templates salvos com sucesso!', 'success');
    },

    getConfiguracoes: function() {
        const config = localStorage.getItem('whatsapp-config');
        return config ? JSON.parse(config) : {};
    },

    getTemplates: function() {
        const templates = localStorage.getItem('whatsapp-templates');
        return templates ? JSON.parse(templates) : {};
    },

    salvarConfiguracao: function(chave, valor) {
        const config = this.getConfiguracoes();
        config[chave] = valor;
        localStorage.setItem('whatsapp-config', JSON.stringify(config));
    },

    // Função simulada para enviar mensagem
    enviarMensagem: function(tipo, cliente, dados) {
        const config = this.getConfiguracoes();
        const templates = this.getTemplates();
        
        if (!config['avisos-automaticos'] && tipo !== 'pos-venda') return;
        if (!config['marketing-pos-venda'] && tipo === 'pos-venda') return;

        let template = '';
        switch(tipo) {
            case 'inicio-servico':
                template = templates.inicioServico || 'Seu serviço foi iniciado!';
                break;
            case 'fim-servico':
                template = templates.fimServico || 'Seu serviço foi concluído!';
                break;
            case 'pos-venda':
                template = templates.posVenda || 'Obrigado pela preferência!';
                break;
        }

        // Substituir variáveis
        const mensagem = this.processarTemplate(template, dados);

        // Simular envio (em produção seria uma API real)
        const mensagemData = {
            dataEnvio: new Date().toISOString(),
            cliente: cliente,
            tipo: this.getTipoNome(tipo),
            status: 'Entregue', // Simulado
            mensagem: mensagem
        };

        DataManager.add('whatsapp-mensagens', mensagemData);
        
        // Simular abertura do WhatsApp (apenas log)
        console.log(`WhatsApp simulado para ${cliente}:`, mensagem);
        
        return mensagemData;
    },

    processarTemplate: function(template, dados) {
        const config = this.getConfiguracoes();
        
        return template
            .replace(/{cliente}/g, dados.cliente || '')
            .replace(/{veiculo}/g, dados.veiculo || '')
            .replace(/{servico}/g, dados.servico || '')
            .replace(/{valor}/g, dados.valor || '')
            .replace(/{tempo}/g, dados.tempo || '')
            .replace(/{empresa}/g, config.nomeEmpresa || 'Oficina Pro');
    },

    getTipoNome: function(tipo) {
        const tipos = {
            'inicio-servico': 'Início de Serviço',
            'fim-servico': 'Fim de Serviço',
            'pos-venda': 'Pós-Venda'
        };
        return tipos[tipo] || tipo;
    },

    getStatusIcon: function(status) {
        const icons = {
            'Enviado': '📤',
            'Entregue': '✅',
            'Lido': '👁️',
            'Erro': '❌'
        };
        return icons[status] || '📤';
    },

    getStatusColor: function(status) {
        const colors = {
            'Enviado': '#f39c12',
            'Entregue': '#27ae60',
            'Lido': '#3498db',
            'Erro': '#e74c3c'
        };
        return colors[status] || '#95a5a6';
    },

    truncateMessage: function(message, length = 50) {
        if (message.length <= length) return message;
        return message.substring(0, length) + '...';
    }
};

// Integração com Ordem de Serviço
// Quando uma OS muda de status, enviar mensagem automática
const originalSaveOS = OrdemServico?.saveOS;
if (originalSaveOS) {
    OrdemServico.saveOS = function(modal, id) {
        // Chamar função original
        const result = originalSaveOS.call(this, modal, id);
        
        // Enviar mensagem se necessário
        setTimeout(() => {
            const os = DataManager.getById('ordens-servico', id);
            if (os && os.status === 'Em Andamento') {
                WhatsApp.enviarMensagem('inicio-servico', os.cliente, {
                    cliente: os.cliente,
                    veiculo: os.veiculo,
                    servico: os.servicos.map(s => s.nome).join(', '),
                    tempo: os.servicos.reduce((total, s) => total + (s.tempo || 60), 0)
                });
            } else if (os && os.status === 'Concluído') {
                const valorTotal = os.servicos.reduce((total, s) => total + s.preco, 0);
                WhatsApp.enviarMensagem('fim-servico', os.cliente, {
                    cliente: os.cliente,
                    veiculo: os.veiculo,
                    servico: os.servicos.map(s => s.nome).join(', '),
                    valor: Utils.formatCurrency(valorTotal)
                });
            }
        }, 500);
        
        return result;
    };
}

// Expor para uso global
window.WhatsApp = WhatsApp;