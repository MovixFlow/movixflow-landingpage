"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Handshake, TrendingUp, Users, Award, ArrowRight, CheckCircle2, Target, Zap, Globe, Shield } from "lucide-react"

export default function ParceirosPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Crescimento Conjunto",
      description: "Cresça junto com a MovixFlow e expanda seu negócio",
      color: "blue",
    },
    {
      icon: Users,
      title: "Rede de Clientes",
      description: "Acesso à nossa base de 1.200+ clientes ativos",
      color: "purple",
    },
    {
      icon: Award,
      title: "Certificação",
      description: "Treinamento e certificação oficial MovixFlow",
      color: "amber",
    },
    {
      icon: Zap,
      title: "Suporte Dedicado",
      description: "Equipe exclusiva para apoiar parceiros",
      color: "green",
    },
    {
      icon: Target,
      title: "Comissões Atrativas",
      description: "Modelo de remuneração competitivo",
      color: "red",
    },
    {
      icon: Globe,
      title: "Expansão Nacional",
      description: "Oportunidades em todo o Brasil",
      color: "indigo",
    },
  ]

  const partnerTypes = [
    {
      title: "Parceiro Revendedor",
      description: "Revenda nossas soluções e ganhe comissões recorrentes",
      features: ["Comissão de 20-30%", "Suporte técnico", "Material de vendas", "Treinamento completo"],
      icon: Handshake,
      color: "blue",
    },
    {
      title: "Parceiro Integrador",
      description: "Integre nossa plataforma com outras soluções",
      features: ["API completa", "Documentação técnica", "Suporte de integração", "Co-marketing"],
      icon: Zap,
      color: "purple",
    },
    {
      title: "Parceiro Tecnológico",
      description: "Desenvolva soluções complementares",
      features: ["Acesso à plataforma", "Marketplace", "Revenue share", "Suporte técnico"],
      icon: Globe,
      color: "green",
    },
  ]

  const partners = [
    { name: "TechLog Solutions", logo: "TL", description: "Integrador tecnológico" },
    { name: "Cargo Systems", logo: "CS", description: "Parceiro revendedor" },
    { name: "LogiTech Brasil", logo: "LB", description: "Parceiro tecnológico" },
    { name: "TransPort Pro", logo: "TP", description: "Integrador de sistemas" },
    { name: "Fleet Manager", logo: "FM", description: "Parceiro revendedor" },
    { name: "Smart Logistics", logo: "SL", description: "Parceiro tecnológico" },
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
              <Handshake className="w-4 h-4" />
              <span className="text-sm font-medium">Programa de Parceiros</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Cresça seu negócio
              <br />
              como parceiro MovixFlow
            </h1>

            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto text-pretty">
              Junte-se ao nosso ecossistema e ofereça soluções de gestão logística para seus clientes
            </p>

            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
              asChild
            >
              <a href="#contato">
                Tornar-se Parceiro
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Vantagens de ser Parceiro</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Benefícios exclusivos para impulsionar seu crescimento
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${benefit.color}-100 to-${benefit.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}
                  >
                    <benefit.icon className={`w-8 h-8 text-${benefit.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tipos de Parceria</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o modelo que melhor se adapta ao seu negócio
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {partnerTypes.map((type, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r from-${type.color}-600 to-${type.color}-700`} />
                <CardHeader>
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${type.color}-100 to-${type.color}-200 rounded-2xl flex items-center justify-center mb-4`}
                  >
                    <type.icon className={`w-8 h-8 text-${type.color}-600`} />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{type.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700">
                        <CheckCircle2 className={`w-5 h-5 text-${type.color}-600 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-6 bg-${type.color}-600 hover:bg-${type.color}-700 text-white group`}>
                    Saiba Mais
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Parceiros</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Empresas que confiam e crescem conosco</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 group"
              >
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span className="text-white font-bold text-xl">{partner.logo}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{partner.name}</h3>
                      <p className="text-sm text-gray-600">{partner.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Parceiro Certificado</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contato"
        className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-10 text-blue-100">Entre em contato e descubra como podemos crescer juntos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
              asChild
            >
              <a href="mailto:parceiros@movixflow.com.br">
                Falar com Especialista
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto hover:scale-105 transition-all bg-transparent"
              asChild
            >
              <a href="/#contato">Enviar Mensagem</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
