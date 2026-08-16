# 📚 Documentação Técnica — Stúdio Valtinho Barber v2.0

Documentação completa de cada pasta e arquivo do projeto.

---

## 🗂 Estrutura geral do projeto

```
Barber/
├── src/                          # Todo o código fonte da aplicação
│   ├── firebase/                 # Configuração e funções do Firebase
│   ├── hooks/                    # Hooks personalizados do React
│   ├── components/               # Componentes reutilizáveis
│   │   ├── Barber/               # Componentes exclusivos do barbeiro
│   │   └── Client/               # Componentes exclusivos do cliente
│   ├── pages/                    # Telas da aplicação
│   │   ├── barber/               # Telas do painel do barbeiro
│   │   └── client/               # Telas da área do cliente
│   ├── utils/                    # Funções auxiliares
│   ├── App.jsx                   # Roteador principal
│   ├── main.jsx                  # Entrada da aplicação
│   └── index.css                 # Estilos globais
├── public/                       # Arquivos públicos estáticos
├── index.html                    # HTML base da aplicação
├── vite.config.js                # Configuração do Vite (build)
├── package.json                  # Dependências e scripts
└── README.md                     # Documentação geral
```

---

## 📁 Raiz do projeto

### `index.html`
Arquivo HTML base da aplicação. É o único HTML do projeto — o React injeta todo o conteúdo dentro da `<div id="root">`. Contém as meta tags de viewport para funcionar bem em mobile, incluindo configurações para tela cheia no iPhone (`apple-mobile-web-app-capable`).

### `vite.config.js`
Configuração do Vite, que é a ferramenta que compila e empacota o projeto para produção. A configuração mais importante aqui é o `base: '/Barber/'`, que diz ao app que ele está hospedado na subpasta `/Barber/` do GitHub Pages. **Se o nome do repositório mudar, este valor precisa mudar também.**

### `package.json`
Lista todas as bibliotecas que o projeto usa e os comandos disponíveis:
- `npm run dev` — inicia o servidor local para desenvolvimento
- `npm run build` — compila o projeto para produção (gera a pasta `dist/`)
- `npm run deploy` — compila e sobe automaticamente para o GitHub Pages

Dependências principais:
- `react` e `react-dom` — a biblioteca principal da interface
- `react-router-dom` — controla a navegação entre telas
- `firebase` — banco de dados, autenticação e tempo real

---

## 📁 `src/` — Código fonte

### `src/main.jsx`
**Ponto de entrada da aplicação.** É o primeiro arquivo executado. Ele:
1. Inicializa o React na página
2. Envolve tudo com o `BrowserRouter` (para navegação funcionar com o GitHub Pages usando `basename="/Barber"`)
3. Envolve tudo com o `AuthProvider` (para qualquer tela saber se o usuário está logado)
4. Renderiza o `App.jsx`

### `src/App.jsx`
**Roteador principal.** Define quais telas aparecem em quais URLs:

| URL | Tela | Acesso |
|-----|------|--------|
| `/` | SplashPage (login) | Público |
| `/barber/agenda` | Agenda do barbeiro | Só barbeiro logado |
| `/barber/profits` | Lucros | Só barbeiro logado |
| `/barber/fixed` | Horários fixos | Só barbeiro logado |
| `/client/services` | Serviços | Só cliente logado |
| `/client/schedule` | Agendamento | Só cliente logado |
| `/client/confirm` | Confirmação | Só cliente logado |
| `/client/success` | Sucesso | Só cliente logado |
| `/client/history` | Histórico | Só cliente logado |

Contém dois "guardas" de rota:
- `BarberGuard` — bloqueia acesso às telas do barbeiro se não estiver logado como barbeiro
- `ClientGuard` — bloqueia acesso às telas do cliente se não estiver logado como cliente

### `src/index.css`
**Todos os estilos visuais do app.** Não usa nenhuma biblioteca de CSS externa — tudo foi escrito manualmente. Organizado em seções:

