export const showAdminToast = ({ message, type = 'info', duration = 4000 }) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent('admin:toast', {
      detail: {
        message,
        type,
        duration,
      },
    })
  )
}

export const showAdminSuccess = (message, duration = 4000) => {
  showAdminToast({ message, type: 'success', duration })
}

export const showAdminError = (message, duration = 5000) => {
  showAdminToast({ message, type: 'error', duration })
}
