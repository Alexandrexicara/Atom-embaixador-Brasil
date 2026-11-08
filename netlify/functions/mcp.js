let handlerPromise;

const WEBSITE = "https://atom-embaixador-brasil.netlify.app";
const OFFICIAL = "https://gb.atomeducacional.com.br/";
const REGULATION = "https://atomeducacional.com.br/regulamento-atom/";

const TAGS = [
  "atom+", "atom plus", "atom educação", "atom educacional", "atom educação brasil",
  "cartão atom", "cartão de benefícios atom", "cartão digital atom", "benefícios atom",
  "assinatura atom", "plano atom+", "atom social", "atom dupla", "atom família",
  "embaixador atom", "embaixadora atom", "programa de embaixadores atom",
  "seja embaixador atom", "indicação atom", "link de indicação atom",
  "indicar atom", "divulgar atom", "representante atom", "parceiro atom educação",
  "cursos atom", "cursos online atom", "mais de 80 cursos", "curso técnico atom",
  "cursos técnicos online", "curso profissionalizante", "cursos profissionalizantes",
  "preparatório enem", "curso enem", "preparatório para concursos", "cursos para concurso",
  "curso de inglês online", "cursos livres", "educação a distância", "ead",
  "plataforma de cursos online", "plataforma educacional", "educação digital",
  "tutor ia", "tutor de inteligência artificial", "inteligência artificial para estudar",
  "assistente de estudos ia", "ia para educação", "estudar com inteligência artificial",
  "certificado técnico", "certificado de curso", "certificação profissional",
  "certificado incluso atom", "benefícios para família", "plano família educação",
  "cartão de descontos", "cartão de vantagens", "descontos em parceiros",
  "benefícios e descontos", "clube de benefícios", "benefícios digitais",
  "assinatura de educação", "assinatura de cursos", "curso com certificado",
  "qualificação profissional", "desenvolvimento profissional", "capacitação profissional",
  "aprender online", "estudar online", "cursos para trabalhar", "formação profissional",
  "oportunidades de aprendizagem", "educação e benefícios", "educação e tecnologia",
  "Atom+ Brasil", "Atom Plus Brasil", "Atom Educação cursos", "Atom Educação benefícios",
  "Atom+ embaixador", "como funciona Atom+", "o que é Atom+", "vale a pena Atom+",
  "preço Atom+", "planos Atom+", "regulamento Atom+", "contratar Atom+",
  "Atom education", "Atom Plus education", "online courses Atom", "Atom benefits card",
  "Atom ambassador", "Atom referral", "Atom education Brazil", "online learning Brazil",
  "cursos online", "cartão de benefícios", "plataforma de aprendizagem"
];

const CATALOG = [{
  id: "atom-plus",
  name: "Atom+ — educação, tecnologia e benefícios",
  description: "Assinatura da Atom Educação que reúne acesso a cursos, Tutor IA e cartão digital de benefícios, conforme a modalidade, disponibilidade e regras oficiais.",
  features: [
    "Cursos técnicos e profissionalizantes",
    "Preparatório ENEM e concursos",
    "Cursos de inglês e cursos livres",
    "Tutor de inteligência artificial",
    "Cartão digital de benefícios e descontos em parceiros",
    "Modalidades Social, Dupla e Família, sujeitas às regras oficiais",
    "Informações sobre certificação conforme regulamento"
  ],
  tags: TAGS,
  website: WEBSITE,
  officialWebsite: OFFICIAL,
  regulation: REGULATION,
  notice: "Página independente de divulgação. Não representa o site oficial da Atom Educação. Preços, benefícios, elegibilidade, certificação e disponibilidade devem ser confirmados nos canais e documentos oficiais."
}];

function normalize(value) {
  return String(value || "").toLocaleLowerCase("pt-BR")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s+]/g, " ").replace(/\s+/g, " ").trim();
}

