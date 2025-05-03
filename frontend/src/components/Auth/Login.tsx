import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../utils/api'
import toast from 'react-hot-toast'
interface LoginProps {
  onSuccess?: () => void
}

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

const Login = ({ onSuccess }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await api.login({ email, password })

      if (data.token) {
        toast.success('Login successful!')
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        if (onSuccess) onSuccess() // Call the success callback
        navigate('/dashboard/home')
        return
      }
      throw new Error('Missing token in response')
    } catch (err) {
      let errorMessage = 'Login failed. Please try again.'
      if (err instanceof Error && 'response' in err) {
        const response = err.response as { status: number }
        const status = response?.status

        switch (status) {
          case 401:
            errorMessage = 'Invalid email or password'
            break
          case 404:
            errorMessage = 'User not found'
            break
          case 500:
            errorMessage = 'Server error. Please try again later'
            break
          default:
            errorMessage = (err.response as any)?.data?.message || errorMessage
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      }

      toast.error(errorMessage)
      console.error('Login error:', err)
    }
  }

  return (
    <div className='flex justify-center items-center mt-2 bg-gray-100 dark:bg-gray-900'>
      <Card className='w-[400px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg'>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={email}
                placeholder='you@example.com'
                onChange={e => setEmail(e.target.value)}
                className='dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='••••••••'
                className='dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
              />
            </div>
            <CardFooter className='flex justify-end p-0'>
              <Button type='submit' className='w-full'>
                Login
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
