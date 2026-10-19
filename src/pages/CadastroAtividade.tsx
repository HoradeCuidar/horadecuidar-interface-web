import { useNavigate } from 'react-router-dom'
import { BotaoVoltar } from '@/components'
import { FormularioExercicio } from '@/components/OrientacoesFuncionais'

export function CadastroAtividade() {
  const navigate = useNavigate()
  return <div className="space-y-5 p-4 sm:p-6 lg:flex lg:h-[calc(100dvh-4px)] lg:min-h-0 lg:flex-col lg:gap-5 lg:space-y-0 lg:overflow-hidden lg:p-8">
    <BotaoVoltar onClick={() => navigate('/atividades')}>Voltar</BotaoVoltar>
    <FormularioExercicio titulo="Nova orientação funcional" onCancelar={() => navigate('/atividades')} />
  </div>
}
