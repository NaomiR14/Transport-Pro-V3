'use client'

import { useEffect } from 'react'
import { useAuthStore } from '../store/auth-store'
import { createClient } from '@/lib/supabase/client'

export default function AuthInitializer() {
    useEffect(() => {
        
        const supabase = createClient()
        let mounted = true
        
        // Función para verificar sesión
        const checkSession = async () => {
            if (!mounted) return
            
            try {
                useAuthStore.getState().setLoading(true)
                
                const { data: { session }, error } = await supabase.auth.getSession()
                
                if (error) {
                    console.error('Error obteniendo sesión:', error)
                    return
                }
                
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
                            console.error('Error obteniendo perfil:', profileError)
                        } else {
                            useAuthStore.getState().setProfile(profile)
                        }
                    } catch (profileError) {
                        console.error('Error al cargar perfil:', profileError)
                    }
                } else {
                    useAuthStore.getState().setUser(null)
                    useAuthStore.getState().setProfile(null)
                }
            } catch (error) {
                console.error('Error en verificación de sesión:', error)
            } finally {
                if (mounted) {
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
                
                // IMPORTANTE: Solo establecer loading para SIGNED_IN
                if (event === 'SIGNED_IN') {
                    useAuthStore.getState().setLoading(true)
                }
                
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
                            console.error('Error obteniendo perfil:', profileError)
                        } else {
                            useAuthStore.getState().setProfile(profile)
                        }
                    } catch (error) {
                        console.error('Error al cargar perfil:', error)
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
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    return null
}