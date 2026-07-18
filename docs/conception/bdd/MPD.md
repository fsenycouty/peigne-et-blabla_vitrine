### MPD — Modèle Physique de Données (DBML / dbdiagram.io)

```dbml
Table pictures {
  id                int [pk, increment]
  before_url        text [not null]
  before_public_id  text [not null]
  after_url         text [not null]
  after_public_id   text [not null]
  position          int [not null, default: 0]
}
```

---