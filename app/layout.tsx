import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { UserProvider } from "@/contexts/user-context"
import { ClienteProvider } from "@/contexts/cliente-context"

const geistSans = GeistSans.variable
const geistMono = GeistMono.variable

export const metadata: Metadata = {
  metadataBase: new URL("https://site.movixflow.com.br"),
  title: {
    default: "MovixFlow — Gestão de Riscos e Logística para Transportadoras | Plataforma B2B",
    template: "%s | MovixFlow",
  },
  description:
    "Valide motoristas com biometria, monitore frotas em tempo real e reduza incidentes em 65%. Plataforma B2B SaaS para transportadoras e embarcadores brasileiros.",
  keywords: [
    "gestão de riscos logísticos",
    "plataforma transporte B2B",
    "validação motoristas biometria",
    "software transportadora",
    "marketplace fretes",
    "monitoramento frota",
    "BI logístico",
  ],
  alternates: {
    canonical: "https://site.movixflow.com.br",
  },
  openGraph: {
    type: "website",
    url: "https://site.movixflow.com.br",
    siteName: "MovixFlow",
    locale: "pt_BR",
    title: "MovixFlow — Gestão de Riscos e Logística para Transportadoras",
    description:
      "Valide motoristas com biometria, monitore frotas em tempo real e reduza incidentes em 65%. Plataforma B2B para transportadoras.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MovixFlow — Plataforma de Gestão de Riscos Logísticos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MovixFlow — Gestão de Riscos e Logística para Transportadoras",
    description:
      "Valide motoristas com biometria, monitore frotas em tempo real e reduza incidentes em 65%.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
}

const schemaOrg = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://site.movixflow.com.br/#organization",
    name: "MovixFlow",
    url: "https://site.movixflow.com.br",
    logo: {
      "@type": "ImageObject",
      url: "https://site.movixflow.com.br/logo.svg",
    },
    foundingDate: "2020",
    description:
      "Plataforma B2B de gestão de riscos logísticos para transportadoras brasileiras. Validação de motoristas com biometria facial, monitoramento em tempo real e BI executivo.",
    areaServed: { "@type": "Country", name: "Brasil" },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-63-99274-8276",
      email: "contato@movixflow.com.br",
      contactType: "customer service",
      availableLanguage: "Portuguese",
      areaServed: "BR",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://site.movixflow.com.br/#software",
    name: "MovixFlow",
    url: "https://site.movixflow.com.br",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "pt-BR",
    description:
      "Plataforma SaaS B2B para gestão de riscos logísticos, validação de motoristas por biometria, marketplace de fretes e business intelligence executivo para transportadoras.",
    publisher: { "@id": "https://site.movixflow.com.br/#organization" },
    offers: [
      {
        "@type": "Offer",
        name: "Plano Basic",
        price: "67.00",
        priceCurrency: "BRL",
        description: "1 usuário, até 50 motoristas. Checklist digital, monitoramento básico e marketplace de fretes.",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "67.00",
          priceCurrency: "BRL",
          unitCode: "MON",
        },
      },
      {
        "@type": "Offer",
        name: "Plano Standard",
        price: "670.00",
        priceCurrency: "BRL",
        description: "10 usuários, motoristas ilimitados. BI avançado, alertas WhatsApp, suporte 24/7.",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "670.00",
          priceCurrency: "BRL",
          unitCode: "MON",
        },
      },
    ],
    featureList: [
      "Validação de motoristas com biometria facial",
      "Monitoramento em tempo real de frotas",
      "Marketplace seguro de fretes",
      "Business Intelligence executivo",
      "Alertas preditivos de risco 24/7",
      "Integração via API com TMS e ERP",
      "Gestão de jornada de motoristas",
      "Roteirização inteligente",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://site.movixflow.com.br/#website",
    url: "https://site.movixflow.com.br",
    name: "MovixFlow",
    inLanguage: "pt-BR",
    publisher: { "@id": "https://site.movixflow.com.br/#organization" },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://site.movixflow.com.br/blog?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  },
]

import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className={`${geistSans} ${geistMono} antialiased`}>
        <UserProvider>
          <ClienteProvider>
            {children}
            <Toaster position="top-right" richColors />
          </ClienteProvider>
        </UserProvider>
        <Analytics />
        <Script src="https://js.stripe.com/v3/" strategy="lazyOnload" />
      </body>
    </html>
  )
}
