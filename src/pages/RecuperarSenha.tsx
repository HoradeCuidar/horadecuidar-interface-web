import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import logo from '@/assets/logoMaior.svg'
import passo1Illustration from '@/assets/recuperar-passo1.svg'
import passo2Illustration from '@/assets/recuperar-passo2.svg'
import { authService } from '@/services'
import { Input, Button, IconeUsuario } from '@/components'

const schema = z.object({
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
})

type FormData = z.infer<typeof schema>

export function RecuperarSenha() {
  const [step, setStep] = useState<1 | 2>(1)
  const [emailInput, setEmailInput] = useState('')
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  function maskEmail(email: string) {
    const parts = email.split('@')
    if (parts.length !== 2) return email
    const username = parts[0]
    const domain = parts[1]
    if (username.length <= 2) {
      return `${username}***@${domain}`
    }
    return `${username.slice(0, 3)}***@${domain}`
  }

  async function onSubmit(data: FormData) {
    try {
      await authService.solicitarRecuperacao(data.email)
      setEmailInput(data.email)
      setStep(2)
      toast.success('Instruções de recuperação enviadas para o seu e-mail.')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao solicitar recuperação de senha.')
    }
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
            data={step === 1 ? passo1Illustration : passo2Illustration}
            className="max-h-[16rem] md:max-h-[20rem] w-full h-auto max-w-full object-contain animate-fade-in pointer-events-none"
            aria-label={step === 1 ? 'Ilustração de recuperação de senha' : 'Ilustração de verificação de e-mail'}
          />
        </div>
        <div className="hidden md:block text-center text-xs text-brand-600 font-medium">
          Hora de Cuidar &copy; {new Date().getFullYear()}
        </div>
      </div>

      <div className="flex min-w-0 flex-col justify-center bg-surface-50 p-8 md:p-12">
        {step === 1 ? (
          <div className="flex flex-col justify-center h-full max-w-sm mx-auto w-full animate-fade-in">
            <div className="text-center md:text-left">
              <h1 className="font-heading text-2xl font-semibold text-text" id="recovery-title">
                Redefinir Senha
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                Digite seu e-mail para redefinir!
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-6"
              aria-labelledby="recovery-title"
            >
              <Input
                label="E-mail"
                type="email"
                placeholder="Digite seu e-mail"
                autoComplete="email"
                leftIcon={<IconeUsuario />}
                error={errors.email?.message}
                id="email-input-field"
                {...register('email')}
              />

              <Button type="submit" disabled={isSubmitting} variant="primary" id="btn-submit-recovery">
                {isSubmitting ? 'Enviando...' : 'Enviar Link'}
              </Button>

              <div className="text-center mt-2">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-brand-500 hover:text-brand-600 transition"
                  id="link-back-login"
                >
                  Voltar para login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col justify-center h-full max-w-sm mx-auto w-full animate-fade-in">
            <div className="text-center md:text-left">
              <h1 className="font-heading text-2xl font-semibold text-text" id="verification-title">
                Verificação de segurança
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-text-muted">
                Enviamos um link de recuperação para seu e-mail:<br />
                <span className="font-semibold text-text block mt-1 break-all bg-brand-50 px-3 py-1.5 rounded-lg text-brand-700 text-center font-mono">
                  {maskEmail(emailInput)}
                </span>
              </p>
              <p className="mt-4 text-sm text-text-muted">
                Acesse sua caixa de entrada e clique no link para prosseguir com a redefinição de sua senha.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-4">
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/login')}
                id="btn-go-to-login"
              >
                Voltar para login
              </Button>

              <div className="text-center mt-2">
                <p className="text-xs text-text-muted">
                  Não recebeu o e-mail?{' '}
                  <button
                    type="button"
                    onClick={() => onSubmit({ email: emailInput })}
                    className="font-semibold text-brand-500 hover:text-brand-600 underline transition bg-transparent border-0 p-0 cursor-pointer"
                    id="btn-resend-email"
                  >
                    Reenviar e-mail
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
