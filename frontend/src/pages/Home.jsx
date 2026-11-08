import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersApi } from '../api/usersApi';

const fmt = (iso) => new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

export default function Home() {
  const { user } = useAuth();
  const [data, setData] = useState({ data: [], meta: { total: 0 } });

  useEffect(() => {
    usersApi.list({ per_page: 5 }).then(setData).catch(() => {});
  }, []);

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Hola, {user?.name?.split(' ')[0]}</h1>
          <p className="muted">Este es el estado de tus cuentas hoy.</p>
        </div>
        <Link to="/usuarios" className="btn btn-primary">Administrar usuarios</Link>
      </div>

      <section className="summary">
        <div>
          <span className="summary-number">{data.meta.total}</span>
          <span className="muted">usuarios con acceso</span>
        </div>
        <div className="summary-note">
          <strong>Sesión activa</strong>
          <span className="muted">Conectado como {user?.email}</span>
        </div>
      </section>

      <section className="panel">
        <h2>Últimos usuarios registrados</h2>
        <table className="table">
          <thead>
            <tr><th>Nombre</th><th>Correo</th><th>Alta</th></tr>
          </thead>
          <tbody>
            {data.data.map((u) => (
              <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{fmt(u.created_at)}</td></tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
