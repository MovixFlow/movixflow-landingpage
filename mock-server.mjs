/**
 * Mock Server — MovixFlow Landing Page
 * Porta: 5991 (mesmo endereço que o axios usa em desenvolvimento)
 *
 * Uso: node mock-server.mjs
 *
 * Endpoints implementados:
 *  GET  /api/empresas/publicas
 *  POST /api/clientes/cadastro
 *  POST /api/clientes/login
 *  POST /api/clientes/vinculos
 *  POST /api/consultas/risco/solicitacoes
 *  GET  /api/consultas/risco/solicitacoes/:codigo/status
 */

import http from "http"

const PORT = 5991
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── Banco de dados em memória ────────────────────────────────────────────────

const db = {
  clientes: new Map(),   // email → cliente
  solicitacoes: new Map(), // codigo → solicitacao
  vinculos: new Map(),   // emailCliente → empresaId
  counter: { sol: 42 },
}

// ─── Dados fixos ──────────────────────────────────────────────────────────────

const EMPRESAS = [
  { id: "emp-001", nome: "Transportadora Alpha Ltda",    cnpj: "12.345.678/0001-90", cidade: "São Paulo",     estado: "SP" },
  { id: "emp-002", nome: "Logística Beta S/A",           cnpj: "23.456.789/0001-01", cidade: "Campinas",      estado: "SP" },
  { id: "emp-003", nome: "Cargo Seguro Transportes",     cnpj: "34.567.890/0001-12", cidade: "Curitiba",      estado: "PR" },
  { id: "emp-004", nome: "MovixParceiros Express",       cnpj: "45.678.901/0001-23", cidade: "Belo Horizonte", estado: "MG" },
  { id: "emp-005", nome: "RiskCheck Operações Logísticas", cnpj: "56.789.012/0001-34", cidade: "Porto Alegre", estado: "RS" },
  { id: "emp-006", nome: "Frota Confiável Ltda",         cnpj: "67.890.123/0001-45", cidade: "Brasília",      estado: "DF" },
  { id: "emp-007", nome: "TransLog Sul Transportes",     cnpj: "78.901.234/0001-56", cidade: "Florianópolis", estado: "SC" },
  { id: "emp-008", nome: "Nacional Cargas & Riscos",     cnpj: "89.012.345/0001-67", cidade: "Recife",        estado: "PE" },
]

// Status que evolui automaticamente para testar o fluxo de acompanhamento
const STATUS_PROGRESSAO = ["AGUARDANDO_ACEITE", "ACEITO", "EM_ANALISE", "CONCLUIDO"]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gerarCodigo() {
  const num = String(++db.counter.sol).padStart(4, "0")
  return `SOL-${new Date().getFullYear()}-${num}`
}

function lerBody(req) {
  return new Promise((resolve, reject) => {
    let data = ""
    req.on("data", (chunk) => (data += chunk))
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}) }
      catch { reject(new Error("JSON inválido")) }
    })
  })
}

function responder(res, status, body) {
  const json = JSON.stringify(body, null, 2)
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  })
  res.end(json)
}

function erro(res, status, mensagem) {
  responder(res, status, { mensagem })
}

function log(method, path, status) {
  const cor = status < 300 ? "\x1b[32m" : status < 400 ? "\x1b[33m" : "\x1b[31m"
  console.log(`${cor}[${status}]\x1b[0m ${method.padEnd(6)} ${path}`)
}

