# API Mock Station

**LAB//ABERTO** | Estação local para criar APIs mock e testar respostas HTTP em uma interface web responsiva.

## Funcionalidades

- Criar, editar e remover até 30 rotas `/api/...`.
- Configurar método GET, POST, PUT, PATCH ou DELETE, status HTTP, corpo JSON e atraso de 0 a 3 segundos.
- Testar rotas no próprio navegador e visualizar status, tempo e JSON retornado.
- Exemplos fictícios prontos para demonstração.
- Sem contas, banco de dados, dependências npm ou chamadas externas.

## Requisitos e execução

Node.js 20+:

```bash
npm start
```

Abra `http://localhost:3000` e use **Salvar configuração** após editar rotas. Para alterar a porta: `PORT=8080 npm start`.

## Testes

```bash
npm test
npm run check
```

## Docker

```bash
docker build -t api-mock-station .
docker run --rm -p 3000:3000 api-mock-station
```

Ou `docker compose up --build`.

## API do estúdio

- `GET /_studio/routes`: lista rotas atuais.
- `PUT /_studio/routes`: substitui rotas por um array JSON validado.
- `GET|POST|PUT|PATCH|DELETE /api/...`: retorna o mock configurado ou 404.

Exemplo de configuração:

```json
[{"id":"demo","method":"GET","path":"/api/demo","status":200,"delay":0,"body":{"hello":"world"}}]
```

## Limitações e segurança

Projeto **educacional**, destinado ao uso local e a dados fictícios. As rotas ficam somente na memória do processo e são perdidas ao reiniciar. Não há autenticação na interface administrativa, portanto **não exponha a porta à internet ou a redes não confiáveis**. Não use informações pessoais, segredos ou tokens reais. O servidor não encaminha requisições a terceiros. Consulte [SECURITY.md](SECURITY.md).

## Contribuição e licença

Leia [CONTRIBUTING.md](CONTRIBUTING.md), [ROADMAP.md](ROADMAP.md) e [LICENSE](LICENSE). Código MIT.