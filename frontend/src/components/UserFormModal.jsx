import { useState } from 'react';
import Modal from './Modal';
import { usersApi } from '../api/usersApi';
import { getErrorMessage, getFieldErrors } from '../utils/errors';
import { alertError, alertSuccess } from '../utils/alerts';

export default function UserFormModal({ user, onClose, onSaved }) {
  const editing = Boolean(user);
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', password: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      if (editing) await usersApi.update(user.id, form);
      else await usersApi.create(form);
      onSaved();
      await alertSuccess(editing ? 'Usuario actualizado' : 'Usuario creado', `${form.name} ya puede iniciar sesión.`);
    } catch (err) {
      if (err.response?.status === 422 && err.response.data?.errors) setErrors(getFieldErrors(err));
      else await alertError('No se pudo guardar', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={editing ? 'Editar usuario' : 'Nuevo usuario'} onClose={onClose}>
      <form onSubmit={submit} className="form" noValidate>
        <label className="field">
          <span>Nombre</span>
          <input value={form.name} onChange={set('name')} autoFocus required />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>
        <label className="field">
          <span>Correo electrónico</span>
          <input type="email" value={form.email} onChange={set('email')} required />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>
        <label className="field">
          <span>{editing ? 'Nueva contraseña (opcional)' : 'Contraseña'}</span>
          <input type="password" value={form.password} onChange={set('password')} required={!editing} autoComplete="new-password" />
          {errors.password && <small className="field-error">{errors.password}</small>}
          <small className="hint">{editing ? 'Déjala vacía para conservar la actual.' : 'Mínimo 8 caracteres.'}</small>
        </label>
        <footer className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear usuario'}
          </button>
        </footer>
      </form>
    </Modal>
  );
}
