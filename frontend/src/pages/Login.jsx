import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { alertError } from '../utils/alerts';
import { getErrorMessage } from '../utils/errors';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
    } catch (err) {
      await alertError('No pudimos iniciar tu sesión', getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <section className="login-brand">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Nodo</span>
        </div>
        <div className="login-statement">
          <h1>El acceso de tu equipo, bajo control.</h1>
          <p>Crea cuentas, edítalas y retíralas en segundos. Cada sesión queda protegida con tokens firmados.</p>
        </div>
        <div className="login-grid" aria-hidden="true" />
      </section>

      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit} noValidate>
          <h2>Iniciar sesión</h2>
          <p className="muted">Ingresa con tu correo y contraseña.</p>

          <label className="field">
            <span>Correo electrónico</span>
            <input type="email" autoComplete="email" autoFocus value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@empresa.com" required />
          </label>

          <label className="field">
            <span>Contraseña</span>
            <div className="input-affix">
              <input type={show ? 'text' : 'password'} autoComplete="current-password" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="icon-btn" onClick={() => setShow((s) => !s)}
                aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Ingresando…' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </div>
  );
}
