CREATE VIRTUAL TABLE projects_idx USING fts5(id, name, description, valueStatement, content='Projects');

CREATE TRIGGER projects_idx_i AFTER INSERT ON "Projects" BEGIN
  INSERT INTO projects_idx(id, "name", "description", "valueStatement") VALUES (new.id, new."name", new."description", new."valueStatement");
END;

CREATE TRIGGER projects_idx_d AFTER DELETE ON "Projects" BEGIN
  INSERT INTO projects_idx(projects_idx, id, "name", "description", "valueStatement") VALUES('delete', old.id, old."name", old."description", old."valueStatement");
END;

CREATE TRIGGER projects_idx_u AFTER UPDATE ON "Projects" BEGIN
  INSERT INTO projects_idx(projects_idx, id, "name", "description", "valueStatement") VALUES('delete', old.id, old."name", old."description", old."valueStatement");
  INSERT INTO projects_idx(id, "name", "description", "valueStatement") VALUES (new.id, new."name", new."description", new."valueStatement");
END;
-- this allows running queries like:
-- select * from projects_idx where projects_idx match 'labs';

CREATE VIRTUAL TABLE profiles_idx USING fts5(id, "firstName", "lastName", "email", content='Profiles');

CREATE TRIGGER profiles_idx_i AFTER INSERT ON "Profiles" BEGIN
  INSERT INTO profiles_idx(id, "firstName", "lastName", "email") VALUES (new.id, new."firstName", new."lastName", new."email");
END;

CREATE TRIGGER profiles_idx_d AFTER DELETE ON "Profiles" BEGIN
  INSERT INTO profiles_idx(profiles_idx, id, "firstName", "lastName", "email") VALUES('delete', old.id, old."firstName", old."lastName", old."email");
END;

CREATE TRIGGER profiles_idx_u AFTER UPDATE ON "Profiles" BEGIN
  INSERT INTO profiles_idx(profiles_idx, id, "firstName", "lastName", "email") VALUES('delete', old.id, old."firstName", old."lastName", old."email");
  INSERT INTO profiles_idx(id, "firstName", "lastName", "email") VALUES (new.id, new."firstName", new."lastName", new."email");
END;
-- this allows running queries like:
-- select * from profiles_idx where profiles_idx match 'joaquin';
