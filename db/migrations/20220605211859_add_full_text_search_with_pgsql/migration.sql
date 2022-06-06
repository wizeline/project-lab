CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN "tsColumn" TSVECTOR
  GENERATED ALWAYS AS
    (
      setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("valueStatement", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("searchSkills", '')), 'C')
    )
  STORED;

-- CreateIndex
CREATE INDEX "projects_ts_column_idx" ON "Projects" USING GIN ("tsColumn");

---

-- CreateIndex for Profiles.searchCol
DROP INDEX IF EXISTS profiles_search_col_idx;
CREATE INDEX profiles_search_col_idx ON "Profiles" USING GIN ("searchCol" gin_trgm_ops);

-- Fill values for Profiles.searchCol
DROP TRIGGER IF EXISTS profiles_search_col_trigger ON "Profiles";
UPDATE "Profiles" SET "searchCol" = lower(unaccent("firstName" || ' ' || "lastName") || ' ' || "email");

-- Trigger for Profiles.searchCol
-- Couldn't use a generated column because unaccent is not inmutable.
CREATE OR REPLACE FUNCTION profiles_search_col_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  NEW."searchCol" := lower(unaccent(NEW."firstName" || ' ' || NEW."lastName") || ' ' || NEW."email");
  RETURN NEW;
END;
$body$;

CREATE OR REPLACE TRIGGER profiles_search_col_trigger
  BEFORE INSERT OR UPDATE
  ON "Profiles"
  FOR EACH ROW
  EXECUTE FUNCTION profiles_search_col_fn();
