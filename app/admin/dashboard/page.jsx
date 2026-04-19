"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { 
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  FolderOpen,
  Megaphone,
  Newspaper,
  Plus,
  BookOpen,
  RefreshCw,
  Video,
  Wrench,
  Users,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import AdminLayout from '../../../components/AdminLayout'
import {
  apiClient,
  eventsApi,
  newsApi,
  projectsApi,
  publicationsApi,
  servicesApi,
  teamApi,
} from '../../../src/lib/api'

const RESOURCE_LABELS = {
  projects: 'Projects',
  services: 'Services',
  events: 'Events',
  team: 'Team Members',
  publications: 'Publications',
  news: 'News',
  press: 'Press Releases',
  videos: 'Videos',
}

const RESOURCE_CARDS = [
  { key: 'projects', href: '/admin/projects', icon: FolderOpen, accent: 'text-blue-600', bg: 'bg-blue-100' },
  { key: 'services', href: '/admin/services', icon: Wrench, accent: 'text-emerald-600', bg: 'bg-emerald-100' },
  { key: 'events', href: '/admin/events', icon: Calendar, accent: 'text-violet-600', bg: 'bg-violet-100' },
  { key: 'team', href: '/admin/team', icon: Users, accent: 'text-amber-600', bg: 'bg-amber-100' },
  { key: 'publications', href: '/admin/publications', icon: BookOpen, accent: 'text-cyan-600', bg: 'bg-cyan-100' },
  { key: 'news', href: '/admin/news', icon: Newspaper, accent: 'text-rose-600', bg: 'bg-rose-100' },
  { key: 'press', href: '/admin/press', icon: Megaphone, accent: 'text-indigo-600', bg: 'bg-indigo-100' },
  { key: 'videos', href: '/admin/videos', icon: Video, accent: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
]

const QUICK_ACTIONS = [
  { name: 'Add Project', icon: Plus, href: '/admin/projects/add', color: 'bg-blue-500' },
  { name: 'Add Service', icon: Plus, href: '/admin/services/add', color: 'bg-green-500' },
  { name: 'Add Event', icon: Plus, href: '/admin/events/add', color: 'bg-purple-500' },
  { name: 'Add Publication', icon: Plus, href: '/admin/publications/add', color: 'bg-cyan-500' },
  { name: 'Add News', icon: Plus, href: '/admin/news/add', color: 'bg-rose-500' },
  { name: 'Site Settings', icon: Plus, href: '/admin/settings', color: 'bg-slate-500' },
]

const EMPTY_STATS = {
  projects: 0,
  services: 0,
  events: 0,
  team: 0,
  publications: 0,
  news: 0,
  press: 0,
  videos: 0,
}

const extractResponse = (result) => {
  if (!result || result.status !== 'fulfilled') {
    return null
  }

  if (result.value?.success === false) {
    return null
  }

  return result.value
}

const extractData = (response) => {
  if (!response || !Array.isArray(response.data)) {
    return []
  }

  return response.data
}

const extractTotal = (response) => {
  if (!response) {
    return 0
  }

  if (typeof response?.pagination?.total === 'number') {
    return response.pagination.total
  }

  const list = extractData(response)
  return list.length
}

const pickTitle = (item) => {
  return (
    item?.title ||
    item?.name ||
    item?.full_name ||
    item?.label ||
    'Untitled item'
  )
}

const pickDate = (item, fields) => {
  for (const field of fields) {
    if (item?.[field]) {
      return item[field]
    }
  }
  return null
}

const timeValue = (value) => {
  if (!value) {
    return 0
  }

  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const formatDate = (value) => {
  if (!value) {
    return 'Unknown date'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date'
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const buildRecentEntries = (items, type, href, dateFields) => {
  return items.map((item, index) => {
    const rawDate = pickDate(item, dateFields)
    const idFallback = item?.id || item?.slug || `${type}-${index}`

    return {
      id: `${type}-${idFallback}`,
      type,
      title: pickTitle(item),
      date: rawDate,
      href,
    }
  })
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [featuredProjects, setFeaturedProjects] = useState(0)
  const [upcomingEvents, setUpcomingEvents] = useState(0)
  const [recentUpdates, setRecentUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const [partialFailures, setPartialFailures] = useState([])

  const loadDashboard = useCallback(async ({ isRefresh = false } = {}) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    setError('')

    const requests = {
      projects: projectsApi.getAll({ limit: 3, offset: 0, sortBy: 'created_at', sortOrder: 'DESC' }),
      services: servicesApi.getAll({ limit: 3, offset: 0 }),
      events: eventsApi.getAll({ limit: 3, offset: 0, sortBy: 'event_date', sortOrder: 'DESC' }),
      team: teamApi.getAll({ limit: 3, offset: 0, is_active: 'true' }),
      publications: publicationsApi.getAll({
        limit: 3,
        offset: 0,
        is_public: 'true',
        sortBy: 'publication_date',
        sortOrder: 'DESC',
      }),
      news: newsApi.getAll({
        limit: 3,
        offset: 0,
        is_published: 'true',
        sortBy: 'publication_date',
        sortOrder: 'DESC',
      }),
      press: apiClient.get('/press', {
        limit: 3,
        offset: 0,
        is_published: 'true',
        sortBy: 'publish_date',
        sortOrder: 'DESC',
      }),
      videos: apiClient.get('/videos', {
        limit: 3,
        offset: 0,
        is_published: 'true',
        sortBy: 'publish_date',
        sortOrder: 'DESC',
      }),
      featuredProjects: projectsApi.getAll({ featured: 'true', limit: 1, offset: 0 }),
      upcomingEvents: eventsApi.getAll({ upcoming: 'true', limit: 1, offset: 0 }),
    }

    const requestEntries = Object.entries(requests)

    try {
      const settled = await Promise.allSettled(requestEntries.map(([, promise]) => promise))

      const resultMap = {}
      requestEntries.forEach(([key], index) => {
        resultMap[key] = settled[index]
      })

      const failedEndpoints = requestEntries
        .map(([key], index) => ({ key, result: settled[index] }))
        .filter((entry) => entry.result.status === 'rejected')
        .map((entry) => RESOURCE_LABELS[entry.key] || entry.key)

      setPartialFailures(failedEndpoints)

      const projectsResponse = extractResponse(resultMap.projects)
      const servicesResponse = extractResponse(resultMap.services)
      const eventsResponse = extractResponse(resultMap.events)
      const teamResponse = extractResponse(resultMap.team)
      const publicationsResponse = extractResponse(resultMap.publications)
      const newsResponse = extractResponse(resultMap.news)
      const pressResponse = extractResponse(resultMap.press)
      const videosResponse = extractResponse(resultMap.videos)
      const featuredProjectsResponse = extractResponse(resultMap.featuredProjects)
      const upcomingEventsResponse = extractResponse(resultMap.upcomingEvents)

      const nextStats = {
        projects: extractTotal(projectsResponse),
        services: extractTotal(servicesResponse),
        events: extractTotal(eventsResponse),
        team: extractTotal(teamResponse),
        publications: extractTotal(publicationsResponse),
        news: extractTotal(newsResponse),
        press: extractTotal(pressResponse),
        videos: extractTotal(videosResponse),
      }

      setStats(nextStats)
      setFeaturedProjects(extractTotal(featuredProjectsResponse))
      setUpcomingEvents(extractTotal(upcomingEventsResponse))

      const updates = [
        ...buildRecentEntries(extractData(projectsResponse), 'Project', '/admin/projects', ['updated_at', 'created_at', 'start_date']),
        ...buildRecentEntries(extractData(eventsResponse), 'Event', '/admin/events', ['event_date', 'updated_at', 'created_at']),
        ...buildRecentEntries(extractData(publicationsResponse), 'Publication', '/admin/publications', ['publication_date', 'updated_at', 'created_at']),
        ...buildRecentEntries(extractData(newsResponse), 'News', '/admin/news', ['publication_date', 'publish_date', 'updated_at', 'created_at']),
        ...buildRecentEntries(extractData(pressResponse), 'Press', '/admin/press', ['publish_date', 'updated_at', 'created_at']),
        ...buildRecentEntries(extractData(videosResponse), 'Video', '/admin/videos', ['publish_date', 'updated_at', 'created_at']),
      ]
        .sort((a, b) => timeValue(b.date) - timeValue(a.date))
        .slice(0, 10)

      setRecentUpdates(updates)

      if (!projectsResponse && !servicesResponse && !eventsResponse) {
        setError('Unable to load dashboard data right now. Please try refreshing.')
      }

      setLastSyncedAt(new Date())
    } catch (loadError) {
      console.error('Dashboard load failed:', loadError)
      setError('Unable to load dashboard data right now. Please try again.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const totalResources = useMemo(() => {
    return Object.values(stats).reduce((sum, value) => sum + value, 0)
  }, [stats])

  const totalMediaContent = useMemo(() => {
    return stats.news + stats.press + stats.videos
  }, [stats])

  const operationalSignals = useMemo(() => {
    const signals = []

    if (featuredProjects === 0) {
      signals.push({
        type: 'warning',
        message: 'No featured projects are currently marked. Consider featuring key work on the homepage.',
      })
    }

    if (upcomingEvents === 0) {
      signals.push({
        type: 'warning',
        message: 'No upcoming events found. Add at least one future event to keep the site timeline active.',
      })
    }

    if (stats.team === 0) {
      signals.push({
        type: 'warning',
        message: 'Team listing is empty. Add team members to strengthen the About section credibility.',
      })
    }

    if (signals.length === 0) {
      signals.push({
        type: 'ok',
        message: 'Core content collections are populated and operational.',
      })
    }

    return signals
  }, [featuredProjects, upcomingEvents, stats.team])

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Live Content Overview</h3>
            <p className="text-sm text-gray-600 mt-1">
              Dashboard metrics are loaded from your live API resources.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadDashboard({ isRefresh: true })}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1A365D] text-white text-sm font-medium hover:bg-[#224a80] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh Dashboard'}
            </button>
            <div className="text-xs text-gray-500">
              Last sync: {lastSyncedAt ? lastSyncedAt.toLocaleString() : 'Not synced'}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {partialFailures.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <p className="text-sm text-amber-700">
              Some endpoints did not respond: {partialFailures.join(', ')}. Showing partial dashboard data.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RESOURCE_CARDS.map((card) => {
            const Icon = card.icon

            return (
              <div key={card.key} className="bg-white p-5 rounded-lg shadow-sm border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{RESOURCE_LABELS[card.key]}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats[card.key]}</p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${card.bg}`}>
                    <Icon className={`w-6 h-6 ${card.accent}`} />
                  </div>
                </div>
                <Link href={card.href} className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-[#1A365D] hover:text-[#224a80]">
                  Manage
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm font-medium text-gray-600">Featured Projects</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{featuredProjects}</p>
            <p className="text-sm text-gray-500 mt-2">Highlighted on key public pages</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{upcomingEvents}</p>
            <p className="text-sm text-gray-500 mt-2">Future-dated events currently scheduled</p>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border">
            <p className="text-sm font-medium text-gray-600">Media Content</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalMediaContent}</p>
            <p className="text-sm text-gray-500 mt-2">Combined news, press, and video items</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.name}
                href={action.href}
                className="flex flex-col items-center p-5 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-full ${action.color} text-white mb-3`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700 text-center">{action.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Recent Content Updates</h3>
            </div>
            <div className="p-5">
              {recentUpdates.length === 0 ? (
                <p className="text-sm text-gray-500">No recent updates found yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentUpdates.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wide text-[#1A365D] bg-blue-50 px-2 py-0.5 rounded-full">
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                        </div>
                        <p className="text-sm text-gray-800 line-clamp-2">{item.title}</p>
                      </div>
                      <Link
                        href={item.href}
                        className="text-xs text-[#1A365D] font-medium hover:text-[#224a80] whitespace-nowrap"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-5 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Operational Insights</h3>
            </div>
            <div className="p-5 space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Managed Resources</span>
                  <span className="font-semibold text-gray-900">{totalResources}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Featured Projects</span>
                  <span className="font-semibold text-gray-900">{featuredProjects}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Upcoming Event Slots</span>
                  <span className="font-semibold text-gray-900">{upcomingEvents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Synced</span>
                  <span className="font-semibold text-gray-900 text-xs text-right">
                    {lastSyncedAt ? lastSyncedAt.toLocaleString() : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t space-y-3">
                {operationalSignals.map((signal, index) => (
                  <div key={`${signal.type}-${index}`} className="flex items-start gap-2">
                    {signal.type === 'ok' ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-600" />
                    )}
                    <p className="text-sm text-gray-700">{signal.message}</p>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  Live API telemetry from public and admin content endpoints.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
