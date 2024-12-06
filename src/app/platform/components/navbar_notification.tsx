import { BellIcon } from '@heroicons/react/24/outline'

const NavbarNotification = () => {
  return (
    <>
      <button
        type="button"
        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span>
        <BellIcon aria-hidden="true" className="size-6" />
      </button>
    </>
  )
}

export default NavbarNotification;
