import { useState } from 'react'
import { useApi } from '../../lib/useApi.js'
import { api } from '../../lib/api.js'
import { Table } from '../../components/Table.jsx'
import { Badge } from '../../components/Badge.jsx'
import { Drawer } from '../../components/Drawer.jsx'
import { FormField, TextInput, Select } from '../../components/FormField.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const EMPTY_FORM = { name: '', email: '', password: '', role: 'EDITOR' }

export function Users() {
  const { user: me } = useAuth()
  const { data: users, loading, error, refetch } = useApi('/api/admin/users')
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setForm(EMPTY_FORM)
    setFormError('')
    setCreating(true)
  }

  async function handleCreate() {
    setSaving(true)
    setFormError('')
    try {
      await api.post('/api/admin/users', form)
      setCreating(false)
      await refetch()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function toggleStatus(user) {
    await api.put(`/api/admin/users/${user._id}`, { status: user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' })
    await refetch()
  }

  async function deleteUser(user) {
    if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return
    await api.del(`/api/admin/users/${user._id}`)
    await refetch()
  }

  if (loading) return <p className="text-sm text-stone">Loading…</p>
  if (error) return <p className="text-sm text-red-600">{error.message}</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-soft">Users</h1>
          <p className="text-sm text-stone">Admins have full access; Editors can't manage users or site settings.</p>
        </div>
        <button onClick={openCreate} className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark">
          New user
        </button>
      </div>

      <Table
        rows={users}
        columns={[
          { key: 'name', header: 'Name' },
          { key: 'email', header: 'Email' },
          { key: 'role', header: 'Role', render: (u) => <Badge tone={u.role === 'ADMIN' ? 'gold' : 'gray'}>{u.role}</Badge> },
          { key: 'status', header: 'Status', render: (u) => <Badge>{u.status}</Badge> },
          {
            key: 'actions',
            header: '',
            render: (u) => (
              <div className="flex justify-end gap-3 text-xs">
                <button onClick={() => toggleStatus(u)} className="text-stone hover:text-gold-dark">
                  {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                </button>
                {u._id !== me?.id && (
                  <button onClick={() => deleteUser(u)} className="text-stone hover:text-red-600">
                    Delete
                  </button>
                )}
              </div>
            ),
          },
        ]}
      />

      <Drawer
        open={creating}
        onClose={() => setCreating(false)}
        title="New user"
        footer={
          <div className="flex items-center justify-between gap-3">
            {formError && <p className="text-xs text-red-600">{formError}</p>}
            <button
              onClick={handleCreate}
              disabled={saving}
              className="ml-auto rounded-lg bg-gold px-4 py-2 text-sm font-medium text-ink-soft hover:bg-gold-dark disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create user'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <FormField label="Name" htmlFor="name">
            <TextInput id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </FormField>
          <FormField label="Email" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </FormField>
          <FormField label="Password" htmlFor="password" hint="At least 8 characters.">
            <TextInput
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          </FormField>
          <FormField label="Role" htmlFor="role">
            <Select id="role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="EDITOR">Editor</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </FormField>
        </div>
      </Drawer>
    </div>
  )
}
