// Módulo de Autocomplete
window.Autocomplete = {
    instances: new Map(),

    // Criar um campo de autocomplete
    create: function(inputId, options = {}) {
        const input = document.getElementById(inputId);
        if (!input) {
            console.error(`Input com ID ${inputId} não encontrado`);
            return null;
        }

        const config = {
            data: options.data || [],
            placeholder: options.placeholder || 'Digite para buscar...',
            minLength: options.minLength || 1,
            maxResults: options.maxResults || 10,
            onSelect: options.onSelect || function() {},
            filterBy: options.filterBy || 'nome', // Campo usado para filtrar
            displayField: options.displayField || 'nome', // Campo exibido
            valueField: options.valueField || 'nome', // Campo usado como valor
            allowCustom: options.allowCustom || true, // Permite valores customizados
            searchFields: options.searchFields || ['nome'] // Campos para busca
        };

        // Converter input em autocomplete
        this.setupAutocomplete(input, config);
        
        // Salvar instância
        this.instances.set(inputId, {
            input: input,
            config: config,
            isOpen: false
        });

        return this.instances.get(inputId);
    },

    setupAutocomplete: function(input, config) {
        // Criar container do autocomplete
        const wrapper = document.createElement('div');
        wrapper.className = 'autocomplete-wrapper';
        
        // Substituir input original
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        // Modificar input
        input.setAttribute('autocomplete', 'off');
        input.placeholder = config.placeholder;
        input.className += ' autocomplete-input';
        
        // Criar lista de sugestões
        const suggestions = document.createElement('div');
        suggestions.className = 'autocomplete-suggestions';
        suggestions.style.display = 'none';
        wrapper.appendChild(suggestions);

        // Event listeners
        input.addEventListener('input', (e) => this.handleInput(e, config, suggestions));
        input.addEventListener('focus', (e) => this.handleFocus(e, config, suggestions));
        input.addEventListener('blur', (e) => this.handleBlur(e, config, suggestions));
        input.addEventListener('keydown', (e) => this.handleKeydown(e, config, suggestions));

        // Click fora para fechar
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });
    },

    handleInput: function(e, config, suggestions) {
        const query = e.target.value.trim();
        
        if (query.length < config.minLength) {
            suggestions.style.display = 'none';
            return;
        }

        const results = this.search(query, config);
        this.displaySuggestions(results, config, suggestions, e.target);
    },

    handleFocus: function(e, config, suggestions) {
        const query = e.target.value.trim();
        if (query.length >= config.minLength) {
            const results = this.search(query, config);
            this.displaySuggestions(results, config, suggestions, e.target);
        }
    },

    handleBlur: function(e, config, suggestions) {
        // Delay para permitir click nas sugestões
        setTimeout(() => {
            suggestions.style.display = 'none';
        }, 150);
    },

    handleKeydown: function(e, config, suggestions) {
        const items = suggestions.querySelectorAll('.autocomplete-item');
        const active = suggestions.querySelector('.autocomplete-item.active');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (active) {
                    active.classList.remove('active');
                    const next = active.nextElementSibling || items[0];
                    next.classList.add('active');
                } else if (items.length > 0) {
                    items[0].classList.add('active');
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (active) {
                    active.classList.remove('active');
                    const prev = active.previousElementSibling || items[items.length - 1];
                    prev.classList.add('active');
                } else if (items.length > 0) {
                    items[items.length - 1].classList.add('active');
                }
                break;
                
            case 'Enter':
                if (active) {
                    e.preventDefault();
                    active.click();
                }
                break;
                
            case 'Escape':
                suggestions.style.display = 'none';
                break;
        }
    },

    search: function(query, config) {
        const queryLower = query.toLowerCase();
        
        return config.data.filter(item => {
            return config.searchFields.some(field => {
                const fieldValue = this.getNestedValue(item, field);
                return fieldValue && fieldValue.toLowerCase().includes(queryLower);
            });
        }).slice(0, config.maxResults);
    },

    displaySuggestions: function(results, config, suggestions, input) {
        suggestions.innerHTML = '';
        
        if (results.length === 0) {
            if (config.allowCustom) {
                suggestions.innerHTML = '<div class="autocomplete-no-results">Nenhum resultado encontrado</div>';
            }
            suggestions.style.display = 'block';
            return;
        }

        results.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            if (index === 0) div.classList.add('active');
            
            const displayValue = this.getNestedValue(item, config.displayField);
            const highlightedText = this.highlightMatch(displayValue, input.value);
            
            div.innerHTML = `
                <div class="autocomplete-main">${highlightedText}</div>
                ${this.getSecondaryInfo(item, config)}
            `;
            
            div.addEventListener('click', () => {
                const value = this.getNestedValue(item, config.valueField);
                input.value = value;
                suggestions.style.display = 'none';
                config.onSelect(item, value);
            });
            
            suggestions.appendChild(div);
        });
        
        suggestions.style.display = 'block';
    },

    getSecondaryInfo: function(item, config) {
        // Adicionar informações secundárias baseadas no tipo
        if (item.telefone) {
            return `<div class="autocomplete-secondary">${item.telefone}</div>`;
        }
        if (item.modelo && item.ano) {
            return `<div class="autocomplete-secondary">${item.modelo} - ${item.ano}</div>`;
        }
        if (item.placa) {
            return `<div class="autocomplete-secondary">Placa: ${item.placa}</div>`;
        }
        return '';
    },

    highlightMatch: function(text, query) {
        if (!query) return text;
        
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    },

    getNestedValue: function(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    },

    // Atualizar dados de uma instância
    updateData: function(inputId, newData) {
        const instance = this.instances.get(inputId);
        if (instance) {
            instance.config.data = newData;
        }
    },

    // Criar autocomplete específico para clientes
    createClienteAutocomplete: function(inputId, options = {}) {
        const clientes = DataManager ? DataManager.getAll('clientes') : [];
        
        return this.create(inputId, {
            data: clientes,
            placeholder: 'Digite o nome do cliente...',
            searchFields: ['nome', 'telefone', 'email'],
            onSelect: function(cliente) {
                console.log('Cliente selecionado:', cliente);
                // Disparar evento customizado
                const event = new CustomEvent('clienteSelected', { detail: cliente });
                document.getElementById(inputId).dispatchEvent(event);
            },
            ...options
        });
    },

    // Criar autocomplete específico para veículos
    createVeiculoAutocomplete: function(inputId, clienteNome = '', options = {}) {
        let veiculos = DataManager ? DataManager.getAll('veiculos') : [];
        
        // Filtrar veículos pelo cliente se fornecido
        if (clienteNome) {
            veiculos = veiculos.filter(v => v.cliente === clienteNome);
        }
        
        return this.create(inputId, {
            data: veiculos,
            placeholder: 'Digite o modelo do veículo...',
            searchFields: ['modelo', 'marca', 'placa'],
            displayField: 'modelo',
            valueField: 'modelo',
            onSelect: function(veiculo) {
                console.log('Veículo selecionado:', veiculo);
                // Disparar evento customizado
                const event = new CustomEvent('veiculoSelected', { detail: veiculo });
                document.getElementById(inputId).dispatchEvent(event);
            },
            ...options
        });
    },

    // Atualizar veículos baseado no cliente selecionado
    updateVeiculosByCliente: function(veiculoInputId, clienteNome) {
        const veiculos = DataManager ? DataManager.getAll('veiculos').filter(v => v.cliente === clienteNome) : [];
        this.updateData(veiculoInputId, veiculos);
        
        // Limpar campo se não houver veículos para o cliente
        const input = document.getElementById(veiculoInputId);
        if (input && veiculos.length === 0) {
            input.value = '';
        }
    }
};