- **Variáveis CSS** — cores principais (`--red`, `--dark`, `--white`, etc.), bordas e bordas arredondadas. Para mudar a cor principal do app, basta alterar `--red: #C0392B`
- **Shell e página** — estrutura base que limita o app a 430px (largura de celular) e centraliza na tela
- **Splash** — estilos exclusivos da tela de login (fundo branco, logo)
- **Bottom nav** — barra de navegação fixa na parte de baixo
- **Cards, botões, inputs** — componentes visuais reutilizáveis
- **Calendário semanal** — os chips de dias da semana
- **Slots de horário** — pílulas de horário disponível/ocupado/fixo
- **Toast** — a notificação temporária que aparece na tela ("Agendamento cancelado")
- **Modal** — o popup de formulário usado nos horários fixos
- **Loading / Spinner** — animação de carregamento

---

## 📁 `src/firebase/`

### `src/firebase/config.js`
**O arquivo mais importante do projeto.** Centraliza tudo relacionado ao Firebase:

**Configuração do Firebase:**
```js
const firebaseConfig = { apiKey, authDomain, projectId... }
```
Credenciais que conectam o app ao projeto Firebase do Google. Geradas no Firebase Console.

**Constantes da barbearia:**
```js
export const BARBER_EMAIL    = 'valtinho@navalha.com'
export const BARBER_PHONE    = '5514998217622'
export const BARBERSHOP_NAME = 'Stúdio Valtinho Barber'
```
Para alterar o número do WhatsApp do barbeiro ou o nome da barbearia, edite apenas aqui.

**Serviços oferecidos:**
```js
export const SERVICES = [ { id, name, description, price, duration, icon } ]
```
Array com todos os cortes disponíveis. Para adicionar ou remover um serviço, edite este array.

**Horários de funcionamento:**
```js
export const WORKING_HOURS = ['08:00', '09:00', ...]
```
Lista de horários que aparecem na agenda e no agendamento do cliente.

**Funções de autenticação:**
- `loginBarber(password)` — loga o barbeiro com email fixo + senha
- `loginClient(name, phone)` — loga ou cria conta do cliente usando WhatsApp como identificador. Se o número já existe, faz login. Se não existe, cria a conta automaticamente
- `logout()` — desloga qualquer usuário
- `onAuthChange(callback)` — monitora mudanças no estado do login em tempo real
- `isBarber(user)` — verifica se o usuário logado é o barbeiro (compara o email)

**Funções de agendamentos:**
- `createAppointment(data)` — salva novo agendamento no Firestore
- `cancelAppointment(id)` — apaga um agendamento pelo ID
- `getAppointmentsByDate(dateStr)` — busca todos os agendamentos de uma data
- `listenAppointmentsByDate(dateStr, callback)` — escuta agendamentos em tempo real (quando alguém agenda, a tela atualiza automaticamente sem precisar recarregar)
- `getClientAppointments(uid)` — busca todos os agendamentos de um cliente específico

**Funções de horários fixos:**
- `createFixedSlot(data)` — cadastra um horário fixo semanal para um cliente fiel
- `deleteFixedSlot(id)` — remove um horário fixo permanentemente
- `getFixedSlots()` — busca todos os horários fixos cadastrados
- `listenFixedSlots(callback)` — escuta horários fixos em tempo real
- `createFixedException(data)` — registra que um horário fixo foi liberado naquela semana específica
- `deleteFixedException(fixedSlotId, dateStr)` — remove a exceção, reativando o horário fixo naquela semana
- `getFixedExceptions(dateStr)` — busca as exceções de um dia específico

**Funções de lucros:**
- `addProfit(data)` — registra um lucro no Firestore (chamado automaticamente quando cliente confirma agendamento)
- `listenProfits(callback)` — escuta todos os lucros em tempo real

