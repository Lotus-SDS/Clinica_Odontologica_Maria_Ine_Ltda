# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Plateia que decide hoje: a Dra. Maria Inês Rocha Machado.** Este site é uma peça
especulativa — ela ainda não é cliente e não sabe que ele existe. A abordagem chega
por GIF/MP4 no WhatsApp ou e-mail (`preview/site-scroll.mp4`), então a primeira
plateia assiste à página rolar sozinha, em silêncio, num celular, sem clicar em nada.

**Plateia que o site representa: quem procura dentista em Vitória — ES.** Moradores da
Praia do Canto e bairros vizinhos (Jardim da Penha, Barro Vermelho) buscando clínica
geral, implante, ortodontia, estética ou urgência. Faixa etária ampla, incluindo
pacientes mais velhos e famílias com crianças. Uma parcela relevante chega com medo de
dentista — a própria página já trata isso como objeção explícita, na seção de dúvidas.

## Product Purpose

O consultório odontológico existe em Praia do Canto, Vitória/ES, e hoje não tem
presença digital própria: quem o procura encontra apenas a ficha do Google Maps.

O site resolve isso apresentando a Dra. Maria Inês, os tratamentos, a estrutura e os
canais de agendamento numa página única.

**Sucesso tem duas camadas, e a de cima ainda não foi vencida:**

1. *Agora:* a Dra. Maria Inês responder à abordagem e querer conversar. Enquanto isso
   não acontece, nada mais no projeto importa.
2. *Depois de fechado:* o visitante agendar uma avaliação — por telefone
   **ou** por WhatsApp, com peso igual entre os dois canais. Nenhum deles é o
   principal; a página não deve empurrar um em detrimento do outro.

## Positioning

A proposta que um concorrente não copiaria de graça: chegar com o trabalho **já
feito**, ancorado nos dados públicos reais do consultório (endereço, telefone e
horário do Google Maps), em vez de um orçamento e um portfólio genérico.

O site, em si, posiciona o consultório pelo método de atendimento — diagnóstico antes
de procedimento, explicação de cada etapa, prazos e valores declarados antes de começar
— e não por preço ou volume.

## Operating Context

- **Contexto de descoberta do paciente:** busca local no Google por dentista em Praia
  do Canto, ou indicação. O site é destino, não origem de tráfego pago.
- **Contexto de leitura do paciente:** majoritariamente celular, muitas vezes com dor
  ou ansiedade, decidindo entre algumas opções próximas de casa.
- **Contexto de leitura da Dra.:** vídeo de rolagem automática, 33,5 s, sem interação.
  Toda a argumentação precisa sobreviver a isso. Detalhes que só aparecem ao clicar,
  passar o mouse ou abrir um acordeão são invisíveis na primeira impressão.
- **Operação do consultório:** hora marcada, segunda a sexta, 8h–18h. Sem atendimento
  aos fins de semana. Sem sistema de agendamento online — o contato termina em pessoa.

## Capabilities and Constraints

- **Página única estática.** HTML, CSS e JS puros, sem build e sem back-end. Publicável
  em qualquer hospedagem estática. Única dependência externa: Google Fonts.
- **Formulário sem servidor.** Monta a mensagem e abre o WhatsApp (ou o cliente de
  e-mail). Configurável em `CONFIG`, no topo de `js/main.js`. Não há armazenamento de
  lead, envio autenticado nem confirmação de recebimento.
- **Idioma:** pt-BR, mercado local de Vitória/ES. Não há previsão de i18n.
- **SEO local** via `schema.org/Dentist` com endereço, telefone e horário reais.
- **Substituição de assets sem retrabalho:** as fotos são trocadas sobrescrevendo os
  arquivos em `assets/` com os mesmos nomes; o CSS não muda. Qualquer trabalho futuro
  deve preservar essa propriedade.
- **Domínio, hospedagem e canonical indefinidos.** `<link rel="canonical">` está `#`.
- **`assets/placeholders-antigos/`** guarda os placeholders azuis rotulados "imagem
  provisória" — alternativa pronta às fotos de banco.

## Brand Commitments

Nenhuma identidade visual preexistente foi fornecida pelo consultório. Não há logo,
paleta, tipografia ou manual de marca oficiais. O que existe no código hoje (marca
dentária em círculo, azul e branco, Inter + Playfair Display) foi criado nesta peça
especulativa e **não é compromisso de marca** — é hipótese, substituível.

