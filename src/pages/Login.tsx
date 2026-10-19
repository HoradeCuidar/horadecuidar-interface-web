import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import logo from '@/assets/logoMaior.svg'
import { authService } from '@/services'
import { Input, Button, IconeUsuario, IconeCadeado, IconeOlho, IconeOlhoOculto } from '@/components'

const schema = z.object({
  username: z.string().min(1, 'Usuário é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

type FormData = z.infer<typeof schema>

export function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      await authService.login(data.username, data.password)
      toast.success('Login realizado com sucesso.')
      navigate('/home', { replace: true })
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao fazer login.')
    }
  }

  return (
    <div
      className="grid w-full max-w-4xl min-h-[34rem] grid-cols-2 overflow-hidden rounded-2xl font-sans"
      style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.06), 0 10px 40px rgba(0,0,0,0.1)' }}
    >
      <div className="flex min-w-0 items-center justify-center bg-brand-100 p-8">
        <img
          src={logo}
          alt="Hora de Cuidar"
          className="max-h-[4.5rem] w-auto max-w-full object-contain"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center overflow-y-auto bg-white p-8">
        <div className="text-center">
          <h1 className="font-heading text-xl font-semibold tracking-tight text-text">
            Bem-vindo de volta!
          </h1>
          <p className="mt-1 text-2xl font-semibold text-brand-600">
            Faça seu login
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex max-w-sm flex-col gap-4"
        >
          <Input
            label="Usuário"
            type="text"
            placeholder="Digite seu usuário"
            autoComplete="username"
            leftIcon={<IconeUsuario />}
            error={errors.username?.message}
            {...register('username')}
          />
          <div>
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••"
              autoComplete="current-password"
              leftIcon={<IconeCadeado />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="p-0.5 text-text-muted transition hover:text-text"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? <IconeOlhoOculto /> : <IconeOlho />}
                </button>
              }
              error={errors.password?.message}
              {...register('password')}
            />
            <div className="mt-1.5 flex justify-end">
              <Link
                to="/recuperar-senha"
                className="text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                esqueceu sua senha?
              </Link>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} variant="primary">
            Login
          </Button>
        </form>
      </div>
    </div>
  )
}
