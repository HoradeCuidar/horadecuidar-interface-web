import { Input } from '@/components'

type PassoEnderecoProps = {
  rua: string
  setRua: (v: string) => void
  numeroCasa: string
  setNumeroCasa: (v: string) => void
  bairro: string
  setBairro: (v: string) => void
  estado: string
  setEstado: (v: string) => void
  cidade: string
  setCidade: (v: string) => void
}

export function PassoEndereco({
  rua,
  setRua,
  numeroCasa,
  setNumeroCasa,
  bairro,
  setBairro,
  estado,
  setEstado,
  cidade,
  setCidade,
}: PassoEnderecoProps) {
  return (
    <section className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-3">
        <Input
          size="compact"
          label="Rua"
          placeholder="Digite a rua..."
          value={rua}
          onChange={(e) => setRua(e.target.value)}
        />
        <Input
          size="compact"
          label="Nº da casa"
          placeholder="XXXX"
          value={numeroCasa}
          onChange={(e) => setNumeroCasa(e.target.value)}
        />
        <Input
          size="compact"
          label="Bairro"
          placeholder="Digite o bairro..."
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
        />
        <Input
          size="compact"
          label="Estado"
          placeholder="UF (2 letras)"
          value={estado}
          onChange={(e) => setEstado(e.target.value.slice(0, 2).toUpperCase())}
          maxLength={2}
        />
        <Input
          size="compact"
          label="Cidade"
          placeholder="Digite a cidade..."
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          className="sm:col-span-2"
        />
      </div>
    </section>
  )
}
