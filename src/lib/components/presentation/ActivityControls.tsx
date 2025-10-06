// Router
import { Link, useRouterState } from '@tanstack/react-router'

// Hooks
import { useState, useEffect } from 'react'

// Icons
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  HomeOutlined,
} from '@ant-design/icons'

// Full screen button
const FullscreenButton = () => {
  // Delare state for fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement)
  }

  // Add event listener for fullscreen change
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      className="bg-white hover:bg-indigo-100 text-indigo-600 w-14 h-14 flex items-center justify-center rounded-full shadow-xl z-50 transition-all duration-300 ease-in-out transform hover:scale-110"
    >
      {isFullscreen ? (
        <FullscreenExitOutlined style={{ fontSize: '28px' }} />
      ) : (
        <FullscreenOutlined style={{ fontSize: '28px' }} />
      )}
    </button>
  )
}

// Home button
const HomeButton = () => {
  // Get the current path
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  // Remove the last segment of the path to get the parent path
  const parentPath = pathname.substring(0, pathname.lastIndexOf('/'))

  return (
    <Link
      to={parentPath || '/'}
      title="Go to Lesson Home" // Tooltip
      className="bg-white hover:bg-indigo-100 text-indigo-600 w-14 h-14 flex items-center justify-center rounded-full shadow-xl z-50 transition-all duration-300 ease-in-out transform hover:scale-110"
    >
      <HomeOutlined style={{ fontSize: '28px' }} />
    </Link>
  )
}

// Activity controls
const ActivityControls = () => {
  return (
    <div className="absolute top-4 right-4 flex flex-row gap-3 z-50">
      <FullscreenButton />
      <HomeButton />
    </div>
  )
}

export default ActivityControls
