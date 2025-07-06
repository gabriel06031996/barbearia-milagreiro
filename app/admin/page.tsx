"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Lead {
  id: number
  name: string
  email: string
  phone: string
  interest_type: string
  message: string
  status: string
  created_at: string
  property_title?: string
  agent_name?: string
}

interface Property {
  id: number
  title: string
  price: number
  property_type: string
  transaction_type: string
  city: string
  neighborhood: string
  views_count: number
  is_featured: boolean
  agent_name: string
}

interface Analytics {
  stats: {
    unique_sessions: number
    total_events: number
    page_views: number
    form_submissions: number
    property_views: number
  }
  topEvents: Array<{
    event_type: string
    count: number
  }>
}

export default function AdminDashboard() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Carregar leads
      const leadsResponse = await fetch("/api/leads?limit=20")
      const leadsData = await leadsResponse.json()
      if (leadsData.success) {
        setLeads(leadsData.data)
      }

      // Carregar propriedades
      const propertiesResponse = await fetch("/api/properties?limit=20")
      const propertiesData = await propertiesResponse.json()
      if (propertiesData.success) {
        setProperties(propertiesData.data)
      }

      // Carregar analytics
      const analyticsResponse = await fetch("/api/analytics?days=7")
      const analyticsData = await analyticsResponse.json()
      if (analyticsData.success) {
        setAnalytics(analyticsData.data)
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch("/api/leads", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: leadId,
          status: newStatus,
        }),
      })

      const result = await response.json()
      if (result.success) {
        // Atualizar o lead na lista
        setLeads(leads.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)))
      }
    } catch (error) {
      console.error("Error updating lead status:", error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      novo: "bg-blue-100 text-blue-800",
      contatado: "bg-yellow-100 text-yellow-800",
      qualificado: "bg-green-100 text-green-800",
      convertido: "bg-emerald-100 text-emerald-800",
      perdido: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Administrativo</h1>
              <p className="text-gray-600">Imovel Prime - Gestão Imobiliária</p>
            </div>
            <Button onClick={loadDashboardData} className="bg-blue-600 hover:bg-blue-700">
              <i className="fas fa-sync-alt mr-2"></i>
              Atualizar
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", name: "Visão Geral", icon: "fas fa-chart-line" },
              { id: "leads", name: "Leads", icon: "fas fa-users" },
              { id: "properties", name: "Propriedades", icon: "fas fa-home" },
              { id: "analytics", name: "Analytics", icon: "fas fa-chart-bar" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <i className={tab.icon}></i>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <i className="fas fa-users text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <i className="fas fa-home text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Propriedades</p>
                      <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                        <i className="fas fa-eye text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Visualizações</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.stats.page_views || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <i className="fas fa-chart-line text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Conversões</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics?.stats.form_submissions || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Leads Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leads.slice(0, 5).map((lead) => (
                      <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{lead.name}</p>
                          <p className="text-sm text-gray-600">{lead.email}</p>
                          <p className="text-xs text-gray-500">{formatDate(lead.created_at)}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Propriedades Mais Vistas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties
                      .sort((a, b) => b.views_count - a.views_count)
                      .slice(0, 5)
                      .map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{property.title}</p>
                            <p className="text-sm text-gray-600">
                              {property.neighborhood}, {property.city}
                            </p>
                            <p className="text-sm font-medium text-blue-600">{formatPrice(property.price)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{property.views_count}</p>
                            <p className="text-xs text-gray-500">visualizações</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === "leads" && (
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Interesse
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            {lead.phone && <div className="text-sm text-gray-500">{lead.phone}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{lead.interest_type}</div>
                          {lead.property_title && <div className="text-sm text-gray-500">{lead.property_title}</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="novo">Novo</option>
                            <option value="contatado">Contatado</option>
                            <option value="qualificado">Qualificado</option>
                            <option value="convertido">Convertido</option>
                            <option value="perdido">Perdido</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <Card>
            <CardHeader>
              <CardTitle>Portfólio de Propriedades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <div key={property.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">{property.title}</h3>
                        {property.is_featured && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Destaque
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {property.neighborhood}, {property.city}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mb-2">{formatPrice(property.price)}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="capitalize">{property.property_type}</span>
                        <span className="capitalize">{property.transaction_type}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">{property.views_count} visualizações</span>
                        <span className="text-sm text-gray-600">{property.agent_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && analytics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sessões Únicas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{analytics.stats.unique_sessions}</p>
                  <p className="text-sm text-gray-600">Últimos 7 dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visualizações de Propriedades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">{analytics.stats.property_views}</p>
                  <p className="text-sm text-gray-600">Últimos 7 dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Formulários Enviados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">{analytics.stats.form_submissions}</p>
                  <p className="text-sm text-gray-600">Últimos 7 dias</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topEvents.map((event, index) => (
                    <div key={event.event_type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center mr-3">
                          {index + 1}
                        </span>
                        <span className="font-medium text-gray-900 capitalize">
                          {event.event_type.replace("_", " ")}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-900">{event.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
