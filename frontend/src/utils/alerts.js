import Swal from 'sweetalert2';

const base = Swal.mixin({
  buttonsStyling: false,
  reverseButtons: true,
  customClass: {
    popup: 'swal-popup',
    title: 'swal-title',
    htmlContainer: 'swal-text',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-ghost',
    actions: 'swal-actions',
  },
});

export const alertSuccess = (title, text) =>
  base.fire({ icon: 'success', title, text, timer: 2200, timerProgressBar: true, showConfirmButton: false });

export const alertError = (title, text) =>
  base.fire({ icon: 'error', title, text, confirmButtonText: 'Entendido' });

export const alertInfo = (title, text) =>
  base.fire({ icon: 'info', title, text, confirmButtonText: 'Entendido' });

export async function confirmAction({ title, text, confirmText = 'Confirmar', danger = false }) {
  const result = await base.fire({
    icon: danger ? 'warning' : 'question',
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-popup',
      title: 'swal-title',
      htmlContainer: 'swal-text',
      confirmButton: danger ? 'btn btn-danger' : 'btn btn-primary',
      cancelButton: 'btn btn-ghost',
      actions: 'swal-actions',
    },
  });
  return result.isConfirmed;
}
