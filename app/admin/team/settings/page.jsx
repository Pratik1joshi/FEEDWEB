'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '../../../../components/AdminLayout';
import { teamSettingsApi } from '../../../../src/lib/api-team';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X } from 'lucide-react';

const SECTION_CONFIG = {
  role: {
    key: 'roles',
    title: 'Roles',
    singular: 'Role',
    description: 'Manage selectable team roles used in member profiles.',
  },
  department: {
    key: 'departments',
    title: 'Departments',
    singular: 'Department',
    description: 'Manage selectable departments used in team member profiles.',
  },
};

const normalizeSettingsResponse = (response) => {
  const payload = response?.data && !Array.isArray(response.data) ? response.data : response;

  return {
    roles: Array.isArray(payload?.roles) ? payload.roles : [],
    departments: Array.isArray(payload?.departments) ? payload.departments : [],
  };
};

const showAdminToast = (message, type = 'info') => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent('admin:toast', {
      detail: {
        message,
        type,
      },
    })
  );
};

export default function TeamSettingsPage() {
  const [settings, setSettings] = useState({ roles: [], departments: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newValues, setNewValues] = useState({ role: '', department: '' });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ label: '', sort_order: 0, is_active: true });

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await teamSettingsApi.getAll({ includeInactive: 'true' });
      setSettings(normalizeSettingsResponse(response));
    } catch (error) {
      console.error('Error loading team settings:', error);
      showAdminToast(`Failed to load team settings: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const getOptions = (type) => settings[SECTION_CONFIG[type].key] || [];

  const handleCreate = async (type) => {
    const label = `${newValues[type] || ''}`.trim();

    if (!label) {
      showAdminToast(`${SECTION_CONFIG[type].singular} name is required.`, 'error');
      return;
    }

    try {
      setSaving(true);
      await teamSettingsApi.create({
        type,
        label,
        sort_order: getOptions(type).length + 1,
        is_active: true,
      });

      setNewValues((prev) => ({
        ...prev,
        [type]: '',
      }));

      await loadSettings();
      showAdminToast(`${SECTION_CONFIG[type].singular} created successfully.`, 'success');
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      showAdminToast(error.message || `Failed to create ${type}.`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const beginEdit = (option) => {
    setEditingId(option.id);
    setEditDraft({
      label: option.label,
      sort_order: option.sort_order,
      is_active: option.is_active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({ label: '', sort_order: 0, is_active: true });
  };

  const handleSaveEdit = async () => {
    if (!editingId) {
      return;
    }

    const cleanedLabel = `${editDraft.label || ''}`.trim();
    if (!cleanedLabel) {
      showAdminToast('Name is required.', 'error');
      return;
    }

    try {
      setSaving(true);
      await teamSettingsApi.update(editingId, {
        label: cleanedLabel,
        sort_order: Number.parseInt(editDraft.sort_order, 10) || 0,
        is_active: editDraft.is_active,
      });

      await loadSettings();
      cancelEdit();
      showAdminToast('Setting updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating team setting:', error);
      showAdminToast(error.message || 'Failed to update setting.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type, option) => {
    const confirmed = window.confirm(
      `Delete ${SECTION_CONFIG[type].singular.toLowerCase()} "${option.label}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      await teamSettingsApi.delete(option.id);
      await loadSettings();
      showAdminToast(`${SECTION_CONFIG[type].singular} deleted successfully.`, 'success');
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showAdminToast(error.message || `Failed to delete ${type}.`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderSection = (type) => {
    const config = SECTION_CONFIG[type];
    const options = getOptions(type);

    return (
      <section key={type} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">{config.title}</h2>
          <p className="text-sm text-gray-600 mt-1">{config.description}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <input
            type="text"
            value={newValues[type]}
            onChange={(event) =>
              setNewValues((prev) => ({
                ...prev,
                [type]: event.target.value,
              }))
            }
            placeholder={`Add new ${config.singular.toLowerCase()}`}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D] focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => handleCreate(type)}
            disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 bg-[#1A365D] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {config.singular}
          </button>
        </div>

        <div className="space-y-2">
          {options.length === 0 && (
            <p className="text-sm text-gray-500 py-2">No {config.title.toLowerCase()} configured yet.</p>
          )}

          {options.map((option) => {
            const isEditing = editingId === option.id;

            if (isEditing) {
              return (
                <div key={option.id} className="p-3 border border-blue-200 bg-blue-50 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={editDraft.label}
                      onChange={(event) =>
                        setEditDraft((prev) => ({
                          ...prev,
                          label: event.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                    <input
                      type="number"
                      value={editDraft.sort_order}
                      onChange={(event) =>
                        setEditDraft((prev) => ({
                          ...prev,
                          sort_order: event.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1A365D]"
                    />
                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={editDraft.is_active}
                        onChange={(event) =>
                          setEditDraft((prev) => ({
                            ...prev,
                            is_active: event.target.checked,
                          }))
                        }
                      />
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-white"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={saving}
                      className="inline-flex items-center px-3 py-1.5 bg-[#1A365D] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={option.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border border-gray-200 rounded-md"
              >
                <div>
                  <p className="font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500">
                    Sort: {option.sort_order} | Status: {option.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => beginEdit(option)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(type, option)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <AdminLayout title="Team Settings">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <Link
            href="/admin/team"
            className="inline-flex items-center text-[#1A365D] hover:text-[#2D5A87] font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team Management
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Manage Team Roles and Departments</h1>
          <p className="text-gray-600 mt-1">
            Add, edit, and delete available role and department options used by team member forms.
          </p>
        </div>

        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D]" />
              <span className="ml-3 text-gray-600">Loading team settings...</span>
            </div>
          </div>
        ) : (
          <>
            {renderSection('role')}
            {renderSection('department')}
          </>
        )}
      </div>
    </AdminLayout>
  );
}