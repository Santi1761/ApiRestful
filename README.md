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


#### Usuarios:

Registrar usuario (no requiere autenticación)
```
POST: api/users/register
```

Login usuario (no requiere autenticación)
```
POST: api/users/login
```

Crear usuario (requiere autenticación y rol de superadmin)
```
POST: api/users/
```

Obtener todos los usuarios (requiere autenticación)
```
GET: api/users/
```

Obtener un usuario específico por ID y grupo (requiere autenticación)
```
GET: api/users/:id/group/:groupId
```

Obtener un usuario por ID (requiere autenticación)
```
GET: api/users/:id
```

Actualizar usuario (requiere autenticación)
```
PUT: api/users/:id
```

Eliminar usuario (requiere autenticación y rol de superadmin)
```
DELETE: api/users/:id
```

#### Comentarios

Crear comentarios (requiere autenticación)
```
POST: comments/
```

Obtener todos los comentarios (requiere autenticación)
```
GET: comments/
```

Obtener un comentario por id (requiere autenticación)
```
GET: comments/:id
```

Actualizar comentario (requiere autenticación)
```
PUT: comments/:id
```

Borrar comentario (requiere autenticación)
```
DELETE: comments/:id
```