**Funções de clientes:**
- `getAllClients()` — busca todos os clientes cadastrados (usado futuramente para envio de promoções)

---

## 📁 `src/hooks/`

### `src/hooks/useAuth.jsx`
**Hook de autenticação global.** Usando o conceito de Context do React, disponibiliza o estado do login para qualquer tela do app sem precisar passar como parâmetro.

Disponibiliza três valores:
- `user` — objeto do usuário logado (ou `null` se não logado)
- `barber` — `true` se o usuário logado é o barbeiro, `false` se é cliente
- `loading` — `true` enquanto o Firebase ainda está verificando se há sessão ativa (evita flash de tela errada ao recarregar)

Qualquer tela acessa assim:
```js
const { user, barber, loading } = useAuth()
```

---

## 📁 `src/components/`

Componentes que aparecem em mais de uma tela.

### `src/components/Barber/BarberNav.jsx`
**Barra de navegação inferior do barbeiro.** Aparece em todas as telas do barbeiro. Contém três botões:
- **Agenda** → `/barber/agenda`
- **Fixos** → `/barber/fixed`
- **Lucros** → `/barber/profits`
- **Sair** → chama `logout()` e redireciona para `/`

O botão da tela atual fica destacado em vermelho (classe `active`).

### `src/components/Client/ClientNav.jsx`
**Barra de navegação inferior do cliente.** Aparece em todas as telas do cliente. Contém:
- **Serviços** → `/client/services`
- **Agendar** → `/client/schedule`
- **Histórico** → `/client/history`
- **Sair** → chama `logout()` e redireciona para `/`

---

## 📁 `src/pages/`

### `src/pages/SplashPage.jsx`
**Tela de login — primeira tela do app.** Fundo branco com a identidade visual da barbearia.

Contém o toggle "Sou Cliente / Sou Barbeiro":

**Fluxo do cliente:**
1. Digita nome e WhatsApp
2. Chama `loginClient(name, phone)` do Firebase
3. Se o número já existe → faz login na conta existente
4. Se é novo → cria conta automaticamente
5. Redireciona para `/client/services`

**Fluxo do barbeiro:**
1. Digita a senha
2. Chama `loginBarber(password)` com o email fixo `valtinho@navalha.com`
3. Firebase autentica
4. Redireciona para `/barber/agenda`

Se o usuário já está logado quando abre o app, redireciona automaticamente sem mostrar o login.

---

## 📁 `src/pages/barber/`

### `src/pages/barber/BarberAgenda.jsx`
**Tela principal do barbeiro — Agenda do dia.**

Funcionalidades:
- **Calendário semanal** — mostra os próximos 7 dias, clicável
- **Lista de horários** — para o dia selecionado, mostra cada horário com seu status:
  - 🔴 **Agendado** — tem um cliente, mostra nome, serviço e preço. Botão "cancelar" apaga do Firestore
  - 🟣 **Fixo** — horário reservado semanalmente. Mostra o nome do cliente fiel. Botão "liberar semana" cria uma exceção no Firestore para aquela data específica, liberando o horário
  - 🟢 **Livre** — nenhum agendamento nem fixo

**Como funciona o tempo real:** usa `onSnapshot` do Firestore — quando qualquer cliente agenda, a tela do barbeiro atualiza instantaneamente sem precisar recarregar.

**Lógica dos horários fixos com exceção:**
1. Busca todos os horários fixos (`listenFixedSlots`)
2. Busca as exceções do dia selecionado (`getFixedExceptions`)
3. Para cada horário, verifica: existe fixo para este dia da semana? Tem exceção para esta data? Se tem fixo mas não tem exceção → bloqueia. Se tem exceção → libera

### `src/pages/barber/BarberFixed.jsx`
**Tela de gerenciamento de horários fixos.**

Mostra todos os horários fixos agrupados por dia da semana (Segunda, Terça...).

