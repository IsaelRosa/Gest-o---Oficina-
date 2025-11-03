// Módulo Clientes
window.Clientes = {
    init: function() {
        console.log('Inicializando módulo de clientes...');
        
        // Aguardar DataManager estar disponível
        if (!window.DataManager) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.bindEvents();
        this.loadClientes();
    },

    bindEvents: function() {
        // Botão novo cliente
        const btnNovo = document.getElementById('novo-cliente');
        if (btnNovo) {
            btnNovo.addEventListener('click', () => this.showFormCliente());
            console.log('Event listener adicionado ao botão novo cliente');
        } else {
            console.warn('Botão novo-cliente não encontrado');
        }

        // Busca
        const buscarCliente = document.getElementById('buscar-cliente');
        if (buscarCliente) {
            buscarCliente.addEventListener('input', Utils.debounce(() => this.loadClientes(), 300));
        }
    },

    loadClientes: function() {
        const tbody = document.getElementById('clientes-tbody');
        if (!tbody) {
            console.warn('Elemento clientes-tbody não encontrado');
            return;
        }

        const buscarCliente = document.getElementById('buscar-cliente');
        const termoBusca = buscarCliente ? buscarCliente.value.toLowerCase() : '';

        let clientes = DataManager.getAll('clientes');
        console.log('Clientes carregados:', clientes.length);

        // Aplicar filtro de busca
        if (termoBusca) {
            clientes = clientes.filter(c => 
                c.nome.toLowerCase().includes(termoBusca) ||
                c.telefone.includes(termoBusca) ||
                (c.email && c.email.toLowerCase().includes(termoBusca))
            );
        }

        if (clientes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum cliente encontrado</td></tr>';
            return;
        }

        const html = clientes.map(cliente => `
            <tr>
                <td>${cliente.nome}</td>
                <td>${cliente.telefone}</td>
                <td>${cliente.email}</td>
                <td>${cliente.veiculos || 0}</td>
                <td>${cliente.ultimaVisita ? Utils.formatDate(cliente.ultimaVisita) : 'Nunca'}</td>
                <td>
                    <button class="btn btn-warning" onclick="Clientes.editCliente(${cliente.id})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn" onclick="Clientes.viewCliente(${cliente.id})" title="Visualizar">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-danger" onclick="Clientes.deleteCliente(${cliente.id})" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    },

    showFormCliente: function(cliente = null) {
        const isEdit = cliente !== null;
        const title = isEdit ? 'Editar Cliente' : 'Novo Cliente';

        const content = `
            <form id="form-cliente">
                <div class="form-group">
                    <label>Nome Completo:</label>
                    <input type="text" id="nome" required value="${isEdit ? cliente.nome : ''}" placeholder="Nome completo do cliente">
                </div>
                <div class="form-group">
                    <label>Telefone:</label>
                    <input type="tel" id="telefone" required value="${isEdit ? cliente.telefone : ''}" placeholder="(11) 99999-9999">
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="email" required value="${isEdit ? cliente.email : ''}" placeholder="cliente@email.com">
                </div>
                <div class="form-group">
                    <label>CPF:</label>
                    <input type="text" id="cpf" value="${isEdit ? cliente.cpf || '' : ''}" placeholder="000.000.000-00">
                </div>
                <div class="form-group">
                    <label>Endereço:</label>
                    <textarea id="endereco" placeholder="Endereço completo">${isEdit ? cliente.endereco || '' : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Data de Nascimento:</label>
                    <input type="date" id="dataNascimento" value="${isEdit ? cliente.dataNascimento || '' : ''}">
                </div>
                <div class="flex gap-1">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Salvar'}
                    </button>
                    <button type="button" class="btn" onclick="Modal.hide(this.closest('.modal'))">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `;

        const modal = Modal.show(content, title);

        // Event listener para o formulário
        const form = document.getElementById('form-cliente');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCliente(modal, isEdit ? cliente.id : null);
        });
    },

    saveCliente: function(modal, id = null) {
        const data = {
            nome: document.getElementById('nome').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            email: document.getElementById('email').value.trim().toLowerCase(),
            cpf: document.getElementById('cpf').value.trim(),
            endereco: document.getElementById('endereco').value.trim(),
            dataNascimento: document.getElementById('dataNascimento').value,
            veiculos: id ? DataManager.getById('clientes', id).veiculos : 0,
            ultimaVisita: id ? DataManager.getById('clientes', id).ultimaVisita : null
        };

        // Validações
        if (!data.nome || !data.telefone || !data.email) {
            Utils.showNotification('Por favor, preencha os campos obrigatórios (Nome, Telefone e Email)!', 'error');
            return;
        }

        // Validar formato do email
        if (!this.validarEmail(data.email)) {
            Utils.showNotification('Por favor, insira um email válido!', 'error');
            return;
        }

        // Verificar duplicatas (apenas para novos clientes ou quando alterando dados únicos)
        if (!id || (id && DataManager.getById('clientes', id).email !== data.email)) {
            if (this.verificarEmailExistente(data.email)) {
                Utils.showNotification('Já existe um cliente com este email!', 'error');
                return;
            }
        }

        if (id) {
            DataManager.update('clientes', id, data);
            Utils.showNotification('Cliente atualizado com sucesso!', 'success');
        } else {
            DataManager.add('clientes', data);
            Utils.showNotification('Cliente criado com sucesso!', 'success');
        }

        Modal.hide(modal);
        this.loadClientes();
    },

    validarEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    verificarEmailExistente: function(email) {
        const clientes = DataManager.getAll('clientes');
        return clientes.some(c => c.email === email);
    },

    viewCliente: function(id) {
        const cliente = DataManager.getById('clientes', id);
        if (!cliente) return;

        // Buscar agendamentos do cliente
        const agendamentos = DataManager.getAll('agendamentos')
            .filter(a => a.cliente === cliente.nome)
            .sort((a, b) => new Date(b.data) - new Date(a.data));

        const agendamentosHtml = agendamentos.length > 0 ? 
            agendamentos.map(a => `
                <div style="border-left: 3px solid #3498db; padding-left: 1rem; margin-bottom: 1rem;">
                    <div><strong>${a.servico}</strong></div>
                    <div style="color: #666;">${Utils.formatDate(a.data)} - ${a.hora}</div>
                    <div><span class="status status-${a.status}">${this.getStatusText(a.status)}</span></div>
                </div>
            `).join('') : '<p>Nenhum agendamento encontrado</p>';

        const content = `
            <div>
                <h3>Informações Pessoais</h3>
                <div style="margin-bottom: 2rem;">
                    <p><strong>Nome:</strong> ${cliente.nome}</p>
                    <p><strong>Telefone:</strong> ${cliente.telefone}</p>
                    <p><strong>Email:</strong> ${cliente.email}</p>
                    ${cliente.cpf ? `<p><strong>CPF:</strong> ${cliente.cpf}</p>` : ''}
                    ${cliente.endereco ? `<p><strong>Endereço:</strong> ${cliente.endereco}</p>` : ''}
                    ${cliente.dataNascimento ? `<p><strong>Data de Nascimento:</strong> ${Utils.formatDate(cliente.dataNascimento)}</p>` : ''}
                    <p><strong>Última Visita:</strong> ${cliente.ultimaVisita ? Utils.formatDate(cliente.ultimaVisita) : 'Nunca'}</p>
                </div>

                <h3>Histórico de Agendamentos</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${agendamentosHtml}
                </div>
            </div>
        `;

        Modal.show(content, `Cliente: ${cliente.nome}`);
    },

    getStatusText: function(status) {
        const statusMap = {
            'agendado': 'Agendado',
            'em-andamento': 'Em Andamento',
            'concluido': 'Concluído',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    },

    editCliente: function(id) {
        const cliente = DataManager.getById('clientes', id);
        if (cliente) {
            this.showFormCliente(cliente);
        }
    },

    deleteCliente: function(id) {
        Utils.confirm('Tem certeza que deseja excluir este cliente?', () => {
            DataManager.delete('clientes', id);
            Utils.showNotification('Cliente excluído com sucesso!', 'success');
            this.loadClientes();
        });
    }
};