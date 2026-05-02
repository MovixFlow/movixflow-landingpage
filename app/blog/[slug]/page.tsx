import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { ArrowLeft, Calendar, Clock, User } from "lucide-react"

const articles = [
  {
    slug: "como-reduzir-riscos-logisticos",
    title: "Como reduzir riscos logísticos em 65%",
    excerpt: "Descubra as estratégias que transportadoras líderes estão usando para minimizar incidentes e aumentar a segurança da operação.",
    category: "Gestão de Riscos",
    date: "2025-01-15",
    dateFormatted: "15 de janeiro de 2025",
    readTime: "5 min",
    image: "/logistics-risk-management.jpg",
    author: "Equipe MovixFlow",
    content: `
      <p>A gestão de riscos logísticos é um dos maiores desafios enfrentados pelas transportadoras brasileiras. Com o aumento do volume de cargas, a complexidade das rotas e a escassez de motoristas qualificados, as empresas precisam adotar estratégias inteligentes para proteger seu patrimônio e manter a eficiência operacional.</p>

      <h2>O que é gestão de riscos logísticos?</h2>
      <p>Gestão de riscos logísticos é o conjunto de práticas, processos e tecnologias utilizados para identificar, avaliar e mitigar ameaças à operação de transporte. Isso inclui desde a validação prévia de motoristas até o monitoramento em tempo real das frotas, passando pelo controle de jornada e a análise preditiva de sinistros.</p>

      <h2>Principais fontes de risco no transporte rodoviário</h2>
      <p>As transportadoras brasileiras enfrentam três categorias principais de risco:</p>
      <ul>
        <li><strong>Risco de motorista:</strong> habilitação vencida, histórico de infrações, fadiga, consumo de substâncias</li>
        <li><strong>Risco de carga:</strong> roubo, avaria, desvio de rota, subdeclaração</li>
        <li><strong>Risco operacional:</strong> falha mecânica, documentação irregular, não conformidade com ANTT</li>
      </ul>

      <h2>Estratégia 1: Validação biométrica no cadastro de motoristas</h2>
      <p>A primeira linha de defesa é garantir que o motorista que inicia a viagem é quem diz ser. A biometria facial no momento do cadastro e na liberação de cada embarque elimina o uso de documentos fraudulentos e o chamado "laranja" — motorista que cede seus documentos a terceiros.</p>
      <p>Transportadoras que implementaram validação biométrica relatam redução de até 40% nos casos de fraude documental nos primeiros 90 dias de uso.</p>

      <h2>Estratégia 2: Alertas preditivos baseados em perfil de risco</h2>
      <p>Sistemas modernos de gestão de risco cruzam dados de CNH, histórico de infrações, score de condução e jornada de trabalho para gerar um perfil de risco individual por motorista. Quando esse perfil ultrapassa limiares predefinidos, alertas automáticos são disparados para o gestor antes do embarque.</p>
      <p>Essa abordagem proativa é mais eficaz do que a análise reativa pós-sinistro, pois permite intervenção antes que o dano ocorra.</p>

      <h2>Estratégia 3: Monitoramento contínuo de jornada</h2>
      <p>A fadiga do motorista é responsável por aproximadamente 30% dos acidentes graves no transporte rodoviário brasileiro, segundo dados da ANTT. O controle eletrônico de jornada, integrado a alertas de tempo de direção contínua, reduz significativamente esse risco.</p>

      <h2>Resultados mensuráveis</h2>
      <p>Transportadoras que adotam uma plataforma integrada de gestão de riscos — combinando validação biométrica, alertas preditivos e monitoramento de jornada — conseguem reduzir a taxa de sinistros em 65% em média nos primeiros 12 meses de operação. O retorno sobre o investimento costuma ser positivo já no terceiro mês, considerando apenas a redução de custos com sinistros e franquias de seguro.</p>
    `,
  },
  {
    slug: "futuro-logistica-ia-preditiva",
    title: "O futuro da logística com IA preditiva",
    excerpt: "Inteligência artificial está revolucionando a forma como prevemos e evitamos problemas operacionais no transporte rodoviário.",
    category: "Tecnologia",
    date: "2025-01-12",
    dateFormatted: "12 de janeiro de 2025",
    readTime: "7 min",
    image: "/ai-logistics-technology.jpg",
    author: "Equipe MovixFlow",
    content: `
      <p>A inteligência artificial aplicada à logística deixou de ser tendência para se tornar vantagem competitiva real. Transportadoras que já utilizam IA preditiva reportam ganhos expressivos em eficiência operacional e redução de custos.</p>

      <h2>Como a IA preditiva funciona na logística</h2>
      <p>Modelos de machine learning analisam grandes volumes de dados históricos — rotas, motoristas, veículos, condições climáticas, sazonalidade — para identificar padrões que precedem incidentes. O sistema aprende continuamente com cada nova ocorrência, refinando suas previsões ao longo do tempo.</p>

      <h2>Casos de uso práticos</h2>
      <p>As principais aplicações de IA preditiva no transporte rodoviário brasileiro incluem:</p>
      <ul>
        <li><strong>Predição de falhas mecânicas:</strong> análise de dados de telemetria para antecipar necessidade de manutenção</li>
        <li><strong>Score de risco por motorista:</strong> cruzamento de múltiplas variáveis para gerar índice de risco individual</li>
        <li><strong>Otimização de rotas:</strong> algoritmos que consideram risco histórico por corredor logístico</li>
        <li><strong>Previsão de sinistralidade:</strong> modelos que estimam probabilidade de ocorrências por região e período</li>
      </ul>

      <h2>Impacto nos resultados das transportadoras</h2>
      <p>Segundo dados coletados pela MovixFlow em clientes que utilizam o módulo de BI com IA preditiva, os resultados médios após 12 meses incluem: redução de 65% nos incidentes graves, diminuição de 28% nos custos com manutenção corretiva e aumento de 18% na pontuação de eficiência operacional da frota.</p>

      <h2>O que esperar para os próximos anos</h2>
      <p>A próxima fronteira é a IA generativa aplicada a relatórios executivos e à comunicação de riscos. Em vez de dashboards com dados brutos, gestores receberão briefings em linguagem natural com recomendações acionáveis geradas automaticamente — transformando dados em decisões mais rápidas e precisas.</p>
    `,
  },
  {
    slug: "gestao-de-fretes-melhores-praticas",
    title: "Gestão de fretes: melhores práticas",
    excerpt: "Aprenda como otimizar sua operação de fretes e conectar-se com motoristas validados para reduzir custos e aumentar a confiabilidade.",
    category: "Operações",
    date: "2025-01-10",
    dateFormatted: "10 de janeiro de 2025",
    readTime: "6 min",
    image: "/freight-management-trucks.jpg",
    author: "Equipe MovixFlow",
    content: `
      <p>Uma gestão eficiente de fretes é o coração de qualquer transportadora competitiva. Com margens pressionadas e demanda por confiabilidade crescente, otimizar cada etapa do processo — do cadastro do motorista à entrega documentada — faz diferença direta no resultado financeiro.</p>

      <h2>O problema do frete sem validação</h2>
      <p>O modelo tradicional de contratação de fretes no Brasil ainda depende fortemente de indicações informais e verificações manuais de documentação. Isso gera riscos significativos: motoristas com CNH vencida, veículos com documentação irregular e histórico de ocorrências desconhecido pelo embarcador.</p>

      <h2>Marketplace de fretes com validação integrada</h2>
      <p>A evolução natural é o marketplace de fretes com validação prévia de motoristas. Nesse modelo, apenas motoristas que passaram por verificação biométrica, checagem de documentos e análise de histórico têm acesso às cargas disponíveis. O embarcador sabe, antes de confirmar o frete, que está contratando um profissional qualificado e regularizado.</p>

      <h2>Práticas essenciais para gestão de fretes</h2>
      <ul>
        <li><strong>Checklist digital no embarque:</strong> substituir o papel por registros digitais com foto, geolocalização e timestamp</li>
        <li><strong>Rating bidirecional:</strong> motoristas avaliam embarcadores e vice-versa, criando accountability em ambas as pontas</li>
        <li><strong>Rastreamento em tempo real:</strong> visibilidade da posição e status da carga durante toda a jornada</li>
        <li><strong>Documentação eletrônica:</strong> CIOT, MDF-e e CT-e gerenciados na mesma plataforma</li>
      </ul>

      <h2>Indicadores de performance para gestão de fretes</h2>
      <p>As transportadoras mais eficientes monitoram: OTD (On Time Delivery), taxa de avaria por corredor, custo por tonelada-quilômetro, índice de devoluções e NPS de clientes. A análise conjunta desses indicadores permite identificar gargalos e oportunidades de melhoria com precisão cirúrgica.</p>
    `,
  },
  {
    slug: "seguranca-transporte-cargas",
    title: "Segurança em transporte de cargas",
    excerpt: "Protocolos essenciais para garantir a segurança de cargas de alto valor e perecíveis no transporte rodoviário brasileiro.",
    category: "Segurança",
    date: "2025-01-08",
    dateFormatted: "8 de janeiro de 2025",
    readTime: "4 min",
    image: "/cargo-security-transport.jpg",
    author: "Equipe MovixFlow",
    content: `
      <p>O Brasil registra perdas bilionárias anuais com roubos de carga. Segundo a CNT, o roubo de cargas custa ao setor logístico brasileiro mais de R$ 1,2 bilhão por ano — valor que impacta diretamente a competitividade das transportadoras e o custo dos produtos para o consumidor final.</p>

      <h2>Principais vulnerabilidades no transporte de cargas</h2>
      <p>Os criminosos exploram pontos específicos da cadeia logística: patios não monitorados, rotas previsíveis, comunicação não criptografada entre motorista e base, e a ausência de verificação de identidade no carregamento. Cada uma dessas vulnerabilidades pode ser endereçada com protocolos adequados.</p>

      <h2>Protocolo de segurança em 5 camadas</h2>
      <ol>
        <li><strong>Validação de identidade:</strong> biometria facial no embarque para confirmar que o motorista autorizado está conduzindo o veículo</li>
        <li><strong>Rastreamento ativo:</strong> monitoramento GPS com alertas de desvio de rota e paradas não autorizadas</li>
        <li><strong>Comunicação segura:</strong> canal criptografado entre motorista e central de operações</li>
        <li><strong>Alertas de comportamento:</strong> detecção automática de velocidade excessiva, frenagem brusca e tempo excessivo parado</li>
        <li><strong>Registro documental:</strong> checklist fotográfico no embarque e na entrega com geolocalização e timestamp</li>
      </ol>

      <h2>Cargas de alto valor: cuidados especiais</h2>
      <p>Cargas com valor acima de R$ 500.000 exigem protocolos adicionais: escoltas, rotas alternativas comunicadas apenas no momento do embarque, e check-ins obrigatórios a cada intervalo definido. A MovixFlow oferece módulos específicos para gestão de cargas de alto valor com integração a seguradoras parceiras.</p>
    `,
  },
  {
    slug: "monitoramento-tempo-real",
    title: "Monitoramento em tempo real: guia completo",
    excerpt: "Como implementar sistemas de rastreamento e monitoramento eficazes para sua frota de transportes.",
    category: "Tecnologia",
    date: "2025-01-05",
    dateFormatted: "5 de janeiro de 2025",
    readTime: "8 min",
    image: "/real-time-tracking-monitoring.jpg",
    author: "Equipe MovixFlow",
    content: `
      <p>O monitoramento em tempo real da frota evoluiu de diferencial competitivo para requisito básico de operação. Embarcadores exigem visibilidade da carga. Seguradoras concedem descontos para frotas monitoradas. E os próprios motoristas se beneficiam do suporte que a tecnologia proporciona em situações de emergência.</p>

      <h2>Componentes de um sistema de monitoramento eficaz</h2>
      <p>Um sistema completo de monitoramento de frotas integra três camadas tecnológicas:</p>
      <ul>
        <li><strong>Hardware embarcado:</strong> rastreador GPS com comunicação GSM/4G, sensor de ignição e integração com tacógrafo</li>
        <li><strong>Plataforma de gestão:</strong> dashboard em tempo real com mapa, alertas configuráveis e histórico de rotas</li>
        <li><strong>Aplicativo do motorista:</strong> comunicação bidirecional, checklist digital e registro de ocorrências</li>
      </ul>

      <h2>Indicadores que o monitoramento fornece</h2>
      <p>Além da posição em tempo real, sistemas modernos de telemetria capturam: velocidade instantânea e média, RPM do motor, consumo de combustível, temperatura da carga (para refrigerados), tempo de motor ligado versus desligado e eventos de condução agressiva.</p>

      <h2>Alertas que fazem diferença na operação</h2>
      <p>Os alertas mais relevantes para redução de risco incluem: desvio de rota (ativado quando o veículo sai do corredor geofenciado), parada não autorizada, velocidade excessiva, jornada de condução acima do limite legal, e violação de área restrita. A configuração correta dos limiares de alerta determina o equilíbrio entre segurança e excesso de notificações que gera fadiga de alerta.</p>

      <h2>Integração com outros sistemas</h2>
      <p>O maior valor do monitoramento está na integração com o TMS (sistema de gestão de transporte), ERP e plataforma de risco. Quando os dados de telemetria alimentam automaticamente os indicadores de risco por motorista, a gestão deixa de ser reativa e passa a ser genuinamente preditiva.</p>
    `,
  },
  {
    slug: "analise-dados-logistica-eficiente",
    title: "Análise de dados para logística eficiente",
    excerpt: "Transforme dados operacionais em insights acionáveis para melhorar sua operação logística e reduzir custos.",
    category: "Análise",
    date: "2025-01-03",
    dateFormatted: "3 de janeiro de 2025",
    readTime: "6 min",
    image: "/data-analytics-logistics.jpg",
    author: "Equipe MovixFlow",
    content: `
      <p>Transportadoras brasileiras geram volumes massivos de dados operacionais todos os dias — rotas, tempos, consumos, ocorrências, notas fiscais. A maioria desses dados não é aproveitada para tomada de decisão. O resultado: gestão baseada em intuição onde deveria haver evidência.</p>

      <h2>Os dados mais valiosos na operação logística</h2>
      <p>Nem todo dado tem o mesmo valor. Os indicadores que mais impactam a rentabilidade e segurança da operação são: custo por tonelada-quilômetro (identifica ineficiências de rota), índice de sinistralidade por motorista (base para treinamento e desligamento), taxa de utilização da frota (oportunidade de reduzir capital imobilizado) e OTD por cliente (impacta diretamente a renovação de contratos).</p>

      <h2>Da planilha ao BI executivo</h2>
      <p>O primeiro passo é consolidar dados hoje dispersos em planilhas, sistemas legados e papéis em uma única base. A partir daí, dashboards executivos permitem que diretores e CEOs monitorem os KPIs mais importantes com atualização em tempo real, sem depender de relatórios manuais semanais ou mensais que chegam tarde demais para gerar ação.</p>

      <h2>Análise de sinistralidade: o caso de uso mais rentável</h2>
      <p>A análise histórica de sinistros por corredor logístico, período do ano, tipo de carga e perfil de motorista permite identificar padrões de risco que não são visíveis na análise caso a caso. Uma transportadora que identificou que 70% dos seus sinistros graves ocorriam em um único corredor logístico, em uma janela de 6 horas específica, conseguiu eliminar esse horário da programação e reduzir sua sinistralidade em 40% — sem qualquer investimento adicional em segurança física.</p>

      <h2>Como começar</h2>
      <p>O ponto de partida é definir os três indicadores mais críticos para o negócio e garantir que são medidos com precisão e frequência adequada. Dashboards com 50 KPIs não funcionam — gestão eficaz começa com foco em poucos números que realmente movem o negócio.</p>
    `,
  },
]

