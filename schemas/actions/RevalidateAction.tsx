import { useState } from 'react'
import type { DocumentActionProps } from 'sanity'

export function RevalidateAction(props: DocumentActionProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  return {
    label:
      status === 'loading' ? 'Refreshing...' :
      status === 'done'    ? 'Cache Refreshed!' :
      status === 'error'   ? 'Refresh Failed' :
      'Refresh Cache',
    onHandle: async () => {
      setStatus('loading')
      try {
        const secret = process.env.SANITY_STUDIO_REVALIDATE_SECRET
        const siteUrl = process.env.SANITY_STUDIO_SITE_URL ?? ''
        const res = await fetch(`${siteUrl}/api/revalidate`, {
          method: 'POST',
          headers: { 'x-revalidate-secret': secret ?? '' },
        })
        setStatus(res.ok ? 'done' : 'error')
      } catch {
        setStatus('error')
      }
      setTimeout(() => setStatus('idle'), 3000)
    },
  }
}
