"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, ArrowRight, Search, Tag, TrendingUp, Shield, Truck } from "lucide-react"

export default function BlogPage() {
  const posts = [
    {
      title: "Como reduzir riscos logísticos em 65%",
      excerpt:
        "Descubra as estratégias que empresas líderes estão usando para minimizar incidentes e aumentar a segurança.",
      category: "Gestão de Riscos",
      date: "15 Jan 2025",
      readTime: "5 min",
      image: "/logistics-risk-management.jpg",
      icon: Shield,
      color: "blue",
    },
    {
      title: "O futuro da logística com IA preditiva",
      excerpt: "Inteligência artificial está revolucionando a forma como prevemos e evitamos problemas operacionais.",
      category: "Tecnologia",
      date: "12 Jan 2025",
      readTime: "7 min",
      image: "/ai-logistics-technology.jpg",
      icon: TrendingUp,
      color: "purple",
    },
    {
      title: "Gestão de fretes: melhores práticas",
      excerpt: "Aprenda como otimizar sua operação de fretes e conectar-se com motoristas confiáveis.",
      category: "Operações",
      date: "10 Jan 2025",
      readTime: "6 min",
      image: "/freight-management-trucks.jpg",
      icon: Truck,
      color: "orange",
    },
    {
      title: "Segurança em transporte de cargas",
      excerpt: "Protocolos essenciais para garantir a segurança de cargas de alto valor e perecíveis.",
      category: "Segurança",
      date: "8 Jan 2025",
      readTime: "4 min",
      image: "/cargo-security-transport.jpg",
      icon: Shield,
      color: "red",
    },
    {
      title: "Monitoramento em tempo real: guia completo",
      excerpt: "Como implementar sistemas de rastreamento e monitoramento eficazes para sua frota.",
      category: "Tecnologia",
      date: "5 Jan 2025",
      readTime: "8 min",
      image: "/real-time-tracking-monitoring.jpg",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Análise de dados para logística eficiente",
      excerpt: "Transforme dados em insights acionáveis para melhorar sua operação logística.",
      category: "Análise",
      date: "3 Jan 2025",
      readTime: "6 min",
      image: "/data-analytics-logistics.jpg",
      icon: TrendingUp,
      color: "indigo",
    },
  ]

  const categories = ["Todos", "Gestão de Riscos", "Tecnologia", "Operações", "Segurança", "Análise"]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">Blog MovixFlow</h1>

            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto text-pretty">
              Insights, tendências e melhores práticas em gestão logística e redução de riscos
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Buscar artigos..."
                  className="h-14 pl-12 pr-4 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200 sticky top-20 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                className={`whitespace-nowrap ${
                  category === "Todos"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Tag className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-4 left-4 bg-${post.color}-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2`}
                  >
                    <post.icon className="w-4 h-4" />
                    {post.category}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 group/btn"
                  >
                    Ler mais
                    <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-10 py-6 h-auto hover:scale-105 transition-all bg-transparent"
            >
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-6">Receba novos artigos por e-mail</h2>
          <p className="text-xl mb-10 text-blue-100">
            Fique por dentro das últimas tendências em logística e gestão de riscos
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <Input
              type="email"
              placeholder="Seu melhor e-mail"
              className="h-14 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 flex-1"
            />
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-10 h-14 hover:scale-105 transition-all shadow-xl"
            >
              Inscrever-se
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
