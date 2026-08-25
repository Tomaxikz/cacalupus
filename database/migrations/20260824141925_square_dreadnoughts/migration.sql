DO $$
DECLARE
  dependent_column record;
BEGIN
  FOR dependent_column IN
    SELECT
      table_namespace.nspname AS schema_name,
      table_class.relname AS table_name,
      table_attribute.attname AS column_name
    FROM pg_attribute AS table_attribute
    INNER JOIN pg_class AS table_class
      ON table_class.oid = table_attribute.attrelid
    INNER JOIN pg_namespace AS table_namespace
      ON table_namespace.oid = table_class.relnamespace
    INNER JOIN pg_type AS column_type
      ON column_type.oid = table_attribute.atttypid
    INNER JOIN pg_namespace AS type_namespace
      ON type_namespace.oid = column_type.typnamespace
    WHERE
      type_namespace.nspname = 'public'
      AND column_type.typname = 'user_toast_position'
      AND table_class.relkind IN ('r', 'p')
      AND table_attribute.attnum > 0
      AND NOT table_attribute.attisdropped
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I ALTER COLUMN %I DROP DEFAULT',
      dependent_column.schema_name,
      dependent_column.table_name,
      dependent_column.column_name
    );
    EXECUTE format(
      'ALTER TABLE %I.%I ALTER COLUMN %I TYPE text USING %I::text',
      dependent_column.schema_name,
      dependent_column.table_name,
      dependent_column.column_name,
      dependent_column.column_name
    );
  END LOOP;
END
$$;

DROP TYPE "public"."user_toast_position";