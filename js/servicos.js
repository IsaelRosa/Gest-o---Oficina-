// Módulo Serviços
window.Servicos = {
    init: function() {
        console.log('Inicializando módulo de serviços...');
        
        // Aguardar DataManager estar disponível
        if (!window.DataManager) {
            setTimeout(() => this.init(), 100);
            return;
        }
        
        this.bindEvents();
        this.loadServicos();
        
        console.log('Serviços disponíveis:', DataManager.getAll('servicos').length);
    },

    bindEvents: function() {
        // Botão novo serviço
        const btnNovo = document.getElementById('novo-servico');
        if (btnNovo) {
            btnNovo.addEventListener('click', () => this.showFormServico());
        }

        // Busca
        const buscarServico = document.getElementById('buscar-servico');
        if (buscarServico) {
            buscarServico.addEventListener('input', Utils.debounce(() => this.loadServicos(), 300));
        }

        // Filtro por categoria
        const filtroCategoria = document.getElementById('filtro-categoria-servico');
        if (filtroCategoria) {
            filtroCategoria.addEventListener('change', () => this.loadServicos());
        }
    },

    loadServicos: function() {
        const grid = document.getElementById('servicos-grid');
        if (!grid) {
            console.warn('Elemento servicos-grid não encontrado');
            return;
        }

        const buscarServico = document.getElementById('buscar-servico');
        const filtroCategoria = document.getElementById('filtro-categoria-servico');
        const termoBusca = buscarServico ? buscarServico.value.toLowerCase() : '';
        const categoriaFiltro = filtroCategoria ? filtroCategoria.value : '';

        let servicos = DataManager.getAll('servicos');
        console.log('Serviços encontrados:', servicos.length);
        console.log('Filtro categoria:', categoriaFiltro);
        console.log('Termo busca:', termoBusca);

        // Atualizar estatísticas na barra superior
        this.atualizarEstatisticas(servicos);

        // Aplicar filtro de busca
        if (termoBusca) {
            servicos = servicos.filter(s => 
                s.nome.toLowerCase().includes(termoBusca) ||
                s.descricao.toLowerCase().includes(termoBusca)
            );
        }

        // Aplicar filtro de categoria
        if (categoriaFiltro) {
            servicos = servicos.filter(s => this.getCategoriaServico(s) === categoriaFiltro);
        }

        console.log('Serviços após filtros:', servicos.length);

        if (servicos.length === 0) {
            grid.innerHTML = '<div class="card no-results"><h3>Nenhum serviço encontrado</h3><p>Tente ajustar os filtros ou adicione novos serviços</p></div>';
            return;
        }

        const html = servicos.map(servico => {
            const categoria = this.getCategoriaServico(servico);
            const iconeCategoria = this.getIconeCategoria(categoria);
            
            return `
                <div class="card">
                    <div class="card-header">
                        <i class="card-icon ${iconeCategoria}"></i>
                        <div>
                            <h3 class="card-title">${servico.nome}</h3>
                            <small style="color: #666; text-transform: uppercase; font-size: 0.8rem;">${categoria}</small>
                        </div>
                    </div>
                    <p style="color: #666; margin: 1rem 0;">${servico.descricao}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span style="font-size: 1.5rem; font-weight: bold; color: #27ae60;">
                            ${Utils.formatCurrency(servico.preco)}
                        </span>
                        <span style="color: #666;">
                            <i class="fas fa-clock"></i> ${servico.tempo} min
                        </span>
                    </div>
                    <div class="flex gap-1">
                        <button class="btn btn-warning" onclick="Servicos.editServico(${servico.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger" onclick="Servicos.deleteServico(${servico.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        grid.innerHTML = html;
    },

    atualizarEstatisticas: function(servicos) {
        const totalElement = document.getElementById('total-servicos');
        const lavagemaElement = document.getElementById('servicos-lavagem');
        const mecanicosElement = document.getElementById('servicos-mecanicos');

        if (totalElement) {
            totalElement.textContent = servicos?.length || 0;
        }
        
        if (lavagemaElement) {
            const servicosLavagem = servicos?.filter(s => this.getCategoriaServico(s) === 'Lavagem & Estética') || [];
            lavagemaElement.textContent = servicosLavagem.length;
        }
        
        if (mecanicosElement) {
            const servicosMecanicos = servicos?.filter(s => this.getCategoriaServico(s) === 'Serviços Mecânicos') || [];
            mecanicosElement.textContent = servicosMecanicos.length;
        }
    },

    getCategoriaServico: function(servico) {
        // Se o serviço é um objeto e tem categoria definida, usa ela
        if (typeof servico === 'object' && servico.categoria) {
            return servico.categoria;
        }
        
        // Caso contrário, verifica pelo nome (para compatibilidade com dados antigos)
        const nomeServico = typeof servico === 'string' ? servico : servico.nome;
        
        const servicosLavagem = [
            'Lavagem Completa', 'Lavagem Simples', 'Lavagem a Seco', 
            'Polimento', 'Cristalização de Vidros', 'Aplicação de Cera', 
            'Higiênização Interna', 'Limpeza de Motor'
        ];
        
        if (servicosLavagem.includes(nomeServico)) {
            return 'Lavagem & Estética';
        }
        
        return 'Serviços Mecânicos';
    },

    getIconeCategoria: function(categoria) {
        if (categoria === 'Lavagem & Estética') {
            return 'fas fa-spray-can';
        }
        return 'fas fa-tools';
    },

    showFormServico: function(servico = null) {
        const isEdit = servico !== null;
        const title = isEdit ? 'Editar Serviço' : 'Novo Serviço';
        const categoriaAtual = isEdit ? this.getCategoriaServico(servico) : '';

        const content = `
            <form id="form-servico">
                <div class="form-group">
                    <label>Nome do Serviço:</label>
                    <input type="text" id="nome" required value="${isEdit ? servico.nome : ''}" placeholder="Ex: Troca de Óleo">
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="categoria" required>
                        <option value="">Selecione uma categoria</option>
                        <option value="Serviços Mecânicos" ${categoriaAtual === 'Serviços Mecânicos' ? 'selected' : ''}>Serviços Mecânicos</option>
                        <option value="Lavagem & Estética" ${categoriaAtual === 'Lavagem & Estética' ? 'selected' : ''}>Lavagem & Estética</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="descricao" required placeholder="Descrição detalhada do serviço">${isEdit ? servico.descricao : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Preço (R$):</label>
                    <input type="number" id="preco" required step="0.01" min="0" value="${isEdit ? servico.preco : ''}" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Tempo Estimado (minutos):</label>
                    <input type="number" id="tempo" required min="1" value="${isEdit ? servico.tempo : ''}" placeholder="60">
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
        const form = document.getElementById('form-servico');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveServico(modal, isEdit ? servico.id : null);
        });
    },

    saveServico: function(modal, id = null) {
        const data = {
            nome: document.getElementById('nome').value.trim(),
            descricao: document.getElementById('descricao').value.trim(),
            preco: parseFloat(document.getElementById('preco').value),
            tempo: parseInt(document.getElementById('tempo').value),
            categoria: document.getElementById('categoria').value
        };

        // Validações
        if (!data.nome || !data.descricao || !data.categoria) {
            Utils.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        if (isNaN(data.preco) || isNaN(data.tempo)) {
            Utils.showNotification('Por favor, insira valores numéricos válidos para preço e tempo!', 'error');
            return;
        }

        if (data.preco <= 0 || data.tempo <= 0) {
            Utils.showNotification('Preço e tempo devem ser maiores que zero!', 'error');
            return;
        }

        // Verificar nome duplicado
        if (!id || (id && DataManager.getById('servicos', id).nome !== data.nome)) {
            if (this.verificarNomeExistente(data.nome)) {
                Utils.showNotification('Já existe um serviço com este nome!', 'error');
                return;
            }
        }

        if (id) {
            DataManager.update('servicos', id, data);
            Utils.showNotification('Serviço atualizado com sucesso!', 'success');
        } else {
            DataManager.add('servicos', data);
            Utils.showNotification('Serviço criado com sucesso!', 'success');
        }

        Modal.hide(modal);
        this.loadServicos();
    },

    verificarNomeExistente: function(nome) {
        const servicos = DataManager.getAll('servicos');
        return servicos.some(s => s.nome.toLowerCase() === nome.toLowerCase());
    },

    editServico: function(id) {
        const servico = DataManager.getById('servicos', id);
        if (servico) {
            this.showFormServico(servico);
        }
    },

    deleteServico: function(id) {
        Utils.confirm('Tem certeza que deseja excluir este serviço?', () => {
            DataManager.delete('servicos', id);
            Utils.showNotification('Serviço excluído com sucesso!', 'success');
            this.loadServicos();
        });
    }
};