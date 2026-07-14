import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import api from '../lib/api'
import useAuthStore from '../store/useAuthStore'

const userSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required').matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, "password too weak"),
})

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(userSchema),
    mode: 'onTouched',
  })
  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      setServerError('')
      const res = await api.post('/auth/register', data)
      setAuth(res.data)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 bg-[var(--fh-bg)]'>
        <div className='card w-full max-w-md p-8 text-white'>
            <button type='button' onClick={() => navigate(-1)} className='flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors mb-6'>
                <ArrowLeft size={18} /> Back
            </button>
            <div className='text-center mb-6'>
                <span className='text-3xl tracking-tight'>
                    <span className='font-extrabold'>film</span><span className='font-light'>house</span>
                </span>
                <h2 className='text-xl font-semibold mt-4'>Create your account</h2>
                <p className='text-sm text-white/50 mt-1'>Join to build your watchlist</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 items-stretch'>
                {serverError && <p className='text-[var(--fh-red)] text-sm text-center'>{serverError}</p>}
                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-white/70'>First Name</label>
                    <input {...register('firstName')} className='field !max-w-none' />
                    {errors.firstName && <p className='text-[var(--fh-red)] text-xs'>{errors.firstName?.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-white/70'>Email</label>
                    <input {...register('email')} className='field !max-w-none' />
                    {errors.email && <p className='text-[var(--fh-red)] text-xs'>{errors.email?.message}</p>}
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='text-sm text-white/70'>Password</label>
                    <div className='relative w-full'>
                        <input type={showPassword ? 'text' : 'password'} {...register('password')} className='field !max-w-none' />
                        <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-white/70'>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className='text-[var(--fh-red)] text-xs'>{errors.password?.message}</p>}
                </div>
                <button type='submit' disabled={isSubmitting} className='mainbutton mt-2 px-4 py-2.5 rounded-lg disabled:opacity-60'>
                    {isSubmitting ? 'Creating...' : 'Create account'}
                </button>
                <p className='text-sm text-center text-white/60'>
                    Already have an account? <Link to='/login' className='text-[var(--fh-red)] hover:underline'>Sign in</Link>
                </p>
            </form>
        </div>
    </div>
  )
}

export default Register
