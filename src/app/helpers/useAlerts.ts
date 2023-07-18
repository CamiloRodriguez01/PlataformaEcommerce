import Swal from 'sweetalert2';

export const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})


export const ToastConfirmacion= Swal.mixin({
    toast: true,
    title: '¿Estas seguro?',
    icon: 'warning',
    position: 'top-end',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#303840',
    confirmButtonText: 'Confirmar!'
})

export const ToastAutentication = Swal.mixin({
    toast: true,
    position: 'center',
    showConfirmButton: false,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
        Swal.showLoading()
    }
})

export const ToastFingerPrint = Swal.mixin({
  position: 'center',
  title: 'Autenticación biométrica',
  text: "¿Te gustaria habilitar la autenticación biométrica?",
  icon: 'info',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#303840',
  confirmButtonText: 'Si',
  cancelButtonText: 'No'
})
