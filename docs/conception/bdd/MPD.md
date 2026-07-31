## MPD — Modèle Physique de Données (PostgreSQL / Supabase)

### Table `pictures`

| Colonne | Type | Contraintes |
|---|---|---|
| id | INT (identity) | PRIMARY KEY |
| url | TEXT | NOT NULL |

### Table `before_after_pictures`

| Colonne | Type | Contraintes |
|---|---|---|
| id | INT (identity) | PRIMARY KEY |
| position | INT | NOT NULL, DEFAULT 0 |
| before_picture_id | INT | NOT NULL, FOREIGN KEY → `pictures(id)`, ON DELETE RESTRICT, ON UPDATE CASCADE |
| after_picture_id | INT | NOT NULL, FOREIGN KEY → `pictures(id)`, ON DELETE RESTRICT, ON UPDATE CASCADE |

`ON DELETE RESTRICT` : interdit de supprimer une photo tant qu'elle est référencée par une paire.

Script SQL exécutable correspondant : voir `MPD.sql`.