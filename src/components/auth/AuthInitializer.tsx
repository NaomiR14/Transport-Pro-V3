'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { createClient } from '@/lib/supabase/client'

export default function AuthInitializer() {
    useEffect(() => {
        console.log('🔧 AuthInitializer montado')
        
        const supabase = createClient()
        let mounted = true
        
        // Función para verificar sesión
        const checkSession = async () => {
            if (!mounted) return
            
            try {
                useAuthStore.getState().setLoading(true)
                console.log('🔧 Verificando sesión inicial...')
                
                const { data: { session }, error } = await supabase.auth.getSession()
                
                if (error) {
                    console.error('🔧 Error obteniendo sesión:', error)
                    return
                }
                
                console.log('🔧 Sesión encontrada:', session?.user?.email)
                
                if (session?.user) {
                    useAuthStore.getState().setUser(session.user)
                    
                    // Obtener perfil
                    try {
                        const { data: profile, error: profileError } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()
                        
                        if (profileError) {
                            console.error('🔧 Error obteniendo perfil:', profileError)
                        } else {
                            console.log('🔧 Perfil obtenido:', profile)
                            useAuthStore.getState().setProfile(profile)
                        }
                    } catch (profileError) {
                        console.error('🔧 Error en perfil:', profileError)
                    }
                } else {
                    console.log('🔧 No hay sesión activa')
                    useAuthStore.getState().setUser(null)
                    useAuthStore.getState().setProfile(null)
                }
            } catch (error) {
                console.error('🔧 Error en checkSession:', error)
            } finally {
                if (mounted) {
                    console.log('🔧 Finalizando loading...')
                    useAuthStore.getState().setLoading(false)
                }
            }
        }
        
        // Verificar sesión inicial
        checkSession()
        
        // Suscribirse a cambios de autenticación
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return
                
                console.log('🔄 AuthStateChange:', event, session?.user?.email)
                
                // IMPORTANTE: Solo establecer loading para SIGNED_IN
                if (event === 'SIGNED_IN') {
                    useAuthStore.getState().setLoading(true)
                }
                
                if (session?.user) {
                    useAuthStore.getState().setUser(session.user)
                    
                    // Obtener perfil
                    try {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', session.user.id)
                            .single()
                        
                        useAuthStore.getState().setProfile(profile)
                    } catch (error) {
                        console.error('🔧 Error obteniendo perfil en onAuthStateChange:', error)
                    }
                } else {
                    useAuthStore.getState().setUser(null)
                    useAuthStore.getState().setProfile(null)
                }
                
                // IMPORTANTE: Siempre establecer loading en false después de procesar
                setTimeout(() => {
                    if (mounted) {
                        useAuthStore.getState().setLoading(false)
                    }
                }, 100) // Pequeño delay para asegurar
            }
        )
        
        return () => {
            console.log('🗑️ AuthInitializer desmontando...')
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return null
}