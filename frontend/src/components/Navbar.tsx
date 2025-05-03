import {useState} from 'react';
import { Link } from 'react-router-dom';
import AuthContainer from './AuthContainer';
import TextPressure from '../ui/TextPressure/TextPressure';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from './ui/button';

const Navbar = () => {
  const storedUser = localStorage.getItem('token')
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className='flex justify-between w-full items-center bg-black p-4 shadow'>
        <div className='logo text-9xl tracking-widest font-bold'>
          <TextPressure text='Event Flow' />
        </div>
        <div className='space-x-4 flex gap-3'>
          <Link to={'/'}>
            <Button>Home</Button>
          </Link>
          <Link to={'/dashboard/home'}>
            <Button>Dashboard</Button>
          </Link>

          {!storedUser && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant='default'>Login / Register</Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[425px] bg-white dark:bg-gray-800 p-0'>
                <AuthContainer onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  )
}

export default Navbar