O formulário de cadastro (modal) pede:
- Nome do cliente
- WhatsApp do cliente
- Dia da semana (Segunda a Sábado)
- Horário (dropdown com os horários de funcionamento)

Ao salvar, cria um documento na coleção `fixedSlots` do Firestore com o `dayOfWeek` (0=Domingo, 1=Segunda... 6=Sábado). A agenda usa esse número para comparar com o dia da semana da data selecionada.

Botão "remover" apaga o horário fixo permanentemente de todos os dias futuros.

### `src/pages/barber/BarberProfits.jsx`
**Tela de faturamento.**

Escuta a coleção `profits` do Firestore em tempo real e calcula:
- **Lucro do mês** — filtra registros onde o mês e ano batem com o atual
- **Lucro da semana** — filtra registros dos últimos 7 dias
- **Lucro do dia** — filtra registros da data de hoje

**Top serviços:** conta quantas vezes cada serviço aparece nos lucros do mês e calcula a porcentagem, exibindo uma barra de progresso.

**Últimos registros:** mostra os 10 agendamentos mais recentes com cliente, serviço e valor.

Os lucros são criados automaticamente no Firestore quando o cliente confirma um agendamento — o barbeiro não precisa registrar manualmente.

---

## 📁 `src/pages/client/`

### `src/pages/client/ClientServices.jsx`
**Tela de escolha do serviço.**

Exibe todos os serviços do array `SERVICES` com filtros por categoria (Todos, Corte, Barba, Completo). Ao selecionar um serviço, ele fica destacado com borda vermelha.

Ao clicar em "Escolher Horário", salva o serviço no `sessionStorage` (memória temporária do navegador para a sessão atual) e navega para `/client/schedule`. O `sessionStorage` é usado aqui porque os dados só precisam existir durante o fluxo de agendamento — ao fechar o app, são apagados automaticamente.

### `src/pages/client/ClientSchedule.jsx`
**Tela de escolha do horário.**

Recupera o serviço do `sessionStorage`. Se não encontrar (cliente acessou direto pela URL), redireciona para serviços.

**Calendário semanal:** mostra os próximos 7 dias. Ao trocar de dia, recarrega os horários em tempo real.

**Lógica de disponibilidade** (igual à agenda do barbeiro, mas do ponto de vista do cliente):
- Horário com agendamento existente → aparece riscado (✗)
- Horário com fixo ativo (sem exceção) → aparece com 📌
- Horário livre → clicável

Ao confirmar, salva o agendamento (serviço + data + horário) no `sessionStorage` e navega para confirmação.

### `src/pages/client/ClientConfirm.jsx`
**Tela de confirmação — última etapa antes de finalizar.**

Recupera o agendamento do `sessionStorage` e os dados do cliente do Firestore (nome e WhatsApp que foram salvos no login).

Ao clicar em "Confirmar & Notificar":
1. Chama `createAppointment()` — salva no Firestore (aparece instantaneamente na agenda do barbeiro)
2. Chama `addProfit()` — registra o lucro no Firestore
3. Chama `notifyBarber()` — abre o WhatsApp com mensagem pronta
4. Limpa o `sessionStorage`
5. Navega para a tela de sucesso

### `src/pages/client/ClientSuccess.jsx`
**Tela de confirmação visual após o agendamento.**

Exibe o que o cliente deve fazer agora (enviar a mensagem no WhatsApp). Oferece dois botões: fazer outro agendamento ou ver o histórico.

### `src/pages/client/ClientHistory.jsx`
**Tela de histórico de agendamentos do cliente.**

Busca no Firestore todos os agendamentos onde `clientUid` é igual ao UID do cliente logado. Divide em dois grupos:
- **Próximos** — data maior ou igual a hoje, ordenados do mais próximo ao mais distante. Tem botão de cancelar
- **Histórico** — datas passadas, com visual mais apagado (opacity 60%)

