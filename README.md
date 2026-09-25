# Consultório Odontológico Dra. Maria Inês Rocha Machado

Site institucional de página única (one-page) para o consultório em Praia do Canto, Vitória — ES.
HTML, CSS e JavaScript puros: basta abrir `index.html` no navegador ou subir a pasta em qualquer
hospedagem estática (Hostinger, Netlify, Vercel, GitHub Pages).

> **Este site está em MODO DEMONSTRAÇÃO.** A Dra. Maria Inês ainda não é cliente e não forneceu
> nenhum dado. Tudo que é provisório se declara provisório na própria página — ver
> "Sair do modo demonstração" no fim deste arquivo.

## Estrutura

```
index.html          página completa
css/styles.css      estilos (tema claro — branco e azul)
js/main.js          menu, formulário, dock, link ativo e entradas na rolagem
assets/             imagens (ver assets/LEIA-ME.txt)
preview/            vídeo de apresentação e scripts de captura
.impeccable/        backup do estado anterior e histórico de crítica
```

## Seções

Hero · Diferenciais · A Dra. · Tratamentos (8) · Estrutura · Faixa de CTA ·
Depoimentos (grade 2×2) · Dúvidas frequentes (abertas) · Contato com mapa e formulário · Rodapé

## Dados reais já aplicados (fonte: Google Maps)

- **Endereço:** Ed. Plaza Center — Av. Nossa Sra. da Penha, 714, Praia do Canto, Vitória/ES, 29055-912
- **Telefone:** (27) 3227-2022
- **Horário:** segunda a sexta, 8h às 18h

São os únicos dados verificados do projeto. O cartão `assets/og-capa.jpg` contém só eles e
pode ser publicado como está.

## Sair do modo demonstração

Cada item abaixo aparece na página com **contorno tracejado e um rótulo do que falta**, para que
nada seja publicado por engano com valor inventado.

| Item | Onde | Como está |
|---|---|---|
| Número do CRO | hero e rodapé | slot tracejado `CRO-ES · A PREENCHER` |
| Tempo de atuação | seção "A Dra." | slot tracejado `— ANOS · A CONFIRMAR` |
| Biografia | seção "A Dra." | etiqueta "Texto de exemplo. A Dra. escreve o dela." |
| Depoimentos | seção "Depoimentos" | etiqueta "Exemplo de layout. Trocar pelas avaliações reais do Google." |
| WhatsApp | contato, dock e `js/main.js` (`CONFIG.whatsapp`) | slot + número placeholder no código |
| E-mail | contato e `js/main.js` (`CONFIG.email`) | slot tracejado |
| Instagram | rodapé | ícone inativo + "Perfis a confirmar" |
| Fotos | `assets/` | placeholders azuis rotulados "imagem provisória" |
| Convênios e pagamentos | seção "Dúvidas" | resposta remete ao telefone — confirmar antes de afirmar |
| Domínio, canonical e og:image | `<head>` do `index.html` | comentário com as três linhas a acrescentar |

Quando tudo estiver preenchido, remover no `index.html` o bloco `<div class="demo-bar">`
e as classes `.slot` / `.demo-note`.

## Formulário

Sem back-end: monta a mensagem e abre o WhatsApp. Se o navegador bloquear a janela (bloqueador
de pop-up, navegador embutido do próprio WhatsApp), **o formulário não é apagado** e a página
oferece o link da conversa como saída. Para mudar o destino, edite `CONFIG` no topo de `js/main.js`:

```js
const CONFIG = {
  whatsapp: '5527999999999',  // DDI + DDD + número
  modoEnvio: 'whatsapp',      // ou 'email'
  email: 'contato@draMariaInes.com.br'
};
```

## Detalhes técnicos

- Responsivo (desktop, tablet e celular), gaveta lateral no mobile com foco preso e Escape
- **Funciona inteiro sem JavaScript** — nenhum conteúdo depende de script para aparecer
- Dock fixo no celular com telefone e WhatsApp no mesmo peso (mesmo botão, só ícone e rótulo mudam); some quando o formulário entra na tela
- Dados estruturados `schema.org/Dentist` para SEO local (só com dados verificados)
- Acessibilidade: navegação por teclado, foco visível, `aria-*`, alvos de toque de 44px,
  contraste AA em texto e bordas de campo, link "pular para o conteúdo"
- Movimento (fim de `css/styles.css`, seção "Movimento"):
  - **abertura** — a marca se desenha, o título sobe linha a linha, o retrato sobe como cortina;
  - **rolagem** — títulos saem de uma fenda, cards sobem em sequência por coluna, fotos assentam
    dentro dos cards, os checks do "A Dra." se traçam e cada campo tracejado recebe um brilho
    único ao aparecer (o recado do que falta preencher);
  - **detalhes** — barra de progresso no header, voltar ao topo (desktop), véu atrás do menu,
    dúvidas que abrem e fecham com suavidade, mapa com brilho de carregamento, erro do formulário
    que treme de leve e botão que confirma o envio.
- O estado padrão de tudo é visível. Sem JavaScript, com `prefers-reduced-motion`, na impressão
  ou abrindo com `?estatico` na URL (útil para prints de página inteira), nada começa escondido
- Sem dependências além do Google Fonts

## Prévia

`preview/` traz a rolagem completa do site em GIF e MP4, mais os scripts que geram esses arquivos.

> **Os vídeos atuais estão desatualizados.** Foram gravados antes das animações.
> `capturar-gif.mjs` agora controla o relógio das animações: cada quadro avança exatamente
> 1/30 s, então as entradas aparecem suaves no vídeo e a abertura do hero entra nos primeiros
> 3,5 s. Regere antes de enviar — ver `preview/LEIA-ME.txt`.
