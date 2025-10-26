📄 Documentación Cash - Versión Markdown
Autenticación
Login

Método: POST
Ruta: /api/v1/auth/login
Headers:

    Content-Type: application/json

Body JSON:

json
{
  "email": "bocher1227gmail.com",
  "password": "Varela1520"
}

Respuestas:

    Éxito:

    json
    {
      "success": true,
      "message": "Se envió un código de verificación a tu correo.",
      "data": {
        "email": "bocher1227gmail.com",
        "expiresin": 600
      }
    }

    Fallo:

        Credenciales inválidas

        Error de validación

Two Factor Code

Método: POST
Ruta: /api/v1/auth/verify-code
Headers:

    Content-Type: application/json

Body JSON:

json
{
  "email": "bocher1227gmail.com",
  "code": "447858"
}

Respuestas:

    Error de validación: El código debe tener 6 dígitos.

    Código inválido o expirado.

    Éxito:

    json
    {
      "success": true,
      "message": "Inicio de sesión exitoso.",
      "data": {
        "accesstoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "tokentype": "bearer",
        "expiresin": 3600,
        "user": {
          "id": 1,
          "name": "Armando Varela Rincon",
          "email": "bocher1227gmail.com"
        }
      }
    }

Me

Método: POST
Ruta: /api/v1/auth/me
Headers:

    Content-Type: application/json

    Bearer Token

Respuestas:

json
{
  "success": true,
  "message": "Perfil obtenido correctamente.",
  "data": {
    "id": 1,
    "name": "Armando Varela Rincon",
    "email": "bocher1227gmail.com",
    "address": "123 Main St, City, Country",
    "phone": "1234567890",
    "isactive": 1,
    "emailverifiedat": null,
    "twofactorcode": null,
    "twofactorexpiresat": null,
    "accounttypeid": 2,
    "createdat": null,
    "updatedat": "2025-10-25T16:51:37.000000Z"
  }
}

Refresh

Método: POST
Ruta: /api/v1/auth/refresh
Headers:

    Content-Type: application/json

    Bearer Token

Respuestas:

json
{
  "success": true,
  "message": "Autenticación exitosa.",
  "data": {
    "accesstoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "tokentype": "bearer",
    "expiresin": 3600,
    "user": {
      "id": 1,
      "name": "Armando Varela Rincon",
      "email": "bocher1227gmail.com",
      "address": "123 Main St, City, Country",
      "phone": "1234567890",
      "isactive": 1,
      "emailverifiedat": null,
      "twofactorcode": null,
      "twofactorexpiresat": null,
      "accounttypeid": 2,
      "createdat": null,
      "updatedat": "2025-10-25T16:51:37.000000Z"
    }
  }
}

Herramientas
Dashboard Usuario

Método: POST
Ruta: /api/v1/tools/dashboard-stats
Headers:

    Content-Type: application/json

    Bearer Token

Respuestas:

json
{
  "success": true,
  "message": "Estadísticas del dashboard calculadas correctamente.",
  "data": {
    "period": {
      "current": {
        "from": "2025-10-01 00:00:00",
        "to": "2025-10-31 23:59:59"
      },
      "previous": {
        "from": "2025-09-01 00:00:00",
        "to": "2025-09-30 23:59:59"
      }
    },
    "totals": {
      "thismonth": {
        "income": 0,
        "expense": 940.09,
        "balance": -940.09
      },
      "lastmonth": {
        "income": 417.52,
        "expense": 461.28,
        "balance": -43.76
      },
      "variation": {
        "incomepct": -100,
        "expensepct": 103.8,
        "balancepct": 2048.29,
        "incometrend": "baj",
        "expensetrend": "subi",
        "balancetrend": "subi"
      }
    },
    "thismonth": {
      "incomes": [
        // ... ingresos
      ],
      "expenses": [
        // ... gastos
      ]
    }
  }
}

Dashboard Admin/Empresas

Método: POST
Ruta: /api/v1/tools/dashboard-enterprise
Headers:

    Content-Type: application/json

    Bearer Token

Respuestas (Ejemplo Donde se detallan periodos mensual, bimestral, trimestral, semestral, anual):

json
{
  "success": true,
  "message": "Estadísticas de empresas calculadas correctamente.",
  "data": {
    "mensual": { /* ... */ },
    "bimestral": { /* ... */ },
    "trimestral": { /* ... */ },
    "semestral": { /* ... */ },
    "anual": { /* ... */ }
  }
}
