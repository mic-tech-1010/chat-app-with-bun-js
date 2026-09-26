import { treaty } from '@elysiajs/eden'

import type { api } from '@/server/routes/route'

export const client = treaty<typeof api>('localhost:3000')
