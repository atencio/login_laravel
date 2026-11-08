// Convierte la respuesta de Laravel en un mensaje legible.
export function getErrorMessage(error) {
  const data = error?.response?.data;
  if (data?.errors) return Object.values(data.errors).flat().join('\n');
  if (data?.message) return data.message;
  if (error?.code === 'ERR_NETWORK') return 'No se pudo conectar con el servidor. Revisa que el backend esté en marcha.';
  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}

// Errores de validación por campo: { email: 'El correo ya existe', ... }
export function getFieldErrors(error) {
  const errors = error?.response?.data?.errors ?? {};
  return Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v[0]]));
}
