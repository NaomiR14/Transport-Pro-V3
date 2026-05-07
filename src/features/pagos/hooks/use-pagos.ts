'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PagosService } from '../services/pagos-service'

export function useEstadoSuscripcion(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['pagos', 'suscripcion'],
        queryFn: () => PagosService.getEstadoSuscripcion(),
        staleTime: 60 * 1000,
        enabled: options?.enabled ?? true,
    })
}

export function useFacturas() {
    return useQuery({
        queryKey: ['pagos', 'facturas'],
        queryFn: () => PagosService.getFacturas(),
        staleTime: 5 * 60 * 1000,
    })
}

export function useIniciarCheckout() {
    return useMutation({
        mutationFn: (plan: string) => PagosService.iniciarCheckout(plan),
        onSuccess: (url) => {
            window.location.href = url
        },
        onError: (err: Error) => {
            toast.error(err.message)
        },
    })
}

export function useAbrirPortal() {
    return useMutation({
        mutationFn: () => PagosService.abrirPortal(),
        onSuccess: (url) => {
            window.location.href = url
        },
        onError: (err: Error) => {
            toast.error(err.message)
        },
    })
}
