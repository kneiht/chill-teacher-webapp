import { Link, useRouterState } from '@tanstack/react-router'

const HomeButton = () => {
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // Remove the last segment of the path to get the parent path
  const parentPath = pathname.substring(0, pathname.lastIndexOf('/'))

  return (
    <Link
      to={parentPath || '/'} // Fallback to root if there's no parent
      className="absolute top-4 left-4 bg-white hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-full shadow-lg z-50"
    >
      &#8592; Home
    </Link>
  )
}

export default HomeButton
