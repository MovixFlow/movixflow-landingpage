import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Carreiras MovixFlow | Trabalhe Conosco",
  description:
    "Faça parte do time MovixFlow. Vagas em tecnologia, produto e operações para quem quer transformar a logística brasileira com inovação e propósito.",
  alternates: { canonical: "https://site.movixflow.com.br/carreiras" },
  openGraph: {
    title: "Carreiras MovixFlow | Trabalhe Conosco",
    description: "Junte-se ao time que está transformando a gestão de riscos logísticos no Brasil.",
    url: "https://site.movixflow.com.br/carreiras",
  },
}

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  Users,
  Heart,
  TrendingUp,
  Award,
  Coffee,
  Laptop,
  GraduationCap,
  Zap,
} from "lucide-react"

export default function CarreirasPage() {
  const jobs = [
    {
      title: "Desenvolvedor Full Stack Sênior",
      department: "Tecnologia",
      location: "São Paulo - SP",
      type: "CLT - Presencial",
      salary: "R$ 12.000 - R$ 18.000",
      description: "Desenvolvimento de features para nossa plataforma de gestão logística.",
      color: "blue",
    },
    {
      title: "Analista de Dados",
      department: "Análise",
      location: "São Paulo - SP",
      type: "CLT - Híbrido",
      salary: "R$ 8.000 - R$ 12.000",
      description: "Análise de dados logísticos e criação de dashboards para clientes.",
      color: "purple",
    },
    {
      title: "Especialista em Gestão de Riscos",
      department: "Operações",
      location: "São Paulo - SP",
      type: "CLT - Presencial",
      salary: "R$ 10.000 - R$ 15.000",
      description: "Consultoria e implementação de soluções de gestão de riscos.",
      color: "red",
    },
    {
      title: "Designer de Produto",
      department: "Design",
      location: "Remoto",
      type: "PJ - Remoto",
      salary: "R$ 9.000 - R$ 14.000",
      description: "Design de interfaces e experiências para nossa plataforma.",
      color: "pink",
    },
    {
      title: "Gerente de Sucesso do Cliente",
      department: "Customer Success",
      location: "São Paulo - SP",
      type: "CLT - Híbrido",
      salary: "R$ 7.000 - R$ 11.000",
      description: "Garantir o sucesso e satisfação dos nossos clientes.",
      color: "green",
    },
    {
      title: "Engenheiro de Machine Learning",
      department: "IA",
      location: "São Paulo - SP",
      type: "CLT - Híbrido",
      salary: "R$ 15.000 - R$ 22.000",
      description: "Desenvolvimento de modelos preditivos para gestão de riscos.",
      color: "indigo",
    },
  ]

  const benefits = [
    { icon: Heart, title: "Plano de Saúde", description: "Cobertura completa" },
    { icon: GraduationCap, title: "Educação", description: "Cursos e certificações" },
    { icon: Coffee, title: "Vale Alimentação", description: "R$ 800/mês" },
    { icon: Laptop, title: "Home Office", description: "Flexibilidade total" },
    { icon: TrendingUp, title: "PLR", description: "Participação nos lucros" },
    { icon: Award, title: "Bônus", description: "Por performance" },
  ]

  const values = [
    {
      icon: Users,
      title: "Colaboração",
      description: "Trabalhamos juntos para alcançar grandes resultados",
    },
    {
      icon: Zap,
      title: "Inovação",
      description: "Buscamos sempre novas soluções e tecnologias",
    },
    {
      icon: Heart,
      title: "Bem-estar",
      description: "Cuidamos da saúde física e mental do time",
    },
    {
      icon: TrendingUp,
      title: "Crescimento",
      description: "Investimos no desenvolvimento profissional",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Briefcase className="w-4 h-4" />
              <span className="text-sm font-medium">Estamos contratando</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Construa o futuro da
              <br />
              logística conosco
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto text-pretty">
              Junte-se a um time apaixonado por tecnologia e inovação que está transformando a logística brasileira
            </p>

            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
              asChild
            >
              <a href="#vagas">
                Ver Vagas Abertas
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefícios e Vantagens</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cuidamos do nosso time com benefícios que fazem a diferença
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa Cultura</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Valores que guiam nosso dia a dia</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all">
                    <value.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section id="vagas" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vagas Abertas</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Encontre a oportunidade perfeita para você</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {jobs.map((job, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-1 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`px-3 py-1 bg-${job.color}-100 text-${job.color}-700 rounded-full text-sm font-medium`}
                    >
                      {job.department}
                    </div>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white group-hover:scale-105 transition-all"
                    >
                      Candidatar
                    </Button>
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{job.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {job.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <DollarSign className="w-5 h-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">{job.salary}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6">Não encontrou a vaga ideal?</h2>
          <p className="text-xl mb-10 text-blue-100">
            Envie seu currículo e entraremos em contato quando surgir uma oportunidade
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
            asChild
          >
            <a href="mailto:rh@movixflow.com.br">
              Enviar Currículo
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
