# ✂ Navalha Barbearia — App Web Mobile

App web responsivo (mobile-first) para gerenciamento de uma barbearia. Permite ao barbeiro controlar a agenda e lucros, e ao cliente agendar horários sem criar conta, com notificação automática via WhatsApp.

---

## 📱 Telas do app

### Cliente (sem cadastro)
| Tela | Descrição |
|------|-----------|
| Login | Toggle entre "Sou Cliente" e "Sou Barbeiro" |
| Serviços | Lista de cortes com preço, descrição e filtros |
| Agendamento | Calendário semanal + horários disponíveis + dados do cliente |
| Confirmação | Resumo do agendamento + botão WhatsApp |
| Sucesso | Confirmação visual após envio |

### Barbeiro (com login)
| Tela | Descrição |
|------|-----------|
| Agenda | Calendário semanal + horários do dia (ocupados/livres) |
| Lucros | Faturamento do dia, semana, mês + top serviços |

---

## 🗂 Estrutura de arquivos

```
barbearia/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              # Entrada da aplicação
    ├── App.jsx               # Rotas
    ├── index.css             # Estilos globais
    ├── data/
    │   └── db.js             # ⚙️ BANCO FICTÍCIO (localStorage + mock data)
    ├── utils/
    │   ├── date.js           # Helpers de data em pt-BR
    │   └── whatsapp.js       # Gerador do link wa.me
    ├── hooks/
    │   └── useAuth.js        # Hook de autenticação
    ├── components/
    │   ├── Barber/
    │   │   └── BarberNav.jsx
    │   └── Client/
    │       └── ClientNav.jsx
    └── pages/
        ├── LoginPage.jsx
        ├── barber/
        │   ├── BarberAgenda.jsx
        │   └── BarberProfits.jsx
        └── client/
            ├── ClientServices.jsx
            ├── ClientSchedule.jsx
            ├── ClientConfirm.jsx
            └── ClientSuccess.jsx
```

---

## ⚙️ Configuração inicial

### 1. Credenciais do barbeiro
Edite o arquivo `src/data/db.js`:

```js
export const BARBER_CREDENTIALS = {
  username: 'joao',       // ← altere aqui
  password: 'navalha123', // ← altere aqui
  name: 'João Silva',
  phone: '5511999998888', // ← WhatsApp do barbeiro com DDI (sem + ou espaços)
  barbershop: 'Navalha Barbearia',
}
```

### 2. Serviços oferecidos
No mesmo arquivo `src/data/db.js`, edite o array `SERVICES`:

```js
export const SERVICES = [
  {
    id: 1,
    name: 'Degradê Clássico',
    description: 'Fade preciso com acabamento impecável',
    price: 40,         // valor em R$
    duration: 45,      // duração em minutos
    icon: '✂',
  },
  // adicione ou remova serviços aqui
]
```

### 3. Horários de funcionamento
Também em `src/data/db.js`:

```js
export const WORKING_HOURS = [
  '08:00', '09:00', '10:00', '11:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
]
```

---

## 🚀 Como rodar localmente

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

Acesse `http://localhost:5173` no navegador.

---

## 📤 Deploy no Vercel (gratuito)

### Passo a passo completo

**1. Suba o projeto no GitHub**
```bash
git init
git add .
git commit -m "primeiro commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/barbearia-navalha.git
git push -u origin main
```

**2. Deploy no Vercel**
- Acesse [vercel.com](https://vercel.com) e faça login com o GitHub
- Clique em **"Add New Project"**
- Selecione o repositório `barbearia-navalha`
- O Vercel detecta automaticamente que é um projeto Vite
- Clique em **"Deploy"**
- Em ~1 minuto o app estará online com URL pública

**3. Atualizações futuras**
```bash
git add .
git commit -m "descrição da mudança"
git push
# O Vercel faz novo deploy automaticamente
```

---

## 💬 Como funciona o WhatsApp

Quando o cliente finaliza o agendamento, o app monta esta mensagem e abre diretamente o WhatsApp do barbeiro:

```
✂ Novo Agendamento — Navalha Barbearia

👤 Cliente: Carlos Silva
📱 WhatsApp: (11) 99999-8888
💈 Serviço: Degradê Clássico
📅 Data: Ter, 10 Jun
⏰ Horário: 10:00
💰 Valor: R$ 40

Agendamento feito pelo app Navalha Barbearia
```

O cliente **clica em Enviar** — chega como mensagem normal no WhatsApp do barbeiro.

> **Requisito:** o cliente precisa ter WhatsApp instalado no celular. Como o app é mobile-first, isso é praticamente garantido.

---

## 💾 Sobre o armazenamento (localStorage)

O app usa o `localStorage` do navegador como banco de dados:

| O que é salvo | Onde |
|---------------|------|
| Login do barbeiro | `localStorage` do navegador do barbeiro |
| Agendamentos | `localStorage` do navegador de cada usuário |
| Lucros | `localStorage` do navegador do barbeiro |

**Importante:** cada navegador tem seu próprio localStorage. Isso significa que os dados do cliente e do barbeiro **não se sincronizam automaticamente** — o WhatsApp é o elo de comunicação entre eles.

O barbeiro visualiza a agenda no app dele **depois de receber a mensagem no WhatsApp e registrar manualmente**, ou quando o cliente agendou no mesmo navegador (ex: demonstração).

---

## 🔐 Segurança do login

O login do barbeiro usa credenciais fixas no código (adequado para MVP). Para produção com múltiplos barbeiros ou maior segurança:

- **Firebase Authentication** — gratuito até certo volume
- **Supabase Auth** — open-source, plano gratuito generoso

---

## 🛣 Roadmap futuro

| Funcionalidade | Tecnologia sugerida |
|----------------|---------------------|
| Banco de dados real | Firebase Firestore ou Supabase |
| Agenda sincronizada em tempo real | Firebase Realtime DB |
| Notificação automática (sem clicar enviar) | Twilio API ou Evolution API |
| Múltiplos barbeiros | Auth multi-usuário |
| PWA (instalar como app) | Vite PWA Plugin |
| Histórico do cliente | Firebase + login social |

---

## 🧪 Credenciais de teste

```
Usuário: joao
Senha:   navalha123
```

---

## 🛠 Tecnologias usadas

| Tecnologia | Uso |
|------------|-----|
| React 18 | Interface |
| React Router v6 | Navegação entre telas |
| Vite | Build e dev server |
| localStorage | Persistência de dados |
| wa.me | Integração WhatsApp |
| Vercel | Hospedagem gratuita |

---

## 📞 Suporte

Para dúvidas ou melhorias, abra uma issue no repositório do GitHub.
