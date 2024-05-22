'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { FC, PropsWithChildren, Suspense, useState } from 'react'
import { SkeletonOneLine } from '../skeleton/SkeletonOneLine'

export const ReactQueryClientProvider: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000 * 60,
            refetchInterval: 60 * 1000 * 60
          }
        }
      })
  )

  return (
    // https://stackoverflow.com/questions/77788615/next-js-uncaught-syntaxerror-invalid-or-unexpected-token-then-chunkloaderror
    <Suspense fallback={<SkeletonOneLine height="h-3" width="w-20" />}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Suspense>
  )
}
