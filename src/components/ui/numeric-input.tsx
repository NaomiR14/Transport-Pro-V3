import { forwardRef } from 'react'
import { Input } from './input'
import type { ComponentPropsWithoutRef } from 'react'

type NumericInputProps = ComponentPropsWithoutRef<typeof Input>

/**
 * Wrapper de Input para campos numéricos.
 * Al hacer focus selecciona todo el contenido automáticamente,
 * evitando el problema de ceros iniciales (ej. "060" al escribir "60").
 */
const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ onFocus, ...props }, ref) => {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.target.select()
      onFocus?.(e)
    }

    return <Input ref={ref} onFocus={handleFocus} {...props} />
  }
)

NumericInput.displayName = 'NumericInput'

export { NumericInput }
