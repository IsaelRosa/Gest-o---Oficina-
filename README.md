# CarService Pro 🚗

Sistema completo de gestão para oficinas automotivas com interface moderna e funcionalidades integradas.

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- Sistema de login seguro com sessão de 24 horas
- Página landing profissional com informações da empresa
- Controle de acesso ao sistema principal

### 📊 Dashboard Gerencial
- Visão geral dos indicadores da oficina
- Métricas de agendamentos, faturamento e serviços
- Interface responsiva e intuitiva

### 📅 Gestão de Agendamentos
- Calendário interativo para agendamentos
- Controle de horários e disponibilidade
- Notificações automáticas via WhatsApp

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Histórico de serviços realizados
- Sistema de busca e filtros avançados

### � Gestão de Veículos
- Cadastro detalhado de veículos por cliente
- Histórico de manutenções e serviços
- Checklist fotográfico de avarias

### 🛠️ Catálogo de Serviços
- Serviços pré-cadastrados (Lavagem, Polimento, etc.)
- Gestão de preços e tempo de execução
- Categorização por tipo de serviço

### 📋 Ordem de Serviço (OS)
- Geração automática de OS em PDF
- Registro fotográfico do veículo
- Checklist completo de avarias internas e externas
- Controle de status do serviço

### 💰 Módulo Financeiro
- Controle de receitas e despesas
- Relatórios financeiros detalhados
- Gestão de formas de pagamento

### 📦 Controle de Estoque
- Gestão de produtos e materiais
- Controle de entrada e saída
- Alertas de estoque baixo

### 📱 Integração WhatsApp
- Avisos automáticos de início/fim de serviço
- Marketing pós-venda personalizado
- Links diretos para contato

### 💼 Sistema de Planos
- Planos Básico, Profissional e Premium
- Funcionalidades específicas por plano
- Interface de upgrade e contratação

### 🔧 Catálogo de Serviços
- Gerenciar serviços oferecidos
- Definir preços e tempo estimado
- Buscar serviços por nome ou descrição
- Cards visuais para melhor apresentação

### 👥 Gestão de Clientes
- Cadastro completo de clientes
- Histórico de agendamentos por cliente
- Buscar clientes por nome, telefone ou email
- Visualizar detalhes e histórico

### 🚗 Gestão de Veículos
- Cadastro de veículos dos clientes
- Informações técnicas completas
- Histórico de manutenções
- Buscar veículos por marca, modelo ou placa

### 💰 Módulo Financeiro
- Controle de receitas e despesas
- Gráficos de faturamento mensal
- Contas a receber e pagar
- Categorização de movimentações
- Status de pagamentos

### 📦 Controle de Estoque
- Gerenciar produtos e peças
- Controle de quantidade e preços
- Alertas de estoque baixo
- Movimentações de entrada e saída
- Categorização por tipo de produto

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e moderna
- **CSS3**: Estilização responsiva com Grid e Flexbox
- **JavaScript ES6+**: Lógica da aplicação e interatividade
- **Font Awesome**: Ícones profissionais
- **LocalStorage**: Persistência de dados local

## 📱 Design Responsivo

O sistema é completamente responsivo e funciona perfeitamente em:
- Desktop (1200px+)
- Tablets (768px - 1199px)
- Smartphones (até 767px)

## 🎨 Características do Design

- **Interface Moderna**: Design limpo e profissional
- **Navegação Intuitiva**: Menu de navegação claro e acessível
- **Cards Visuais**: Informações organizadas em cards
- **Cores Harmoniosas**: Paleta de cores profissional
- **Feedback Visual**: Notificações e confirmações
- **Animações Suaves**: Transições elegantes

## 🚀 Como Usar

1. **Abrir o Sistema**: Abra o arquivo `index.html` em um navegador web moderno

2. **Navegação**: Use o menu superior para navegar entre as diferentes seções:
   - Dashboard
   - Agendamentos
   - Serviços
   - Clientes
   - Veículos
   - Financeiro
   - Estoque

3. **Funcionalidades**:
   - Clique nos botões "+ Novo" para adicionar registros
   - Use os filtros e busca para encontrar informações
   - Clique nos ícones de ação para editar, visualizar ou excluir

## 📊 Dados de Exemplo

O sistema inclui dados de exemplo para demonstração:
- 3 clientes cadastrados
- 5 tipos de serviços
- 3 veículos
- 4 agendamentos
- 4 produtos em estoque
- 4 movimentações financeiras

## 🔧 Estrutura do Projeto

```
Matilde/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos CSS
├── js/
│   ├── app.js             # Aplicação principal
│   ├── navigation.js      # Sistema de navegação
│   ├── dashboard.js       # Módulo Dashboard
│   ├── agendamentos.js    # Módulo Agendamentos
│   ├── servicos.js        # Módulo Serviços
│   ├── clientes.js        # Módulo Clientes
│   ├── veiculos.js        # Módulo Veículos
│   ├── financeiro.js      # Módulo Financeiro
│   ├── estoque.js         # Módulo Estoque
│   └── example-data.js    # Dados de exemplo
├── assets/                # Recursos (imagens, etc.)
└── .github/
    └── copilot-instructions.md
```

## 💾 Persistência de Dados

Os dados são salvos automaticamente no `localStorage` do navegador, garantindo que:
- As informações permanecem entre sessões
- Não há necessidade de servidor
- Os dados são específicos por dispositivo/navegador

## 🌟 Funcionalidades Avançadas

### Sistema Modal
- Modais responsivos para formulários
- Fechamento por clique fora ou botão X
- Formulários validados

### Notificações
- Feedback visual para ações do usuário
- Notificações de sucesso, erro, aviso e informação
- Auto-dismiss após 3 segundos

### Busca e Filtros
- Busca em tempo real com debounce
- Filtros por categoria e status
- Resultados instantâneos

### Utilitários
- Formatação de moeda brasileira
- Formatação de datas
- Geração de IDs únicos
- Confirmações de ações destrutivas

## 🔮 Possíveis Melhorias Futuras

- Integração com banco de dados
- Relatórios em PDF
- Sistema de backup/restore
- Integração com APIs de pagamento
- Módulo de agendamento online
- Sistema de notificações push
- Integração com WhatsApp/SMS

## 📝 Licença

Este projeto está disponível sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests
- Compartilhar feedback

---

**Desenvolvido com ❤️ para oficinas automotivas**