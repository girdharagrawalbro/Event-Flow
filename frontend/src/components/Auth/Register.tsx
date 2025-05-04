import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { api } from '../../utils/api'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

interface RegisterProps {
  onSuccess?: () => void
}

const Register = ({ onSuccess }: RegisterProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const data = await api.register({ name, email, password, role })
      if (data.token) {
        toast.success('Registration successful!')
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        if (onSuccess) onSuccess()
        navigate('/dashboard/home')
      }
    } catch (err) {
      toast.error('Registration failed!')
      console.error(err)
    }
  }

  return (
    <div className='flex justify-center items-center mt-2 bg-gray-100 dark:bg-gray-900'>
      <Card className='w-[400px] bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-lg'>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create a new account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='grid gap-4'>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                placeholder='Your name'
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className='dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className='dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                name='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
              />
            </div>
            <div className='flex flex-col space-y-1.5'>
              <Label htmlFor='role'>Role</Label>
              <Select
                value={role}
                onValueChange={selectedValue => setRole(selectedValue)}
              >
                <SelectTrigger
                  id='role'
                  className='dark:bg-gray-700 dark:border-gray-600 w-full'
                >
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='attendee'>Attendee</SelectItem>
                  <SelectItem value='organizer'>Organizer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <CardFooter className='flex justify-end p-0 pt-2'>
              <Button
                type='submit'
                className='bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white w-full'
              >
                Register
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Register
