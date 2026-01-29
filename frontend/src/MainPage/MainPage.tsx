
import Welcome from './Components/Welcome'
import CardContainer from './Components/CardContainer'

export default function MainPage() {
  return (
    <div className='w-full mt-10 px-4 sm:px-8 md:px-16 lg:px-32 2xl:px-64 flex flex-col justify-center items-center gap-10'>
      <Welcome/>
      <CardContainer/>
    </div>
  )
}
