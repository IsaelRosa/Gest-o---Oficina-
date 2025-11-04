// Módulo Funcionários - Sistema de Gestão de RH
window.Funcionarios = {
    init: function() {
        console.log('Inicializando módulo de funcionários...');
        
        // Aguardar DataManager estar disponível
        if (!window.DataManager) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.bindEvents();
        this.loadFuncionarios();
        this.initializeDemoData();
    },

    initializeDemoData: function() {
        // Criar funcionários de demonstração se não existirem
        const funcionarios = DataManager.getAll('funcionarios');
        if (funcionarios.length === 0) {
            const demoFuncionarios = [
                {
                    id: Utils.generateId(),
                    nome: 'João Silva',
                    cpf: '123.456.789-00',
                    telefone: '(11) 99999-0001',
                    email: 'joao.silva@carservice.com',
                    cargo: 'Lavador Sênior',
                    salarioBase: 2500.00,
                    percentualComissao: 10,
                    dataAdmissao: '2024-01-15',
                    status: 'ativo',
                    endereco: 'Rua das Flores, 123 - São Paulo/SP',
                    dadosBancarios: {
                        banco: 'Banco do Brasil',
                        agencia: '1234-5',
                        conta: '12345-6',
                        tipoConta: 'Corrente'
                    },
                    beneficios: {
                        valeAlimentacao: 600.00,
                        valeTransporte: 200.00,
                        planoSaude: true
                    },
                    observacoes: 'Funcionário experiente, especialista em enceramento'
                },
                {
                    id: Utils.generateId(),
                    nome: 'Maria Santos',
                    cpf: '987.654.321-00',
                    telefone: '(11) 99999-0002',
                    email: 'maria.santos@carservice.com',
                    cargo: 'Detalhamento',
                    salarioBase: 2800.00,
                    percentualComissao: 12,
                    dataAdmissao: '2024-02-01',
                    status: 'ativo',
                    endereco: 'Av. Paulista, 456 - São Paulo/SP',
                    dadosBancarios: {
                        banco: 'Caixa Econômica',
                        agencia: '5678-9',
                        conta: '98765-4',
                        tipoConta: 'Poupança'
                    },
                    beneficios: {
                        valeAlimentacao: 600.00,
                        valeTransporte: 180.00,
                        planoSaude: true
                    },
                    observacoes: 'Especialista em detalhamento automotivo e lavagem a seco'
                },
                {
                    id: Utils.generateId(),
                    nome: 'Carlos Oliveira',
                    cpf: '456.789.123-00',
                    telefone: '(11) 99999-0003',
                    email: 'carlos.oliveira@carservice.com',
                    cargo: 'Gerente',
                    salarioBase: 4500.00,
                    percentualComissao: 5,
                    dataAdmissao: '2023-11-10',
                    status: 'ativo',
                    endereco: 'Rua Augusta, 789 - São Paulo/SP',
                    dadosBancarios: {
                        banco: 'Itaú',
                        agencia: '9876-5',
                        conta: '54321-0',
                        tipoConta: 'Corrente'
                    },
                    beneficios: {
                        valeAlimentacao: 800.00,
                        valeTransporte: 0.00,
                        planoSaude: true
                    },
                    observacoes: 'Responsável pela gestão operacional e atendimento ao cliente'
                }
            ];

            demoFuncionarios.forEach(funcionario => {
                DataManager.save('funcionarios', funcionario);
            });

            Utils.showNotification('Funcionários de demonstração criados com sucesso!', 'success');
        }
    },

    bindEvents: function() {
        // Aguardar um pouco para garantir que os elementos estejam no DOM
        setTimeout(() => {
            // Botão novo funcionário
            const btnNovo = document.getElementById('novo-funcionario');
            if (btnNovo) {
                console.log('Botão novo funcionário encontrado, adicionando event listener');
                btnNovo.addEventListener('click', () => {
                    console.log('Botão novo funcionário clicado!');
                    this.showFormFuncionario();
                });
            } else {
                console.error('Botão novo-funcionario não encontrado');
            }

            // Busca
            const buscarFuncionario = document.getElementById('buscar-funcionario');
            if (buscarFuncionario) {
                buscarFuncionario.addEventListener('input', Utils.debounce(() => this.loadFuncionarios(), 300));
            }

            // Filtro de status
            const filtroStatus = document.getElementById('filtro-status-funcionario');
            if (filtroStatus) {
                filtroStatus.addEventListener('change', () => this.loadFuncionarios());
            }
        }, 500);
    },

    loadFuncionarios: function() {
        const tbody = document.getElementById('funcionarios-tbody');
        if (!tbody) {
            console.warn('Elemento funcionarios-tbody não encontrado');
            return;
        }

        const buscarFuncionario = document.getElementById('buscar-funcionario');
        const filtroStatus = document.getElementById('filtro-status-funcionario');
        const termoBusca = buscarFuncionario ? buscarFuncionario.value.toLowerCase() : '';
        const statusFiltro = filtroStatus ? filtroStatus.value : '';

        let funcionarios = DataManager.getAll('funcionarios');

        // Aplicar filtro de busca
        if (termoBusca) {
            funcionarios = funcionarios.filter(f => 
                f.nome.toLowerCase().includes(termoBusca) ||
                f.cpf.includes(termoBusca) ||
                f.cargo.toLowerCase().includes(termoBusca) ||
                f.email.toLowerCase().includes(termoBusca)
            );
        }

        // Aplicar filtro de status
        if (statusFiltro) {
            funcionarios = funcionarios.filter(f => f.status === statusFiltro);
        }

        tbody.innerHTML = '';

        funcionarios.forEach(funcionario => {
            const row = this.createFuncionarioRow(funcionario);
            tbody.appendChild(row);
        });

        // Atualizar contador
        const total = document.getElementById('total-funcionarios');
        if (total) {
            total.textContent = funcionarios.length;
        }
    },

    createFuncionarioRow: function(funcionario) {
        const row = document.createElement('tr');
        
        const statusClass = funcionario.status === 'ativo' ? 'status-ativo' : 'status-inativo';
        const statusText = funcionario.status === 'ativo' ? 'Ativo' : 'Inativo';

        row.innerHTML = `
            <td>
                <div class="funcionario-info">
                    <div class="funcionario-avatar">
                        ${funcionario.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div class="funcionario-nome">${funcionario.nome}</div>
                        <div class="funcionario-cargo">${funcionario.cargo}</div>
                    </div>
                </div>
            </td>
            <td>${Utils.formatCPF(funcionario.cpf)}</td>
            <td>${Utils.formatPhone(funcionario.telefone)}</td>
            <td>${funcionario.email}</td>
            <td>${Utils.formatCurrency(funcionario.salarioBase)}</td>
            <td>${funcionario.percentualComissao}%</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <div class="actions">
                    <button class="btn-icon" onclick="Funcionarios.showFuncionarioDetails('${funcionario.id}')" title="Ver detalhes">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="Funcionarios.editFuncionario('${funcionario.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" onclick="Funcionarios.showComissoes('${funcionario.id}')" title="Comissões">
                        <i class="fas fa-dollar-sign"></i>
                    </button>
                    <button class="btn-icon btn-danger" onclick="Funcionarios.deleteFuncionario('${funcionario.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;

        return row;
    },

    showFormFuncionario: function(funcionarioId = null) {
        const isEdit = funcionarioId !== null;
        const funcionario = isEdit ? DataManager.getById('funcionarios', funcionarioId) : null;

        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>${isEdit ? 'Editar Funcionário' : 'Novo Funcionário'}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="funcionario-form" class="form-grid">
                    <div class="form-section">
                        <h4>Dados Pessoais</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-nome">Nome Completo *</label>
                                <input type="text" id="funcionario-nome" required 
                                    value="${funcionario ? funcionario.nome : ''}" 
                                    placeholder="Nome completo do funcionário">
                            </div>
                            <div class="form-group">
                                <label for="funcionario-cpf">CPF *</label>
                                <input type="text" id="funcionario-cpf" required 
                                    value="${funcionario ? funcionario.cpf : ''}" 
                                    placeholder="000.000.000-00">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-telefone">Telefone *</label>
                                <input type="text" id="funcionario-telefone" required 
                                    value="${funcionario ? funcionario.telefone : ''}" 
                                    placeholder="(11) 99999-9999">
                            </div>
                            <div class="form-group">
                                <label for="funcionario-email">E-mail *</label>
                                <input type="email" id="funcionario-email" required 
                                    value="${funcionario ? funcionario.email : ''}" 
                                    placeholder="funcionario@carservice.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="funcionario-endereco">Endereço</label>
                            <input type="text" id="funcionario-endereco" 
                                value="${funcionario ? funcionario.endereco : ''}" 
                                placeholder="Rua, número, bairro - Cidade/UF">
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Dados Profissionais</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-cargo">Cargo *</label>
                                <select id="funcionario-cargo" required>
                                    <option value="">Selecione o cargo</option>
                                    <option value="Lavador" ${funcionario && funcionario.cargo === 'Lavador' ? 'selected' : ''}>Lavador</option>
                                    <option value="Lavador Sênior" ${funcionario && funcionario.cargo === 'Lavador Sênior' ? 'selected' : ''}>Lavador Sênior</option>
                                    <option value="Detalhamento" ${funcionario && funcionario.cargo === 'Detalhamento' ? 'selected' : ''}>Detalhamento</option>
                                    <option value="Enceramento" ${funcionario && funcionario.cargo === 'Enceramento' ? 'selected' : ''}>Enceramento</option>
                                    <option value="Gerente" ${funcionario && funcionario.cargo === 'Gerente' ? 'selected' : ''}>Gerente</option>
                                    <option value="Supervisor" ${funcionario && funcionario.cargo === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
                                    <option value="Atendente" ${funcionario && funcionario.cargo === 'Atendente' ? 'selected' : ''}>Atendente</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="funcionario-status">Status *</label>
                                <select id="funcionario-status" required>
                                    <option value="ativo" ${funcionario && funcionario.status === 'ativo' ? 'selected' : ''}>Ativo</option>
                                    <option value="inativo" ${funcionario && funcionario.status === 'inativo' ? 'selected' : ''}>Inativo</option>
                                    <option value="ferias" ${funcionario && funcionario.status === 'ferias' ? 'selected' : ''}>Férias</option>
                                    <option value="afastado" ${funcionario && funcionario.status === 'afastado' ? 'selected' : ''}>Afastado</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-salario">Salário Base *</label>
                                <input type="number" id="funcionario-salario" required min="0" step="0.01"
                                    value="${funcionario ? funcionario.salarioBase : ''}" 
                                    placeholder="0,00">
                            </div>
                            <div class="form-group">
                                <label for="funcionario-comissao">Comissão (%) *</label>
                                <input type="number" id="funcionario-comissao" required min="0" max="100" step="0.1"
                                    value="${funcionario ? funcionario.percentualComissao : ''}" 
                                    placeholder="0.0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="funcionario-admissao">Data de Admissão *</label>
                            <input type="date" id="funcionario-admissao" required 
                                value="${funcionario ? funcionario.dataAdmissao : ''}">
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Dados Bancários</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-banco">Banco</label>
                                <input type="text" id="funcionario-banco" 
                                    value="${funcionario && funcionario.dadosBancarios ? funcionario.dadosBancarios.banco : ''}" 
                                    placeholder="Nome do banco">
                            </div>
                            <div class="form-group">
                                <label for="funcionario-agencia">Agência</label>
                                <input type="text" id="funcionario-agencia" 
                                    value="${funcionario && funcionario.dadosBancarios ? funcionario.dadosBancarios.agencia : ''}" 
                                    placeholder="0000-0">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-conta">Conta</label>
                                <input type="text" id="funcionario-conta" 
                                    value="${funcionario && funcionario.dadosBancarios ? funcionario.dadosBancarios.conta : ''}" 
                                    placeholder="00000-0">
                            </div>
                            <div class="form-group">
                                <label for="funcionario-tipo-conta">Tipo de Conta</label>
                                <select id="funcionario-tipo-conta">
                                    <option value="">Selecione</option>
                                    <option value="Corrente" ${funcionario && funcionario.dadosBancarios && funcionario.dadosBancarios.tipoConta === 'Corrente' ? 'selected' : ''}>Corrente</option>
                                    <option value="Poupança" ${funcionario && funcionario.dadosBancarios && funcionario.dadosBancarios.tipoConta === 'Poupança' ? 'selected' : ''}>Poupança</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h4>Benefícios</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="funcionario-vale-alimentacao">Vale Alimentação (R$)</label>
                                <input type="number" id="funcionario-vale-alimentacao" min="0" step="0.01"
                                    value="${funcionario && funcionario.beneficios ? funcionario.beneficios.valeAlimentacao : ''}" 
                                    placeholder="0,00">
                            </div>
                            <div class="form-group">
                                <label for="funcionario-vale-transporte">Vale Transporte (R$)</label>
                                <input type="number" id="funcionario-vale-transporte" min="0" step="0.01"
                                    value="${funcionario && funcionario.beneficios ? funcionario.beneficios.valeTransporte : ''}" 
                                    placeholder="0,00">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="funcionario-plano-saude" 
                                    ${funcionario && funcionario.beneficios && funcionario.beneficios.planoSaude ? 'checked' : ''}>
                                Plano de Saúde
                            </label>
                        </div>
                    </div>

                    <div class="form-section">
                        <div class="form-group">
                            <label for="funcionario-observacoes">Observações</label>
                            <textarea id="funcionario-observacoes" rows="3" 
                                placeholder="Observações sobre o funcionário, especialidades, etc.">${funcionario ? funcionario.observacoes || '' : ''}</textarea>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
                <button type="submit" form="funcionario-form" class="btn btn-primary">
                    ${isEdit ? 'Atualizar' : 'Cadastrar'} Funcionário
                </button>
            </div>
        `);

        // Adicionar máscara aos campos
        Utils.addInputMasks();

        // Event listener para o formulário
        document.getElementById('funcionario-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveFuncionario(funcionarioId);
        });
    },

    saveFuncionario: function(funcionarioId = null) {
        const form = document.getElementById('funcionario-form');
        const formData = new FormData(form);

        const funcionarioData = {
            id: funcionarioId || Utils.generateId(),
            nome: document.getElementById('funcionario-nome').value,
            cpf: document.getElementById('funcionario-cpf').value,
            telefone: document.getElementById('funcionario-telefone').value,
            email: document.getElementById('funcionario-email').value,
            endereco: document.getElementById('funcionario-endereco').value,
            cargo: document.getElementById('funcionario-cargo').value,
            status: document.getElementById('funcionario-status').value,
            salarioBase: parseFloat(document.getElementById('funcionario-salario').value) || 0,
            percentualComissao: parseFloat(document.getElementById('funcionario-comissao').value) || 0,
            dataAdmissao: document.getElementById('funcionario-admissao').value,
            dadosBancarios: {
                banco: document.getElementById('funcionario-banco').value,
                agencia: document.getElementById('funcionario-agencia').value,
                conta: document.getElementById('funcionario-conta').value,
                tipoConta: document.getElementById('funcionario-tipo-conta').value
            },
            beneficios: {
                valeAlimentacao: parseFloat(document.getElementById('funcionario-vale-alimentacao').value) || 0,
                valeTransporte: parseFloat(document.getElementById('funcionario-vale-transporte').value) || 0,
                planoSaude: document.getElementById('funcionario-plano-saude').checked
            },
            observacoes: document.getElementById('funcionario-observacoes').value,
            dataCadastro: funcionarioId ? undefined : new Date().toISOString(),
            dataUltimaAtualizacao: new Date().toISOString()
        };

        try {
            DataManager.save('funcionarios', funcionarioData);
            Utils.closeModal();
            this.loadFuncionarios();
            Utils.showNotification(
                funcionarioId ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!', 
                'success'
            );
        } catch (error) {
            console.error('Erro ao salvar funcionário:', error);
            Utils.showNotification('Erro ao salvar funcionário. Tente novamente.', 'error');
        }
    },

    editFuncionario: function(funcionarioId) {
        this.showFormFuncionario(funcionarioId);
    },

    deleteFuncionario: function(funcionarioId) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        if (!funcionario) return;

        if (confirm(`Tem certeza que deseja excluir o funcionário "${funcionario.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
            try {
                DataManager.delete('funcionarios', funcionarioId);
                this.loadFuncionarios();
                Utils.showNotification('Funcionário excluído com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao excluir funcionário:', error);
                Utils.showNotification('Erro ao excluir funcionário. Tente novamente.', 'error');
            }
        }
    },

    showFuncionarioDetails: function(funcionarioId) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        if (!funcionario) return;

        const dataAdmissao = new Date(funcionario.dataAdmissao);
        const tempoServico = Utils.calculateServiceTime(dataAdmissao);

        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>Detalhes do Funcionário</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="funcionario-details">
                    <div class="funcionario-header">
                        <div class="funcionario-avatar-large">
                            ${funcionario.nome.charAt(0).toUpperCase()}
                        </div>
                        <div class="funcionario-info-main">
                            <h4>${funcionario.nome}</h4>
                            <p class="cargo">${funcionario.cargo}</p>
                            <p class="tempo-servico">Tempo de serviço: ${tempoServico}</p>
                        </div>
                    </div>

                    <div class="details-grid">
                        <div class="detail-section">
                            <h5>Dados Pessoais</h5>
                            <div class="detail-item">
                                <span class="label">CPF:</span>
                                <span class="value">${Utils.formatCPF(funcionario.cpf)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Telefone:</span>
                                <span class="value">${Utils.formatPhone(funcionario.telefone)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">E-mail:</span>
                                <span class="value">${funcionario.email}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Endereço:</span>
                                <span class="value">${funcionario.endereco || 'Não informado'}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h5>Dados Profissionais</h5>
                            <div class="detail-item">
                                <span class="label">Salário Base:</span>
                                <span class="value">${Utils.formatCurrency(funcionario.salarioBase)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Comissão:</span>
                                <span class="value">${funcionario.percentualComissao}%</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Data de Admissão:</span>
                                <span class="value">${Utils.formatDate(funcionario.dataAdmissao)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Status:</span>
                                <span class="value status ${funcionario.status === 'ativo' ? 'status-ativo' : 'status-inativo'}">
                                    ${funcionario.status.charAt(0).toUpperCase() + funcionario.status.slice(1)}
                                </span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h5>Dados Bancários</h5>
                            <div class="detail-item">
                                <span class="label">Banco:</span>
                                <span class="value">${funcionario.dadosBancarios?.banco || 'Não informado'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Agência:</span>
                                <span class="value">${funcionario.dadosBancarios?.agencia || 'Não informado'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Conta:</span>
                                <span class="value">${funcionario.dadosBancarios?.conta || 'Não informado'}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Tipo:</span>
                                <span class="value">${funcionario.dadosBancarios?.tipoConta || 'Não informado'}</span>
                            </div>
                        </div>

                        <div class="detail-section">
                            <h5>Benefícios</h5>
                            <div class="detail-item">
                                <span class="label">Vale Alimentação:</span>
                                <span class="value">${Utils.formatCurrency(funcionario.beneficios?.valeAlimentacao || 0)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Vale Transporte:</span>
                                <span class="value">${Utils.formatCurrency(funcionario.beneficios?.valeTransporte || 0)}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Plano de Saúde:</span>
                                <span class="value">${funcionario.beneficios?.planoSaude ? 'Sim' : 'Não'}</span>
                            </div>
                        </div>

                        ${funcionario.observacoes ? `
                        <div class="detail-section full-width">
                            <h5>Observações</h5>
                            <p class="observacoes">${funcionario.observacoes}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="Funcionarios.editFuncionario('${funcionario.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
            </div>
        `);
    },

    showComissoes: function(funcionarioId) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        if (!funcionario) return;

        // Calcular comissões do funcionário
        const comissoes = this.calcularComissoesFuncionario(funcionarioId);
        
        const modal = Utils.createModal(`
            <div class="modal-header">
                <h3>Comissões - ${funcionario.nome}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="comissoes-summary">
                    <div class="summary-cards">
                        <div class="summary-card">
                            <h5>Este Mês</h5>
                            <p class="value">${Utils.formatCurrency(comissoes.mesAtual)}</p>
                        </div>
                        <div class="summary-card">
                            <h5>Último Mês</h5>
                            <p class="value">${Utils.formatCurrency(comissoes.mesAnterior)}</p>
                        </div>
                        <div class="summary-card">
                            <h5>Total Acumulado</h5>
                            <p class="value">${Utils.formatCurrency(comissoes.total)}</p>
                        </div>
                    </div>
                </div>

                <div class="comissoes-detalhes">
                    <h5>Serviços Realizados Este Mês</h5>
                    <div class="servicos-comissao">
                        ${comissoes.detalhes.length > 0 ? 
                            comissoes.detalhes.map(detalhe => `
                                <div class="servico-comissao-item">
                                    <div class="servico-info">
                                        <strong>OS #${detalhe.numero}</strong>
                                        <span>${detalhe.cliente}</span>
                                        <span>${Utils.formatDate(detalhe.data)}</span>
                                    </div>
                                    <div class="servico-valores">
                                        <span>Valor: ${Utils.formatCurrency(detalhe.valor)}</span>
                                        <span>Comissão: ${Utils.formatCurrency(detalhe.comissao)}</span>
                                    </div>
                                </div>
                            `).join('') 
                            : '<p>Nenhum serviço realizado este mês.</p>'
                        }
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
                <button type="button" class="btn btn-primary" onclick="Funcionarios.gerarRelatorioComissoes('${funcionarioId}')">
                    <i class="fas fa-print"></i> Relatório
                </button>
            </div>
        `);
    },

    calcularComissoesFuncionario: function(funcionarioId) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        if (!funcionario) return { mesAtual: 0, mesAnterior: 0, total: 0, detalhes: [] };

        const agendamentos = DataManager.getAll('agendamentos') || [];
        const hoje = new Date();
        const inicioMesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const inicioMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1);
        const fimMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);

        // Filtrar agendamentos do funcionário que foram concluídos
        const agendamentosFuncionario = agendamentos.filter(a => 
            a.funcionarioId === funcionarioId && 
            a.status === 'concluido' &&
            a.valor > 0
        );

        let mesAtual = 0;
        let mesAnterior = 0;
        let total = 0;
        let detalhes = [];

        agendamentosFuncionario.forEach(agendamento => {
            const dataAgendamento = new Date(agendamento.data);
            const comissao = (agendamento.valor * funcionario.percentualComissao) / 100;
            
            total += comissao;

            if (dataAgendamento >= inicioMesAtual) {
                mesAtual += comissao;
                detalhes.push({
                    numero: agendamento.id,
                    cliente: agendamento.cliente,
                    data: agendamento.data,
                    valor: agendamento.valor,
                    comissao: comissao
                });
            } else if (dataAgendamento >= inicioMesAnterior && dataAgendamento <= fimMesAnterior) {
                mesAnterior += comissao;
            }
        });

        return { mesAtual, mesAnterior, total, detalhes };
    },

    gerarRelatorioComissoes: function(funcionarioId) {
        const funcionario = DataManager.getById('funcionarios', funcionarioId);
        const comissoes = this.calcularComissoesFuncionario(funcionarioId);
        
        // Aqui você pode implementar a geração de PDF ou impressão
        Utils.showNotification('Funcionalidade de relatório em desenvolvimento!', 'info');
    }
};

// Utilitários específicos para funcionários
Utils.calculateServiceTime = function(dataAdmissao) {
    const agora = new Date();
    const admissao = new Date(dataAdmissao);
    const diffTime = Math.abs(agora - admissao);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
        return `${diffDays} dias`;
    } else if (diffDays < 365) {
        const meses = Math.floor(diffDays / 30);
        return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    } else {
        const anos = Math.floor(diffDays / 365);
        const mesesRestantes = Math.floor((diffDays % 365) / 30);
        return `${anos} ${anos === 1 ? 'ano' : 'anos'}${mesesRestantes > 0 ? ` e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}` : ''}`;
    }
};

Utils.formatCPF = function(cpf) {
    if (!cpf) return '';
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};