// ─── Roteador ─────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const path = url.pathname
  const method = req.method

  // CORS preflight
  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
    res.end()
    return
  }

  await delay(300) // simula latência realista

  try {
    // ── GET /api/empresas/publicas ─────────────────────────────────────────
    if (method === "GET" && path === "/api/empresas/publicas") {
      const busca = (url.searchParams.get("busca") || "").toLowerCase()
      const resultado = busca
        ? EMPRESAS.filter(
            (e) =>
              e.nome.toLowerCase().includes(busca) ||
              e.cnpj.replace(/\D/g, "").includes(busca.replace(/\D/g, ""))
          )
        : EMPRESAS
      log(method, path, 200)
      return responder(res, 200, resultado)
    }

    // ── POST /api/clientes/cadastro ────────────────────────────────────────
    if (method === "POST" && path === "/api/clientes/cadastro") {
      const body = await lerBody(req)

      if (!body.email || !body.senha) {
        log(method, path, 400)
        return erro(res, 400, "E-mail e senha são obrigatórios.")
      }
      if (db.clientes.has(body.email)) {
        log(method, path, 409)
        return erro(res, 409, "Já existe uma conta com este e-mail.")
      }

      const cliente = {
        id: `cli-${Date.now()}`,
        ...body,
        criadoEm: new Date().toISOString(),
      }
      db.clientes.set(body.email, cliente)

      log(method, path, 201)
      return responder(res, 201, {
        id: cliente.id,
        mensagem: "Conta criada com sucesso.",
        nome: body.nome ?? body.razaoSocial ?? "Cliente",
        tipo: body.tipo ?? "PF",
        email: body.email,
      })
    }

    // ── POST /api/clientes/login ───────────────────────────────────────────
    if (method === "POST" && path === "/api/clientes/login") {
      const body = await lerBody(req)

      const cliente = db.clientes.get(body.email)
      if (!cliente || cliente.senha !== body.senha) {
        if (body.email === "cliente@demo.com" && body.senha === "demo123") {
          log(method, path, 200)
          return responder(res, 200, {
            id: "cli-demo",
            nome: "Cliente Demo",
            email: "cliente@demo.com",
            tipo: "PF",
            token: "mock-token-demo-abc123",
          })
        }
        log(method, path, 401)
        return erro(res, 401, "E-mail ou senha incorretos.")
      }

      log(method, path, 200)
      return responder(res, 200, {
        id: cliente.id,
        nome: cliente.nome ?? cliente.razaoSocial ?? "Cliente",
        email: cliente.email,
        tipo: cliente.tipo ?? "PF",
        token: `mock-token-${cliente.id}`,
      })
    }

    // ── POST /api/usuario/autenticar ───────────────────────────────────────
    // Endpoint usado pelo AuthService.authenticateLogin no ClienteAuthModal
    if (method === "POST" && path === "/api/usuario/autenticar") {
      const body = await lerBody(req)
      const email = body.usuario // campo "usuario" = e-mail

      // Usuário demo sempre disponível
      const isDemo = email === "cliente@demo.com" && body.senha === "demo123"
      const cliente = db.clientes.get(email)
      const senhaOk = cliente && cliente.senha === body.senha

      if (!isDemo && !senhaOk) {
        log(method, path, 401)
        return erro(res, 401, "Usuário ou senha inválidos.")
      }

      const id    = isDemo ? "cli-demo" : cliente.id
      const nome  = isDemo ? "Cliente Demo" : (cliente.nome ?? cliente.razaoSocial ?? "Cliente")
      const tipo  = isDemo ? "PF" : (cliente.tipo ?? "PF")
      const vinculo = db.vinculos.get(email)
      const empresa = vinculo ? EMPRESAS.find(e => e.id === vinculo) : null

      const token = `mock-jwt.${Buffer.from(JSON.stringify({
        id,
        nome,
        email,
        tipoUsuario: "CLIENTE_CONSULTA",
        idEmpresa: empresa?.id ?? "",
        statusAcesso: "ATIVO",
        exp: Math.floor(Date.now() / 1000) + 86400,
      })).toString("base64")}.mock-sig`

      log(method, path, 200)
      return responder(res, 200, {
        token,
        claims: {
          id,
          nome,
          email,
          cargo: "CLIENTE",
          createdAt: new Date().toISOString(),
          tipoUsuario: "CLIENTE_CONSULTA",
          idEmpresa: empresa?.id ?? "",
          identificador: email,
          statusAcesso: "ATIVO",
          idEmpresaVinculada: empresa?.id ?? undefined,
          nomeEmpresaVinculada: empresa?.nome ?? undefined,
        },
      })
    }

    // ── POST /api/clientes/vinculos ────────────────────────────────────────
    if (method === "POST" && path === "/api/clientes/vinculos") {
      const body = await lerBody(req)

      if (!body.idEmpresaParceira) {
        log(method, path, 400)
        return erro(res, 400, "idEmpresaParceira é obrigatório.")
      }

      const empresa = EMPRESAS.find((e) => e.id === body.idEmpresaParceira)
      if (!empresa) {
        log(method, path, 404)
        return erro(res, 404, "Empresa parceira não encontrada.")
      }

      db.vinculos.set(body.emailCliente ?? "desconhecido", body.idEmpresaParceira)

      log(method, path, 201)
      return responder(res, 201, {
        mensagem: `Solicitação de vínculo enviada para ${empresa.nome}. Aguardando confirmação da empresa.`,
        idEmpresa: empresa.id,
        nomeEmpresa: empresa.nome,
      })
    }

    // ── POST /api/consultas/risco/solicitacoes ─────────────────────────────
    if (method === "POST" && path === "/api/consultas/risco/solicitacoes") {
      const body = await lerBody(req)

      const obrigatorios = ["idEmpresa", "tipoConsulta", "nomeCliente", "documentoCliente", "emailCliente", "telefoneCliente"]
      const faltando = obrigatorios.filter((f) => !body[f])
      if (faltando.length > 0) {
        log(method, path, 400)
        return erro(res, 400, `Campos obrigatórios ausentes: ${faltando.join(", ")}`)
      }

      const empresa = EMPRESAS.find((e) => e.id === body.idEmpresa)
      if (!empresa) {
        log(method, path, 404)
        return erro(res, 404, "Empresa parceira não encontrada.")
      }

      const codigo = gerarCodigo()
      db.solicitacoes.set(codigo, {
        codigo,
        status: "AGUARDANDO_ACEITE",
        tipoConsulta: body.tipoConsulta,
        nomeEmpresa: empresa.nome,
        idEmpresa: empresa.id,
        nomeCliente: body.nomeCliente,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        _progressaoIdx: 0,
        _proximaProgressao: Date.now() + 15_000, // avança após 15s
      })

      log(method, path, 201)
      return responder(res, 201, {
        codigo,
        status: "AGUARDANDO_ACEITE",
        mensagem: `Solicitação ${codigo} criada. A empresa ${empresa.nome} foi notificada.`,
      })
    }

    // ── GET /api/consultas/risco/solicitacoes/:codigo/status ───────────────
    const matchStatus = path.match(/^\/api\/consultas\/risco\/solicitacoes\/([^/]+)\/status$/)
    if (method === "GET" && matchStatus) {
      const codigo = decodeURIComponent(matchStatus[1])
      const sol = db.solicitacoes.get(codigo)

      if (!sol) {
        log(method, path, 404)
        return erro(res, 404, "Solicitação não encontrada.")
      }

      // Avança o status automaticamente a cada chamada (simulação de progressão)
      if (Date.now() >= sol._proximaProgressao && sol._progressaoIdx < STATUS_PROGRESSAO.length - 1) {
        sol._progressaoIdx++
        sol.status = STATUS_PROGRESSAO[sol._progressaoIdx]
        sol.atualizadoEm = new Date().toISOString()
        sol._proximaProgressao = Date.now() + 20_000 // próxima progressão em 20s

        // Quando concluído, adiciona resultado
        if (sol.status === "CONCLUIDO") {
          const resultados = ["APROVADO", "REPROVADO", "RESTRICAO"]
          sol.resultado = resultados[Math.floor(Math.random() * resultados.length)]
          sol.observacaoOperador = sol.resultado === "APROVADO"
            ? "Consulta concluída sem restrições encontradas."
            : sol.resultado === "REPROVADO"
            ? "Foram encontradas pendências que impedem a aprovação."
            : "Foram encontradas restrições que requerem atenção."
        }
      }

      log(method, path, 200)
      return responder(res, 200, {
        codigo: sol.codigo,
        status: sol.status,
        tipoConsulta: sol.tipoConsulta,
        nomeEmpresa: sol.nomeEmpresa,
        resultado: sol.resultado ?? null,
        observacaoOperador: sol.observacaoOperador ?? null,
        motivoRejeicao: sol.motivoRejeicao ?? null,
        criadoEm: sol.criadoEm,
        atualizadoEm: sol.atualizadoEm,
      })
    }

    // ── 404 ───────────────────────────────────────────────────────────────
    log(method, path, 404)
    erro(res, 404, `Rota não encontrada: ${method} ${path}`)
  } catch (err) {
    console.error("\x1b[31m[ERRO]\x1b[0m", err.message)
    log(method, path, 500)
    erro(res, 500, "Erro interno do servidor mock.")
  }
})

