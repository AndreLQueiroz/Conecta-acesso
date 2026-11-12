<div align="center">

# ♿ Conecta Acesso

### Seu olhar pode abrir caminhos.

Uma plataforma para registrar barreiras de acessibilidade, organizar informações e conectar necessidades a especialidades profissionais.

![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-123C72?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

**Global Solution 2026.2 · CitizenTech · FIAP**  
Mobile Development & IoT

[Proposta](#-ficha-da-citizentech) ·
[Funcionalidades](#-a-jornada-no-aplicativo) ·
[Execução](#-como-executar) ·
[Equipe](#-equipe) ·
[Vídeo](#-vídeo-de-demonstração)

</div>

---

## 📋 Ficha da CitizenTech

| Campo | Descrição |
| :--- | :--- |
| **Nome provisório** | Conecta Acesso |
| **Ideia** | Identificação de barreiras de acessibilidade e conexão informativa com parceiros especializados. |
| **Cidadão beneficiado** | Pessoas com deficiência que encontram dificuldades para acessar e utilizar estabelecimentos comerciais e serviços do bairro. |
| **Problema** | Barreiras limitam a autonomia dessas pessoas, enquanto estabelecimentos podem ter dificuldade para identificar necessidades e encontrar profissionais que possam avaliá-las. |
| **Solução** | Aplicativo para registrar barreiras, complementar informações por meio de uma avaliação preliminar e consultar especialidades profissionais relacionadas. |
| **Como funciona** | O cidadão registra uma dificuldade. O relato pode receber foto, questionário e medição declarada. A plataforma organiza as observações, apresenta parceiros fictícios e permite simular o acompanhamento. |
| **Recorte inicial** | Estabelecimentos de um bairro de São Paulo, a definir após observação do território e conversa com pessoas afetadas. O protótipo utiliza dados de teste fictícios. |
| **Limites da atuação** | Não executa obras, oferece cursos ou treinamentos, certifica estabelecimentos ou substitui avaliação técnica profissional. |
| **Impacto esperado** | Ampliar o acesso à informação e facilitar a organização de necessidades que dificultam a participação das pessoas com deficiência na vida urbana. O impacto ainda não foi medido. |

> [!IMPORTANT]
> Este é um **protótipo acadêmico**. Parceiros são fictícios e atualizações de status são simuladas. Não há contratação, notificação ou encaminhamento real a estabelecimentos e profissionais.

## 💡 Por que o Conecta Acesso?

Uma dificuldade de acesso pode impedir alguém de entrar, circular, compreender uma orientação ou utilizar um serviço.

O Conecta Acesso propõe uma jornada para transformar essa experiência em informação organizada: **registrar o problema, complementar as observações e acompanhar os próximos passos**.

O foco está nas barreiras encontradas no ambiente e no serviço, respeitando as diferentes necessidades das pessoas.

## 📱 A jornada no aplicativo

| Etapa | O que o usuário faz |
| :---: | :--- |
| **01 · Registrar** | Identifica o estabelecimento e descreve a dificuldade encontrada. |
| **02 · Complementar** | Adiciona uma foto opcional e preenche um questionário preliminar. |
| **03 · Consultar** | Conhece especialidades e parceiros fictícios relacionados à categoria. |
| **04 · Acompanhar** | Consulta o relato, altera status de demonstração e visualiza o histórico. |

### 🏠 Início

- Apresentação da proposta.
- Acesso rápido ao cadastro.
- Indicadores calculados a partir dos registros locais.
- Relatos recentes.
- Acesso à área Explorar.

### ✍️ Cadastro em etapas

O formulário é dividido em quatro momentos:

**Local → Barreira → Foto → Revisão**

- Validação dos campos obrigatórios.
- Descrição com mínimo de 10 caracteres.
- Seleção de categoria.
- Foto opcional de até 2 MB após o processamento.
- Revisão dos dados antes de salvar.
- Confirmação de descarte pelo botão Cancelar.

### 📂 Meus registros

- Listagem dos relatos salvos.
- Busca por estabelecimento, localização ou categoria.
- Identificação do status atual.
- Acesso ao detalhe.
- Estados de carregamento, erro e ausência de resultados.

### 🔎 Detalhe e acompanhamento

- Informações completas do relato.
- Exibição da foto.
- Acesso ao questionário.
- Resumo da avaliação.
- Orientações informativas de triagem.
- Atualização simulada de status.
- Linha do tempo persistente.
- Exclusão com confirmação.

### 📋 Avaliação preliminar

Questionário com respostas **Sim**, **Não** e **Não sei**:

| Aspecto | Observação |
| :--- | :--- |
| **Entrada** | Dificuldades relatadas para acessar o estabelecimento. |
| **Circulação** | Obstáculos e dificuldades de deslocamento interno. |
| **Atendimento** | Comunicação e apoio necessários ao atendimento. |
| **Sinalização** | Identificação e orientação nos espaços. |

Também permite informar a largura livre observada da entrada e observações complementares.

> [!NOTE]
> Respostas positivas e medições isoladas **não comprovam acessibilidade ou conformidade técnica**. A triagem apenas organiza as informações declaradas.

### 🧭 Explorar

- Explicação das categorias de barreiras.
- Parceiros fictícios por categoria.
- Carregamento da consulta.
- Mensagem de lista vazia.
- Controle explícito de falha simulada.
- Recuperação da consulta.

### ℹ️ Sobre

- Objetivo e público beneficiado.
- Explicação da jornada.
- Limites do protótipo.
- Informações sobre dados e armazenamento local.

## 🛠️ Tecnologias

| Tecnologia | Aplicação |
| :--- | :--- |
| **React Native** | Construção da interface. |
| **Expo** | Ambiente de desenvolvimento e execução. |
| **TypeScript** | Tipagem do código. |
| **Expo Router** | Navegação por abas e pilha. |
| **Expo SQLite** | Persistência local dos dados. |
| **Expo Image Picker** | Seleção de fotos. |
| **React Native Safe Area Context** | Adaptação às áreas seguras da tela. |
| **Expo Vector Icons / Ionicons** | Ícones da interface. |
| **React Native Web** | Execução no navegador. |

As versões das dependências estão registradas em `package.json` e `package-lock.json`.

## 🗂️ Organização do projeto

```text
app/
├── _layout.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── explorar.tsx
│   ├── registros.tsx
│   └── sobre.tsx
├── registrar.tsx
├── avaliar.tsx
└── registro/
    └── [id].tsx

src/
├── components/
│   ├── ui.tsx
│   └── FotoRegistro.tsx
├── database/
│   ├── registros.ts
│   └── avaliacoes.ts
├── services/
│   ├── parceiros.ts
│   └── avaliacao.ts
├── theme/
│   └── index.ts
└── types/
    └── index.ts

app.json
metro.config.js
package.json
package-lock.json
tsconfig.json
README.md
```

| Camada | Responsabilidade |
| :--- | :--- |
| `app` | Telas e navegação. |
| `components` | Componentes reutilizáveis. |
| `database` | Inicialização e operações do SQLite. |
| `services` | Consulta mock e regras informativas de triagem. |
| `theme` | Cores, fontes, espaçamentos e dimensões. |
| `types` | Contratos TypeScript. |

O `Stack` principal contém cadastro, avaliação e detalhe. As quatro telas principais ficam no grupo `(tabs)`.

## 💾 Banco de dados

### Escolha: SQLite

O projeto utiliza **SQLite**, por meio de `expo-sqlite`, com o banco local:

```text
conecta-acesso.db
```

A escolha permite:

- Salvar e recuperar a jornada sem backend externo.
- Utilizar uma solução gratuita.
- Organizar informações em tabelas.
- Separar a persistência da interface.
- Manter os dados localmente.

### Tabelas

| Tabela | Conteúdo |
| :--- | :--- |
| `registros` | Estabelecimento, localização, categoria, descrição, foto, status e data de criação. |
| `avaliacoes` | Respostas, largura declarada, observações e data de atualização. |
| `historico_registros` | Eventos de criação e alterações de status. |

Gatilhos do SQLite registram mudanças de status e removem informações associadas quando um relato é excluído.

A inicialização adiciona o suporte a fotos em bancos antigos sem apagar os registros existentes.

Para relatos anteriores à linha do tempo, é criado um evento de início de acompanhamento. Mudanças anteriores não são inventadas ou reconstruídas.

### Fotos

As imagens são armazenadas em Base64 junto ao relato, com limite de tamanho.

Essa é uma simplificação do protótipo. Uma versão de produção precisaria reavaliar o armazenamento de arquivos e a política de retenção.

> [!WARNING]
> O banco é local. Computador e celular não compartilham registros. Limpar os dados do site ou desinstalar o aplicativo pode removê-los. Não existe backup remoto implementado.

## 📡 Origem dos dados

### Parceiros fictícios

Definidos em:

```text
src/services/parceiros.ts
```

O serviço mock utiliza uma operação assíncrona com atraso simulado. Não há API externa nesta versão.

A categoria **Atendimento** não possui parceiros na base de demonstração, permitindo apresentar o estado de lista vazia.

### Relatos e imagens

Devem ser utilizados dados fictícios preenchidos pela equipe e imagens de teste sem informações pessoais.

### Triagem informativa

Definida em:

```text
src/services/avaliacao.ts
```

As orientações são produzidas por regras locais a partir das respostas. Não há inteligência artificial, diagnóstico técnico ou análise automática das imagens.

## 🚀 Como executar

### Pré-requisitos

- Node.js compatível com o Expo SDK do projeto.
- npm.
- Expo Go compatível ou emulador configurado.
- Navegador atualizado para execução web.

### 1. Obter o projeto

Clone este repositório e abra sua pasta no terminal.

### 2. Instalar as dependências

Com o `package-lock.json` versionado:

```bash
npm ci
```

### 3. Iniciar

```bash
npx expo start
```

- **Android:** abra pelo Expo Go ou emulador.
- **iPhone:** escaneie o QR Code pela câmera, com Expo Go compatível instalado.
- Para conexão local, mantenha computador e celular na mesma rede.

### Executar na web

```bash
npx expo start --web --clear
```

O `metro.config.js` contém a configuração necessária ao SQLite web, incluindo suporte a WebAssembly e cabeçalhos para `SharedArrayBuffer`.

### Conferir a tipagem

```bash
npx tsc --noEmit
```

### Conferir dependências

```bash
npx expo install --check
```

### Variáveis de ambiente

Esta versão não exige `.env`, chave de API ou credenciais de banco em nuvem.

### SQLite no navegador

O armazenamento web pode apresentar conflito ao abrir mais de uma instância do aplicativo.

Se ocorrer falha na abertura:

1. Feche as outras abas do aplicativo.
2. Se necessário, encerre o navegador completamente.
3. Abra uma única aba no mesmo endereço.
4. Tente novamente.

A interface apresenta uma mensagem de recuperação. Ela não remove a restrição de acesso simultâneo do armazenamento web.

**Não é necessário apagar o banco para essa tentativa.**

## ♿ Acessibilidade e usabilidade

A interface inclui:

- Rótulos para leitores de tela.
- Identificação de opções selecionadas.
- Alertas de erro.
- Textos com redimensionamento padrão do sistema.
- Áreas de toque amplas nos principais controles.
- Status identificados por palavras.
- Explicação para o botão de status já salvo.
- Formulário dividido em etapas.
- Tema centralizado.
- Layout com rolagem e largura controlada no navegador.

Esses recursos precisam ser avaliados com TalkBack, VoiceOver, fonte ampliada e participação de pessoas com deficiência. Sua implementação não representa certificação de acessibilidade.

## 🧪 Roteiro de validação

Os itens abaixo orientam a verificação. Não representam uma declaração de que todos os testes foram concluídos.

| Área | Verificação |
| :--- | :--- |
| **Cadastro** | Campos obrigatórios, etapas, revisão e cancelamento. |
| **Foto** | Selecionar, trocar, remover, salvar e recuperar. |
| **Questionário** | Salvar respostas e conferir o resumo. |
| **Status** | Alterar, salvar e conferir a linha do tempo. |
| **Persistência** | Fechar e reabrir o app, recuperando os dados. |
| **Exclusão** | Confirmar a remoção e verificar que o relato não reaparece. |
| **Mock** | Carregamento, resultado, vazio, erro e recuperação. |
| **Navegação** | Abas, cadastro, detalhe, avaliação e retorno. |
| **Acessibilidade** | Fonte ampliada, leitor de tela e uso no celular. |

## 📸 Telas do aplicativo

**Adicionar prints reais antes da entrega.**

Salve as imagens nesta estrutura:

```text
docs/
└── prints/
    ├── inicio.png
    ├── cadastro.png
    ├── registros.png
    ├── detalhe.png
    ├── avaliacao.png
    └── explorar.png
```

Depois de enviar as imagens ao GitHub, remova `<!--` e `-->` do bloco abaixo para exibir a galeria.

<!--
<div align="center">

| Início | Cadastro |
| :---: | :---: |
| <img src="docs/prints/inicio.png" width="300" alt="Tela inicial do Conecta Acesso"> | <img src="docs/prints/cadastro.png" width="300" alt="Cadastro de barreira"> |

| Registros | Detalhe |
| :---: | :---: |
| <img src="docs/prints/registros.png" width="300" alt="Lista de registros"> | <img src="docs/prints/detalhe.png" width="300" alt="Detalhe e acompanhamento do relato"> |

| Avaliação | Explorar |
| :---: | :---: |
| <img src="docs/prints/avaliacao.png" width="300" alt="Questionário preliminar"> | <img src="docs/prints/explorar.png" width="300" alt="Consulta de parceiros fictícios"> |

</div>
-->

## 🎬 Vídeo de demonstração

**YouTube — não listado:** ADICIONAR LINK DO VÍDEO

Duração máxima: **3 minutos**.

| Tempo | Conteúdo |
| :--- | :--- |
| 0:00–0:20 | Problema, público e proposta. |
| 0:20–1:00 | Cadastro de um relato fictício. |
| 1:00–1:30 | Questionário e triagem. |
| 1:30–1:55 | Atualização de status e histórico. |
| 1:55–2:25 | Reabertura e recuperação dos dados. |
| 2:25–2:50 | Estados da consulta mock. |
| 2:50–3:00 | Banco escolhido e limites do protótipo. |

## 👥 Equipe

| Integrante | RM |
| :--- | :---: |
| Andre Queiroz | **554503** |
| Paulo Poças | **556080** |
| Rafael Bocchi | **557603** |
| Rafael Oliveira | **554736** |
| Marcus Vinicius | **555490** |

## 📌 Limitações

- Sem autenticação ou separação real de permissões.
- Questionário do responsável representado na mesma instalação.
- Parceiros fictícios e status simulados.
- Sem notificações, contratação ou encaminhamento externo.
- Sem sincronização ou backup remoto.
- Rascunho do formulário não persistido.
- Sem certificação de acessibilidade.
- Pesquisa de campo e impacto ainda não comprovados.
- SQLite web sujeito a restrições de acesso simultâneo.

## 📚 Referências

- [Documentação do Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [Expo Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
- [Acessibilidade no React Native](https://reactnative.dev/docs/accessibility)

---

<div align="center">

**Conecta Acesso**  
Informação para reconhecer barreiras. Conexão para buscar caminhos.

Projeto acadêmico · FIAP · 2026

</div>