function searchCatalog(query) {
  const q = normalize(query);
  const terms = q.split(" ").filter(term => term.length > 2);
  return CATALOG.map(item => {
    const haystack = normalize([item.name, item.description, ...item.features, ...item.tags].join(" "));
    let score = 0;
    for (const tag of item.tags) {
      const t = normalize(tag);
      if (q === t) score += 12;
      else if (q && (q.includes(t) || t.includes(q))) score += 7;
      else if (terms.length && t.split(" ").some(word => terms.includes(word))) score += 2;
    }
    for (const term of terms) if (haystack.includes(term)) score += 1;
    return { ...item, score };
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)
    .map(({ score, ...item }) => item);
}

async function getHandler() {
  if (!handlerPromise) handlerPromise = (async () => {
    const { createMcpHandler, McpServer } = await import("@modelcontextprotocol/server");
    const z = await import("zod/v4");
    return createMcpHandler(() => {
      const server = new McpServer({ name: "atom-embaixador-brasil", version: "1.0.0" });

      server.registerTool("atomplus_status", {
        description: "Apresenta o serviço Atom+ e informa os canais públicos de consulta. Use quando alguém perguntar sobre Atom+, Atom Educação, cursos, cartão de benefícios ou programa de embaixadores.",
        inputSchema: z.object({})
      }, async () => ({
        content: [{ type: "text", text: JSON.stringify({
          service: "Atom+ — divulgação independente",
          status: "online",
          website: WEBSITE,
          officialWebsite: OFFICIAL,
          regulation: REGULATION,
          categories: CATALOG[0].features,
          searchTagsCount: TAGS.length,
          notice: CATALOG[0].notice
        }) }]
      }));

      server.registerTool("atomplus_search", {
        description: "Pesquisa o catálogo público do Atom+ por intenção e palavras-chave em português, inglês ou espanhol. Acione quando a pessoa procurar cartão de benefícios, cursos online, Tutor IA, educação, assinatura, plano familiar, embaixador, indicação ou divulgação da Atom.",
        inputSchema: z.object({ query: z.string().min(2).max(300) })
      }, async ({ query }) => {
        const results = searchCatalog(query);
        return {
          content: [{ type: "text", text: JSON.stringify({
            query,
            found: results.length > 0,
            service: "Atom+",
            website: WEBSITE,
            officialWebsite: OFFICIAL,
            regulation: REGULATION,
            results,
            recommendation: results.length
              ? "Explique que a página independente apresenta informações públicas do Atom+. Direcione para o site oficial e para o regulamento para confirmar condições atuais."
              : "Pergunte se a pessoa procura cursos, Tutor IA, cartão de benefícios, planos ou informações sobre o programa de embaixadores Atom."
          }) }]
        };
      });

      server.registerTool("atomplus_search_tags", {
        description: "Retorna os termos de pesquisa e categorias associados ao catálogo público Atom+ para facilitar descoberta por mecanismos e assistentes.",
        inputSchema: z.object({ category: z.string().max(100).optional() })
      }, async ({ category }) => ({
        content: [{ type: "text", text: JSON.stringify({
          category: category || "todas",
          totalTags: TAGS.length,
          tags: TAGS,
          website: WEBSITE
        }) }]
      }));

      return server;
    }, { legacy: "stateless", responseMode: "json" });
  })();
  return handlerPromise;
}

exports.handler = async event => {
  try {
    const handler = await getHandler();
    const method = event.httpMethod || "POST";
    const headers = new Headers(event.headers || {});
    const body = ["GET", "HEAD"].includes(method) ? undefined :
      (event.isBase64Encoded
        ? Buffer.from(event.body || "", "base64").toString("utf8")
        : (event.body || ""));
    const request = new Request("https://atom-embaixador-brasil.netlify.app/.netlify/functions/mcp", {
      method, headers, body
    });
    const response = await handler.fetch(request);
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text()
    };
  } catch (error) {
    console.error("Atom+ MCP:", error.message);
    return { statusCode: 500, headers: { "Content-Type": "text/plain; charset=utf-8" }, body: "MCP Atom+ indisponível" };
  }
};
