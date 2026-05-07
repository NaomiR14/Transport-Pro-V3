'use client'

import { useQuery } from '@tanstack/react-query'
import { AuditService } from '../services/audit-service'
import type { AuditFilters } from '../types/audit.types'

export function useAuditLogs(filters: AuditFilters = {}, page = 0) {
    return useQuery({
        queryKey: ['audit_log', filters, page],
        queryFn: () => AuditService.getAuditLogs(filters, page),
        staleTime: 60 * 1000,
    })
}
