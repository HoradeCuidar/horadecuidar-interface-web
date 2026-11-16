export function focarPrimeiroErroNutricional() {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const campo = document.querySelector<HTMLElement>('[aria-invalid="true"]')
    campo?.focus({ preventScroll: true })
    campo?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }))
}
