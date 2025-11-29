'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { useStore } from '@/lib/store'
import type { EmergencyReserve } from '@/types'
import { PiggyBank, TrendingUp } from 'lucide-react'

export default function ReservaPage() {
  const { emergencyReserve, updateEmergencyReserve } = useStore()
  const [isEditing, setIsEditing] = useState(!emergencyReserve)
  const [formData, setFormData] = useState({
    targetAmount: emergencyReserve?.targetAmount.toString() || '',
    currentAmount: emergencyReserve?.currentAmount.toString() || '0',
    monthlyContribution: emergencyReserve?.monthlyContribution.toString() || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const reserve: EmergencyReserve = {
      id: emergencyReserve?.id || Date.now().toString(),
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount),
      monthlyContribution: parseFloat(formData.monthlyContribution),
    }

    updateEmergencyReserve(reserve)
    setIsEditing(false)
  }

  const progress = emergencyReserve
    ? Math.min((emergencyReserve.currentAmount / emergencyReserve.targetAmount) * 100, 100)
    : 0

  const monthsRemaining = emergencyReserve
    ? Math.ceil(
        (emergencyReserve.targetAmount - emergencyReserve.currentAmount) /
          emergencyReserve.monthlyContribution
      )
    : 0

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-warning-500 via-warning-600 to-warning-700 flex items-center justify-center shadow-lg shadow-warning-500/30">
              <PiggyBank className="text-white" size={24} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Reserva de Emergência
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Controle sua reserva financeira de emergência
              </p>
            </div>
            {emergencyReserve && !isEditing && (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            )}
          </div>
        </div>

        {isEditing ? (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Configurar Reserva de Emergência
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Meta da Reserva (R$)"
                type="number"
                step="0.01"
                value={formData.targetAmount}
                onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                required
              />
              <Input
                label="Valor Atual (R$)"
                type="number"
                step="0.01"
                value={formData.currentAmount}
                onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                required
              />
              <Input
                label="Contribuição Mensal (R$)"
                type="number"
                step="0.01"
                value={formData.monthlyContribution}
                onChange={(e) =>
                  setFormData({ ...formData, monthlyContribution: e.target.value })
                }
                required
              />
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Salvar
                </Button>
                {emergencyReserve && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>
        ) : (
          emergencyReserve && (
            <>
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-warning-100 rounded-xl">
                    <PiggyBank className="text-warning-600" size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      R$ {emergencyReserve.currentAmount.toFixed(2)}
                    </h2>
                    <p className="text-slate-600">
                      de R$ {emergencyReserve.targetAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Progresso</span>
                    <span className="font-semibold text-slate-900">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        progress >= 100 ? 'bg-success-500' : 'bg-warning-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-600 mb-1">
                      Contribuição Mensal
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      R$ {emergencyReserve.monthlyContribution.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-600 mb-1">
                      Meses Restantes
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      {monthsRemaining}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-primary-50">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-primary-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      Próxima Contribuição
                    </h3>
                    <p className="text-sm text-slate-600">
                      Adicione R$ {emergencyReserve.monthlyContribution.toFixed(2)}{' '}
                      para continuar progredindo em sua reserva
                    </p>
                  </div>
                </div>
              </Card>
            </>
          )
        )}

        {!emergencyReserve && !isEditing && (
          <Card className="p-12 text-center">
            <PiggyBank size={48} className="mx-auto text-slate-400 mb-4" />
            <p className="text-slate-500 mb-4">
              Configure sua reserva de emergência para começar
            </p>
            <Button onClick={() => setIsEditing(true)}>Configurar Reserva</Button>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}

