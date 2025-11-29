# Instalação do DemandeX

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Passos para Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Executar em modo de desenvolvimento:**
```bash
npm run dev
```

3. **Acessar o aplicativo:**
Abra seu navegador em [http://localhost:3000](http://localhost:3000)

## Build para Produção

```bash
npm run build
npm start
```

## Funcionalidades Implementadas

### ✅ Dashboard Principal
- Visão geral de todas as áreas
- Estatísticas rápidas
- Ações rápidas

### ✅ Gestão da Minha Saúde
- **Alimentação**: Cadastro de refeições com calorias
- **Treino**: Registro de exercícios e treinos
- **Sono**: Monitoramento de qualidade e duração do sono
- **Objetivos**: Metas relacionadas à saúde

### ✅ Gestão Financeira
- **Transações**: Cadastro de receitas e despesas
- **Metas Financeiras**: Acompanhamento de objetivos financeiros
- **Reserva de Emergência**: Controle de reserva financeira
- **Investimentos**: Gestão de investimentos com cálculo de retorno
- **Objetivos**: Metas financeiras

### ✅ Produtividade
- **Tarefas**: Sistema completo de gestão de tarefas (tipo Monday.com)
- **Estudos**: Estrutura hierárquica (Área > Matéria > Aula > Pomodoro)
- **Projetos Pessoais**: Ideias, metas e objetivos vinculados a tarefas
- **Objetivos**: Metas de produtividade

### ✅ Lei da Atração
- Cadastro de objetivos e sonhos
- Mural com visualizações

### ✅ Notificações
- Sistema completo de notificações
- Suporte a notificações do navegador

## Tecnologias Utilizadas

- **Next.js 14**: Framework React
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Zustand**: Gerenciamento de estado
- **Lucide React**: Ícones
- **date-fns**: Manipulação de datas

## Estrutura do Projeto

```
├── app/                    # Páginas do Next.js
│   ├── saude/             # Módulo de saúde
│   ├── financeiro/        # Módulo financeiro
│   ├── produtividade/     # Módulo de produtividade
│   ├── lei-atracao/      # Lei da atração
│   └── notificacoes/      # Notificações
├── components/            # Componentes React
│   ├── Dashboard/        # Componentes do dashboard
│   ├── Layout/           # Layout e navegação
│   └── UI/               # Componentes de UI base
├── lib/                   # Utilitários e stores
│   ├── store.ts          # Store Zustand
│   └── notifications.ts  # Sistema de notificações
└── types/                 # Tipos TypeScript
```

## Armazenamento de Dados

Os dados são armazenados localmente no navegador usando `localStorage`. Todos os dados são salvos automaticamente quando há alterações.

## Personalização

### Cores

As cores podem ser personalizadas em `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },
  success: { ... },
  warning: { ... },
  danger: { ... },
}
```

### Notificações

Para usar notificações programaticamente:

```typescript
import { useNotifications } from '@/lib/notifications'

const { createNotification } = useNotifications()
createNotification('diet', 'Hora de almoçar!', '/saude/alimentacao')
```

## Próximos Passos

- [ ] Adicionar autenticação de usuário
- [ ] Sincronização com backend
- [ ] Exportação de dados
- [ ] Gráficos e relatórios avançados
- [ ] Modo escuro
- [ ] Aplicativo mobile (PWA)

