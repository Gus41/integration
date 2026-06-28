# Integration Project

Projeto desenvolvido para a disciplina de **Integração de Aplicações**, demonstrando a integração entre sistemas heterogêneos utilizando arquiteturas baseadas em APIs e um middleware responsável pela comunicação entre aplicações.

## Arquitetura

```
                 +----------------------+
                 |     Sales System     |
                 | Next.js + MongoDB    |
                 +----------+-----------+
                            |
                            | HTTP/REST
                            |
                 +----------v-----------+
                 |   FastAPI Middleware |
                 | Integração de Dados  |
                 | Regras de Negócio    |
                 | Dashboard            |
                 +----------+-----------+
                            |
                            | HTTP/REST
                            |
                 +----------v-----------+
                 | Inventory System     |
                 | Django + PostgreSQL  |
                 +----------------------+
```

---

# Objetivo

O projeto demonstra a integração entre dois sistemas independentes:

* Um sistema moderno de vendas desenvolvido em **Next.js**, responsável pelo registro das vendas.
* Um sistema legado de estoque desenvolvido em **Django**, responsável pelo controle dos produtos.
* Um middleware em **FastAPI**, responsável pela comunicação, transformação dos dados e sincronização entre os sistemas.

Cada aplicação possui banco de dados próprio, simulando um cenário real de integração entre aplicações distintas.

---

# Tecnologias

## Sales System

* Next.js
* TypeScript
* MongoDB
* Mongoose

## Inventory System

* Django
* Django REST Framework
* PostgreSQL

## Middleware

* FastAPI
* Python
* Requests / HTTPX

---

# Estrutura do Projeto

```
integration-project/

├── sales-system/
│   ├── app/
│   ├── models/
│   ├── lib/
│   └── api/
│
├── inventory-system/
│   ├── inventory/
│   ├── api/
│   └── config/
│
└── middleware/
    ├── app/
    ├── services/
    └── dashboard/
```

---

# Sistemas

## Sales System

Responsável por:

* Cadastro de vendas
* Consulta de vendas
* Atualização de vendas
* Exclusão de vendas
* Persistência no MongoDB

Modelo (provavelmente terá alterações):

```ts
Sale {
    productCode
    quantity
    unitPrice
    total
    createdAt
}
```

---

## Inventory System

Responsável por:

* Cadastro de produtos
* Controle de estoque
* Atualização do estoque
* API REST utilizando Django REST Framework

Modelo (Provavelmente terá alteração):

```python
Item:
    sku
    name
    description
    price
    quantity
```

---

# Middleware

O middleware é responsável por:

* Comunicação entre os sistemas
* Conversão de dados
* Aplicação das regras de negócio
* Sincronização do estoque
* Dashboard de monitoramento

---

# Fluxo de Integração

## 1. Venda

O usuário realiza uma venda no Sales System.

```
POST /api/sales
```

↓

A venda é salva no MongoDB.

↓

O middleware recebe os dados da venda.

↓

Consulta o Inventory System.

```
GET /api/items/{sku}
```

↓

Valida:

* existência do produto
* quantidade disponível
* preço

↓

Atualiza o estoque.

```
PATCH /api/items/{id}
```

↓

Registra logs da integração.

---

# Papel do Middleware

O middleware resolve a heterogeneidade entre os sistemas.

Exemplo:

Sales:

```json
{
    "productCode": "NOTEBOOK-001",
    "quantity": 2
}
```

Inventory:

```json
{
    "sku": "NOTEBOOK-001",
    "price": 2500,
    "quantity": 15
}
```

O middleware transforma os dados e envia o formato adequado para cada aplicação.

---

# Dashboard

O middleware também disponibiliza um dashboard contendo:

* Total de vendas
* Produtos mais vendidos
* Estoque disponível
* Histórico das integrações
* Logs
* Erros de comunicação
* Status dos serviços

---

# Objetivos Acadêmicos

O projeto demonstra:

* Integração de aplicações
* Integração de dados
* Sistemas heterogêneos
* APIs REST
* Middleware
* Transformação de dados
* Arquitetura distribuída
* Comunicação entre aplicações
* Persistência em bancos distintos
* Separação de responsabilidades

 
