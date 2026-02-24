"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DriverData {
  name: string
  email?: string
  phone?: string
  cnh?: string
  vehicleType?: string
  cpf: string
  profileComplete: boolean
  profileCompletionPending: boolean
  vehiclePlate?: string
  // </CHANGE>
  rg?: string
  birthDate?: string
  birthPlace?: string
  address?: string
  motherName?: string
  fatherName?: string
  cnhValidity?: string
  cnhCategory?: string
  driverClassification?: string
  companyName?: string
  companyCnpj?: string
  responsibleEmployee?: string
  cnhDocument?: string
  selfieDocument?: string
  cnhExtraDocument?: string
  faceData?: string
}

interface UserContextType {
  isLoggedIn: boolean
  driverData: DriverData | null
  faceData: string | null
  login: (data: DriverData) => void
  logout: () => void
  updateDriverData: (data: Partial<DriverData>) => void
  setFaceData: (data: string) => void
  completeProfile: () => void
  // </CHANGE>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [driverData, setDriverData] = useState<DriverData | null>(null)
  const [faceDataState, setFaceDataState] = useState<string | null>(null)

  const login = (data: DriverData) => {
    setIsLoggedIn(true)
    setDriverData(data)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setDriverData(null)
    setFaceDataState(null)
  }

  const updateDriverData = (data: Partial<DriverData>) => {
    if (driverData) {
      setDriverData({ ...driverData, ...data })
    }
  }

  const setFaceData = (data: string) => {
    setFaceDataState(data)
  }

  const completeProfile = () => {
    if (driverData) {
      setDriverData({
        ...driverData,
        profileComplete: true,
        profileCompletionPending: false,
      })
    }
  }
  // </CHANGE>

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        driverData,
        faceData: faceDataState,
        login,
        logout,
        updateDriverData,
        setFaceData,
        completeProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
