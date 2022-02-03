CREATE VIRTUAL TABLE IF NOT EXISTS projects_idx USING fts5(id, name, description, valueStatement, searchSkills, content='Projects');

CREATE TRIGGER IF NOT EXISTS projects_idx_i AFTER INSERT ON "Projects" BEGIN
  INSERT INTO projects_idx(rowid, id, "name", "description", "valueStatement", "searchSkills") VALUES (new.rowid, new.id, new."name", new."description", new."valueStatement", new."searchSkills");
END;

CREATE TRIGGER IF NOT EXISTS projects_idx_d AFTER DELETE ON "Projects" BEGIN
  INSERT INTO projects_idx(projects_idx, rowid, id, "name", "description", "valueStatement", "searchSkills") VALUES ('delete', old.rowid, old.id, old."name", old."description", old."valueStatement", old."searchSkills");
END;

CREATE TRIGGER IF NOT EXISTS projects_idx_u AFTER UPDATE ON "Projects" BEGIN
  INSERT INTO projects_idx(projects_idx, rowid, id, "name", "description", "valueStatement", "searchSkills") VALUES ('delete', old.rowid, old.id, old."name", old."description", old."valueStatement", old."searchSkills");
  INSERT INTO projects_idx(rowid, id, "name", "description", "valueStatement", "searchSkills") VALUES (new.rowid, new.id, new."name", new."description", new."valueStatement", new."searchSkills");
END;
-- this allows running queries like:
-- select * from projects_idx where projects_idx match 'labs';


CREATE VIRTUAL TABLE IF NOT EXISTS profiles_idx USING fts5(id, "firstName", "lastName", "email", content='Profiles');

CREATE TRIGGER IF NOT EXISTS profiles_idx_i AFTER INSERT ON "Profiles" BEGIN
  INSERT INTO profiles_idx(rowid, id, "firstName", "lastName", "email") VALUES (new.rowid, new.id, new."firstName", new."lastName", new."email");
END;

CREATE TRIGGER IF NOT EXISTS profiles_idx_d AFTER DELETE ON "Profiles" BEGIN
  INSERT INTO profiles_idx(profiles_idx, rowid, id, "firstName", "lastName", "email") VALUES ('delete', old.rowid, old.id, old."firstName", old."lastName", old."email");
END;

CREATE TRIGGER IF NOT EXISTS profiles_idx_u AFTER UPDATE ON "Profiles" BEGIN
  INSERT INTO profiles_idx(profiles_idx, rowid, id, "firstName", "lastName", "email") VALUES ('delete', old.rowid, old.id, old."firstName", old."lastName", old."email");
  INSERT INTO profiles_idx(rowid, id, "firstName", "lastName", "email") VALUES (new.rowid, new.id, new."firstName", new."lastName", new."email");
END;
-- this allows running queries like:
-- select * from profiles_idx where profiles_idx match 'joaquin';
