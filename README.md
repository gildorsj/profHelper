# PropHelfer 📚

Aplicativo **React Native (Expo)** para **gerenciamento de turmas por professores**.
Trabalho final da disciplina de Programação de Dispositivos Móveis — UEMG.

O foco do projeto é usar **recursos fundamentais e simples do React Native**
(componentes básicos, navegação em pilha e formulários) com **armazenamento
local em SQLite**. Todos os dados ficam no aparelho — o app funciona 100%
offline.

---

## ✨ Funcionalidades

- **Perfil do professor** — nome e matéria (editável).
- **Salas presenciais e online** — criar e listar turmas.
- **Alunos** — cadastrar (nome, matrícula, e-mail), listar e remover.
- **Chamada (registrar aula)** — marca presença/ausência de cada aluno.
  É a chamada que alimenta toda a **frequência** do app.
- **Frequência por aluno** — presenças e faltas na listagem de alunos.
- **Informações da sala** — aulas lecionadas, **frequência geral (%)** e
  frequência individual de cada aluno.
- **Tarefas** — adicionar, marcar como concluída e remover.

O app já abre com uma **turma de exemplo** ("Algoritmos I") com alunos e
chamadas lançadas, para demonstrar a frequência funcionando.

---

## 🧱 Tecnologias

| Recurso | Uso |
|---|---|
| **Expo SDK 57** | Base do projeto |
| **React Native 0.86** | Componentes (`View`, `Text`, `TextInput`, `FlatList`, `TouchableOpacity`, `ScrollView`, `Alert`, `Modal`) |
| **expo-sqlite** | Banco de dados local (SQLite) |
| **@react-navigation/native-stack** | Navegação entre telas |
| **@expo/vector-icons** | Ícones (Ionicons) |

---

## ▶️ Como executar

```bash
# 1. Instalar as dependências
npm install

# 2. Iniciar o Expo
npx expo start
```

Depois, abra no **Expo Go** (Android/iOS) lendo o QR Code, ou rode em um
emulador com `npx expo start --android` / `--ios`.

---

## 🗂️ Estrutura do projeto

```
profHelper/
├── App.js                     # Navegação + provedor do SQLite
├── src/
│   ├── database/
│   │   └── db.js              # Esquema do banco + toda a lógica de negócio
│   ├── theme/
│   │   └── theme.js           # Cores, espaçamentos e tipografia
│   ├── components/            # Componentes reutilizáveis
│   │   ├── Avatar.js
│   │   ├── EmptyState.js
│   │   ├── Field.js
│   │   ├── MenuButton.js
│   │   ├── PrimaryButton.js
│   │   ├── Screen.js
│   │   └── TitleCard.js
│   └── screens/               # Uma tela por arquivo
│       ├── HomeScreen.js
│       ├── PerfilScreen.js
│       ├── CriarSalaScreen.js
│       ├── ListaSalasScreen.js
│       ├── SalaScreen.js
│       ├── AdicionarAlunoScreen.js
│       ├── ListaAlunosScreen.js
│       ├── RemoverAlunoScreen.js
│       ├── RegistrarAulaScreen.js
│       ├── AdicionarTarefaScreen.js
│       ├── ListaTarefasScreen.js
│       └── InfoSalaScreen.js
```

---

## 🧮 Modelo de dados (SQLite)

```
professor (id, nome, materia)

salas (id, nome, informacoes, online, criada_em)
  └── alunos      (id, sala_id, nome, matricula, email)
  └── aulas       (id, sala_id, data, conteudo)
  └── tarefas     (id, sala_id, titulo, descricao, entrega, concluida)

frequencias (id, aula_id, aluno_id, presente)
  ↑ liga cada AULA a cada ALUNO com presente = 1 (presente) ou 0 (falta)
```

### Como a frequência é calculada

1. Ao **registrar uma aula**, o app cria 1 linha em `aulas` e 1 linha em
   `frequencias` para cada aluno (presente `1` ou `0`).
2. **Frequência do aluno** = `presenças ÷ total de chamadas do aluno × 100`.
3. **Frequência geral da sala** = `total de presenças ÷ total de registros × 100`.

---

## 🔄 Fluxo de navegação

```
Home
├── Perfil (informações do professor)
├── Criar sala  ──▶ Sala
└── Salas existentes ──▶ Sala
                          ├── Adicionar aluno
                          ├── Registrar aula (chamada)
                          ├── Adicionar tarefa
                          ├── Listagem de alunos (frequência)
                          ├── Tarefas
                          ├── Remover aluno
                          └── Informações da sala (estatísticas)
```

---

## 📝 Observações

- O banco `prophelfer.db` é criado automaticamente na primeira execução
  (função `initDatabase` em `src/database/db.js`).
- Para começar do zero (sem os dados de exemplo), basta reinstalar o app —
  o banco é local ao aparelho.