// ─── Start ────────────────────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log("\n\x1b[36m╔══════════════════════════════════════════════╗")
  console.log("║      MovixFlow — Mock Server Iniciado        ║")
  console.log(`║      http://localhost:${PORT}/api                ║`)
  console.log("╚══════════════════════════════════════════════╝\x1b[0m\n")

  console.log("\x1b[33mEndpoints disponíveis:\x1b[0m")
  console.log("  GET  /api/empresas/publicas")
  console.log("  POST /api/usuario/autenticar   ← login do cliente")
  console.log("  POST /api/clientes/cadastro")
  console.log("  POST /api/clientes/login")
  console.log("  POST /api/clientes/vinculos")
  console.log("  POST /api/consultas/risco/solicitacoes")
  console.log("  GET  /api/consultas/risco/solicitacoes/:codigo/status")

  console.log("\n\x1b[33mUsuário demo:\x1b[0m")
  console.log("  E-mail: cliente@demo.com")
  console.log("  Senha:  demo123")

  console.log("\n\x1b[32mPronto. Aguardando requisições...\x1b[0m\n")
})

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\x1b[31m[ERRO] Porta ${PORT} já está em uso. Verifique se o backend real já está rodando.\x1b[0m`)
  } else {
    console.error("\x1b[31m[ERRO]\x1b[0m", err.message)
  }
  process.exit(1)
})
