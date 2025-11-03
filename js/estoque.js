// Módulo Estoque
window.Estoque = {
    init: function() {
        this.bindEvents();
        this.loadEstoque();
        this.verificarEstoqueBaixo();
    },

    verificarEstoqueBaixo: function() {
        const produtos = DataManager.getAll('estoque') || [];
        const produtosBaixoEstoque = produtos.filter(p => p.quantidade <= p.estoqueMinimo);
        
        if (produtosBaixoEstoque.length > 0) {
            const nomes = produtosBaixoEstoque.map(p => p.nome).join(', ');
            Utils.showNotification(
                `Atenção: ${produtosBaixoEstoque.length} produto(s) com estoque baixo: ${nomes}`, 
                'warning'
            );
        }
    },

    bindEvents: function() {
        // Botão novo produto
        const btnNovo = document.getElementById('novo-produto');
        if (btnNovo) {
            btnNovo.addEventListener('click', () => this.showFormProduto());
        }

        // Filtro de categoria
        const filtroCategoria = document.getElementById('filtro-categoria');
        if (filtroCategoria) {
            filtroCategoria.addEventListener('change', () => this.loadEstoque());
        }

        // Busca
        const buscarProduto = document.getElementById('buscar-produto');
        if (buscarProduto) {
            buscarProduto.addEventListener('input', Utils.debounce(() => this.loadEstoque(), 300));
        }
    },

    loadEstoque: function() {
        const tbody = document.getElementById('estoque-tbody');
        if (!tbody) return;

        const filtroCategoria = document.getElementById('filtro-categoria');
        const buscarProduto = document.getElementById('buscar-produto');
        const categoriaFiltro = filtroCategoria ? filtroCategoria.value : '';
        const termoBusca = buscarProduto ? buscarProduto.value.toLowerCase() : '';

        let produtos = DataManager.getAll('estoque') || [];

        // Aplicar filtros
        if (categoriaFiltro) {
            produtos = produtos.filter(p => p.categoria === categoriaFiltro);
        }

        if (termoBusca) {
            produtos = produtos.filter(p => 
                p.nome.toLowerCase().includes(termoBusca) ||
                p.codigo.toLowerCase().includes(termoBusca)
            );
        }

        // Ordenar por nome
        produtos.sort((a, b) => a.nome.localeCompare(b.nome));

        if (produtos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum produto encontrado</td></tr>';
            return;
        }

        const html = produtos.map(produto => {
            const valorTotal = produto.quantidade * produto.precoUnitario;
            const status = this.getStatusEstoque(produto.quantidade, produto.estoqueMinimo);
            
            return `
                <tr>
                    <td>
                        <strong>${produto.nome}</strong><br>
                        <small style="color: #666;">Código: ${produto.codigo}</small>
                    </td>
                    <td>${this.getCategoriaText(produto.categoria)}</td>
                    <td>${produto.quantidade} ${produto.unidade}</td>
                    <td>${Utils.formatCurrency(produto.precoUnitario)}</td>
                    <td>${Utils.formatCurrency(valorTotal)}</td>
                    <td>
                        <span class="status ${status.class}">${status.text}</span>
                    </td>
                    <td>
                        <button class="btn btn-warning" onclick="Estoque.editProduto(${produto.id})" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn" onclick="Estoque.showMovimentacao(${produto.id})" title="Movimentar">
                            <i class="fas fa-exchange-alt"></i>
                        </button>
                        <button class="btn btn-danger" onclick="Estoque.deleteProduto(${produto.id})" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        tbody.innerHTML = html;
    },

    getStatusEstoque: function(quantidade, estoqueMinimo) {
        if (quantidade === 0) {
            return { class: 'status-cancelado', text: 'Sem Estoque' };
        } else if (quantidade <= estoqueMinimo) {
            return { class: 'status-agendado', text: 'Estoque Baixo' };
        } else {
            return { class: 'status-concluido', text: 'Normal' };
        }
    },

    getCategoriaText: function(categoria) {
        const categorias = {
            'pecas': 'Peças',
            'ferramentas': 'Ferramentas',
            'fluidos': 'Fluidos',
            'acessorios': 'Acessórios'
        };
        return categorias[categoria] || categoria;
    },

    showFormProduto: function(produto = null) {
        const isEdit = produto !== null;
        const title = isEdit ? 'Editar Produto' : 'Novo Produto';

        const content = `
            <form id="form-produto">
                <div class="form-group">
                    <label>Nome do Produto:</label>
                    <input type="text" id="nome" required value="${isEdit ? produto.nome : ''}" placeholder="Nome do produto">
                </div>
                <div class="form-group">
                    <label>Código:</label>
                    <input type="text" id="codigo" required value="${isEdit ? produto.codigo : ''}" placeholder="Código do produto">
                </div>
                <div class="form-group">
                    <label>Categoria:</label>
                    <select id="categoria" required>
                        <option value="">Selecione uma categoria</option>
                        <option value="pecas" ${isEdit && produto.categoria === 'pecas' ? 'selected' : ''}>Peças</option>
                        <option value="ferramentas" ${isEdit && produto.categoria === 'ferramentas' ? 'selected' : ''}>Ferramentas</option>
                        <option value="fluidos" ${isEdit && produto.categoria === 'fluidos' ? 'selected' : ''}>Fluidos</option>
                        <option value="acessorios" ${isEdit && produto.categoria === 'acessorios' ? 'selected' : ''}>Acessórios</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade:</label>
                    <input type="number" id="quantidade" required min="0" value="${isEdit ? produto.quantidade : ''}" placeholder="0">
                </div>
                <div class="form-group">
                    <label>Unidade:</label>
                    <select id="unidade" required>
                        <option value="un" ${isEdit && produto.unidade === 'un' ? 'selected' : ''}>Unidade</option>
                        <option value="kg" ${isEdit && produto.unidade === 'kg' ? 'selected' : ''}>Quilograma</option>
                        <option value="l" ${isEdit && produto.unidade === 'l' ? 'selected' : ''}>Litro</option>
                        <option value="m" ${isEdit && produto.unidade === 'm' ? 'selected' : ''}>Metro</option>
                        <option value="pç" ${isEdit && produto.unidade === 'pç' ? 'selected' : ''}>Peça</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Preço Unitário (R$):</label>
                    <input type="number" id="precoUnitario" required step="0.01" min="0" value="${isEdit ? produto.precoUnitario : ''}" placeholder="0.00">
                </div>
                <div class="form-group">
                    <label>Estoque Mínimo:</label>
                    <input type="number" id="estoqueMinimo" required min="0" value="${isEdit ? produto.estoqueMinimo : ''}" placeholder="Quantidade mínima">
                </div>
                <div class="form-group">
                    <label>Localização:</label>
                    <input type="text" id="localizacao" value="${isEdit ? produto.localizacao || '' : ''}" placeholder="Ex: Prateleira A-1">
                </div>
                <div class="form-group">
                    <label>Observações:</label>
                    <textarea id="observacoes" placeholder="Observações sobre o produto">${isEdit ? produto.observacoes || '' : ''}</textarea>
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
        const form = document.getElementById('form-produto');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduto(modal, isEdit ? produto.id : null);
        });
    },

    saveProduto: function(modal, id = null) {
        const data = {
            nome: document.getElementById('nome').value.trim(),
            codigo: document.getElementById('codigo').value.trim().toUpperCase(),
            categoria: document.getElementById('categoria').value,
            quantidade: parseInt(document.getElementById('quantidade').value),
            unidade: document.getElementById('unidade').value,
            precoUnitario: parseFloat(document.getElementById('precoUnitario').value),
            estoqueMinimo: parseInt(document.getElementById('estoqueMinimo').value),
            localizacao: document.getElementById('localizacao').value.trim(),
            observacoes: document.getElementById('observacoes').value.trim()
        };

        // Validações
        if (!data.nome || !data.codigo || !data.categoria) {
            Utils.showNotification('Por favor, preencha todos os campos obrigatórios!', 'error');
            return;
        }

        if (isNaN(data.quantidade) || isNaN(data.precoUnitario) || isNaN(data.estoqueMinimo)) {
            Utils.showNotification('Por favor, insira valores numéricos válidos!', 'error');
            return;
        }

        if (data.quantidade < 0 || data.precoUnitario < 0 || data.estoqueMinimo < 0) {
            Utils.showNotification('Os valores não podem ser negativos!', 'error');
            return;
        }

        // Verificar código duplicado
        if (!id || (id && DataManager.getById('estoque', id).codigo !== data.codigo)) {
            if (this.verificarCodigoExistente(data.codigo)) {
                Utils.showNotification('Já existe um produto com este código!', 'error');
                return;
            }
        }

        if (id) {
            DataManager.update('estoque', id, data);
            Utils.showNotification('Produto atualizado com sucesso!', 'success');
        } else {
            DataManager.add('estoque', data);
            Utils.showNotification('Produto criado com sucesso!', 'success');
        }

        Modal.hide(modal);
        this.loadEstoque();
        this.verificarEstoqueBaixo();
    },

    verificarCodigoExistente: function(codigo) {
        const produtos = DataManager.getAll('estoque') || [];
        return produtos.some(p => p.codigo === codigo);
    },

    showMovimentacao: function(id) {
        const produto = DataManager.getById('estoque', id);
        if (!produto) return;

        const content = `
            <form id="form-movimentacao-estoque">
                <div class="form-group">
                    <label>Produto:</label>
                    <input type="text" value="${produto.nome}" readonly>
                </div>
                <div class="form-group">
                    <label>Estoque Atual:</label>
                    <input type="text" value="${produto.quantidade} ${produto.unidade}" readonly>
                </div>
                <div class="form-group">
                    <label>Tipo de Movimentação:</label>
                    <select id="tipoMovimentacao" required>
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantidade:</label>
                    <input type="number" id="quantidadeMovimentacao" required min="1" placeholder="Quantidade a movimentar">
                </div>
                <div class="form-group">
                    <label>Motivo:</label>
                    <input type="text" id="motivo" required placeholder="Motivo da movimentação">
                </div>
                <div class="flex gap-1">
                    <button type="submit" class="btn btn-success">
                        <i class="fas fa-save"></i> Confirmar
                    </button>
                    <button type="button" class="btn" onclick="Modal.hide(this.closest('.modal'))">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </form>
        `;

        const modal = Modal.show(content, 'Movimentação de Estoque');

        // Event listener para o formulário
        const form = document.getElementById('form-movimentacao-estoque');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processarMovimentacao(modal, produto);
        });
    },

    processarMovimentacao: function(modal, produto) {
        const tipo = document.getElementById('tipoMovimentacao').value;
        const quantidade = parseInt(document.getElementById('quantidadeMovimentacao').value);
        const motivo = document.getElementById('motivo').value;

        let novaQuantidade = produto.quantidade;

        if (tipo === 'entrada') {
            novaQuantidade += quantidade;
        } else {
            if (quantidade > produto.quantidade) {
                Utils.showNotification('Quantidade insuficiente em estoque!', 'error');
                return;
            }
            novaQuantidade -= quantidade;
        }

        // Atualizar estoque
        DataManager.update('estoque', produto.id, { quantidade: novaQuantidade });

        // Registrar movimentação (implementar histórico se necessário)
        Utils.showNotification(
            `${tipo === 'entrada' ? 'Entrada' : 'Saída'} de ${quantidade} ${produto.unidade} registrada com sucesso!`, 
            'success'
        );

        Modal.hide(modal);
        this.loadEstoque();
    },

    editProduto: function(id) {
        const produto = DataManager.getById('estoque', id);
        if (produto) {
            this.showFormProduto(produto);
        }
    },

    deleteProduto: function(id) {
        Utils.confirm('Tem certeza que deseja excluir este produto?', () => {
            DataManager.delete('estoque', id);
            Utils.showNotification('Produto excluído com sucesso!', 'success');
            this.loadEstoque();
        });
    }
};