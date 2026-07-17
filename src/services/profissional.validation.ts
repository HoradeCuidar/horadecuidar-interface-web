import { dateToApi, onlyDigits } from './profissional.mappers'

export function validarCadastroProfissional(dados: Record<string, string>): string | null {
  if (!(dados.senha?.length >= 8)) {
    return 'Senha deve ter no mínimo 8 caracteres.'
  }
  const tel = onlyDigits(dados.telefone ?? '')
  if (tel.length < 10 || tel.length > 11) {
    return 'Telefone deve conter 10 ou 11 dígitos.'
  }
  const dataStr = dateToApi(dados.dataNascimento ?? '')
  if (!dataStr) {
    return 'Data de nascimento inválida. Use dd/mm/yyyy.'
  }
  const estadoStr = (dados.estado?.trim() ?? '').slice(0, 2).toUpperCase()
  if (estadoStr.length !== 2) {
    return 'Estado deve conter 2 letras (ex.: CE).'
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(dados.username?.trim() ?? '')) {
    return 'Username não pode conter espaços; use apenas letras, números, ., _ ou -.'
  }
  if (!dados.genero?.trim()) {
    return 'Selecione o gênero.'
  }
  return null
}

export function validarEdicaoProfissional(dados: Record<string, string>): string | null {
  const tel = onlyDigits(dados.telefone ?? '')
  if (tel.length < 10 || tel.length > 11) {
    return 'Telefone deve conter 10 ou 11 dígitos.'
  }
  const dataStr = dateToApi(dados.dataNascimento ?? '')
  if (!dataStr) {
    return 'Data de nascimento inválida. Use dd/mm/yyyy.'
  }
  const estadoStr = (dados.estado?.trim() ?? '').slice(0, 2).toUpperCase()
  if (estadoStr.length !== 2) {
    return 'Estado deve conter 2 letras (ex.: CE).'
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(dados.username?.trim() ?? '')) {
    return 'Username não pode conter espaços; use apenas letras, números, ., _ ou -.'
  }
  if (!dados.genero?.trim()) {
    return 'Selecione o gênero.'
  }
  return null
}

export function validarMeuPerfilProfissional(dados: Record<string, string>): string | null {
  if (!(dados.nome?.trim())) return 'Nome é obrigatório.'
  if (!(dados.email?.trim())) return 'E-mail é obrigatório.'
  const tel = onlyDigits(dados.telefone ?? '')
  if (tel.length < 10 || tel.length > 11) {
    return 'Telefone deve conter 10 ou 11 dígitos.'
  }
  const dataStr = dateToApi(dados.dataNascimento ?? '')
  if (!dataStr) {
    return 'Data de nascimento inválida. Use dd/mm/yyyy.'
  }
  const estadoStr = (dados.estado?.trim() ?? '').slice(0, 2).toUpperCase()
  if (estadoStr.length !== 2) {
    return 'Estado deve conter 2 letras (ex.: CE).'
  }
  if (!dados.genero?.trim()) {
    return 'Selecione o gênero.'
  }
  if (!(dados.rua?.trim())) return 'Rua é obrigatória.'
  if (!(dados.bairro?.trim())) return 'Bairro é obrigatório.'
  if (!(dados.cidade?.trim())) return 'Cidade é obrigatória.'
  if (!(dados.numeroCasa?.trim())) return 'Número da casa é obrigatório.'
  return null
}
