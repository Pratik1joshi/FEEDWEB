"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { KeyRound, RefreshCw, Shield, Trash2, UserPlus } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import ConfirmationDialog from '@/components/ConfirmationDialog'
import { authApi } from '@/lib/api-services'
import { showAdminError, showAdminSuccess } from '@/lib/admin-toast'

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const initialAdminForm = {
  name: '',
  email: '',
  password: '',
  role: 'admin',
}

const formatRole = (role = '') => role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [passwordSaving, setPasswordSaving] = useState(false)

  const [admins, setAdmins] = useState([])
  const [adminsLoading, setAdminsLoading] = useState(false)
  const [adminForm, setAdminForm] = useState(initialAdminForm)
  const [adminSaving, setAdminSaving] = useState(false)

  const [deactivateDialog, setDeactivateDialog] = useState({
    isOpen: false,
    admin: null,
    loading: false,
  })

  const isSuperAdmin = profile?.role === 'super_admin'

  const loadProfile = useCallback(async () => {
    setProfileLoading(true)
    try {
      const response = await authApi.getProfile()
      setProfile(response.data || null)
    } catch (error) {
      showAdminError(error.message || 'Unable to load your admin profile.')
    } finally {
      setProfileLoading(false)
    }
  }, [])

  const loadAdmins = useCallback(async (showLoader = true) => {
    if (!isSuperAdmin) {
      setAdmins([])
      return
    }

    if (showLoader) {
      setAdminsLoading(true)
    }

    try {
      const response = await authApi.getAdmins()
      setAdmins(response.data || [])
    } catch (error) {
      showAdminError(error.message || 'Unable to load admin users.')
    } finally {
      if (showLoader) {
        setAdminsLoading(false)
      }
    }
  }, [isSuperAdmin])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    if (isSuperAdmin) {
      loadAdmins()
    }
  }, [isSuperAdmin, loadAdmins])

  const handlePasswordChange = (event) => {
    const { name, value } = event.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdminFieldChange = (event) => {
    const { name, value } = event.target
    setAdminForm((prev) => ({ ...prev, [name]: value }))
  }

  const submitPasswordChange = async (event) => {
    event.preventDefault()

    if (passwordForm.newPassword.length < 8) {
      showAdminError('New password must be at least 8 characters long.')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showAdminError('New password and confirmation do not match.')
      return
    }

    setPasswordSaving(true)

    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })

      setPasswordForm(initialPasswordForm)
      showAdminSuccess('Password updated successfully.')
    } catch (error) {
      showAdminError(error.message || 'Failed to update password.')
    } finally {
      setPasswordSaving(false)
    }
  }

  const submitCreateAdmin = async (event) => {
    event.preventDefault()

    if (!isSuperAdmin) {
      showAdminError('Only super admins can create admin users.')
      return
    }

    if (!adminForm.name.trim() || !adminForm.email.trim() || !adminForm.password.trim()) {
      showAdminError('Name, email, and password are required for a new admin user.')
      return
    }

    if (adminForm.password.length < 8) {
      showAdminError('Admin password must be at least 8 characters long.')
      return
    }

    setAdminSaving(true)

    try {
      await authApi.createAdmin({
        name: adminForm.name.trim(),
        email: adminForm.email.trim(),
        password: adminForm.password,
        role: adminForm.role,
      })

      setAdminForm(initialAdminForm)
      showAdminSuccess('New admin user created successfully.')
      await loadAdmins(false)
    } catch (error) {
      showAdminError(error.message || 'Failed to create admin user.')
    } finally {
      setAdminSaving(false)
    }
  }

  const openDeactivateDialog = (admin) => {
    setDeactivateDialog({
      isOpen: true,
      admin,
      loading: false,
    })
  }

  const closeDeactivateDialog = () => {
    if (deactivateDialog.loading) {
      return
    }

    setDeactivateDialog({
      isOpen: false,
      admin: null,
      loading: false,
    })
  }

  const confirmDeactivateAdmin = async () => {
    if (!deactivateDialog.admin) {
      return
    }

    setDeactivateDialog((prev) => ({ ...prev, loading: true }))

    try {
      await authApi.deactivateAdmin(deactivateDialog.admin.id)
      showAdminSuccess('Admin user deactivated successfully.')
      setDeactivateDialog({
        isOpen: false,
        admin: null,
        loading: false,
      })
      await loadAdmins(false)
    } catch (error) {
      setDeactivateDialog((prev) => ({ ...prev, loading: false }))
      showAdminError(error.message || 'Failed to deactivate admin user.')
    }
  }

  const adminCount = useMemo(() => admins.length, [admins])

  if (profileLoading) {
    return (
      <AdminLayout title="Settings">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Settings">
      <div className="max-w-6xl mx-auto space-y-6">
        <section className="bg-white rounded-lg border p-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Security Settings</h1>
          <p className="text-gray-600 mt-2">
            Update your password and manage admin access. Super admins can add or deactivate other admin accounts.
          </p>

          {profile && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-900">
              <Shield className="w-4 h-4" />
              Signed in as {profile.name} ({formatRole(profile.role)})
            </div>
          )}
        </section>

        <section className="bg-white rounded-lg border p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          <form onSubmit={submitPasswordChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field
              label="Current Password"
              name="currentPassword"
              type="password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <div className="hidden md:block" />
            <Field
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <Field
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              required
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={passwordSaving}
                className="inline-flex items-center gap-2 bg-[#0396FF] text-white px-5 py-2.5 rounded-md hover:bg-opacity-90 disabled:opacity-60"
              >
                {passwordSaving ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg border p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
              <p className="text-sm text-gray-600">Active admin accounts: {adminCount}</p>
            </div>

            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => loadAdmins()}
                disabled={adminsLoading}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${adminsLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>

          {!isSuperAdmin && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm">
              Super admin access is required to view or manage admin users.
            </div>
          )}

          {isSuperAdmin && (
            <>
              <form onSubmit={submitCreateAdmin} className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4 mb-6 bg-gray-50">
                <div className="md:col-span-2 flex items-center gap-2 text-sm font-medium text-gray-800">
                  <UserPlus className="w-4 h-4" />
                  Add New Admin
                </div>

                <Field
                  label="Full Name"
                  name="name"
                  value={adminForm.name}
                  onChange={handleAdminFieldChange}
                  required
                />
                <Field
                  label="Email"
                  name="email"
                  type="email"
                  value={adminForm.email}
                  onChange={handleAdminFieldChange}
                  required
                />
                <Field
                  label="Temporary Password"
                  name="password"
                  type="password"
                  value={adminForm.password}
                  onChange={handleAdminFieldChange}
                  required
                />

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={adminForm.role}
                    onChange={handleAdminFieldChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={adminSaving}
                    className="inline-flex items-center gap-2 bg-[#1A365D] text-white px-5 py-2.5 rounded-md hover:bg-[#132844] disabled:opacity-60"
                  >
                    {adminSaving ? 'Creating Admin...' : 'Create Admin'}
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">Name</th>
                      <th className="text-left px-4 py-3 font-medium">Email</th>
                      <th className="text-left px-4 py-3 font-medium">Role</th>
                      <th className="text-left px-4 py-3 font-medium">Last Login</th>
                      <th className="text-left px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {adminsLoading && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          Loading admin users...
                        </td>
                      </tr>
                    )}

                    {!adminsLoading && admins.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No active admin users found.
                        </td>
                      </tr>
                    )}

                    {!adminsLoading && admins.map((admin) => {
                      const isCurrentUser = admin.id === profile?.id

                      return (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{admin.name}</td>
                          <td className="px-4 py-3 text-gray-700">{admin.email}</td>
                          <td className="px-4 py-3 text-gray-700">{formatRole(admin.role)}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never'}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              disabled={isCurrentUser}
                              onClick={() => openDeactivateDialog(admin)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Trash2 className="w-4 h-4" />
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>

      <ConfirmationDialog
        isOpen={deactivateDialog.isOpen}
        title="Deactivate Admin"
        message={deactivateDialog.admin ? `Deactivate ${deactivateDialog.admin.name} (${deactivateDialog.admin.email})? They will no longer be able to sign in.` : 'Deactivate this admin user?'}
        confirmText="Deactivate"
        confirmButtonColor="bg-red-600 hover:bg-red-700"
        onCancel={closeDeactivateDialog}
        onConfirm={confirmDeactivateAdmin}
        loading={deactivateDialog.loading}
      />
    </AdminLayout>
  )
}

function Field({ label, name, type = 'text', value, onChange, required = false }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0396FF] focus:border-transparent"
      />
    </div>
  )
}