Esta tela requer um **índice composto no Firestore** (clientUid + date) que é criado automaticamente quando o erro aparece no console pela primeira vez.

---

## 📁 `src/utils/`

### `src/utils/date.js`
**Funções auxiliares de data em português.**

- `DAYS_PT` — array com nomes dos dias: `['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']`
- `MONTHS_PT` — array com nomes dos meses: `['Jan','Fev'...]`
- `toDateStr(date)` — converte uma data para o formato `YYYY-MM-DD` (formato usado no Firestore)
- `formatDate(dateStr)` — converte `2026-08-09` para `Dom, 9 Ago` (exibição amigável)
- `getWeekDays()` — retorna array com os próximos 7 dias a partir de hoje, cada um com `dateStr`, `dayName`, `dayOfWeek` (0-6) e `dayNum`
- `todayStr()` — retorna a data de hoje no formato `YYYY-MM-DD`

### `src/utils/whatsapp.js`
**Funções de integração com WhatsApp.**

- `notifyBarber(dados)` — monta a mensagem de novo agendamento e abre `wa.me/[número do barbeiro]?text=[mensagem]`. O WhatsApp abre com a mensagem pré-preenchida para o cliente só clicar em Enviar
- `sendPromo(clientPhone, message)` — abre o WhatsApp para um número específico com uma mensagem personalizada (usado futuramente para campanhas de promoção)

O número do barbeiro vem da constante `BARBER_PHONE` do `config.js` — alterar lá muda automaticamente aqui.

---

## 🗄 Coleções no Firestore

| Coleção | O que armazena | Quem cria |
|---------|---------------|-----------|
| `clients` | Nome, WhatsApp e UID de cada cliente | Automático no login do cliente |
| `appointments` | Agendamentos: data, hora, serviço, preço, clientUid, clientName, clientPhone | Cliente ao confirmar |
| `profits` | Registro financeiro: data, serviço, preço, clientName | Cliente ao confirmar |
| `fixedSlots` | Horários fixos: dayOfWeek, time, clientName, clientPhone | Barbeiro manualmente |
| `fixedExceptions` | Semanas em que um fixo foi liberado: fixedSlotId + date | Barbeiro ao liberar na agenda |

---

## 🔐 Firebase Authentication

| Usuário | Email | Como entra |
|---------|-------|-----------|
| Barbeiro | `valtinho@navalha.com` | Senha cadastrada no Firebase Console |
| Cliente | `[ddd+número]@cliente.valtinho.com` | WhatsApp vira email fictício, número vira senha |

Exemplo: cliente com WhatsApp `(14) 99821-7622` vira:
- Email: `14998217622@cliente.valtinho.com`
- Senha: `14998217622`

Isso permite que o cliente acesse a mesma conta em qualquer dispositivo digitando o mesmo número de WhatsApp.

---

## 📦 Comandos úteis

```bash
# Instalar dependências (necessário na primeira vez ou após atualizar package.json)
npm install

# Rodar localmente (acesse http://localhost:5173/Barber/)
npm run dev

# Publicar no GitHub Pages (faz build + deploy automático)
npm run deploy
```

---

## 🛣 Como adicionar um novo serviço

1. Abra `src/firebase/config.js`
2. Adicione um objeto no array `SERVICES`:
```js
{
  id: 6,
  name: 'Hidratação Capilar',
  description: 'Tratamento profundo para os cabelos',
  price: 45,
  duration: 40,
  icon: '💧',
}
```
3. Rode `npm run deploy`

## 🕐 Como adicionar um novo horário

1. Abra `src/firebase/config.js`
2. Adicione o horário no array `WORKING_HOURS`:
```js
export const WORKING_HOURS = [
  '08:00', '09:00', '10:00', '11:00',
  '12:00', // ← novo horário
  '13:00', '14:00', '15:00', '16:00', '17:00',
]
```
3. Rode `npm run deploy`
