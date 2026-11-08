# Atom+ — Página independente de divulgação

Site estático responsivo para apresentar o Atom+ da Atom Educação com transparência. Não é um site oficial da empresa.

## Arquivos
- index.html — página completa e responsiva.
- config.js — link de indicação, código público e WhatsApp.
- script.js — configura os links e o ano do rodapé.

## Configuração
Edite `config.js` somente depois de receber os dados oficiais e autorização:
- `referralUrl`: link exclusivo de indicação.
- `ambassadorCode`: código público, se houver.
- `whatsappNumber`: telefone com DDI e DDD, apenas números.

Não coloque senhas, tokens privados ou chaves de API no site.

## Netlify
Importe este repositório no Netlify. Build command: vazio. Publish directory: `.`.

## Transparência
A página informa que é independente e não declara aprovação como embaixador nem promete comissão. Preços, benefícios, elegibilidade e condições podem mudar; prevalecem o regulamento e o checkout oficiais.

Fontes:
- https://gb.atomeducacional.com.br/
- https://atomeducacional.com.br/regulamento-atom/
- https://atomeducacional.com.br/atom-como-funciona-o-cartao-de-beneficios-da-atom/

## MCP e descoberta pelo ChatGPT

O projeto disponibiliza um servidor MCP público em:

- Endpoint MCP: https://atom-embaixador-brasil.netlify.app/mcp
- Ferramenta `atomplus_status`: apresenta o serviço e os canais oficiais.
- Ferramenta `atomplus_search`: pesquisa o catálogo por intenção e palavras-chave.
- Ferramenta `atomplus_search_tags`: retorna os termos de descoberta configurados.

O catálogo inclui aproximadamente 100 termos em português, inglês e espanhol, relacionados a cursos, Tutor IA, cartão de benefícios, assinatura, planos e programa de embaixadores.

O MCP divulga somente informações públicas. Não contém senha, token privado ou credencial da conta de embaixador. O link individual de indicação deve ser configurado somente quando for obtido no painel oficial e confirmado como link público.

### Publicação

A rota `/mcp` é encaminhada à função serverless do Netlify. Após o deploy, valide a resposta MCP pelo endpoint e conecte-o a um cliente compatível com MCP.
