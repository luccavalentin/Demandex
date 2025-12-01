'use client'

import React, { useState } from 'react'
import { MainLayout } from '@/components/Layout/MainLayout'
import { Card } from '@/components/UI/Card'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Moon, 
  Sun, 
  Save,
  Globe,
  Shield,
  Database
} from 'lucide-react'

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<'perfil' | 'notificacoes' | 'aparencia' | 'privacidade'>('perfil')
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('light')

  const tabs = [
    { id: 'perfil' as const, label: 'Perfil', icon: User },
    { id: 'notificacoes' as const, label: 'Notificações', icon: Bell },
    { id: 'aparencia' as const, label: 'Aparência', icon: Palette },
    { id: 'privacidade' as const, label: 'Privacidade', icon: Shield },
  ]

  return (
    <MainLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center gap-4 mb-4 text-center">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-500/30">
              <Settings className="text-white" size={28} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                Configurações
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Gerencie suas preferências e configurações da conta
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Menu Lateral */}
          <div className="lg:col-span-1">
            <Card className="p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                        transition-all duration-200
                        ${
                          isActive
                            ? 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-md'
                            : 'text-slate-700 hover:bg-slate-50'
                        }
                      `}
                    >
                      <Icon size={20} strokeWidth={2} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </Card>
          </div>

          {/* Conteúdo */}
          <div className="lg:col-span-3">
            <Card className="p-6 sm:p-8">
              {/* Perfil */}
              {activeTab === 'perfil' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Informações do Perfil</h2>
                    <p className="text-sm text-slate-600">Atualize suas informações pessoais</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Nome
                      </label>
                      <Input placeholder="Seu nome completo" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Telefone
                      </label>
                      <Input type="tel" placeholder="(00) 00000-0000" />
                    </div>

                    <div className="pt-4">
                      <Button>
                        <Save size={18} className="mr-2" />
                        Salvar Alterações
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notificações */}
              {activeTab === 'notificacoes' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Preferências de Notificações</h2>
                    <p className="text-sm text-slate-600">Configure como e quando você deseja receber notificações</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <h3 className="font-semibold text-slate-900">Notificações por Email</h3>
                        <p className="text-sm text-slate-600">Receba atualizações importantes por email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <h3 className="font-semibold text-slate-900">Lembretes de Tarefas</h3>
                        <p className="text-sm text-slate-600">Receba lembretes sobre tarefas pendentes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                      <div>
                        <h3 className="font-semibold text-slate-900">Alertas Financeiros</h3>
                        <p className="text-sm text-slate-600">Notificações sobre transações e metas financeiras</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Aparência */}
              {activeTab === 'aparencia' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Aparência e Tema</h2>
                    <p className="text-sm text-slate-600">Personalize a aparência da aplicação</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-3">
                        Tema
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setTheme('light')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === 'light'
                              ? 'border-slate-600 bg-slate-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Sun className="mx-auto mb-2 text-slate-600" size={24} />
                          <span className="text-sm font-medium text-slate-700">Claro</span>
                        </button>
                        <button
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === 'dark'
                              ? 'border-slate-600 bg-slate-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Moon className="mx-auto mb-2 text-slate-600" size={24} />
                          <span className="text-sm font-medium text-slate-700">Escuro</span>
                        </button>
                        <button
                          onClick={() => setTheme('auto')}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            theme === 'auto'
                              ? 'border-slate-600 bg-slate-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <Settings className="mx-auto mb-2 text-slate-600" size={24} />
                          <span className="text-sm font-medium text-slate-700">Automático</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacidade */}
              {activeTab === 'privacidade' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Privacidade e Segurança</h2>
                    <p className="text-sm text-slate-600">Gerencie suas configurações de privacidade</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <Shield className="text-slate-600 mt-0.5" size={20} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">Segurança dos Dados</h3>
                          <p className="text-sm text-slate-600 mb-3">
                            Seus dados são armazenados localmente e nunca são compartilhados com terceiros.
                          </p>
                          <Button variant="secondary" size="sm">
                            Exportar Dados
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-start gap-3">
                        <Database className="text-slate-600 mt-0.5" size={20} />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">Backup e Sincronização</h3>
                          <p className="text-sm text-slate-600 mb-3">
                            Faça backup dos seus dados regularmente para não perder informações importantes.
                          </p>
                          <Button variant="secondary" size="sm">
                            Fazer Backup Agora
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-900 mb-1">Zona de Perigo</h3>
                          <p className="text-sm text-red-700 mb-3">
                            Esta ação não pode ser desfeita. Todos os seus dados serão permanentemente excluídos.
                          </p>
                          <Button variant="secondary" size="sm" className="bg-red-600 hover:bg-red-700 text-white border-red-700">
                            Excluir Todos os Dados
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

