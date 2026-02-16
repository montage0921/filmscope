
import Logo from './Components/Logo'
import LoginButton from './Components/LoginButton'

export default function NavBar() {
  return (
    <div className='w-full px-4 sm:px-10 md:px-20 lg:px-30 2xl:px-60 py-3 flex justify-between items-center'>
      <Logo/>
      <LoginButton/>
    </div>
  )
}
