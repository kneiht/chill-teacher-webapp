import { Outlet, createRootRoute } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanstackDevtools } from '@tanstack/react-devtools'
import { AppProvider } from '@/lib/components/AppProvider'

import {
  LocalStorageKeys,
  setToLocalStorage,
} from '@/lib/utils/local-storage-helpers'

export const Route = createRootRoute({
  // TODO: Remove this when there is a proper auth system
  beforeLoad: () => {
    setToLocalStorage(LocalStorageKeys.USER, 'Demo User')
  },
  component: () => (
    <>
      <AppProvider>
        <Outlet />
      </AppProvider>

      {/* <TanstackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </>
  ),
})
