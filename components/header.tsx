"use client"
import { AvatarFallback } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Truck,
  Menu,
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  Upload,
  CheckCircle2,
  XCircle,
  Camera,
  LogOut,
  UserCircle,
  Building2,
  Building,
  Users,
  Award as IdCard,
  Car,
  FileText,
  ChevronDown,
  UserPlus,
  ShieldCheck,
  ClipboardList,
} from "lucide-react"
import { FacialRecognition } from "@/components/facial-recognition"
import { useUser } from "@/contexts/user-context"
import { useCliente } from "@/contexts/cliente-context"
import { DriverAuthModals } from "@/components/driver-auth-modals"
import { CadastroModal } from "@/components/cadastro-modal"
import { ClienteAuthModal } from "@/components/cliente-auth-modal"
import { ClienteProfileModal } from "@/components/cliente-profile-modal"


export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoggedIn, driverData, login, logout, updateDriverData, faceData, setFaceData } = useUser()
  const { isClienteLogado, clienteData, logoutCliente } = useCliente()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clienteMenuOpen, setClienteMenuOpen] = useState(false)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [driverLoginModalOpen, setDriverLoginModalOpen] = useState(false)
  const [registrationModalOpen, setRegistrationModalOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [registrationError, setRegistrationError] = useState("")
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [cadastroModalOpen, setCadastroModalOpen] = useState(false)
  const [clienteModalOpen, setClienteModalOpen] = useState(false)
  const [clienteProfileModalOpen, setClienteProfileModalOpen] = useState(false)

  const [showFacialRecognition, setShowFacialRecognition] = useState(false)
  const [facialRecognitionMode, setFacialRecognitionMode] = useState<"register" | "verify">("register")
  const [pendingRegistrationData, setPendingRegistrationData] = useState<any>(null)

  const [driverClassification, setDriverClassification] = useState<"frota" | "agregado" | "autonomo">("autonomo")
  const [companyName, setCompanyName] = useState("")
  const [companyCnpj, setCompanyCnpj] = useState("")
  const [regCpf, setRegCpf] = useState("")
  const [regRg, setRegRg] = useState("")
  const [regBirthDate, setRegBirthDate] = useState("")
  const [regBirthPlace, setRegBirthPlace] = useState("")
  const [regAddress, setRegAddress] = useState("")
  const [regMotherName, setRegMotherName] = useState("")
  const [regFatherName, setRegFatherName] = useState("")
  const [regCnhValidity, setRegCnhValidity] = useState("")
  const [regCnhCategory, setRegCnhCategory] = useState("")
  const [regResponsibleEmployee, setRegResponsibleEmployee] = useState("")
  const [cnhFile, setCnhFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [cnhExtraFile, setCnhExtraFile] = useState<File | null>(null)

  const [editDriverClassification, setEditDriverClassification] = useState<"frota" | "agregado" | "autonomo">(
    "autonomo",
  )
  const [editCompanyName, setEditCompanyName] = useState("")
  const [editCompanyCnpj, setEditCompanyCnpj] = useState("")
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editCpf, setEditCpf] = useState("")
  const [editRg, setEditRg] = useState("")
  const [editBirthDate, setEditBirthDate] = useState("")
  const [editBirthPlace, setEditBirthPlace] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editMotherName, setEditMotherName] = useState("")
  const [editFatherName, setEditFatherName] = useState("")
  const [editCnh, setEditCnh] = useState("")
  const [editCnhValidity, setEditCnhValidity] = useState("")
  const [editCnhCategory, setEditCnhCategory] = useState("")
  const [editVehicleType, setEditVehicleType] = useState("")
  const [editVehiclePlate, setEditVehiclePlate] = useState("")
  const [editResponsibleEmployee, setEditResponsibleEmployee] = useState("")
  const [editCnhFile, setEditCnhFile] = useState<File | null>(null)
  const [editSelfieFile, setEditSelfieFile] = useState<File | null>(null)
  const [editCnhExtraFile, setEditCnhExtraFile] = useState<File | null>(null)
  const [profileUpdateError, setProfileUpdateError] = useState("")

  // Password visibility states for registration and login forms
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)

  // Abre o modal de cliente automaticamente quando redirecionado de página protegida
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("cliente") === "login" && !isClienteLogado) {
      setClienteModalOpen(true)
      // Remove o param da URL sem recarregar a página
      params.delete("cliente")
      const newSearch = params.toString()
      window.history.replaceState(null, "", newSearch ? `?${newSearch}` : window.location.pathname)
    }
  }, [isClienteLogado])

  const handleLoginClick = () => {
    setLoginModalOpen(true)
    setMobileMenuOpen(false)
  }

  const handleLoginTypeSelect = (type: "empresa" | "motorista") => {
    if (type === "empresa") {
      window.location.href = "https://www.movixflow.com.br/entrar"
    } else {
      setLoginModalOpen(false)
      setDriverLoginModalOpen(true)
    }
  }

  const handleDriverLogin = (e: React.FormEvent, data: any) => {
    e.preventDefault()
    setLoginError("Autenticação de motorista não disponível no momento.")

  }


  const handleRegistration = (e: React.FormEvent, data: any) => {
    e.preventDefault()
    setRegistrationError("")

    if (!data.name || !data.email || !data.cpf || !data.password || !data.confirmPassword) {
      setRegistrationError("Por favor, preencha os campos obrigatórios.")
      return
    }

    if (data.password !== data.confirmPassword) {
      setRegistrationError("As senhas não coincidem")
      return
    }

    setPendingRegistrationData({
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      password: data.password,
    })
    setRegistrationModalOpen(false)
    setFacialRecognitionMode("register")
    setShowFacialRecognition(true)
  }

  const handleFacialCapture = (imageData: string) => {
    if (facialRecognitionMode === "register" && pendingRegistrationData) {
      setFaceData(imageData)
      login({
        ...pendingRegistrationData,
        faceData: imageData, // Store face data within driverData
        profileComplete: false,
        profileCompletionPending: true,
      })

      setShowFacialRecognition(false)
      setRegistrationSuccess(true)

      // Clear form and show success
      setTimeout(() => {
        setRegistrationSuccess(false)
        setPendingRegistrationData(null)
        // Open login modal
        setDriverLoginModalOpen(true)
      }, 2000)
    } else if (facialRecognitionMode === "verify") {
      // Facial login successful
      if (driverData) {
        login(driverData)
      }

      setShowFacialRecognition(false)
      setDriverLoginModalOpen(false)
      router.push("/anuncio-de-fretes")
    }
  }

  const handleFacialCancel = () => {
    setShowFacialRecognition(false)
    if (facialRecognitionMode === "register") {
      setRegistrationModalOpen(true)
      setPendingRegistrationData(null)
    } else {
      setDriverLoginModalOpen(true)
    }
  }

  const handleFacialLogin = () => {
    // Use faceData from context
    if (!faceData) {
      setLoginError("Nenhum registro facial encontrado. Por favor, faça login com email e senha.")
      return
    }
    setDriverLoginModalOpen(false)
    setFacialRecognitionMode("verify")
    setShowFacialRecognition(true)
  }

  const getUserInitials = () => {
    const name = driverData?.name || "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCreateAccountClick = () => {
    setDriverLoginModalOpen(false)
    setRegistrationModalOpen(true)
  }

  const loadUserDataForEdit = () => {
    if (driverData) {
      setEditDriverClassification((driverData.driverClassification as any) || "autonomo")
      setEditCompanyName(driverData.companyName || "")
      setEditCompanyCnpj(driverData.companyCnpj || "")
      setEditName(driverData.name || "")
      setEditEmail(driverData.email || "")
      setEditPhone(driverData.phone || "")
      setEditCpf(driverData.cpf || "")
      setEditRg(driverData.rg || "")
      setEditBirthDate(driverData.birthDate || "")
      setEditBirthPlace(driverData.birthPlace || "")
      setEditAddress(driverData.address || "")
      setEditMotherName(driverData.motherName || "")
      setEditFatherName(driverData.fatherName || "")
      setEditCnh(driverData.cnh || "")
      setEditCnhValidity(driverData.cnhValidity || "")
      setEditCnhCategory(driverData.cnhCategory || "")
      setEditVehicleType(driverData.vehicleType || "")
      setEditVehiclePlate(driverData.vehiclePlate || "")
      setEditResponsibleEmployee(driverData.responsibleEmployee || "")
    }
  }

  const handleEditProfileClick = () => {
    loadUserDataForEdit()
    setIsEditMode(true) // Use setIsEditMode
    setProfileModalOpen(true)
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileUpdateError("")

    // Validation
    if (!editName || !editEmail || !editPhone || !editCnh || !editVehicleType) {
      setProfileUpdateError("Por favor, preencha todos os campos obrigatórios")
      return
    }

    const updatedData = {
      driverClassification: editDriverClassification,
      companyName: editCompanyName,
      companyCnpj: editCompanyCnpj,
      name: editName,
      email: editEmail,
      phone: editPhone,
      cpf: editCpf,
      rg: editRg,
      birthDate: editBirthDate,
      birthPlace: editBirthPlace,
      address: editAddress,
      motherName: editMotherName,
      fatherName: editFatherName,
      cnh: editCnh,
      cnhValidity: editCnhValidity,
      cnhCategory: editCnhCategory,
      vehicleType: editVehicleType,
      vehiclePlate: editVehiclePlate,
      responsibleEmployee: editResponsibleEmployee,
      cnhDocument: editCnhFile ? "local-file-stub" : undefined,
      selfieDocument: editSelfieFile ? "local-file-stub" : undefined,
      cnhExtraDocument: editCnhExtraFile ? "local-file-stub" : undefined,
    }

    updateDriverData(updatedData)

    setIsEditMode(false) // Use setIsEditMode
    setProfileModalOpen(false)
    setProfileUpdateError("") // Clear error on successful update
  }

  const handleCancelEdit = () => {
    setIsEditMode(false) // Use setIsEditMode
    setProfileModalOpen(false)
    setProfileUpdateError("") // Clear error on cancel
  }

  const navigation = [
    { name: "Benefícios", href: "/#beneficios" },
    { name: "Anúncio de Fretes", href: "/anuncio-de-fretes" },
    { name: "Depoimentos", href: "/#depoimentos" },
    { name: "Contato", href: "/#contato" },
  ]

  const activeLinkClass =
    "text-blue-600 font-semibold relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 transition-all"
  const inactiveLinkClass =
    "text-gray-600 hover:text-blue-600 font-medium relative after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 transition-colors"

  const filteredNavigation = isLoggedIn
    ? [
      { name: "Anúncio de Fretes", href: "/anuncio-de-fretes" },
    ]
    : isClienteLogado
    ? []
    : navigation

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <img src="/logo.svg" alt="MovixFlow" className="h-7 sm:h-9 w-auto" />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {filteredNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={pathname === item.href ? activeLinkClass : inactiveLinkClass}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4 relative">
              {/* ── Motorista logado ── */}
              {isLoggedIn && (
                <div className="relative">
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2 rounded-xl transition-all" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                    <Avatar className="w-9 h-9 ring-2 ring-gray-100 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-sm font-black tracking-tighter">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900 font-bold text-sm tracking-tight">{driverData?.name || "Motorista"}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${profileMenuOpen ? "rotate-180" : ""}`} />
                  </Button>
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
                        <motion.div initial={{ opacity:0, y:10, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.95 }} className="absolute right-0 mt-3 w-64 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl p-2 z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-50 mb-1">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestão de Conta</p>
                            <p className="text-xs text-gray-500 font-medium truncate">{driverData?.email}</p>
                          </div>
                          <button onClick={() => { setProfileModalOpen(true); setProfileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all">
                            <UserCircle className="w-4 h-4 text-blue-500" />Meu Perfil
                          </button>
                          <button onClick={() => { router.push("/anuncio-de-fretes"); setProfileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all">
                            <Truck className="w-4 h-4 text-gray-400" />Fretes Disponíveis
                          </button>
                          <div className="h-px bg-gray-50 my-1 mx-2" />
                          <button onClick={() => { handleLogout(); setProfileMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <LogOut className="w-4 h-4" />Sair do Sistema
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Cliente logado ── */}
              {!isLoggedIn && isClienteLogado && clienteData && (
                <div className="relative">
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all" onClick={() => setClienteMenuOpen(!clienteMenuOpen)}>
                    <Avatar className="w-9 h-9 ring-2 ring-indigo-100 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white text-sm font-black tracking-tighter">
                        {clienteData.nome.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-900 font-bold text-sm tracking-tight">{clienteData.nome.split(" ")[0]}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${clienteMenuOpen ? "rotate-180" : ""}`} />
                  </Button>
                  <AnimatePresence>
                    {clienteMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setClienteMenuOpen(false)} />
                        <motion.div initial={{ opacity:0, y:10, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:10, scale:0.95 }} className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl p-2 z-50 overflow-hidden">
                          <div className="px-4 py-3 border-b border-gray-50 mb-1">
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Área do Cliente</p>
                            <p className="text-sm font-bold text-gray-800 truncate">{clienteData.nome}</p>
                            <p className="text-xs text-gray-400 truncate">{clienteData.email}</p>
                          </div>
                          {clienteData.empresaVinculadaNome && (
                            <div className="mx-3 my-1 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-0.5">Empresa vinculada</p>
                              <p className="text-xs font-semibold text-emerald-800">{clienteData.empresaVinculadaNome}</p>
                            </div>
                          )}
                          <div className="h-px bg-gray-50 my-1 mx-2" />
                          <button onClick={() => { setClienteMenuOpen(false); setClienteProfileModalOpen(true); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 rounded-xl transition-all">
                            <UserCircle className="w-4 h-4 text-indigo-500" />Meu Perfil
                          </button>
                          <button onClick={() => { logoutCliente(); setClienteMenuOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all">
                            <LogOut className="w-4 h-4" />Sair
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Nenhum logado ── */}
              {!isLoggedIn && !isClienteLogado && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-2 h-auto rounded-lg shadow-sm hover:shadow-md transition-all"
                  onClick={handleLoginClick}
                >
                  Entrar
                </Button>
              )}
            </div>

            <button
              type="button"
              className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-6 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-3 rounded-lg ${pathname === item.href
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 font-medium"
                      } transition-colors`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-gray-100">
                  {isLoggedIn ? (
                    <>
                      <Button
                        variant="ghost"
                        className="text-gray-600 hover:bg-blue-50 hover:text-blue-700 w-full justify-start px-4 py-3 h-auto font-medium transition-all"
                        onClick={() => {
                          setProfileModalOpen(true)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <UserCircle className="w-5 h-5 mr-3" />
                        Meu Perfil
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-gray-600 hover:bg-gray-50 w-full justify-start px-4 py-3 h-auto font-medium"
                        onClick={() => {
                          router.push("/anuncio-de-fretes")
                          setMobileMenuOpen(false)
                        }}
                      >
                        <Truck className="w-5 h-5 mr-3" />
                        Fretes Disponíveis
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50 w-full justify-start px-4 py-3 h-auto font-medium"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Sair
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full py-3 rounded-lg shadow-sm"
                      onClick={handleLoginClick}
                    >
                      Entrar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Bem-vindo ao MovixFlow</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Selecione o tipo de acesso para continuar
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <button
              onClick={() => handleLoginTypeSelect("empresa")}
              className="group relative flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-blue-100 group-hover:bg-blue-600 rounded-xl flex items-center justify-center transition-colors">
                <Building2 className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                  Sou Empresa
                </h3>
                <p className="text-sm text-gray-600">Acesse os módulos de gestão logística</p>
              </div>
            </button>

            <button
              onClick={() => handleLoginTypeSelect("motorista")}
              className="group relative flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-green-100 group-hover:bg-green-600 rounded-xl flex items-center justify-center transition-colors">
                <User className="w-7 h-7 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-green-600 transition-colors">
                  Sou Motorista
                </h3>
                <p className="text-sm text-gray-600">Acesse fretes e gerencie suas viagens</p>
              </div>
            </button>

            <button
              onClick={() => {
                setLoginModalOpen(false)
                setClienteModalOpen(true)
              }}
              className="group relative flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
            >
              <div className="flex-shrink-0 w-14 h-14 bg-indigo-100 group-hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors">
                <Users className="w-7 h-7 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-indigo-600 transition-colors">
                  Sou Cliente
                </h3>
                <p className="text-sm text-gray-600">Solicite e acompanhe consultas de risco</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <DriverAuthModals
        loginOpen={driverLoginModalOpen}
        setLoginOpen={setDriverLoginModalOpen}
        regOpen={registrationModalOpen}
        setRegOpen={setRegistrationModalOpen}
        customHandleLogin={handleDriverLogin}
        customHandleRegister={handleRegistration}
      />

      <CadastroModal
        open={cadastroModalOpen}
        onOpenChange={setCadastroModalOpen}
      />

      <ClienteAuthModal
        open={clienteModalOpen}
        onOpenChange={setClienteModalOpen}
      />

      <ClienteProfileModal
        open={clienteProfileModalOpen}
        onOpenChange={setClienteProfileModalOpen}
      />

      <Dialog open={showFacialRecognition} onOpenChange={setShowFacialRecognition}>
        <DialogContent className="sm:max-w-lg">
          <FacialRecognition
            onCapture={handleFacialCapture}
            onCancel={handleFacialCancel}
            mode={facialRecognitionMode}
            storedFaceData={faceData || undefined} // Use faceData from context
          />
        </DialogContent>
      </Dialog>

      <Dialog open={registrationSuccess} onOpenChange={setRegistrationSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4 py-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Cadastro Concluído!</h3>
            <p className="text-gray-600">
              Sua conta foi criada com sucesso e seu reconhecimento facial foi registrado.
            </p>
            <p className="text-sm text-gray-500">Redirecionando para o login...</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Meu Perfil</DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {isEditMode ? "Edite suas informações" : "Informações do motorista cadastrado"}
            </DialogDescription>
          </DialogHeader>

          {!isEditMode ? (
            <div className="space-y-6 py-4">
              <div className="flex justify-center">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-6">
                {/* Classificação Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 border-b pb-2">
                    <IdCard className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Classificação do Motorista</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Tipo de Motorista</Label>
                    <p className="text-gray-900 font-medium mt-1">
                      {driverData?.driverClassification === "frota"
                        ? "Motorista de Frota (Funcionário da empresa)"
                        : driverData?.driverClassification === "agregado"
                          ? "Motorista Agregado (Parceiro da empresa)"
                          : "Motorista Autônomo (Terceirizado)"}
                    </p>
                  </div>

                  {driverData?.driverClassification === "autonomo" &&
                    (driverData.companyName || driverData.companyCnpj) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {driverData.companyName && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <Label className="text-xs text-blue-700 uppercase font-semibold">Empresa Terceira</Label>
                            <p className="text-gray-900 font-medium mt-1">{driverData.companyName}</p>
                          </div>
                        )}
                        {driverData.companyCnpj && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <Label className="text-xs text-blue-700 uppercase font-semibold">CNPJ</Label>
                            <p className="text-gray-900 font-medium mt-1">{driverData.companyCnpj}</p>
                          </div>
                        )}
                      </div>
                    )}
                </div>

                {/* Dados Pessoais Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-700 border-b pb-2">
                    <User className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-600 uppercase font-semibold">Nome Completo</Label>
                      <p className="text-gray-900 font-medium mt-1">{driverData?.name || ""}</p>
                    </div>

                    {driverData?.cpf && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">CPF</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.cpf}</p>
                      </div>
                    )}
                    {driverData?.rg && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">RG</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.rg}</p>
                      </div>
                    )}
                    {driverData?.birthDate && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Data de Nascimento</Label>
                        <p className="text-gray-900 font-medium mt-1">
                          {new Date(driverData.birthDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                    {driverData?.birthPlace && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Local de Nascimento</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.birthPlace}</p>
                      </div>
                    )}
                    {driverData?.motherName && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Nome da Mãe</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.motherName}</p>
                      </div>
                    )}
                    {driverData?.fatherName && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Nome do Pai</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.fatherName}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Habilitação Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 border-b pb-2">
                    <IdCard className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Carteira Nacional de Habilitação</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-600 uppercase font-semibold">CNH (nº de registro)</Label>
                      <p className="text-gray-900 font-medium mt-1">{driverData?.cnh || ""}</p>
                    </div>

                    {driverData?.cnhValidity && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Validade da CNH</Label>
                        <p className="text-gray-900 font-medium mt-1">
                          {new Date(driverData.cnhValidity).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}
                    {driverData?.cnhCategory && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Categoria da CNH</Label>
                        <p className="text-gray-900 font-medium mt-1">Categoria {driverData.cnhCategory}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contato Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-orange-700 border-b pb-2">
                    <Phone className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Informações de Contato</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-600 uppercase font-semibold">Email</Label>
                      <p className="text-gray-900 font-medium mt-1">{driverData?.email || ""}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <Label className="text-xs text-gray-600 uppercase font-semibold">Telefone</Label>
                      <p className="text-gray-900 font-medium mt-1">{driverData?.phone || ""}</p>
                    </div>

                    {driverData?.address && (
                      <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Endereço</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.address}</p>
                      </div>
                    )}
                    {driverData?.responsibleEmployee && driverData.driverClassification !== "autonomo" && (
                      <div className="p-4 bg-gray-50 rounded-lg sm:col-span-2">
                        <Label className="text-xs text-gray-600 uppercase font-semibold">Funcionário Responsável</Label>
                        <p className="text-gray-900 font-medium mt-1">{driverData.responsibleEmployee}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Veículo Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-blue-700 border-b pb-2">
                    <Car className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Veículo</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Tipo de Veículo</Label>
                    <p className="text-gray-900 font-medium mt-1">{driverData?.vehicleType || ""}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <Label className="text-xs text-gray-600 uppercase font-semibold">Placa do Veículo</Label>
                    <p className="text-gray-900 font-medium mt-1">{driverData?.vehiclePlate || ""}</p>
                  </div>
                </div>

                {/* Documentos Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-purple-700 border-b pb-2">
                    <FileText className="w-5 h-5" />
                    <h3 className="font-semibold text-lg">Status dos Documentos</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 ${driverData?.cnhDocument ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {driverData?.cnhDocument ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <Label className="text-xs uppercase font-semibold">CNH</Label>
                      </div>
                      <p
                        className={`text-sm font-medium ${driverData?.cnhDocument ? "text-green-700" : "text-red-700"}`}
                      >
                        {driverData?.cnhDocument ? "Documento enviado" : "Pendente"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${driverData?.selfieDocument ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {driverData?.selfieDocument ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <Label className="text-xs uppercase font-semibold">Selfie</Label>
                      </div>
                      <p
                        className={`text-sm font-medium ${driverData?.selfieDocument ? "text-green-700" : "text-red-700"}`}
                      >
                        {driverData?.selfieDocument ? "Documento enviado" : "Pendente"}
                      </p>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 ${driverData?.cnhExtraDocument ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {driverData?.cnhExtraDocument ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-gray-400" />
                        )}
                        <Label className="text-xs uppercase font-semibold">CNH Extra</Label>
                      </div>
                      <p
                        className={`text-sm font-medium ${driverData?.cnhExtraDocument ? "text-green-700" : "text-gray-600"}`}
                      >
                        {driverData?.cnhExtraDocument ? "Documento enviado" : "Opcional"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setProfileModalOpen(false)}>
                  Fechar
                </Button>
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleEditProfileClick}>
                  Editar Perfil
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProfileUpdate} className="space-y-6 py-4">
              {profileUpdateError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{profileUpdateError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-700">
                  <IdCard className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Classificação do Motorista</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setEditDriverClassification("frota")}
                    className={`p-4 rounded-xl border-2 transition-all ${editDriverClassification === "frota"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${editDriverClassification === "frota" ? "bg-blue-600" : "bg-blue-100"
                          }`}
                      >
                        <Building
                          className={`w-6 h-6 ${editDriverClassification === "frota" ? "text-white" : "text-blue-600"}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">Motorista de Frota</p>
                        <p className="text-xs text-gray-600">Funcionário da empresa</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditDriverClassification("agregado")}
                    className={`p-4 rounded-xl border-2 transition-all ${editDriverClassification === "agregado"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${editDriverClassification === "agregado" ? "bg-green-600" : "bg-green-100"
                          }`}
                      >
                        <Users
                          className={`w-6 h-6 ${editDriverClassification === "agregado" ? "text-white" : "text-green-600"}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">Motorista Agregado</p>
                        <p className="text-xs text-gray-600">Parceiro da empresa</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditDriverClassification("autonomo")}
                    className={`p-4 rounded-xl border-2 transition-all ${editDriverClassification === "autonomo"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${editDriverClassification === "autonomo" ? "bg-orange-600" : "bg-orange-100"
                          }`}
                      >
                        <User
                          className={`w-6 h-6 ${editDriverClassification === "autonomo" ? "text-white" : "text-orange-600"}`}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">Motorista Autônomo</p>
                        <p className="text-xs text-gray-600">Terceirizado</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {editDriverClassification === "autonomo" && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Building2 className="w-5 h-5" />
                    <h3 className="font-semibold">Empresa Terceira</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-company-name" className="text-gray-900 font-medium">
                        Nome da Empresa
                      </Label>
                      <Input
                        id="edit-company-name"
                        type="text"
                        placeholder="Nome da empresa terceirizada"
                        value={editCompanyName}
                        onChange={(e) => setEditCompanyName(e.target.value)}
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-company-cnpj" className="text-gray-900 font-medium">
                        CNPJ
                      </Label>
                      <Input
                        id="edit-company-cnpj"
                        type="text"
                        placeholder="00.000.000/0000-00"
                        value={editCompanyCnpj}
                        onChange={(e) => setEditCompanyCnpj(e.target.value)}
                        className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-700">
                  <User className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Dados do Motorista</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cpf" className="text-gray-900 font-medium">
                      CPF
                    </Label>
                    <Input
                      id="edit-cpf"
                      type="text"
                      placeholder="000.000.000-00"
                      value={editCpf}
                      onChange={(e) => setEditCpf(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-gray-900 font-medium">
                      Nome Completo *
                    </Label>
                    <Input
                      id="edit-name"
                      type="text"
                      placeholder="Nome completo do motorista"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-rg" className="text-gray-900 font-medium">
                      RG
                    </Label>
                    <Input
                      id="edit-rg"
                      type="text"
                      placeholder="00.000.000-0"
                      value={editRg}
                      onChange={(e) => setEditRg(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-birth-date" className="text-gray-900 font-medium">
                      Data de Nascimento
                    </Label>
                    <Input
                      id="edit-birth-date"
                      type="date"
                      value={editBirthDate}
                      onChange={(e) => setEditBirthDate(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-birth-place" className="text-gray-900 font-medium">
                      Local de Nascimento
                    </Label>
                    <Input
                      id="edit-birth-place"
                      type="text"
                      placeholder="Cidade - Estado"
                      value={editBirthPlace}
                      onChange={(e) => setEditBirthPlace(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-address" className="text-gray-900 font-medium">
                      Endereço
                    </Label>
                    <Input
                      id="edit-address"
                      type="text"
                      placeholder="Rua, número, bairro, cidade"
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-mother-name" className="text-gray-900 font-medium">
                      Nome da Mãe
                    </Label>
                    <Input
                      id="edit-mother-name"
                      type="text"
                      placeholder="Nome completo da mãe"
                      value={editMotherName}
                      onChange={(e) => setEditMotherName(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-father-name" className="text-gray-900 font-medium">
                      Nome do Pai
                    </Label>
                    <Input
                      id="edit-father-name"
                      type="text"
                      placeholder="Nome completo do pai"
                      value={editFatherName}
                      onChange={(e) => setEditFatherName(e.target.value)}
                      className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-700">
                  <IdCard className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Carteira Nacional de Habilitação</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-cnh" className="text-gray-900 font-medium">
                      CNH (nº de registro) *
                    </Label>
                    <Input
                      id="edit-cnh"
                      type="text"
                      placeholder="00000000000"
                      value={editCnh}
                      onChange={(e) => setEditCnh(e.target.value)}
                      className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-cnh-validity" className="text-gray-900 font-medium">
                      Validade da CNH
                    </Label>
                    <Input
                      id="edit-cnh-validity"
                      type="date"
                      value={editCnhValidity}
                      onChange={(e) => setEditCnhValidity(e.target.value)}
                      className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-cnh-category" className="text-gray-900 font-medium">
                      Categoria da CNH
                    </Label>
                    <Select value={editCnhCategory} onValueChange={setEditCnhCategory}>
                      <SelectTrigger className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Categoria A</SelectItem>
                        <SelectItem value="B">Categoria B</SelectItem>
                        <SelectItem value="C">Categoria C</SelectItem>
                        <SelectItem value="D">Categoria D</SelectItem>
                        <SelectItem value="E">Categoria E</SelectItem>
                        <SelectItem value="AB">Categoria AB</SelectItem>
                        <SelectItem value="AC">Categoria AC</SelectItem>
                        <SelectItem value="AD">Categoria AD</SelectItem>
                        <SelectItem value="AE">Categoria AE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-700">
                  <Phone className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Informações de Contato</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone" className="text-gray-900 font-medium">
                      Telefone *
                    </Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  {editDriverClassification !== "autonomo" && (
                    <div className="space-y-2">
                      <Label htmlFor="edit-responsible" className="text-gray-900 font-medium">
                        Funcionário Responsável
                      </Label>
                      <Input
                        id="edit-responsible"
                        type="text"
                        placeholder="Nome do funcionário responsável"
                        value={editResponsibleEmployee}
                        onChange={(e) => setEditResponsibleEmployee(e.target.value)}
                        className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-gray-900 font-medium">
                      E-mail *
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="motorista@email.com"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-vehicle" className="text-gray-900 font-medium">
                      Tipo de Veículo *
                    </Label>
                    <Input
                      id="edit-vehicle"
                      type="text"
                      placeholder="Caminhão Baú"
                      value={editVehicleType}
                      onChange={(e) => setEditVehicleType(e.target.value)}
                      className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-plate" className="text-gray-900 font-medium">
                      Placa do Veículo *
                    </Label>
                    <Input
                      id="edit-plate"
                      type="text"
                      placeholder="ABC-1234"
                      value={editVehiclePlate}
                      onChange={(e) => setEditVehiclePlate(e.target.value.toUpperCase())}
                      className="h-11 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-700">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-semibold text-lg">Anexar Documentos do Motorista</h3>
                </div>
                <p className="text-sm text-gray-600">Atualize seus documentos para validação</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-900 font-medium">CNH (Carteira Nacional de Habilitação)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="edit-cnh-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setEditCnhFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="edit-cnh-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          {editCnhFile ? editCnhFile.name : "Clique para anexar CNH"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (máx. 5MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 font-medium">Selfie do Motorista</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="edit-selfie-upload"
                        accept=".jpg,.jpeg,.png"
                        onChange={(e) => setEditSelfieFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="edit-selfie-upload" className="cursor-pointer">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          {editSelfieFile ? editSelfieFile.name : "Clique para anexar selfie"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG (máx. 2MB)</p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-900 font-medium">CNH Extra (Verso/Adicional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer">
                      <input
                        type="file"
                        id="edit-cnh-extra-upload"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setEditCnhExtraFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="edit-cnh-extra-upload" className="cursor-pointer">
                        <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">
                          {editCnhExtraFile ? editCnhExtraFile.name : "Clique para anexar"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (máx. 5MB)</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  Salvar Alterações
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