Compromisso factual único: o nome completo, **Dra. Maria Inês Rocha Machado**, e a
designação **cirurgiã-dentista**.

## Evidence on Hand

**Real e verificável** (fonte: ficha pública do Google Maps):

- Endereço: Ed. Plaza Center — Av. Nossa Sra. da Penha, 714, Praia do Canto,
  Vitória/ES, 29055-912
- Telefone: (27) 3227-2022
- Horário: segunda a sexta, 8h às 18h
- `assets/og-capa.jpg` — cartão gerado aqui, contendo apenas esses dados reais.
  Não é foto, não é placeholder, pode ser publicado.
- `preview/` — rolagem completa em MP4, WebP e dois GIFs, mais os scripts de captura
  (`capturar-gif.mjs`, `gerar-placeholders.mjs`). É a peça de abordagem.

**Inexistente — nunca apresentar como fato, nunca preencher por conta própria:**

- **Número do CRO.** Está `0000` no hero e no rodapé. Publicar um número inventado
  é falsificar registro profissional.
- **Formação, especializações e tempo de atuação.** O "+20 anos" da seção "A Dra." é
  invenção desta peça, assim como toda a biografia.
- **Depoimentos.** Os quatro depoimentos (Ana L., Rodrigo M., Camila S., Paulo H.) são
  exemplos de layout. Não são avaliações reais.
- **Fotos de pessoas.** Tudo em `assets/` é banco de imagens (Pexels, licença livre
  inclusive comercial). **A mulher do hero não é a Dra. Maria Inês** — apresentá-la como
  se fosse é o risco mais grave do projeto. Vale o mesmo para as pessoas da recepção e
  do atendimento. A licença Pexels proíbe sugerir que os retratados endossam o negócio.
  A foto de "esterilização" é, na verdade, uma coroa protética.
- **WhatsApp** (`5527999999999`), **Instagram** (`#`) e **e-mail**
  (`contato@draMariaInes.com.br`): todos placeholders.
- **Convênios e formas de pagamento.** A resposta nas dúvidas frequentes desconversa
  de propósito, remetendo ao telefone. Confirmar antes de afirmar qualquer coisa.
- **Estacionamento.** "Boa oferta de estacionamentos nas proximidades" não foi
  verificado.

**Decisão tomada sobre esse vazio:** na demo, o conteúdo provisório deve **se declarar
provisório**. A peça não simula um site pronto. Isso protege contra parecer que
credenciais foram inventadas e, de quebra, mostra à Dra. exatamente o que ela precisa
enviar para o site sair do ar de rascunho.

## Product Principles

1. **Credencial não se inventa.** CRO, formação, tempo de atuação e depoimentos ou são
   reais ou aparecem declaradamente vazios. Nenhum trabalho futuro preenche esses
   campos com texto plausível.
2. **O rosto não é dela.** Enquanto não houver foto real, nenhuma imagem de pessoa pode
   ocupar uma posição que a identifique como a Dra. Maria Inês.
3. **Duas plateias, uma peça.** Cada decisão precisa funcionar para o paciente que
   agenda e para a dentista que avalia se quer contratar. Quando as duas divergem, a
   dentista decide primeiro — ela é o obstáculo atual.
4. **A prova está na rolagem.** A primeira impressão é um vídeo mudo, sem cliques. A
   argumentação tem que caber no que se vê rolando.
5. **Dois canais, mesmo peso.** Telefone e WhatsApp são igualmente válidos. Nenhuma
   hierarquia visual deve eleger um vencedor.
6. **Troca sem retrabalho.** O conteúdo real vai entrar depois, por outra pessoa e sem
   contexto. Substituir foto, número ou depoimento tem que ser sobrescrever um arquivo
   ou editar uma linha — nunca refazer layout.

## Accessibility & Inclusion

- **Faixa etária ampla**, incluindo pacientes mais velhos: legibilidade de corpo de
  texto, alvos de toque generosos e contraste são requisitos de público, não refinamento.
- **Ansiedade odontológica** é um estado real de parte do público. Tom e ritmo da página
  são parte do atendimento.
- O código hoje já entrega navegação por teclado, foco visível, `aria-*`, link "pular
  para o conteúdo" e respeito a `prefers-reduced-motion`. Esse patamar é piso, não teto,
  e nenhum trabalho futuro pode regredi-lo.
