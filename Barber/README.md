# ✂ Stúdio Valtinho Barber — v2.0

App web mobile-first com Firebase para gerenciamento completo de barbearia.

---

## 🚀 O que há de novo na v2.0

| Recurso | v1 | v2 |
|---------|----|----|
| Banco de dados | localStorage (local) | Firebase Firestore (nuvem) |
| Login cliente | Sem conta | Nome + WhatsApp (conta real) |
| Login barbeiro | Senha no código | Firebase Authentication |
| Agendamentos | Só no próprio navegador | Sincronizado em tempo real |
| Horários fixos | ❌ | ✅ Com exceções semanais |
| Histórico do cliente | ❌ | ✅ |
| Base para promoções | ❌ | ✅ Todos os WhatsApps salvos |
| Segurança | Senha visível | Firebase Auth seguro |

---

## 📱 Telas

### Splash (login)
- Visual da logo: **STÚDIO / Valtinho / BARBER** em branco com vermelho
- Toggle Sou Cliente / Sou Barbeiro
- Cliente entra com **nome + WhatsApp** (cria conta automática)
- Barbeiro entra com **senha**

### Barbeiro
| Tela | Descrição |
|------|-----------|
| Agenda | Calendário semanal + horários em tempo real. Cancelar agendamentos. Liberar horários fixos pontualmente |
| Fixos | Cadastrar/remover clientes com horário semanal fixo |
| Lucros | Faturamento dia/semana/mês + top serviços |

### Cliente
| Tela | Descrição |
|------|-----------|
| Serviços | Lista de cortes com filtros, preços e duração |
| Agendamento | Calendário + horários livres em tempo real (fixos bloqueados aparecem com 📌) |
| Confirmação | Resumo + disparo WhatsApp |
| Histórico | Próximos e passados, com opção de cancelar |

---

## ⚙️ Configuração

### 1. Credenciais e dados da barbearia
Edite `src/firebase/config.js`:

```js
export const BARBER_EMAIL    = 'valtinho@navalha.com' // email no Firebase Auth
export const BARBER_NAME     = 'Valtinho'
export const BARBER_PHONE    = '5514998217622'        // WhatsApp com DDI, sem símbolos
export const BARBERSHOP_NAME = 'Stúdio Valtinho Barber'
```

### 2. Serviços e horários
No mesmo arquivo, edite os arrays `SERVICES` e `WORKING_HOURS`.

### 3. Firebase
As credenciais do Firebase já estão configuradas no arquivo. Se precisar trocar de projeto, substitua o objeto `firebaseConfig`.

---

## 🚀 Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173/Barber/`

---

## 📤 Deploy no GitHub Pages

```bash
npm run deploy
```

Disponível em: `https://RafaelLanaDS.github.io/Barber/`

---

## 💬 Fluxo do WhatsApp

Quando o cliente confirma, o app:
1. Salva o agendamento no Firestore (aparece instantaneamente na agenda do barbeiro)
2. Abre o WhatsApp com mensagem pronta para o barbeiro
3. Cliente clica Enviar — barbeiro recebe no celular

---

## 📌 Horários Fixos

```
Barbeiro cadastra: Toda terça às 10h → João
        ↓
Toda terça o horário aparece como 📌 (bloqueado para outros)
        ↓
Se precisar liberar aquela semana:
Agenda → horário fixo → "liberar semana"
        ↓
Horário volta a aparecer livre para qualquer cliente
```

---

## 🔐 Segurança

- Login do barbeiro: **Firebase Authentication** (senha não fica no código)
- Login do cliente: WhatsApp como identificador único
- Dados: **Firestore** com regras em modo teste (atualizar para produção após 30 dias)

### Atualizar regras do Firestore para produção
No Firebase Console → Firestore → Regras:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appointments/{doc} {
      allow read, write: if request.auth != null;
    }
    match /clients/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /fixedSlots/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'valtinho@navalha.com';
    }
    match /fixedExceptions/{doc} {
      allow read, write: if request.auth != null;
    }
    match /profits/{doc} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🛣 Próximos passos sugeridos

| Funcionalidade | Como fazer |
|----------------|-----------|
| Envio de promoções | Buscar todos os clientes no Firestore e abrir WhatsApp em loop |
| Notificação automática (sem clicar enviar) | Twilio ou Evolution API |
| PWA (instalar como app) | Vite PWA Plugin |
| Múltiplos barbeiros | Adicionar campo `barberId` nos agendamentos |

---

## 🧪 Credenciais de teste

```
Barbeiro:
  Email:  valtinho@navalha.com  (Firebase Auth)
  Senha:  valtinho123

Cliente:
  Nome:   qualquer nome
  Fone:   qualquer número de WhatsApp
```

---

## 🛠 Stack

| Tecnologia | Uso |
|------------|-----|
| React 18 + Vite | Interface |
| React Router v6 | Navegação |
| Firebase Auth | Login seguro |
| Firestore | Banco em tempo real |
| wa.me | Notificação WhatsApp |
| GitHub Pages | Hospedagem gratuita |
