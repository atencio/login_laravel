import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { usersApi } from '../api/usersApi';
import UserFormModal from '../components/UserFormModal';
import { alertError, alertSuccess, confirmAction } from '../utils/alerts';
import { getErrorMessage } from '../utils/errors';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { user: me } = useAuth();
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | {} (nuevo) | usuario

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await usersApi.list({ page, search: query || undefined });
      setRows(res.data);
      setMeta(res.meta);
    } catch (err) {
      alertError('No se pudo cargar la lista', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  // Espera a que dejes de escribir antes de buscar.
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); setQuery(search.trim()); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  async function remove(u) {
    const ok = await confirmAction({
      title: `¿Eliminar a ${u.name}?`,
      text: 'Esta persona dejará de poder iniciar sesión. No se puede deshacer.',
      confirmText: 'Sí, eliminar',
      danger: true,
    });
    if (!ok) return;
    try {
      await usersApi.remove(u.id);
      await alertSuccess('Usuario eliminado', `${u.name} ya no tiene acceso.`);
      load();
    } catch (err) {
      alertError('No se pudo eliminar', getErrorMessage(err));
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Usuarios</h1>
          <p className="muted">{meta.total} cuentas en total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          <Plus size={18} /> Nuevo usuario
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <div className="search">
            <Search size={18} />
            <input placeholder="Buscar por nombre o correo" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th className="right">Acciones</th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="3" className="empty">Cargando…</td></tr>}
              {!loading && rows.length === 0 && (
                <tr><td colSpan="3" className="empty">No hay usuarios que coincidan. Crea uno con “Nuevo usuario”.</td></tr>
              )}
              {!loading && rows.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}{u.id === me?.id && <span className="tag">Tú</span>}</td>
                  <td>{u.email}</td>
                  <td className="right">
                    <button className="icon-btn" onClick={() => setEditing(u)} aria-label={`Editar ${u.name}`}><Pencil size={18} /></button>
                    <button className="icon-btn danger" onClick={() => remove(u)} disabled={u.id === me?.id} aria-label={`Eliminar ${u.name}`}><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="pager">
          <span className="muted">Página {meta.current_page} de {meta.last_page}</span>
          <div>
            <button className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Anterior</button>
            <button className="btn btn-ghost" disabled={page >= meta.last_page} onClick={() => setPage((p) => p + 1)}>Siguiente</button>
          </div>
        </footer>
      </section>

      {editing && (
        <UserFormModal
          user={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </>
  );
}
