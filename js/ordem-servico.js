// Sistema de Ordem de Serviço - Inspirado no JumpCar
const OrdemServico = {
    init: function() {
        console.log('Inicializando Sistema de Ordem de Serviço...');
        this.loadOrdemServicos();
        this.bindEvents();
    },

    bindEvents: function() {
        // Event listeners para busca e filtros
        const buscarOS = document.getElementById('buscar-os');
        const filtroStatus = document.getElementById('filtro-status-os');

        if (buscarOS) {
            buscarOS.addEventListener('input', () => this.loadOrdemServicos());
        }

        if (filtroStatus) {
            filtroStatus.addEventListener('change', () => this.loadOrdemServicos());
        }
    },

    loadOrdemServicos: function() {
        const grid = document.getElementById('os-grid');
        if (!grid) return;

        const buscarOS = document.getElementById('buscar-os');
        const filtroStatus = document.getElementById('filtro-status-os');
        const termoBusca = buscarOS ? buscarOS.value.toLowerCase() : '';
        const statusFiltro = filtroStatus ? filtroStatus.value : '';

        let ordensServico = DataManager.getAll('ordens-servico');

        // Aplicar filtro de busca
        if (termoBusca) {
            ordensServico = ordensServico.filter(os => 
                os.numero.toString().includes(termoBusca) ||
                os.cliente.toLowerCase().includes(termoBusca) ||
                os.veiculo.toLowerCase().includes(termoBusca)
            );
        }

        // Aplicar filtro de status
        if (statusFiltro) {
            ordensServico = ordensServico.filter(os => os.status === statusFiltro);
        }

        if (ordensServico.length === 0) {
            grid.innerHTML = '<div class="card"><p>Nenhuma ordem de serviço encontrada</p></div>';
            return;
        }

        const html = ordensServico.map(os => {
            const statusColor = this.getStatusColor(os.status);
            const valorTotal = os.servicos.reduce((total, s) => total + s.preco, 0);
            
            return `
                <div class="card os-card">
                    <div class="card-header">
                        <div>
                            <h3 class="card-title">OS #${os.numero}</h3>
                            <small style="color: #666;">${Utils.formatDate(os.dataAbertura)}</small>
                        </div>
                        <span class="status-badge" style="background-color: ${statusColor}">${os.status}</span>
                    </div>
                    
                    <div class="os-info">
                        <div class="info-row">
                            <i class="fas fa-user"></i>
                            <strong>Cliente:</strong> ${os.cliente}
                        </div>
                        <div class="info-row">
                            <i class="fas fa-car"></i>
                            <strong>Veículo:</strong> ${os.veiculo}
                        </div>
                        <div class="info-row">
                            <i class="fas fa-tools"></i>
                            <strong>Serviços:</strong> ${os.servicos.length} item(s)
                        </div>
                        <div class="info-row">
                            <i class="fas fa-dollar-sign"></i>
                            <strong>Total:</strong> ${Utils.formatCurrency(valorTotal)}
                        </div>
                    </div>

                    <div class="os-actions">
                        <button class="btn btn-info btn-sm" onclick="OrdemServico.viewOS(${os.id})" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="OrdemServico.editOS(${os.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-success btn-sm" onclick="OrdemServico.printOS(${os.id})" title="Imprimir PDF">
                            <i class="fas fa-print"></i>
                        </button>
                        ${os.status !== 'Entregue' ? `
                            <button class="btn btn-primary btn-sm" onclick="OrdemServico.avancarStatus(${os.id})" title="Avançar Status">
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = html;
    },

    getStatusColor: function(status) {
        const colors = {
            'Aguardando': '#f39c12',
            'Em Andamento': '#3498db',
            'Concluído': '#27ae60',
            'Entregue': '#2c3e50'
        };
        return colors[status] || '#95a5a6';
    },

    showFormOS: function(os = null) {
        const isEdit = os !== null;
        const title = isEdit ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço';

        // Buscar clientes e veículos para os selects
        const clientes = DataManager.getAll('clientes');
        const veiculos = DataManager.getAll('veiculos');
        const servicos = DataManager.getAll('servicos');

        const clientesOptions = clientes.map(c => 
            `<option value="${c.nome}" ${isEdit && os.cliente === c.nome ? 'selected' : ''}>${c.nome}</option>`
        ).join('');

        const veiculosOptions = veiculos.map(v => 
            `<option value="${v.marca} ${v.modelo} - ${v.placa}" ${isEdit && os.veiculo === `${v.marca} ${v.modelo} - ${v.placa}` ? 'selected' : ''}>${v.marca} ${v.modelo} - ${v.placa}</option>`
        ).join('');

        const servicosOptions = servicos.map(s => 
            `<option value="${s.id}" data-preco="${s.preco}">${s.nome} - ${Utils.formatCurrency(s.preco)}</option>`
        ).join('');

        const content = `
            <form id="form-os" class="os-form">
                <div class="form-row">
                    <div class="form-group">
                        <label>Número da OS:</label>
                        <input type="text" id="numero" readonly value="${isEdit ? os.numero : this.gerarNumeroOS()}" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Data de Abertura:</label>
                        <input type="date" id="dataAbertura" required value="${isEdit ? os.dataAbertura : new Date().toISOString().split('T')[0]}" class="form-control">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente:</label>
                        <input type="text" id="cliente" required value="${isEdit ? os.cliente : ''}" placeholder="Digite o nome do cliente..." class="form-control">
                    </div>
                    <div class="form-group">
                        <label>Veículo:</label>
                        <input type="text" id="veiculo" required value="${isEdit ? os.veiculo : ''}" placeholder="Digite o modelo do veículo..." class="form-control">
                    </div>
                </div>

                <div class="form-group">
                    <label>Observações/Problema Relatado:</label>
                    <textarea id="observacoes" class="form-control" rows="3" placeholder="Descreva o problema relatado pelo cliente...">${isEdit ? os.observacoes || '' : ''}</textarea>
                </div>

                <div class="checklist-section">
                    <h4><i class="fas fa-clipboard-check"></i> Checklist de Avarias</h4>
                    <p class="section-description">Registre as condições do veículo antes do atendimento</p>
                    
                    <div class="checklist-tabs">
                        <button type="button" class="checklist-tab active" data-tab="externo">
                            <i class="fas fa-car"></i> Externo
                        </button>
                        <button type="button" class="checklist-tab" data-tab="interno">
                            <i class="fas fa-chair"></i> Interno
                        </button>
                        <button type="button" class="checklist-tab" data-tab="fotos">
                            <i class="fas fa-camera"></i> Fotos
                        </button>
                    </div>

                    <div class="checklist-content active" id="checklist-externo">
                        <div class="checklist-grid">
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-para-choque-dianteiro"> Para-choque dianteiro
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-para-choque-traseiro"> Para-choque traseiro
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-porta-direita"> Porta direita
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-porta-esquerda"> Porta esquerda
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-capo"> Capô
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-teto"> Teto
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-para-brisa"> Para-brisa
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-vidro-traseiro"> Vidro traseiro
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-espelhos"> Espelhos retrovisores
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-pneus"> Pneus e rodas
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>

                    <div class="checklist-content" id="checklist-interno">
                        <div class="checklist-grid">
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-painel"> Painel
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-volante"> Volante
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-bancos"> Bancos
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-carpete"> Carpete/Tapetes
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-console"> Console central
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-portas-internas"> Forros das portas
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-teto-interno"> Forro do teto
                                <span class="checkmark"></span>
                            </label>
                            <label class="checklist-item">
                                <input type="checkbox" id="avaria-porta-malas"> Porta-malas
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>

                    <div class="checklist-content" id="checklist-fotos">
                        <div class="fotos-section">
                            <p class="fotos-instruction">Adicione fotos do veículo para documentar o estado atual</p>
                            <div class="fotos-upload">
                                <input type="file" id="fotos-veiculo" multiple accept="image/*" style="display: none;">
                                <button type="button" class="btn btn-secondary" onclick="document.getElementById('fotos-veiculo').click()">
                                    <i class="fas fa-camera"></i> Adicionar Fotos
                                </button>
                            </div>
                            <div id="fotos-preview" class="fotos-preview">
                                <!-- Fotos serão exibidas aqui -->
                            </div>
                        </div>
                    </div>

                    <div class="avarias-observacoes">
                        <label>Observações das Avarias:</label>
                        <textarea id="observacoes-avarias" class="form-control" rows="3" placeholder="Descreva detalhadamente as avarias encontradas...">${isEdit ? os.observacoesAvarias || '' : ''}</textarea>
                    </div>
                </div>

                <div class="servicos-section">
                    <h4>Serviços</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <select id="servico-select" class="form-control">
                                <option value="">Selecione um serviço</option>
                                ${servicosOptions}
                            </select>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-primary" onclick="OrdemServico.adicionarServico()">
                                <i class="fas fa-plus"></i> Adicionar
                            </button>
                        </div>
                    </div>
                    
                    <div id="servicos-lista" class="servicos-lista">
                        <!-- Serviços adicionados serão listados aqui -->
                    </div>
                    
                    <div class="total-section">
                        <h3>Total: <span id="total-os">R$ 0,00</span></h3>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Status:</label>
                        <select id="status" class="form-control">
                            <option value="Aguardando" ${isEdit && os.status === 'Aguardando' ? 'selected' : ''}>Aguardando</option>
                            <option value="Em Andamento" ${isEdit && os.status === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
                            <option value="Concluído" ${isEdit && os.status === 'Concluído' ? 'selected' : ''}>Concluído</option>
                            <option value="Entregue" ${isEdit && os.status === 'Entregue' ? 'selected' : ''}>Entregue</option>
                        </select>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> ${isEdit ? 'Atualizar' : 'Salvar'} OS
                    </button>
                    <button type="button" class="btn" onclick="Modal.hide(this.closest('.modal'))">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `;

        const modal = Modal.show(content, title, 'large');

        // Inicializar serviços se for edição
        if (isEdit && os.servicos) {
            this.servicosAdicionados = [...os.servicos];
            this.atualizarListaServicos();
            this.calcularTotal();
            
            // Carregar checklist se existir
            if (os.checklist) {
                this.carregarChecklist(os.checklist);
            }
        } else {
            this.servicosAdicionados = [];
        }

        // Inicializar funcionalidades do checklist
        this.initChecklistTabs();
        this.initFotosUpload();

        // Event listener para o formulário
        const form = document.getElementById('form-os');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveOS(modal, isEdit ? os.id : null);
        });

        // Configurar autocomplete após criar o modal
        setTimeout(() => {
            this.setupFormAutocomplete();
        }, 100);
    },

    setupFormAutocomplete: function() {
        // Autocomplete para cliente
        Autocomplete.createClienteAutocomplete('cliente', {
            onSelect: (cliente) => {
                // Atualizar autocomplete de veículos baseado no cliente selecionado
                Autocomplete.updateVeiculosByCliente('veiculo', cliente.nome);
            }
        });

        // Autocomplete para veículo
        Autocomplete.createVeiculoAutocomplete('veiculo');

        // Listener para mudanças no campo cliente (manual)
        const clienteInput = document.getElementById('cliente');
        if (clienteInput) {
            let timeoutId;
            clienteInput.addEventListener('input', () => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    const clienteNome = clienteInput.value.trim();
                    if (clienteNome) {
                        Autocomplete.updateVeiculosByCliente('veiculo', clienteNome);
                    }
                }, 500);
            });
        }
    },

    gerarNumeroOS: function() {
        const osExistentes = DataManager.getAll('ordens-servico');
        const ultimoNumero = osExistentes.length > 0 
            ? Math.max(...osExistentes.map(os => parseInt(os.numero))) 
            : 0;
        return (ultimoNumero + 1).toString().padStart(4, '0');
    },

    servicosAdicionados: [],

    adicionarServico: function() {
        const servicoSelect = document.getElementById('servico-select');
        const servicoId = servicoSelect.value;
        
        if (!servicoId) {
            Utils.showNotification('Selecione um serviço!', 'error');
            return;
        }

        const servico = DataManager.getById('servicos', parseInt(servicoId));
        if (!servico) {
            Utils.showNotification('Serviço não encontrado!', 'error');
            return;
        }

        // Verificar se o serviço já foi adicionado
        if (this.servicosAdicionados.some(s => s.id === servico.id)) {
            Utils.showNotification('Este serviço já foi adicionado!', 'warning');
            return;
        }

        this.servicosAdicionados.push(servico);
        this.atualizarListaServicos();
        this.calcularTotal();
        
        // Limpar select
        servicoSelect.value = '';
    },

    removerServico: function(servicoId) {
        this.servicosAdicionados = this.servicosAdicionados.filter(s => s.id !== servicoId);
        this.atualizarListaServicos();
        this.calcularTotal();
    },

    atualizarListaServicos: function() {
        const lista = document.getElementById('servicos-lista');
        if (!lista) return;

        if (this.servicosAdicionados.length === 0) {
            lista.innerHTML = '<p class="no-services">Nenhum serviço adicionado</p>';
            return;
        }

        const html = this.servicosAdicionados.map(servico => `
            <div class="servico-item">
                <div class="servico-info">
                    <strong>${servico.nome}</strong>
                    <span class="servico-preco">${Utils.formatCurrency(servico.preco)}</span>
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="OrdemServico.removerServico(${servico.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        lista.innerHTML = html;
    },

    calcularTotal: function() {
        const total = this.servicosAdicionados.reduce((sum, servico) => sum + servico.preco, 0);
        const totalElement = document.getElementById('total-os');
        if (totalElement) {
            totalElement.textContent = Utils.formatCurrency(total);
        }
    },

    initChecklistTabs: function() {
        const tabButtons = document.querySelectorAll('.checklist-tab');
        const tabContents = document.querySelectorAll('.checklist-content');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Remover ativo de todas as abas
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Ativar aba selecionada
                btn.classList.add('active');
                document.getElementById(`checklist-${tab}`).classList.add('active');
            });
        });
    },

    initFotosUpload: function() {
        const fotosInput = document.getElementById('fotos-veiculo');
        if (fotosInput) {
            fotosInput.addEventListener('change', (e) => {
                this.handleFotosUpload(e.target.files);
            });
        }
    },

    fotosVeiculo: [],

    handleFotosUpload: function(files) {
        const preview = document.getElementById('fotos-preview');
        if (!preview) return;

        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const fotoData = {
                        id: Date.now() + Math.random(),
                        nome: file.name,
                        data: e.target.result,
                        timestamp: new Date().toISOString()
                    };
                    
                    this.fotosVeiculo.push(fotoData);
                    this.updateFotosPreview();
                };
                reader.readAsDataURL(file);
            }
        });
    },

    updateFotosPreview: function() {
        const preview = document.getElementById('fotos-preview');
        if (!preview) return;

        if (this.fotosVeiculo.length === 0) {
            preview.innerHTML = '<p class="no-photos">Nenhuma foto adicionada</p>';
            return;
        }

        const html = this.fotosVeiculo.map(foto => `
            <div class="foto-item" data-id="${foto.id}">
                <img src="${foto.data}" alt="${foto.nome}" class="foto-thumbnail">
                <div class="foto-info">
                    <span class="foto-nome">${foto.nome}</span>
                    <span class="foto-timestamp">${Utils.formatDateTime(foto.timestamp)}</span>
                </div>
                <button type="button" class="btn btn-danger btn-sm" onclick="OrdemServico.removerFoto('${foto.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        preview.innerHTML = html;
    },

    removerFoto: function(fotoId) {
        this.fotosVeiculo = this.fotosVeiculo.filter(foto => foto.id !== fotoId);
        this.updateFotosPreview();
    },

    coletarChecklist: function() {
        const checkboxes = document.querySelectorAll('#form-os input[type="checkbox"]');
        const checklist = {};
        
        checkboxes.forEach(checkbox => {
            if (checkbox.id.startsWith('avaria-')) {
                checklist[checkbox.id] = checkbox.checked;
            }
        });

        return {
            avarias: checklist,
            observacoes: document.getElementById('observacoes-avarias')?.value || '',
            fotos: [...this.fotosVeiculo]
        };
    },

    carregarChecklist: function(checklist) {
        if (!checklist) return;

        // Carregar avarias marcadas
        if (checklist.avarias) {
            Object.keys(checklist.avarias).forEach(id => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = checklist.avarias[id];
                }
            });
        }

        // Carregar observações
        if (checklist.observacoes) {
            const observacoesElement = document.getElementById('observacoes-avarias');
            if (observacoesElement) {
                observacoesElement.value = checklist.observacoes;
            }
        }

        // Carregar fotos
        if (checklist.fotos) {
            this.fotosVeiculo = [...checklist.fotos];
            this.updateFotosPreview();
        }
    },

    saveOS: function(modal, id = null) {
        const data = {
            numero: document.getElementById('numero').value,
            dataAbertura: document.getElementById('dataAbertura').value,
            cliente: document.getElementById('cliente').value,
            veiculo: document.getElementById('veiculo').value,
            observacoes: document.getElementById('observacoes').value,
            status: document.getElementById('status').value,
            servicos: [...this.servicosAdicionados],
            checklist: this.coletarChecklist()
        };

        // Validações
        if (!data.cliente || !data.veiculo) {
            Utils.showNotification('Por favor, selecione cliente e veículo!', 'error');
            return;
        }

        if (data.servicos.length === 0) {
            Utils.showNotification('Adicione pelo menos um serviço!', 'error');
            return;
        }

        // Adicionar timestamps
        if (!id) {
            data.criadoEm = new Date().toISOString();
        }
        data.atualizadoEm = new Date().toISOString();

        if (id) {
            DataManager.update('ordens-servico', id, data);
            Utils.showNotification('Ordem de Serviço atualizada com sucesso!', 'success');
        } else {
            DataManager.add('ordens-servico', data);
            Utils.showNotification('Ordem de Serviço criada com sucesso!', 'success');
        }

        Modal.hide(modal);
        this.loadOrdemServicos();
        
        // Limpar dados temporários
        this.servicosAdicionados = [];
        this.fotosVeiculo = [];
    },

    viewOS: function(id) {
        const os = DataManager.getById('ordens-servico', id);
        if (!os) return;

        const valorTotal = os.servicos.reduce((total, s) => total + s.preco, 0);
        const servicosList = os.servicos.map(s => 
            `<li>${s.nome} - ${Utils.formatCurrency(s.preco)}</li>`
        ).join('');

        // Gerar checklist de avarias
        let checklistHtml = '';
        if (os.checklist && os.checklist.avarias) {
            const avariasEncontradas = Object.keys(os.checklist.avarias)
                .filter(key => os.checklist.avarias[key])
                .map(key => key.replace('avaria-', '').replace('-', ' '))
                .map(item => item.charAt(0).toUpperCase() + item.slice(1));

            if (avariasEncontradas.length > 0) {
                checklistHtml = `
                    <div class="avarias-encontradas">
                        <h4>⚠️ Avarias Identificadas:</h4>
                        <ul class="avarias-list">
                            ${avariasEncontradas.map(avaria => `<li>${avaria}</li>`).join('')}
                        </ul>
                        ${os.checklist.observacoes ? `<p><strong>Observações:</strong> ${os.checklist.observacoes}</p>` : ''}
                    </div>
                `;
            } else {
                checklistHtml = '<div class="no-avarias"><p>✅ Nenhuma avaria identificada</p></div>';
            }
        }

        // Gerar galeria de fotos
        let fotosHtml = '';
        if (os.checklist && os.checklist.fotos && os.checklist.fotos.length > 0) {
            fotosHtml = `
                <div class="fotos-galeria">
                    <h4>📸 Fotos do Veículo:</h4>
                    <div class="fotos-grid">
                        ${os.checklist.fotos.map(foto => `
                            <div class="foto-galeria-item">
                                <img src="${foto.data}" alt="${foto.nome}" onclick="OrdemServico.ampliarFoto('${foto.data}', '${foto.nome}')">
                                <span class="foto-nome">${foto.nome}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        const content = `
            <div class="os-view">
                <div class="os-header">
                    <h2>Ordem de Serviço #${os.numero}</h2>
                    <span class="status-badge" style="background-color: ${this.getStatusColor(os.status)}">${os.status}</span>
                </div>
                
                <div class="os-details">
                    <div class="detail-row">
                        <strong>Data de Abertura:</strong> ${Utils.formatDate(os.dataAbertura)}
                    </div>
                    <div class="detail-row">
                        <strong>Cliente:</strong> ${os.cliente}
                    </div>
                    <div class="detail-row">
                        <strong>Veículo:</strong> ${os.veiculo}
                    </div>
                    <div class="detail-row">
                        <strong>Observações:</strong> ${os.observacoes || 'Nenhuma observação'}
                    </div>
                </div>

                ${checklistHtml}

                <div class="servicos-details">
                    <h4>Serviços:</h4>
                    <ul>${servicosList}</ul>
                    <div class="total-view">
                        <strong>Total: ${Utils.formatCurrency(valorTotal)}</strong>
                    </div>
                </div>

                ${fotosHtml}
            </div>
        `;

        Modal.show(content, 'Visualizar OS', 'large');
    },

    ampliarFoto: function(src, nome) {
        const content = `
            <div class="foto-ampliada">
                <img src="${src}" alt="${nome}" style="max-width: 100%; height: auto;">
                <p class="foto-nome-ampliada">${nome}</p>
            </div>
        `;
        Modal.show(content, 'Foto do Veículo', 'large');
    },

    editOS: function(id) {
        const os = DataManager.getById('ordens-servico', id);
        if (os) {
            this.showFormOS(os);
        }
    },

    printOS: function(id) {
        const os = DataManager.getById('ordens-servico', id);
        if (!os) return;

        // Simular geração de PDF (aqui você integraria com uma biblioteca como jsPDF)
        Utils.showNotification('Funcionalidade de PDF em desenvolvimento!', 'info');
        console.log('Gerando PDF para OS:', os);
    },

    avancarStatus: function(id) {
        const os = DataManager.getById('ordens-servico', id);
        if (!os) return;

        const statusSequence = ['Aguardando', 'Em Andamento', 'Concluído', 'Entregue'];
        const currentIndex = statusSequence.indexOf(os.status);
        
        if (currentIndex < statusSequence.length - 1) {
            os.status = statusSequence[currentIndex + 1];
            os.atualizadoEm = new Date().toISOString();
            
            DataManager.update('ordens-servico', id, os);
            Utils.showNotification(`Status atualizado para: ${os.status}`, 'success');
            this.loadOrdemServicos();
        }
    }
};

// Expor para uso global
window.OrdemServico = OrdemServico;