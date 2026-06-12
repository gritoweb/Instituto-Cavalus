# Sincronizar banco remoto (D1) para o local

Use este processo quando quiser que o seu ambiente local fique idêntico ao banco de produção da Cloudflare.

---

## Quando usar

- Antes de desenvolver uma feature que depende de dados reais
- Quando o banco local divergiu muito do remoto
- Para depurar um problema que só acontece com os dados de produção

---

## Pré-requisitos

- `wrangler` autenticado com a conta correta:
  ```bash
  wrangler whoami   # deve mostrar suporte@gritoweb.com.br
  ```
- `python3` disponível (já vem no Ubuntu/macOS)
- `pnpm payload migrate` já foi rodado ao menos uma vez (para o diretório `.wrangler/` existir)

---

## Passo a passo

### 1. Exportar o banco remoto

```bash
wrangler d1 export cloudflare-payload-db --remote --output=./remote-backup.sql
```

Aguarda a mensagem `Downloaded to ./remote-backup.sql successfully!`.

> O wrangler vai perguntar se pode deixar o banco indisponível por alguns segundos. Em contexto não-interativo ele aceita automaticamente.

---

### 2. Descobrir o caminho do arquivo SQLite local

```bash
find .wrangler/state/v3/d1 -name "*.sqlite" | grep -v metadata
```

Anota o caminho completo — será algo como:
```
.wrangler/state/v3/d1/miniflare-D1DatabaseObject/<hash>.sqlite
```

Se o diretório não existir, rode primeiro:
```bash
pnpm payload migrate
```

---

### 3. Substituir o banco local pelo remoto

```bash
DB=$(find .wrangler/state/v3/d1 -name "*.sqlite" | grep -v metadata)
rm -f "$DB"

python3 - <<'EOF'
import sqlite3, sys, subprocess, os

result = subprocess.run(
    ["find", ".wrangler/state/v3/d1", "-name", "*.sqlite"],
    capture_output=True, text=True
)
db_path = [l for l in result.stdout.strip().splitlines() if "metadata" not in l][0]
sql_path = "remote-backup.sql"

conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys=OFF")

with open(sql_path, "r") as f:
    sql = f.read()

try:
    conn.executescript(sql)
    conn.commit()
    print(f"Importado com sucesso em: {db_path}")
except Exception as e:
    print(f"Erro: {e}", file=sys.stderr)
    sys.exit(1)
finally:
    conn.close()
EOF
```

---

### 4. Verificar a importação

```bash
python3 - <<'EOF'
import sqlite3, subprocess

result = subprocess.run(
    ["find", ".wrangler/state/v3/d1", "-name", "*.sqlite"],
    capture_output=True, text=True
)
db_path = [l for l in result.stdout.strip().splitlines() if "metadata" not in l][0]
conn = sqlite3.connect(db_path)

tables = conn.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").fetchall()
print(f"Total de tabelas: {len(tables)}")
for (t,) in tables:
    count = conn.execute(f"SELECT COUNT(*) FROM [{t}]").fetchone()[0]
    if count > 0:
        print(f"  {t}: {count} registros")
conn.close()
EOF
```

---

### 5. Limpar o arquivo temporário

```bash
rm remote-backup.sql
```

---

## Por que não usar `wrangler d1 execute --local --file`?

O dump exportado cria `users_sessions` antes de `users` no arquivo SQL. O wrangler local não aceita essa ordem com foreign keys ativas, resultando em erro `no such table: main.users`. A abordagem com Python resolve isso usando `PRAGMA foreign_keys=OFF` e `executescript()`, que aplica todo o arquivo em uma única transação.

---

## Observações importantes

- **Dados locais são apagados** — qualquer conteúdo criado localmente é perdido.
- **O banco remoto fica indisponível por alguns segundos** durante o export — não faça isso em horário de pico.
- **Arquivos de mídia não são sincronizados** — o R2 não é copiado. As imagens aparecem com URL quebrada no admin local, mas o funcionamento do sistema não é afetado.
- O arquivo `remote-backup.sql` pode conter dados sensíveis (hashes de senha). Nunca faça commit dele.
