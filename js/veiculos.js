// Módulo Veículos
window.Veiculos = {
    init: function() {
        this.bindEvents();
        this.loadVeiculos();
    },

    bindEvents: function() {
        // Botão novo veículo
        const btnNovo = document.getElementById('novo-veiculo');
        if (btnNovo) {
            btnNovo.addEventListener('click', () => this.showFormVeiculo());
        }

        // Busca
        const buscarVeiculo = document.getElementById('buscar-veiculo');
        if (buscarVeiculo) {
            buscarVeiculo.addEventListener('input', Utils.debounce(() => this.loadVeiculos(), 300));
        }
    },

    loadVeiculos: function() {
        const tbody = document.getElementById('veiculos-tbody');
        if (!tbody) return;

        const buscarVeiculo = document.getElementById('buscar-veiculo');
        const termoBusca = buscarVeiculo ? buscarVeiculo.value.toLowerCase() : '';

        let veiculos = DataManager.getAll('veiculos') || [];

        // Aplicar filtro de busca
        if (termoBusca) {
            veiculos = veiculos.filter(v => 
                v.marca.toLowerCase().includes(termoBusca) ||
                v.modelo.toLowerCase().includes(termoBusca) ||
                v.placa.toLowerCase().includes(termoBusca) ||
                v.proprietario.toLowerCase().includes(termoBusca)
            );
        }

        if (veiculos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum veículo encontrado</td></tr>';
            return;
        }

        const html = veiculos.map(veiculo => `
            <tr>
                <td data-label="Veículo">${veiculo.marca} ${veiculo.modelo}</td>
                <td data-label="Placa">${veiculo.placa}</td>
                <td data-label="Ano">${veiculo.ano}</td>
                <td data-label="Proprietário">${veiculo.proprietario}</td>
                <td data-label="Última Manutenção">${veiculo.ultimaManutencao ? Utils.formatDate(veiculo.ultimaManutencao) : 'Nunca'}</td>
                <td data-label="Ações" class="actions-cell">
                    <div class="actions-buttons">
                        <button class="btn btn-warning" onclick="Veiculos.editVeiculo(${veiculo.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn" onclick="Veiculos.viewVeiculo(${veiculo.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-danger" onclick="Veiculos.deleteVeiculo(${veiculo.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.innerHTML = html;
    },

    showFormVeiculo: function(veiculo = null) {
        const isEdit = veiculo !== null;
        const title = isEdit ? 'Editar Veículo' : 'Novo Veículo';

        const clientes = DataManager.getAll('clientes');
        const clientesOptions = clientes.map(c => 
            `<option value="${c.nome}" ${isEdit && veiculo.proprietario === c.nome ? 'selected' : ''}>${c.nome}</option>`
        ).join('');

        const content = `
            <form id="form-veiculo">
                <div class="form-group">
                    <label>Marca:</label>
                    <input type="text" id="marca" required value="${isEdit ? veiculo.marca : ''}" placeholder="Ex: Honda">
                </div>
                <div class="form-group">
                    <label>Modelo:</label>
                    <input type="text" id="modelo" required value="${isEdit ? veiculo.modelo : ''}" placeholder="Ex: Civic">
                </div>
                <div class="form-group">
                    <label>Ano:</label>
                    <input type="number" id="ano" required min="1900" max="2030" value="${isEdit ? veiculo.ano : ''}" placeholder="2020">
                </div>
                <div class="form-group">
                    <label>Placa:</label>
                    <input type="text" id="placa" required value="${isEdit ? veiculo.placa : ''}" placeholder="ABC-1234">
                </div>
                <div class="form-group">
                    <label>Cor:</label>
                    <input type="text" id="cor" value="${isEdit ? veiculo.cor || '' : ''}" placeholder="Ex: Branco">
                </div>
                <div class="form-group">
                    <label>Combustível:</label>
                    <select id="combustivel">
                        <option value="Gasolina" ${isEdit && veiculo.combustivel === 'Gasolina' ? 'selected' : ''}>Gasolina</option>
                        <option value="Etanol" ${isEdit && veiculo.combustivel === 'Etanol' ? 'selected' : ''}>Etanol</option>
                        <option value="Flex" ${isEdit && veiculo.combustivel === 'Flex' ? 'selected' : ''}>Flex</option>
                        <option value="Diesel" ${isEdit && veiculo.combustivel === 'Diesel' ? 'selected' : ''}>Diesel</option>
                        <option value="GNV" ${isEdit && veiculo.combustivel === 'GNV' ? 'selected' : ''}>GNV</option>
                        <option value="Elétrico" ${isEdit && veiculo.combustivel === 'Elétrico' ? 'selected' : ''}>Elétrico</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Proprietário:</label>
                    <select id="proprietario" required>
                        <option value="">Selecione um cliente</option>
                        ${clientesOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label>Quilometragem:</label>
                    <input type="number" id="quilometragem" min="0" value="${isEdit ? veiculo.quilometragem || '' : ''}" placeholder="50000">
                </div>
                <div class="form-group">
                    <label>Observações:</label>
                    <textarea id="observacoes" placeholder="Observações sobre o veículo">${isEdit ? veiculo.observacoes || '' : ''}</textarea>
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
        const form = document.getElementById('form-veiculo');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVeiculo(modal, isEdit ? veiculo.id : null);
        });
    },

    saveVeiculo: function(modal, id = null) {
        const data = {
            marca: document.getElementById('marca').value.trim(),
            modelo: document.getElementById('modelo').value.trim(),
            ano: parseInt(document.getElementById('ano').value),
            placa: document.getElementById('placa').value.trim().toUpperCase(),
            cor: document.getElementById('cor').value.trim(),
            combustivel: document.getElementById('combustivel').value,
            proprietario: document.getElementById('proprietario').value,
            quilometragem: document.getElementById('quilometragem').value ? parseInt(document.getElementById('quilometragem').value) : null,
            observacoes: document.getElementById('observacoes').value.trim(),
            ultimaManutencao: id ? DataManager.getById('veiculos', id)?.ultimaManutencao : null
        };

        // Validações
        if (!data.marca || !data.modelo || !data.ano || !data.placa || !data.proprietario) {
            Utils.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        // Validar formato da placa (formato antigo ABC-1234 ou novo ABC1D234)
        if (!this.validarPlaca(data.placa)) {
            Utils.showNotification('Formato de placa inválido! Use ABC-1234 ou ABC1D23', 'error');
            return;
        }

        // Verificar placa duplicada
        if (!id || (id && DataManager.getById('veiculos', id).placa !== data.placa)) {
            if (this.verificarPlacaExistente(data.placa)) {
                Utils.showNotification('Já existe um veículo com esta placa!', 'error');
                return;
            }
        }

        if (id) {
            DataManager.update('veiculos', id, data);
            Utils.showNotification('Veículo atualizado com sucesso!', 'success');
        } else {
            DataManager.add('veiculos', data);
            Utils.showNotification('Veículo criado com sucesso!', 'success');
            
            // Atualizar contador de veículos do cliente
            this.atualizarContadorVeiculosCliente(data.proprietario, 1);
        }

        Modal.hide(modal);
        this.loadVeiculos();
    },

    validarPlaca: function(placa) {
        // Formato antigo: ABC-1234
        const formatoAntigo = /^[A-Z]{3}-\d{4}$/;
        // Formato Mercosul: ABC1D23
        const formatoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
        
        return formatoAntigo.test(placa) || formatoMercosul.test(placa);
    },

    verificarPlacaExistente: function(placa) {
        const veiculos = DataManager.getAll('veiculos') || [];
        return veiculos.some(v => v.placa === placa);
    },

    atualizarContadorVeiculosCliente: function(nomeCliente, incremento) {
        const clientes = DataManager.getAll('clientes');
        const cliente = clientes.find(c => c.nome === nomeCliente);
        if (cliente) {
            const novoTotal = (cliente.veiculos || 0) + incremento;
            DataManager.update('clientes', cliente.id, { veiculos: Math.max(0, novoTotal) });
        }
    },

    viewVeiculo: function(id) {
        const veiculo = DataManager.getById('veiculos', id);
        if (!veiculo) return;

        // Buscar agendamentos do veículo
        const agendamentos = DataManager.getAll('agendamentos')
            .filter(a => a.veiculo.includes(veiculo.marca) && a.veiculo.includes(veiculo.modelo))
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
                <h3>Informações do Veículo</h3>
                <div style="margin-bottom: 2rem;">
                    <p><strong>Marca/Modelo:</strong> ${veiculo.marca} ${veiculo.modelo}</p>
                    <p><strong>Ano:</strong> ${veiculo.ano}</p>
                    <p><strong>Placa:</strong> ${veiculo.placa}</p>
                    <p><strong>Cor:</strong> ${veiculo.cor || 'Não informado'}</p>
                    <p><strong>Combustível:</strong> ${veiculo.combustivel}</p>
                    <p><strong>Proprietário:</strong> ${veiculo.proprietario}</p>
                    <p><strong>Quilometragem:</strong> ${veiculo.quilometragem ? veiculo.quilometragem.toLocaleString() + ' km' : 'Não informado'}</p>
                    <p><strong>Última Manutenção:</strong> ${veiculo.ultimaManutencao ? Utils.formatDate(veiculo.ultimaManutencao) : 'Nunca'}</p>
                    ${veiculo.observacoes ? `<p><strong>Observações:</strong> ${veiculo.observacoes}</p>` : ''}
                </div>

                <h3>Histórico de Serviços</h3>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${agendamentosHtml}
                </div>
            </div>
        `;

        Modal.show(content, `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`);
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

    editVeiculo: function(id) {
        const veiculo = DataManager.getById('veiculos', id);
        if (veiculo) {
            this.showFormVeiculo(veiculo);
        }
    },

    deleteVeiculo: function(id) {
        const veiculo = DataManager.getById('veiculos', id);
        if (!veiculo) return;

        Utils.confirm('Tem certeza que deseja excluir este veículo?', () => {
            // Atualizar contador de veículos do cliente
            this.atualizarContadorVeiculosCliente(veiculo.proprietario, -1);
            
            DataManager.delete('veiculos', id);
            Utils.showNotification('Veículo excluído com sucesso!', 'success');
            this.loadVeiculos();
        });
    }
};