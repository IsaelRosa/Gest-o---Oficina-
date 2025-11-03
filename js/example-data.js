// Dados de exemplo para demonstração
(function() {
    // Aguardar DataManager estar disponível
    const initExampleData = () => {
        if (!window.DataManager) {
            setTimeout(initExampleData, 100);
            return;
        }

        console.log('Inicializando dados de exemplo...');
        
        // Limpar dados existentes para garantir dados frescos
        if (DataManager.getAll('servicos').length > 0) {
            console.log('Dados já existem, limpando...');
            localStorage.removeItem('carservice_servicos');
        }

        console.log('Carregando dados de exemplo...');

        // Dados de exemplo para clientes
        const clientes = [
            {
                nome: 'João Silva',
                telefone: '(11) 99999-9999',
                email: 'joao.silva@email.com',
                cpf: '123.456.789-00',
                endereco: 'Rua das Flores, 123 - São Paulo, SP',
                dataNascimento: '1985-05-15',
                veiculos: 1,
                ultimaVisita: '2025-10-25'
            },
            {
                nome: 'Maria Santos',
                telefone: '(11) 88888-8888',
                email: 'maria.santos@email.com',
                cpf: '987.654.321-00',
                endereco: 'Av. Paulista, 456 - São Paulo, SP',
                dataNascimento: '1990-08-20',
                veiculos: 2,
                ultimaVisita: '2025-10-30'
            },
            {
                nome: 'Carlos Oliveira',
                telefone: '(11) 77777-7777',
                email: 'carlos.oliveira@email.com',
                cpf: '456.789.123-00',
                endereco: 'Rua Augusta, 789 - São Paulo, SP',
                dataNascimento: '1978-12-10',
                veiculos: 1,
                ultimaVisita: '2025-10-28'
            }
        ];

        // Dados de exemplo para serviços
        const servicos = [
            // Serviços de Lavagem e Estética Automotiva
            {
                nome: 'Lavagem Completa',
                descricao: 'Lavagem interna e externa detalhada com aspiração completa',
                preco: 35.00,
                tempo: 60,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Lavagem Simples',
                descricao: 'Foco na limpeza externa do veículo com enxágue básico',
                preco: 20.00,
                tempo: 30,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Lavagem a Seco',
                descricao: 'Utiliza produtos especiais para limpar sem água, ideal para situações específicas',
                preco: 45.00,
                tempo: 45,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Polimento',
                descricao: 'Remoção de riscos leves e imperfeições na pintura, devolvendo o brilho',
                preco: 120.00,
                tempo: 90,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Cristalização de Vidros',
                descricao: 'Tratamento que repele água, sujeira e melhora a visibilidade na chuva',
                preco: 80.00,
                tempo: 60,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Aplicação de Cera',
                descricao: 'Proteção e brilho para a pintura com cera automotiva premium',
                preco: 60.00,
                tempo: 45,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Higiênização Interna',
                descricao: 'Limpeza profunda do interior, incluindo aspiração, limpeza de estofados, tapetes e painel',
                preco: 70.00,
                tempo: 75,
                categoria: 'Lavagem & Estética'
            },
            {
                nome: 'Limpeza de Motor',
                descricao: 'Limpeza da parte mecânica do veículo com produtos específicos',
                preco: 50.00,
                tempo: 40,
                categoria: 'Lavagem & Estética'
            },
            // Serviços mecânicos adicionais
            {
                nome: 'Troca de Óleo',
                descricao: 'Troca de óleo do motor e filtro de óleo',
                preco: 80.00,
                tempo: 30,
                categoria: 'Serviços Mecânicos'
            },
            {
                nome: 'Revisão Completa',
                descricao: 'Revisão geral do veículo incluindo todos os sistemas',
                preco: 250.00,
                tempo: 120,
                categoria: 'Serviços Mecânicos'
            },
            {
                nome: 'Alinhamento e Balanceamento',
                descricao: 'Alinhamento de direção e balanceamento das rodas',
                preco: 60.00,
                tempo: 45,
                categoria: 'Serviços Mecânicos'
            },
            {
                nome: 'Troca de Pastilhas de Freio',
                descricao: 'Substituição das pastilhas de freio dianteiras',
                preco: 150.00,
                tempo: 60,
                categoria: 'Serviços Mecânicos'
            }
        ];

        // Dados de exemplo para veículos
        const veiculos = [
            {
                marca: 'Honda',
                modelo: 'Civic',
                ano: 2020,
                placa: 'ABC-1234',
                cor: 'Prata',
                combustivel: 'Flex',
                proprietario: 'João Silva',
                quilometragem: 45000,
                observacoes: 'Veículo em bom estado',
                ultimaManutencao: '2025-10-25'
            },
            {
                marca: 'Toyota',
                modelo: 'Corolla',
                ano: 2019,
                placa: 'DEF-5678',
                cor: 'Branco',
                combustivel: 'Flex',
                proprietario: 'Maria Santos',
                quilometragem: 52000,
                observacoes: 'Cliente fiel, sempre pontual',
                ultimaManutencao: '2025-10-30'
            },
            {
                marca: 'Volkswagen',
                modelo: 'Gol',
                ano: 2018,
                placa: 'GHI-9012',
                cor: 'Azul',
                combustivel: 'Flex',
                proprietario: 'Carlos Oliveira',
                quilometragem: 68000,
                observacoes: 'Necessita revisão mais frequente',
                ultimaManutencao: '2025-10-28'
            }
        ];

        // Dados de exemplo para agendamentos
        const agendamentos = [
            {
                data: '2025-10-31',
                hora: '09:00',
                cliente: 'João Silva',
                veiculo: 'Honda Civic 2020',
                servico: 'Lavagem Completa',
                status: 'agendado'
            },
            {
                data: '2025-10-31',
                hora: '14:00',
                cliente: 'Maria Santos',
                veiculo: 'Toyota Corolla 2019',
                servico: 'Polimento',
                status: 'em-andamento'
            },
            {
                data: '2025-11-01',
                hora: '10:30',
                cliente: 'Carlos Oliveira',
                veiculo: 'Volkswagen Gol 2018',
                servico: 'Higiênização Interna',
                status: 'agendado'
            },
            {
                data: '2025-10-29',
                hora: '16:00',
                cliente: 'João Silva',
                veiculo: 'Honda Civic 2020',
                servico: 'Cristalização de Vidros',
                status: 'concluido'
            },
            {
                data: '2025-11-01',
                hora: '15:30',
                cliente: 'Maria Santos',
                veiculo: 'Toyota Corolla 2019',
                servico: 'Lavagem a Seco',
                status: 'agendado'
            },
            {
                data: '2025-10-30',
                hora: '11:00',
                cliente: 'Carlos Oliveira',
                veiculo: 'Volkswagen Gol 2018',
                servico: 'Limpeza de Motor',
                status: 'concluido'
            }
        ];

        // Dados de exemplo para estoque
        const estoque = [
            {
                nome: 'Óleo Motor 5W30',
                codigo: 'OL001',
                categoria: 'fluidos',
                quantidade: 50,
                unidade: 'l',
                precoUnitario: 25.00,
                estoqueMinimo: 10,
                localizacao: 'Prateleira A-1',
                observacoes: 'Óleo sintético premium'
            },
            {
                nome: 'Filtro de Óleo',
                codigo: 'FO001',
                categoria: 'pecas',
                quantidade: 30,
                unidade: 'un',
                precoUnitario: 15.00,
                estoqueMinimo: 5,
                localizacao: 'Prateleira B-2',
                observacoes: 'Compatible com Honda e Toyota'
            },
            {
                nome: 'Pastilha de Freio Dianteira',
                codigo: 'PF001',
                categoria: 'pecas',
                quantidade: 8,
                unidade: 'pç',
                precoUnitario: 120.00,
                estoqueMinimo: 4,
                localizacao: 'Prateleira C-1',
                observacoes: 'Pastilha premium com garantia'
            },
            {
                nome: 'Chave Inglesa 10mm',
                codigo: 'CI010',
                categoria: 'ferramentas',
                quantidade: 5,
                unidade: 'un',
                precoUnitario: 35.00,
                estoqueMinimo: 2,
                localizacao: 'Bancada 1',
                observacoes: 'Ferramenta profissional'
            }
        ];

        // Dados de exemplo para ordens de serviço
        const ordensServico = [
            {
                numero: '0001',
                dataAbertura: '2025-10-31',
                cliente: 'João Silva',
                veiculo: 'Honda Civic - ABC-1234',
                observacoes: 'Cliente solicitou lavagem completa e polimento. Veículo em bom estado geral.',
                status: 'Em Andamento',
                servicos: [
                    { id: 1, nome: 'Lavagem Completa', preco: 35.00 },
                    { id: 4, nome: 'Polimento', preco: 120.00 }
                ],
                criadoEm: '2025-10-31T08:00:00.000Z',
                atualizadoEm: '2025-10-31T09:30:00.000Z'
            },
            {
                numero: '0002',
                dataAbertura: '2025-10-30',
                cliente: 'Maria Santos',
                veiculo: 'Toyota Corolla - DEF-5678',
                observacoes: 'Limpeza interna detalhada solicitada devido a odores.',
                status: 'Concluído',
                servicos: [
                    { id: 7, nome: 'Higiênização Interna', preco: 70.00 },
                    { id: 6, nome: 'Aplicação de Cera', preco: 60.00 }
                ],
                criadoEm: '2025-10-30T14:00:00.000Z',
                atualizadoEm: '2025-10-30T16:45:00.000Z'
            },
            {
                numero: '0003',
                dataAbertura: '2025-10-29',
                cliente: 'Carlos Oliveira',
                veiculo: 'Volkswagen Gol - GHI-9012',
                observacoes: 'Serviço de lavagem simples e limpeza dos vidros.',
                status: 'Entregue',
                servicos: [
                    { id: 2, nome: 'Lavagem Simples', preco: 20.00 },
                    { id: 5, nome: 'Cristalização de Vidros', preco: 80.00 }
                ],
                criadoEm: '2025-10-29T10:00:00.000Z',
                atualizadoEm: '2025-10-29T12:30:00.000Z'
            },
            {
                numero: '0004',
                dataAbertura: '2025-10-31',
                cliente: 'Maria Santos',
                veiculo: 'Toyota Corolla - DEF-5678',
                observacoes: 'Manutenção preventiva e troca de óleo.',
                status: 'Aguardando',
                servicos: [
                    { id: 9, nome: 'Troca de Óleo', preco: 80.00 },
                    { id: 11, nome: 'Alinhamento e Balanceamento', preco: 60.00 }
                ],
                criadoEm: '2025-10-31T07:00:00.000Z',
                atualizadoEm: '2025-10-31T07:00:00.000Z'
            }
        ];

        // Dados de exemplo para movimentações financeiras
        const movimentacoes = [
            {
                data: '2025-10-29',
                descricao: 'Serviço - Troca de Pastilhas de Freio',
                tipo: 'receita',
                valor: 150.00,
                status: 'pago',
                categoria: 'Serviços',
                observacoes: 'Pagamento à vista'
            },
            {
                data: '2025-10-30',
                descricao: 'Compra de óleo motor',
                tipo: 'despesa',
                valor: 200.00,
                status: 'pago',
                categoria: 'Peças',
                observacoes: 'Reposição de estoque'
            },
            {
                data: '2025-10-31',
                descricao: 'Serviço - Revisão Completa',
                tipo: 'receita',
                valor: 250.00,
                status: 'pendente',
                categoria: 'Serviços',
                observacoes: 'Pagamento agendado'
            },
            {
                data: '2025-10-28',
                descricao: 'Aluguel da oficina',
                tipo: 'despesa',
                valor: 2500.00,
                status: 'pago',
                categoria: 'Aluguel',
                observacoes: 'Mensalidade outubro'
            }
        ];

        // Adicionar dados ao DataManager
        clientes.forEach(cliente => DataManager.add('clientes', cliente));
        servicos.forEach(servico => DataManager.add('servicos', servico));
        veiculos.forEach(veiculo => DataManager.add('veiculos', veiculo));
        agendamentos.forEach(agendamento => DataManager.add('agendamentos', agendamento));
        ordensServico.forEach(os => DataManager.add('ordens-servico', os));
        estoque.forEach(produto => DataManager.add('estoque', produto));
        movimentacoes.forEach(movimentacao => DataManager.add('movimentacoes', movimentacao));

        console.log('Dados de exemplo carregados com sucesso!');
        console.log('Serviços carregados:', DataManager.getAll('servicos').length);
    };

    // Função global para resetar dados
    window.resetarDados = function() {
        if (window.DataManager) {
            localStorage.clear();
            console.log('Dados resetados, recarregando...');
            initExampleData();
            console.log('Novos dados carregados!');
            // Recarregar página atual se estiver em serviços ou agendamentos
            if (window.currentPage === 'servicos' || window.currentPage === 'agendamentos') {
                window.location.reload();
            }
        }
    };

    // Inicializar quando a página carregar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExampleData);
    } else {
        initExampleData();
    }
})();