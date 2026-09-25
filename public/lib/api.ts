import { treaty } from '@elysiajs/eden'

import type { app } from '@/server/index'

export const api = treaty<typeof app>('localhost:3000')
