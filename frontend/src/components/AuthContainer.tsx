import { useState } from 'react'
import Login from './Auth/Login'
import Register from './Auth/Register'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AuthContainerProps {
  onSuccess?: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (isAuthenticated) {
    onSuccess?.();
    return null // This will collapse the form after successful auth
  }

  return (
    <div className='flex justify-center items-center min-h-[400px]'>
      {' '}
      {/* Added min-height and centered */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-[400px]'
      >
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='login'>Login</TabsTrigger>
          <TabsTrigger value='register'>Register</TabsTrigger>
        </TabsList>
        <TabsContent value='login'>
          <Login onSuccess={() => setIsAuthenticated(true)} />
        </TabsContent>
        <TabsContent value='register'>
          <Register
            onSuccess={() => {
              setIsAuthenticated(true)
              setActiveTab('login')
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AuthContainer
