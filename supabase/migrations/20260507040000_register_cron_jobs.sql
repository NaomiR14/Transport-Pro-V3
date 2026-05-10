-- Registra los cron jobs ahora que pg_cron está habilitado.
-- Usa ON CONFLICT para que sea idempotente si se corre de nuevo.

SELECT cron.schedule(
    'snapshot-metricas-mensual',
    '0 2 1 * *',
    'SELECT fn_crear_snapshots_mensuales()'
);

SELECT cron.schedule(
    'archivar-registros-antiguos',
    '0 3 * * 0',
    'SELECT fn_archivar_registros_antiguos()'
);
