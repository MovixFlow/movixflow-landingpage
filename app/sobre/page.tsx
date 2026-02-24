"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Target, Users, TrendingUp, Award, Globe, Heart, Lightbulb, ArrowRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

export default function SobrePage() {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const values = [
    {
      icon: Shield,
      title: "Segurança",
      description: "Proteção total em cada operação",
      color: "blue",
    },
    {
      icon: Lightbulb,
      title: "Inovação",
      description: "Tecnologia de ponta para logística",
      color: "purple",
    },
    {
      icon: Heart,
      title: "Compromisso",
      description: "Dedicação ao sucesso dos clientes",
      color: "red",
    },
    {
      icon: Users,
      title: "Colaboração",
      description: "Trabalho em equipe e parceria",
      color: "green",
    },
  ]

  const stats = [
    { icon: Users, value: "1.200+", label: "Clientes Ativos" },
    { icon: TrendingUp, value: "65%", label: "Redução de Riscos" },
    { icon: Globe, value: "15+", label: "Estados Atendidos" },
    { icon: Award, value: "98%", label: "Satisfação" },
  ]

  const milestones = [
    { year: "2020", title: "Fundação", description: "Início da MovixFlow com foco em gestão de riscos" },
    { year: "2021", title: "Expansão", description: "Alcançamos 100 clientes e 5 estados" },
    { year: "2022", title: "Inovação", description: "Lançamento do módulo de IA preditiva" },
    { year: "2023", title: "Reconhecimento", description: "Prêmio de melhor solução logística" },
    { year: "2024", title: "Crescimento", description: "1.200+ clientes em todo Brasil" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-30 animate-pulse" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Sobre a MovixFlow</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Transformando a logística
              <br />
              com inteligência e segurança
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto text-pretty leading-relaxed">
              Somos especialistas em gestão de riscos logísticos, ajudando empresas a prevenir problemas e otimizar
              operações com tecnologia de ponta.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section
        ref={(el) => {
          sectionRefs.current["mission"] = el
        }}
        id="mission"
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has("mission") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Missão</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Proteger operações logísticas através de tecnologia inteligente, reduzindo riscos e aumentando a
                  eficiência das empresas brasileiras.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden group hover:shadow-2xl transition-all">
              <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-600" />
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Nossa Visão</h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Ser a plataforma líder em gestão de riscos logísticos na América Latina, reconhecida pela inovação e
                  resultados excepcionais.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section
        ref={(el) => {
          sectionRefs.current["values"] = el
        }}
        id="values"
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-white transition-all duration-1000 ${
          visibleSections.has("values") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Valores</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Princípios que guiam cada decisão e ação da MovixFlow
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-${value.color}-100 to-${value.color}-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all`}
                  >
                    <value.icon className={`w-8 h-8 text-${value.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section
        ref={(el) => {
          sectionRefs.current["timeline"] = el
        }}
        id="timeline"
        className={`py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 transition-all duration-1000 ${
          visibleSections.has("timeline") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossa Jornada</h2>
            <p className="text-xl text-gray-600">Crescimento e evolução ao longo dos anos</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-purple-600" />

            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative mb-12 ${index % 2 === 0 ? "text-right pr-1/2" : "text-left pl-1/2"}`}
              >
                <div className={`flex items-center ${index % 2 === 0 ? "justify-end" : "justify-start"}`}>
                  <Card
                    className={`border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-all hover:-translate-y-2 w-full max-w-md ${
                      index % 2 === 0 ? "mr-8" : "ml-8"
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">{milestone.title}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="absolute left-1/2 top-6 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6">Faça parte da nossa história</h2>
          <p className="text-xl mb-10 text-blue-100">Junte-se a centenas de empresas que confiam na MovixFlow</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-10 py-6 h-auto group shadow-xl hover:scale-105 transition-all"
              asChild
            >
              <a href="/#contato">
                Fale Conosco
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-10 py-6 h-auto hover:scale-105 transition-all bg-transparent"
              asChild
            >
              <a href="/carreiras">Ver Vagas</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
