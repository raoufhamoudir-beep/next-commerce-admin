import { Outlet } from 'react-router-dom'

const StoreLayout = () => {
  return (
    <div
    className='w-full'
    >
        <Outlet />
    </div>
  )
}

export default StoreLayout