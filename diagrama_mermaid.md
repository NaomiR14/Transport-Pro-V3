# Diagrama ERD - Formato Mermaid

## Diagrama de Entidad-Relación

```mermaid
erDiagram
    FLOTA ||--o{ SEGUROS : "tiene"
    FLOTA ||--o{ IMPUESTOS : "tiene"
    FLOTA ||--o{ RUTAS : "realiza"
    FLOTA ||--o{ MULTAS : "recibe"
    FLOTA ||--o{ MANTENIMIENTO : "requiere"
    CONDUCTORES ||--o{ RUTAS : "conduce"
    CONDUCTORES ||--o{ MULTAS : "recibe"
    TALLERES ||--o{ MANTENIMIENTO : "atiende"

    FLOTA {
        varchar placa_vehiculo PK
        int nro
        varchar tipo
        varchar marca
        varchar modelo
        varchar nro_serie
        varchar color
        int año
        decimal carga_maxima_kg
        varchar estado_vehiculo
        int ciclo_mnnto_prevent_km
        int kms_odometro_inicial
        int kms_odometro_mnnto_preventivo
        int kms_odometro_actual
        int falta_proximo_mnnto_km
        varchar estado_mantenimiento_preventivo
    }

    CONDUCTORES {
        varchar doc_identidad PK
        int nro
        varchar conductor
        varchar nro_licencia
        varchar direccion
        varchar telefono_celular
        varchar calificacion
    }

    TALLERES {
        int id PK
        varchar nombre_taller UK
        varchar direccion
        varchar telefono_celular
        varchar correo
        varchar contacto_principal
    }

    SEGUROS {
        int id PK
        varchar placa_vehiculo FK
        varchar aseguradora
        varchar poliza_seguro
        date fecha_inicio
        date fecha_vencimiento
        decimal importe_pagado
        date fecha_pago
        varchar estado_poliza
    }

    IMPUESTOS {
        int id PK
        varchar placa_vehiculo FK
        varchar tipo_impuesto
        int año_impuesto
        decimal impuesto
        date fecha_pago
    }

    RUTAS {
        int id PK
        timestamp fecha_salida
        timestamp fecha_llegada
        varchar placa_vehiculo FK
        varchar estado_vehiculo
        varchar conductor FK
        varchar origen
        varchar destino
        int kms_inicial
        int kms_final
        int kms_recorridos
        decimal peso_carga_kg
        decimal costo_kg_carga
        decimal ingreso_total
        varchar estacion_combustible
        varchar tipo_combustible
        decimal precio_galon
        decimal total_combustible
        decimal gasto_peajes
        decimal gasto_comidas
        decimal otros_gastos
        decimal gasto_total
        decimal volumen_combustible_gal
        decimal recorrido_km_gal
        decimal ingreso_km
        text observaciones
    }

    MULTAS {
        int id PK
        date fecha
        int nro_viaje
        varchar placa_vehiculo FK
        varchar conductor FK
        varchar infraccion
        decimal importe_multa
        decimal importe_pagado
        decimal debe
        varchar estado_pago
        text observaciones
    }

    MANTENIMIENTO {
        int id PK
        varchar placa_vehiculo FK
        varchar taller FK
        date fecha_entrada
        date fecha_salida
        varchar tipo
        int kilometraje_odometro
        varchar paquete_mantenimiento
        text causas_mantenimiento
        decimal costo_total
        date fecha_pago
        text observaciones
    }
```

## Resumen Visual de Relaciones

```
                    ┌─────────────┐
                    │   FLOTA     │
                    │  (Central)  │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    ┌────────┐        ┌────────┐        ┌──────────┐
    │SEGUROS │        │IMPUEST.│        │   RUTAS  │◄────┐
    └────────┘        └────────┘        └──────────┘     │
                                             │            │
        ┌────────────────────────────────────┤            │
        │                                    │            │
        ▼                                    ▼            │
    ┌────────┐                          ┌────────┐       │
    │ MULTAS │◄─────────────────────────│CONDUCT.│───────┘
    └────────┘                          └────────┘
        │
        │
        ▼
    ┌──────────────┐        ┌─────────┐
    │MANTENIMIENTO │───────►│TALLERES │
    └──────────────┘        └─────────┘
```

