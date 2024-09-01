## Aplicación de Gestión de Usuarios y Comentarios

Una API RESTful construida con Node.js y TypeScript para gestionar usuarios y comentarios. Los usuarios pueden crear, modificar y eliminar comentarios, así como reaccionar a ellos. La autenticación se realiza mediante JWT, asegurando que solo los usuarios autenticados puedan interactuar con la API. Los roles definidos, como superadmin y usuario regular, determinan las operaciones permitidas. La API también permite la creación y gestión de usuarios, con los superadmins teniendo control total sobre los usuarios del sistema.

### Configuración del proyecto

En el package.json agregar:
```
"scripts": {
    "dev": "nodemon src/index.ts"
 }
```

Instalar dependencias:

```
yarn add @types/bcrypt @types/dotenv @types/express @types/jsonwebtoken @types/mongoose @types/node nodemon ts-node typescript -D

yarn add bcrypt express jsonwebtoken zod
```

Agregar las variables de entorno al .env :
```
PORT=xxxx
MONGO_URL= tu_url
JWT_SECRET=TULLAVEPRIVADA
```
### Ejecución del proyecto

```
npm run dev
```

### Funcionalidades y endpoints

Registrar usuario (no requiere autenticación)
```
POST: /register
```

Login usuario (no requiere autenticación)
```
POST: /login
```

Crear usuario (requiere autenticación y rol de superadmin)
```
POST: /
```

Obtener todos los usuarios (requiere autenticación)
```
GET: /
```

Obtener un usuario específico por ID y grupo (requiere autenticación)
```
GET: /:id/group/:groupId
```

Obtener un usuario por ID (requiere autenticación)
```
GET: /:id
```

Actualizar usuario (requiere autenticación)
```
PUT: /:id
```

Eliminar usuario (requiere autenticación y rol de superadmin)
```
DELETE: /:id
```