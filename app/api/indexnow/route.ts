import { NextResponse } from "next/server"

const KEY = "4f6b8d2e1a9c3f7b5e0d4a8c2f6b9e3d"
const HOST = "site.movixflow.com.br"

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/sobre`,
  `https://${HOST}/blog`,
  `https://${HOST}/contato`,
  `https://${HOST}/carreiras`,
  `https://${HOST}/parceiros`,
  `https://${HOST}/embarcadores`,
  `https://${HOST}/anuncio-de-fretes`,
  `https://${HOST}/blog/como-reduzir-riscos-logisticos`,
  `https://${HOST}/blog/futuro-logistica-ia-preditiva`,
  `https://${HOST}/blog/gestao-de-fretes-melhores-praticas`,
  `https://${HOST}/blog/seguranca-transporte-cargas`,
  `https://${HOST}/blog/monitoramento-tempo-real`,
  `https://${HOST}/blog/analise-dados-logistica-eficiente`,
]

export async function POST(req: Request) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: URLS,
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  })

  return NextResponse.json({ status: res.status, submitted: URLS.length })
}
