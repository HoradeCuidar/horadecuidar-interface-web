export function calcularIdadeParticipante(
  dataNascimento?: string,
  idadeApi?: number | null
): number | null {
  if (idadeApi != null && Number.isFinite(idadeApi)) return idadeApi
  if (!dataNascimento?.trim()) return null

  const raw = dataNascimento.includes('/')
    ? dataNascimento.split('/').reverse().join('-')
    : dataNascimento
  const [y, m, d] = raw.split('-').map(Number)
  if (!y || !m || !d) return null

  const hoje = new Date()
  let idade = hoje.getFullYear() - y
  const mesDiff = hoje.getMonth() + 1 - m
  if (mesDiff < 0 || (mesDiff === 0 && hoje.getDate() < d)) idade--
  return idade
}
