"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Headphones, ArrowRight, MessageCircle } from "lucide-react"

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-white/20">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Estamos aqui para ajudar</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-balance">
              Entre em contato
              <br />
              com nossa equipe
            </h1>

            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto text-pretty">
              Resposta em até 24 horas. Nossa equipe está pronta para ajudar você.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="text-3xl text-gray-900">Envie uma Mensagem</CardTitle>
                  <CardDescription className="text-lg text-gray-600">
                    Preencha o formulário e entraremos em contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                        <Input placeholder="João Silva" className="h-12" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                        <Input placeholder="Sua Empresa Ltda" className="h-12" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <Input type="email" placeholder="joao@empresa.com.br" className="h-12" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                        <Input type="tel" placeholder="(11) 99999-9999" className="h-12" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
                      <Input placeholder="Como podemos ajudar?" className="h-12" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                      <Textarea placeholder="Descreva sua necessidade ou dúvida..." className="min-h-40 resize-none" />
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg group hover:scale-105 transition-all shadow-lg">
                      Enviar Mensagem
                      <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* WhatsApp */}
              <Card className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 group bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                      <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">WhatsApp</h3>
                        <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded-full">
                          Mais Rápido
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium mb-1">(11) 99999-9999</p>
                      <p className="text-sm text-gray-600 mb-3">Resposta imediata</p>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white group/btn" asChild>
                        <a
                          href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre a MovixFlow."
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Iniciar Conversa
                          <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {[
                {
                  icon: Mail,
                  color: "blue",
                  title: "E-mail",
                  info: "contato@movixflow.com.br",
                  description: "Resposta em até 24h",
                },
                {
                  icon: Phone,
                  color: "purple",
                  title: "Telefone",
                  info: "(11) 3000-0000",
                  description: "Seg-Sex: 8h às 18h",
                },
                {
                  icon: MapPin,
                  color: "indigo",
                  title: "Endereço",
                  info: "Av. Paulista, 1000",
                  description: "São Paulo - SP",
                },
                {
                  icon: Clock,
                  color: "amber",
                  title: "Horário",
                  info: "Seg-Sex: 8h às 18h",
                  description: "Sábado: 9h às 13h",
                },
              ].map((contact, index) => (
                <Card
                  key={index}
                  className="border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all hover:-translate-y-1 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br from-${contact.color}-100 to-${contact.color}-200 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                      >
                        <contact.icon className={`w-7 h-7 text-${contact.color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 text-lg">{contact.title}</h3>
                        <p className="text-gray-900 font-medium mb-1">{contact.info}</p>
                        <p className="text-sm text-gray-600">{contact.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-0 shadow-lg rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2 text-lg">Suporte Técnico</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        Precisa de ajuda urgente? Nossa equipe de suporte está disponível.
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white group" asChild>
                        <a href="mailto:suporte@movixflow.com.br">
                          Abrir Chamado
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visite nosso escritório</h2>
            <p className="text-xl text-gray-600">Estamos localizados no coração de São Paulo</p>
          </div>

          <div className="bg-gray-200 rounded-3xl overflow-hidden shadow-2xl h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Mapa interativo em breve</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
