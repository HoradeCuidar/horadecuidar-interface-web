export type CadastroProfissionalPayload = {
  nome: string
  username: string
  senha: string
  dataDeNascimento: string
  telefone: string
  rua: string
  bairro: string
  estado: string
  cidade: string
  numeroDaCasa: string
  genero: 'MASCULINO' | 'FEMININO' | 'NAO_BINARIO' | 'OUTRO'
  email: string
}

function generoFormToApi(value: string): CadastroProfissionalPayload['genero'] {
  const map: Record<string, CadastroProfissionalPayload['genero']> = {
    F: 'FEMININO',
    FEMININO: 'FEMININO',
    M: 'MASCULINO',
    MASCULINO: 'MASCULINO',
    O: 'OUTRO',
    OUTRO: 'OUTRO',
    N: 'NAO_BINARIO',
    NAO_BINARIO: 'NAO_BINARIO',
  }
  return map[value] ?? 'OUTRO'
}

export function dateToApi(dateStr: string): string {
  const raw = (dateStr ?? '').trim().replace(/\D/g, '')
  if (raw.length !== 8) return ''
  const d = raw.slice(0, 2)
  const m = raw.slice(2, 4)
  const y = raw.slice(4, 8)
  const day = parseInt(d, 10)
  const month = parseInt(m, 10)
  if (day < 1 || day > 31 || month < 1 || month > 12) return ''
  return `${y}-${m}-${d}`
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formToPayload(dados: Record<string, string>): CadastroProfissionalPayload {
  return {
    nome: dados.nome?.trim() ?? '',
    username: dados.username?.trim() ?? '',
    senha: dados.senha ?? '',
    dataDeNascimento: dateToApi(dados.dataNascimento ?? ''),
    telefone: onlyDigits(dados.telefone ?? ''),
    rua: dados.rua?.trim() ?? '',
    bairro: dados.bairro?.trim() ?? '',
    estado: (dados.estado?.trim() ?? '').slice(0, 2).toUpperCase(),
    cidade: dados.cidade?.trim() ?? '',
    numeroDaCasa: dados.numeroCasa?.trim() ?? '',
    genero: generoFormToApi(dados.genero ?? ''),
    email: dados.email?.trim() ?? '',
  }
}

export type ProfessionalApi = {
  id: number;
  nome?: string;
  telefone?: string;
  ativo?: boolean;
  status?: 'ATIVO' | 'INATIVO' | 'active' | 'inactive';
};

export type ProfessionalFront = {
  id: number;
  name: string;
  phone: string;
  status: "active" | "inactive";
};

export function apiToProfessional(api: ProfessionalApi): ProfessionalFront {
  const id = api.id;
  const name = (api as any).nome ?? (api as any).name ?? "";
  const phone = (api as any).telefone ?? (api as any).phone ?? "";

  let status: ProfessionalFront['status'] = "active";

  if (typeof api.ativo === "boolean") {
    status = api.ativo ? "active" : "inactive";
  } else if (typeof api.status === "string") {
    const s = api.status.toUpperCase();
    if (s === "INATIVO" || s === "INACTIVE") status = "inactive";
    else status = "active";
  }

  return { id, name, phone, status };
}

export function payloadComAtivo(novoStatus: ProfessionalFront['status']) {
  return { ativo: novoStatus === "active" };
}

export function payloadComStatus(novoStatus: ProfessionalFront['status']) {
  return { status: novoStatus === "active" ? "ATIVO" : "INATIVO" };
}
