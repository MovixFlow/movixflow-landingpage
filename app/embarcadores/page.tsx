import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Shield,
  Scan,
  BarChart3,
  Truck,
  CheckCircle2,
  ArrowRight,
  Package,
  Clock,
  AlertTriangle,
  Users,
  TrendingDown,
  ShieldCheck,
  FileSearch,
  MapPin,
} from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "MovixFlow para Embarcadores | Contrate Transportadoras com Segurança",
  description:
    "Valide transportadoras e motoristas antes de contratar. Biometria facial, consulta ANTT, histórico de ocorrências e monitoramento em tempo real para embarcadores que não querem surpresas.",
  alternates: { canonical: "https://site.movixflow.com.br/embarcadores" },
  openGraph: {
    title: "MovixFlow para Embarcadores | Segurança na Contratação de Transportes",
    description:
      "Reduza sinistros e cargas extraviadas em 65%. Validação de transportadoras e motoristas com biometria, ANTT e BI logístico.",
    url: "https://site.movixflow.com.br/embarcadores",
  },
}

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "MovixFlow para Embarcadores",
  description:
    "Plataforma de validação de transportadoras e motoristas para embarcadores brasileiros.",
  url: "https://site.movixflow.com.br/embarcadores",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://site.movixflow.com.br/" },
      { "@type": "ListItem", position: 2, name: "Embarcadores", item: "https://site.movixflow.com.br/embarcadores" },
    ],
  },
}

const problems = [
  {
    icon: AlertTriangle,
    title: "Carga extraviada ou roubada",
    description: "Contratar transportadoras sem histórico verificado aumenta o risco de sinistros e prejuízos.",
  },
  {
    icon: FileSearch,
    title: "Documentação falsa",
    description: "Motoristas e veículos com documentos irregulares geram multas e processos para o embarcador.",
  },
  {
    icon: Clock,
    title: "Atrasos sem visibilidade",
    description: "Sem rastreamento em tempo real você fica no escuro sobre onde está sua carga.",
  },
  {
    icon: Users,
    title: "Motoristas sem habilitação válida",
    description: "CNH vencida, suspensa ou categoria incorreta só é descoberta quando o problema acontece.",
  },
]

const solutions = [
  {
    icon: Scan,
    title: "Validação Biométrica",
    description:
      "Confirme que o motorista que buscou a carga é realmente quem diz ser. Biometria facial integrada ao cadastro da ANTT.",
    color: "blue",
  },
  {
    icon: Shield,
    title: "Consulta ANTT & RNTRC",
    description:
      "Valide automaticamente a regularidade da transportadora no Registro Nacional de Transportadores de Cargas.",
    color: "indigo",
  },
  {
    icon: BarChart3,
    title: "Score de Risco da Transportadora",
    description:
      "Histórico consolidado de ocorrências, avaliações e índice de pontualidade para cada transportadora do painel.",
    color: "purple",
  },
  {
    icon: MapPin,
    title: "Rastreamento em Tempo Real",
    description:
      "Acompanhe a localização da carga do momento da coleta até a entrega, com alertas de desvio de rota.",
    color: "green",
  },
  {
    icon: FileSearch,
    title: "Auditoria Documental",
    description:
      "Verificação automática de CNH, CRLV, apólice de seguro e contrato de transporte antes da liberação da carga.",
    color: "amber",
  },
  {
    icon: BarChart3,
    title: "BI Executivo",
    description:
      "Dashboards de desempenho de transportadoras, custo por rota, índice de sinistros e relatórios para auditoria.",
    color: "red",
  },
]

const stats = [
  { icon: TrendingDown, value: "65%", label: "Redução de sinistros" },
  { icon: ShieldCheck, value: "98%", label: "Precisão na validação" },
  { icon: Package, value: "12k+", label: "Cargas monitoradas/mês" },
  { icon: Truck, value: "1.200+", label: "Transportadoras homologadas" },
]

const steps = [
  { number: "01", title: "Cadastre sua empresa", description: "Onboarding em menos de 24h. Sem burocracia." },
  { number: "02", title: "Homologue suas transportadoras", description: "Importe a lista ou adicione uma a uma. A plataforma valida tudo automaticamente." },
  { number: "03", title: "Solicite coleta com segurança", description: "O motorista passa pela validação biométrica antes de pegar a carga." },
  { number: "04", title: "Acompanhe até a entrega", description: "Rastreamento em tempo real com notificações e relatório de entrega." },
]

export default function EmbarcadoresPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Header />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">MovixFlow para Embarcadores</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Contrate transportadoras
              <br />
              sem surpresas desagradáveis
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Valide motoristas com biometria, monitore cargas em tempo real e reduza sinistros em até 65% com a
              plataforma que mais de 1.200 empresas já confiam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
                asChild
              >
                <Link href="/solicitar-consulta">
                  Solicitar demonstração gratuita
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto transition-all bg-transparent"
                asChild
              >
                <a href="https://wa.me/5563992748276?text=Ol%C3%A1%2C+sou+embarcador+e+quero+conhecer+a+MovixFlow" target="_blank" rel="noopener noreferrer">
                  Falar pelo WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i} className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Você já passou por alguma dessas situações?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Problemas recorrentes que custam caro para embarcadores sem a ferramenta certa
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) => (
              <Card key={i} className="border-0 shadow-lg rounded-2xl bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <p.icon className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{p.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{p.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tudo que um embarcador precisa</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Da validação prévia ao relatório de entrega, em uma única plataforma
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((s, i) => (
              <Card key={i} className="border-0 shadow-lg rounded-3xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden group">
                <div className={`h-1.5 bg-gradient-to-r from-${s.color}-500 to-${s.color}-700`} />
                <CardHeader>
                  <div className={`w-14 h-14 bg-gradient-to-br from-${s.color}-100 to-${s.color}-200 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                    <s.icon className={`w-7 h-7 text-${s.color}-600`} />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{s.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{s.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-xl text-gray-600">Do cadastro à entrega, em 4 passos simples</p>
          </div>
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg shadow-blue-200">
                  {step.number}
                </div>
                <div className="pt-3">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6">Pronto para contratar com mais segurança?</h2>
          <p className="text-xl mb-10 text-blue-100">
            Agende uma demonstração gratuita e veja como a MovixFlow protege sua operação
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
              asChild
            >
              <Link href="/solicitar-consulta">
                Agendar demonstração
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto transition-all bg-transparent"
              asChild
            >
              <Link href="/#contato">Enviar mensagem</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
