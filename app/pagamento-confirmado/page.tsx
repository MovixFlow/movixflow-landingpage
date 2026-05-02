"use client"

import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, ArrowRight, Shield, Truck } from "lucide-react"
import { motion } from "framer-motion"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PagamentoConfirmadoPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-3">
            Pagamento confirmado!
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            Sua assinatura MovixFlow foi ativada com sucesso.
            Nossa equipe entrará em contato em até 24h para configurar seu acesso.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-gray-50 rounded-2xl border border-gray-100 p-6 mb-8 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Próximos passos
          </p>
          <ul className="space-y-3">
            {[
              { icon: Shield, text: "Validação dos dados da sua empresa" },
              { icon: Truck, text: "Configuração do acesso à plataforma" },
              { icon: CheckCircle2, text: "Onboarding com nosso time de sucesso" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-8 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-blue-600" />
                </div>
                {item.text}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-8 py-4 text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200"
          >
            Voltar ao início
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
