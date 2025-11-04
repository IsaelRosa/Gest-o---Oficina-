// Sistema de Navegação entre Páginas
class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.pageContainer = document.getElementById('page-container');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.init();
    }

    init() {
        // Adicionar event listeners aos botões de navegação
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = e.target.closest('.nav-btn').dataset.page;
                this.navigateTo(page);
            });
        });

        // Carregar página inicial
        this.loadPage(this.currentPage);
    }

    navigateTo(page) {
        if (page === this.currentPage) return;

        // Atualizar botão ativo
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Carregar nova página
        this.currentPage = page;
        this.loadPage(page);
    }

    async loadPage(page) {
        try {
            // Mostrar loading
            this.pageContainer.innerHTML = '<div class="loading">Carregando...</div>';

            // Gerar conteúdo da página dinamicamente (sem fetch)
            this.generatePageContent(page);

            // Inicializar funcionalidades específicas da página
            this.initPageFunctionality(page);

        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.generatePageContent(page);
        }
    }

    generatePageContent(page) {
        const pageContent = this.getPageContent(page);
        this.pageContainer.innerHTML = pageContent;
    }

    getPageContent(page) {
        const pages = {
            dashboard: this.getDashboardContent(),
            agendamentos: this.getAgendamentosContent(),
            'ordem-servico': this.getOrdemServicoContent(),
            funcionarios: this.getFuncionariosContent(),
            despesas: this.getDespesasContent(),
            whatsapp: this.getWhatsAppContent(),
            servicos: this.getServicosContent(),
            clientes: this.getClientesContent(),
            veiculos: this.getVeiculosContent(),
            financeiro: this.getFinanceiroContent(),
            estoque: this.getEstoqueContent(),
            planos: this.getPlanosContent()
        };

        return pages[page] || '<div class="page"><h1>Página não encontrada</h1></div>';
    }

    getDashboardContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-tachometer-alt"></i> Dashboard</h1>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-calendar-check"></i>
                            <h3 class="card-title">Agendamentos Hoje</h3>
                        </div>
                        <div class="card-value">12</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-tools"></i>
                            <h3 class="card-title">Serviços em Andamento</h3>
                        </div>
                        <div class="card-value">8</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-dollar-sign"></i>
                            <h3 class="card-title">Faturamento Mensal</h3>
                        </div>
                        <div class="card-value">R$ 45.280</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-users"></i>
                            <h3 class="card-title">Clientes Ativos</h3>
                        </div>
                        <div class="card-value">156</div>
                    </div>
                </div>

                <div class="cards-grid">
                    <div class="card">
                        <h3 class="card-title">Próximos Agendamentos</h3>
                        <div id="proximos-agendamentos"></div>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title">Serviços Mais Solicitados</h3>
                        <div id="servicos-populares"></div>
                    </div>
                </div>
            </div>
        `;
    }

    getAgendamentosContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-calendar-alt"></i> Agendamentos</h1>
                
                <div class="flex justify-between items-center mb-2">
                    <button class="btn" id="novo-agendamento">
                        <i class="fas fa-plus"></i> Novo Agendamento
                    </button>
                    <div class="form-group" style="margin: 0; width: 200px;">
                        <select id="filtro-status">
                            <option value="">Todos os Status</option>
                            <option value="agendado">Agendado</option>
                            <option value="em-andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-agendamentos">
                        <thead>
                            <tr>
                                <th>Data/Hora</th>
                                <th>Cliente</th>
                                <th>Veículo</th>
                                <th>Serviço</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="agendamentos-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getServicosContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-tools"></i> Catálogo de Serviços</h1>
                
                <div class="stats-bar">
                    <div class="stat-item">
                        <span id="total-servicos">0</span> serviços cadastrados
                    </div>
                    <div class="stat-item">
                        <span id="servicos-lavagem">0</span> serviços de lavagem
                    </div>
                    <div class="stat-item">
                        <span id="servicos-mecanicos">0</span> serviços mecânicos
                    </div>
                </div>
                
                <div class="flex justify-between items-center mb-2">
                    <button class="btn btn-primary" id="novo-servico">
                        <i class="fas fa-plus"></i> Novo Serviço
                    </button>
                    <div class="flex gap-1">
                        <div class="form-group" style="margin: 0; width: 200px;">
                            <select id="filtro-categoria-servico" class="form-control">
                                <option value="">Todas as Categorias</option>
                                <option value="Lavagem & Estética">Lavagem & Estética</option>
                                <option value="Serviços Mecânicos">Serviços Mecânicos</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin: 0; width: 200px;">
                            <input type="text" id="buscar-servico" placeholder="Buscar serviços..." class="form-control search-input">
                        </div>
                    </div>
                </div>

                <div class="cards-grid" id="servicos-grid">
                    <div class="loading-message">Carregando serviços...</div>
                </div>
            </div>
        `;
    }

    getClientesContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-users"></i> Gestão de Clientes</h1>
                
                <div class="flex justify-between items-center mb-2">
                    <button class="btn" id="novo-cliente">
                        <i class="fas fa-plus"></i> Novo Cliente
                    </button>
                    <div class="form-group" style="margin: 0; width: 200px;">
                        <input type="text" id="buscar-cliente" placeholder="Buscar clientes...">
                    </div>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-clientes">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Telefone</th>
                                <th>Email</th>
                                <th>Veículos</th>
                                <th>Última Visita</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="clientes-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getVeiculosContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-car-side"></i> Gestão de Veículos</h1>
                
                <div class="flex justify-between items-center mb-2">
                    <button class="btn" id="novo-veiculo">
                        <i class="fas fa-plus"></i> Novo Veículo
                    </button>
                    <div class="form-group" style="margin: 0; width: 200px;">
                        <input type="text" id="buscar-veiculo" placeholder="Buscar veículos...">
                    </div>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-veiculos">
                        <thead>
                            <tr>
                                <th>Marca/Modelo</th>
                                <th>Placa</th>
                                <th>Ano</th>
                                <th>Proprietário</th>
                                <th>Última Manutenção</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="veiculos-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getFinanceiroContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-chart-line"></i> Módulo Financeiro</h1>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-money-bill-wave"></i>
                            <h3 class="card-title">Receita Mensal</h3>
                        </div>
                        <div class="card-value">R$ 45.280</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-credit-card"></i>
                            <h3 class="card-title">Despesas Mensais</h3>
                        </div>
                        <div class="card-value">R$ 18.450</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-chart-pie"></i>
                            <h3 class="card-title">Lucro Líquido</h3>
                        </div>
                        <div class="card-value">R$ 26.830</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-clock"></i>
                            <h3 class="card-title">Contas a Receber</h3>
                        </div>
                        <div class="card-value">R$ 12.150</div>
                    </div>
                </div>

                <div class="flex justify-between items-center mb-2">
                    <h2>Movimentações Financeiras</h2>
                    <button class="btn" id="nova-movimentacao">
                        <i class="fas fa-plus"></i> Nova Movimentação
                    </button>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-financeiro">
                        <thead>
                            <tr>
                                <th>Data</th>
                                <th>Descrição</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="financeiro-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getEstoqueContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-boxes"></i> Controle de Estoque</h1>
                
                <div class="flex justify-between items-center mb-2">
                    <button class="btn" id="novo-produto">
                        <i class="fas fa-plus"></i> Novo Produto
                    </button>
                    <div class="flex gap-1">
                        <div class="form-group" style="margin: 0; width: 150px;">
                            <select id="filtro-categoria">
                                <option value="">Todas Categorias</option>
                                <option value="pecas">Peças</option>
                                <option value="ferramentas">Ferramentas</option>
                                <option value="fluidos">Fluidos</option>
                                <option value="acessorios">Acessórios</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin: 0; width: 200px;">
                            <input type="text" id="buscar-produto" placeholder="Buscar produtos...">
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-estoque">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Categoria</th>
                                <th>Quantidade</th>
                                <th>Preço Unitário</th>
                                <th>Valor Total</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="estoque-tbody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getPlanosContent() {
        return `
            <div class="page" id="page-planos">
                <!-- Conteúdo será gerado dinamicamente pelo PlanosManager -->
                <div class="loading">Carregando planos...</div>
            </div>
        `;
    }

    getOrdemServicoContent() {
        return `
            <div class="page">
                <h1 class="page-title">
                    <i class="fas fa-clipboard-list"></i> Ordem de Serviço
                </h1>
                
                <div class="toolbar">
                    <div class="toolbar-left">
                        <button class="btn btn-primary" onclick="OrdemServico.showFormOS()">
                            <i class="fas fa-plus"></i> Nova OS
                        </button>
                    </div>
                    <div class="toolbar-right">
                        <input type="text" id="buscar-os" placeholder="Buscar OS..." class="search-input">
                        <select id="filtro-status-os" class="form-control">
                            <option value="">Todos os Status</option>
                            <option value="Aguardando">Aguardando</option>
                            <option value="Em Andamento">Em Andamento</option>
                            <option value="Concluído">Concluído</option>
                            <option value="Entregue">Entregue</option>
                        </select>
                    </div>
                </div>

                <div class="cards-grid" id="os-grid">
                    <!-- Os cards de OS serão carregados aqui -->
                </div>
            </div>
        `;
    }

    getFuncionariosContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-users-cog"></i> Gestão de Funcionários</h1>
                
                <div class="stats-bar">
                    <div class="stat-item">
                        <span id="total-funcionarios">0</span> funcionários cadastrados
                    </div>
                    <div class="stat-item">
                        Funcionários ativos: <span id="funcionarios-ativos">0</span>
                    </div>
                </div>
                
                <div class="flex justify-between items-center mb-2">
                    <button class="btn btn-primary" id="novo-funcionario">
                        <i class="fas fa-plus"></i> Novo Funcionário
                    </button>
                    <div class="flex gap-1">
                        <div class="form-group" style="margin: 0; width: 200px;">
                            <select id="filtro-status-funcionario" class="form-control">
                                <option value="">Todos os Status</option>
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                                <option value="ferias">Férias</option>
                                <option value="afastado">Afastado</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin: 0; width: 200px;">
                            <input type="text" id="buscar-funcionario" placeholder="Buscar funcionários..." class="form-control search-input">
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-funcionarios">
                        <thead>
                            <tr>
                                <th>Funcionário</th>
                                <th>CPF</th>
                                <th>Telefone</th>
                                <th>E-mail</th>
                                <th>Salário</th>
                                <th>Comissão</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="funcionarios-tbody">
                            <tr>
                                <td colspan="8" class="text-center">Carregando funcionários...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getDespesasContent() {
        return `
            <div class="page">
                <h1 class="page-title"><i class="fas fa-receipt"></i> Gestão de Despesas</h1>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-calendar-alt"></i>
                            <h3 class="card-title">Total do Mês</h3>
                        </div>
                        <div class="card-value">R$ 0,00</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-check-circle"></i>
                            <h3 class="card-title">Já Pagas</h3>
                        </div>
                        <div class="card-value">R$ 0,00</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-clock"></i>
                            <h3 class="card-title">Pendentes</h3>
                        </div>
                        <div class="card-value">R$ 0,00</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-exclamation-triangle"></i>
                            <h3 class="card-title">Vencidas</h3>
                        </div>
                        <div class="card-value">R$ 0,00</div>
                    </div>
                </div>
                
                <div class="stats-bar">
                    <div class="stat-item">
                        <span id="total-despesas">0</span> despesas cadastradas
                    </div>
                </div>
                
                <div class="flex justify-between items-center mb-2">
                    <div class="flex gap-1">
                        <button class="btn btn-primary" id="nova-despesa">
                            <i class="fas fa-plus"></i> Nova Despesa
                        </button>
                        <button class="btn btn-secondary" id="gerenciar-tipos-pagamento">
                            <i class="fas fa-cog"></i> Tipos de Pagamento
                        </button>
                    </div>
                    <div class="flex gap-1">
                        <div class="form-group" style="margin: 0; width: 150px;">
                            <select id="filtro-categoria-despesa" class="form-control">
                                <option value="">Todas as Categorias</option>
                                <option value="Infraestrutura">Infraestrutura</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Funcionários">Funcionários</option>
                                <option value="Impostos">Impostos</option>
                                <option value="Equipamentos">Equipamentos</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Materiais">Materiais</option>
                                <option value="Outros">Outros</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin: 0; width: 120px;">
                            <select id="filtro-status-despesa" class="form-control">
                                <option value="">Todos os Status</option>
                                <option value="pendente">Pendente</option>
                                <option value="pago">Pago</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin: 0; width: 200px;">
                            <input type="text" id="buscar-despesa" placeholder="Buscar despesas..." class="form-control search-input">
                        </div>
                    </div>
                </div>

                <div class="table-container">
                    <table class="table" id="tabela-despesas">
                        <thead>
                            <tr>
                                <th>Despesa</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Vencimento</th>
                                <th>Pagamento</th>
                                <th>Funcionário</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="despesas-tbody">
                            <tr>
                                <td colspan="8" class="text-center">Carregando despesas...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    getWhatsAppContent() {
        return `
            <div class="page">
                <h1 class="page-title">
                    <i class="fab fa-whatsapp"></i> WhatsApp Business
                </h1>
                
                <div class="whatsapp-sections">
                    <div class="section">
                        <h3><i class="fas fa-cog"></i> Configurações</h3>
                        <p>Configure seu número do WhatsApp Business e personalize suas mensagens.</p>
                        
                        <div class="toolbar">
                            <button class="btn btn-primary" onclick="WhatsApp.showConfigForm()">
                                <i class="fas fa-cog"></i> Configurar WhatsApp
                            </button>
                            <button class="btn btn-secondary" onclick="WhatsApp.showTemplatesForm()">
                                <i class="fas fa-edit"></i> Gerenciar Templates
                            </button>
                        </div>

                        <div class="toggle-section">
                            <label class="toggle">
                                <input type="checkbox" id="avisos-automaticos">
                                <span class="slider"></span>
                            </label>
                            <span>Avisos automáticos de início/fim de serviço</span>
                        </div>

                        <div class="toggle-section">
                            <label class="toggle">
                                <input type="checkbox" id="marketing-pos-venda">
                                <span class="slider"></span>
                            </label>
                            <span>Marketing pós-venda automático</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3><i class="fas fa-chart-bar"></i> Estatísticas</h3>
                        <div id="whatsapp-stats">
                            <p>Carregando estatísticas...</p>
                        </div>
                    </div>

                    <div class="section">
                        <h3><i class="fas fa-history"></i> Histórico de Mensagens</h3>
                        <div class="table-container">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Cliente</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Mensagem</th>
                                    </tr>
                                </thead>
                                <tbody id="mensagens-tbody">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getWhatsAppContent() {
        return `
            <div class="page">
                <h1 class="page-title">
                    <i class="fab fa-whatsapp"></i> WhatsApp Business
                </h1>
                
                <div class="cards-grid">
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-cog"></i>
                            <h3 class="card-title">Configurações</h3>
                        </div>
                        <p>Configure sua integração com WhatsApp Business</p>
                        <button class="btn btn-primary" onclick="WhatsApp.showConfigForm()">
                            <i class="fas fa-edit"></i> Configurar
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-robot"></i>
                            <h3 class="card-title">Mensagens Automáticas</h3>
                        </div>
                        <p>Configure mensagens automáticas para seus clientes</p>
                        <button class="btn btn-primary" onclick="WhatsApp.showTemplatesForm()">
                            <i class="fas fa-comment"></i> Gerenciar
                        </button>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <i class="card-icon fas fa-chart-bar"></i>
                            <h3 class="card-title">Estatísticas</h3>
                        </div>
                        <div id="whatsapp-stats">
                            <p>Mensagens enviadas hoje: <strong>0</strong></p>
                            <p>Taxa de entrega: <strong>100%</strong></p>
                        </div>
                    </div>
                </div>

                <div class="whatsapp-sections">
                    <div class="section">
                        <h3><i class="fas fa-clock"></i> Avisos de Início/Fim de Serviço</h3>
                        <p>Configure avisos automáticos para notificar clientes sobre o status dos serviços.</p>
                        <div class="toggle-section">
                            <label class="toggle">
                                <input type="checkbox" id="avisos-automaticos" checked>
                                <span class="slider"></span>
                            </label>
                            <span>Ativar avisos automáticos</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3><i class="fas fa-heart"></i> Marketing Pós-Venda</h3>
                        <p>Envie mensagens de follow-up personalizadas após a conclusão dos serviços.</p>
                        <div class="toggle-section">
                            <label class="toggle">
                                <input type="checkbox" id="marketing-pos-venda" checked>
                                <span class="slider"></span>
                            </label>
                            <span>Ativar marketing pós-venda</span>
                        </div>
                    </div>

                    <div class="section">
                        <h3><i class="fas fa-history"></i> Histórico de Mensagens</h3>
                        <div class="table-container">
                            <table class="table" id="tabela-mensagens">
                                <thead>
                                    <tr>
                                        <th>Data/Hora</th>
                                        <th>Cliente</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Mensagem</th>
                                    </tr>
                                </thead>
                                <tbody id="mensagens-tbody">
                                    <!-- Mensagens serão carregadas aqui -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    initPageFunctionality(page) {
        // Inicializar funcionalidades específicas de cada página
        try {
            switch(page) {
                case 'dashboard':
                    if (window.Dashboard) {
                        window.Dashboard.init();
                        console.log('Dashboard inicializado');
                    }
                    break;
                case 'agendamentos':
                    if (window.Agendamentos) {
                        window.Agendamentos.init();
                        console.log('Agendamentos inicializado');
                    }
                    break;
                case 'servicos':
                    if (window.Servicos) {
                        window.Servicos.init();
                        console.log('Serviços inicializado');
                    }
                    break;
                case 'ordem-servico':
                    if (window.OrdemServico) {
                        window.OrdemServico.init();
                        console.log('Ordem de Serviço inicializado');
                    }
                    break;
                case 'funcionarios':
                    if (window.Funcionarios) {
                        window.Funcionarios.init();
                        console.log('Funcionários inicializado');
                    }
                    break;
                case 'despesas':
                    if (window.Despesas) {
                        window.Despesas.init();
                        console.log('Despesas inicializado');
                    }
                    break;
                case 'whatsapp':
                    if (window.WhatsApp) {
                        window.WhatsApp.init();
                        console.log('WhatsApp inicializado');
                    }
                    break;
                case 'clientes':
                    if (window.Clientes) {
                        window.Clientes.init();
                        console.log('Clientes inicializado');
                    }
                    break;
                case 'veiculos':
                    if (window.Veiculos) {
                        window.Veiculos.init();
                        console.log('Veículos inicializado');
                    }
                    break;
                case 'financeiro':
                    if (window.Financeiro) {
                        window.Financeiro.init();
                        console.log('Financeiro inicializado');
                    }
                    break;
                case 'estoque':
                    if (window.Estoque) {
                        window.Estoque.init();
                        console.log('Estoque inicializado');
                    }
                    break;
                case 'planos':
                    if (typeof showPlanos === 'function') {
                        showPlanos();
                        console.log('Planos inicializado');
                    }
                    break;
                default:
                    console.warn('Página não reconhecida:', page);
            }
        } catch (error) {
            console.error('Erro ao inicializar funcionalidade da página:', error);
        }
    }
}

// Expor para uso global
window.Navigation = Navigation;