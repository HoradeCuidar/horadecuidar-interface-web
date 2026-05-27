import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import logo from '@/assets/logoMaior.svg'
import passo3Illustration from '@/assets/recuperar-passo3.svg'
import passo4Illustration from '@/assets/recuperar-passo4.svg'
import { authService } from '@/services'
import { Input, Button, IconeCadeado, IconeOlho, IconeOlhoOculto, IconeCheck } from '@/components'

const schema = z
  .object({
    novaSenha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmacao: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.novaSenha === data.confirmacao, {
    message: 'As senhas informadas não coincidem',
    path: ['confirmacao'],
  })

type FormData = z.infer<typeof schema>

export function ResetPassword() {
  const [step, setStep] = useState<3 | 4>(3)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      novaSenha: '',
      confirmacao: '',
    },
  })

  const watchNovaSenha = watch('novaSenha', '')
  const hasEightChars = watchNovaSenha.length >= 8

  async function onSubmit(data: FormData) {
    if (!token) {
      toast.error('Token de recuperação inválido ou não informado.')
      return
    }

    try {
      await authService.resetarSenha(token, data.novaSenha, data.confirmacao)
      setStep(4)
      toast.success('Senha alterada com sucesso.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao redefinir a senha.')
    }
  }

  if (!token) {
    return (
      <div
        className="grid w-full max-w-4xl min-h-[34rem] grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl font-sans"
        style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06), 0 10px 40px rgba(0,0,0,0.1)' }}
      >
        <div className="flex flex-col justify-between bg-brand-100 p-8 min-h-[16rem] md:min-h-0 relative">
          <div className="flex justify-start">
            <img
              src={logo}
              alt="Hora de Cuidar"
              className="max-h-[2.5rem] w-auto object-contain cursor-pointer"
              onClick={() => navigate('/login')}
            />
          </div>
          <div className="flex flex-1 items-center justify-center py-6 w-full h-full">
            <object
              type="image/svg+xml"
              data={passo3Illustration}
              className="max-h-[16rem] md:max-h-[20rem] w-full h-auto max-w-full object-contain pointer-events-none"
              aria-label="Ilustração de erro"
            />
          </div>
          <div className="hidden md:block text-center text-xs text-brand-600 font-medium">
            Hora de Cuidar &copy; {new Date().getFullYear()}
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center bg-surface-50 p-8 md:p-12">
          <div className="flex flex-col justify-center h-full max-w-sm mx-auto w-full text-center md:text-left">
            <h1 className="font-heading text-2xl font-semibold text-error">
              Link inválido
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-muted">
              Não foi possível localizar o código de validação na sua URL de redefinição.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Certifique-se de que copiou o link completo enviado para seu e-mail ou tente solicitar um novo link.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/recuperar-senha')}
              >
                Solicitar novo link
              </Button>
              <div className="text-center mt-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition"
                >
                  Voltar para login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="grid w-full max-w-4xl min-h-[34rem] grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl font-sans"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06), 0 10px 40px rgba(0,0,0,0.1)' }}
    >
      <div className="flex flex-col justify-between bg-brand-100 p-8 min-h-[16rem] md:min-h-0 relative">
        <div className="flex justify-start">
          <img
            src={logo}
            alt="Hora de Cuidar"
            className="max-h-[2.5rem] w-auto object-contain cursor-pointer"
            onClick={() => navigate('/login')}
          />
        </div>
        <div className="flex flex-1 items-center justify-center py-6 md:py-0 w-full h-full">
          <object
            type="image/svg+xml"
            data={step === 3 ? passo3Illustration : passo4Illustration}
            className="max-h-[16rem] md:max-h-[20rem] w-full h-auto max-w-full object-contain animate-fade-in pointer-events-none"
            aria-label={step === 3 ? 'Ilustração de nova senha' : 'Ilustração de sucesso'}
          />
        </div>
        <div className="hidden md:block text-center text-xs text-brand-600 font-medium">
          Hora de Cuidar &copy; {new Date().getFullYear()}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center bg-surface-50 p-8 md:p-12">
        {step === 3 ? (
          <div className="flex flex-col justify-center h-full max-w-sm mx-auto w-full animate-fade-in">
            <div className="text-center md:text-left">
              <h1 className="font-heading text-2xl font-semibold text-text" id="reset-password-title">
                Criar nova senha
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Digite uma nova senha abaixo.
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-5"
              aria-labelledby="reset-password-title"
            >
              <Input
                label="Digite a nova senha"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                leftIcon={<IconeCadeado />}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="p-0.5 hover:opacity-70 transition bg-transparent border-0"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <IconeOlhoOculto /> : <IconeOlho />}
                  </button>
                }
                error={errors.novaSenha?.message}
                id="nova-senha-field"
                {...register('novaSenha')}
              />

              <Input
                label="Repetir nova senha"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••••"
                leftIcon={<IconeCadeado />}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="p-0.5 hover:opacity-70 transition bg-transparent border-0"
                    aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showConfirmPassword ? <IconeOlhoOculto /> : <IconeOlho />}
                  </button>
                }
                error={errors.confirmacao?.message}
                id="confirmacao-field"
                {...register('confirmacao')}
              />

              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`flex items-center justify-center w-5 h-5 rounded-full border transition-colors duration-300 ${hasEightChars
                      ? 'bg-success border-success text-white'
                      : 'border-surface-200 text-text-muted bg-surface-100'
                    }`}
                  aria-hidden="true"
                >
                  <IconeCheck className="w-3.5 h-3.5" />
                </span>
                <span
                  className={`text-sm font-medium transition-colors duration-300 ${hasEightChars ? 'text-success' : 'text-text-muted'
                    }`}
                >
                  Pelo menos 8 caracteres
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                className="mt-4"
                id="btn-save-new-password"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar nova senha'}
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto w-full text-center animate-fade-in">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-brand-50 border-4 border-brand-200 text-brand-500 shadow-lg shadow-brand-100 animate-bounce-short">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <h1 className="font-heading text-2xl font-bold text-text mt-8">
              Senha alterada com sucesso!
            </h1>
            <p className="mt-3 text-sm text-text-muted max-w-xs">
              Sua senha foi redefinida com segurança. Agora você já pode fazer login normalmente.
            </p>

            <Button
              type="button"
              variant="primary"
              className="mt-8"
              onClick={() => navigate('/login')}
              id="btn-goto-login-success"
            >
              Ir para login
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
