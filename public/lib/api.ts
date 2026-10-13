import { treaty } from '@elysiajs/eden'

import type { api } from '@/server/routes/route'

export const backendUrl = 'http:localhost:3000'

export const client = treaty<typeof api>(backendUrl)
