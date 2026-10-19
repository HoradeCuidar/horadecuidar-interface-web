export function formatarData(value: string | null | undefined): string {
  if (!value) return '—'
  const parte = value.trim().slice(0, 10)
  const [ano, mes, dia] = parte.split('-')
  if (!ano || !mes || !dia) return value
  return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`
}