type Params = { slug: string }

export async function generateStaticParams(): Promise<Params[]> {
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) return { title: "Artigo não encontrado | MovixFlow" }

  return {
    title: `${article.title} | Blog MovixFlow`,
    description: article.excerpt,
    alternates: { canonical: `https://site.movixflow.com.br/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `https://site.movixflow.com.br/blog/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      images: [{ url: article.image, width: 1200, height: 630, alt: article.title }],
    },
  }
}

export default function BlogPostPage({ params }: { params: Params }) {
  const article = articles.find((a) => a.slug === params.slug)
  if (!article) notFound()

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: `https://site.movixflow.com.br${article.image}`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "MovixFlow",
      url: "https://site.movixflow.com.br",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://site.movixflow.com.br/#organization",
      name: "MovixFlow",
      logo: { "@type": "ImageObject", url: "https://site.movixflow.com.br/logo.svg" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://site.movixflow.com.br/blog/${article.slug}`,
    },
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://site.movixflow.com.br" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://site.movixflow.com.br/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://site.movixflow.com.br/blog/${article.slug}` },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Header />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium truncate max-w-[200px]">{article.title}</li>
          </ol>
        </nav>

        {/* Category */}
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full mb-6">
          {article.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-6 leading-tight">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
          <div className="flex items-center gap-1.5">
            <User className="w-4 h-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <time dateTime={article.date}>{article.dateFormatted}</time>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{article.readTime} de leitura</span>
          </div>
        </div>

        {/* Hero image */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-10">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-gray prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600 prose-strong:text-gray-900"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-100">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Blog
          </Link>
        </div>
      </article>
    </div>
  )
}
