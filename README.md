# TODO

- [x] Send email with qr
- [x] Add Gihub
- Add project in vercel
- Add env in vercel
- Create storage in vercel
- Change to Postgresql
- Change the stripe webhook domain

## BD

USER:

- Guarda los datos del usuario, solo el campo email es requerido, en form se aplica logica del negocio para campos requeridos cuando se requieran
- Tiene relacion hacia un ticket (cuando este se cree)
- Tiene relacion hacia una orden (cuando este se cree)

ORDER:

- Guarda datos del buyer, checkout-session de stripe
- Tiene relacion hacia varios Tickets (cuando este se cree)
- Tiene relacion hacia una Orden (cuando este se cree)

TICKET:

- Guarda los datos del tipo de ticket, tipo de venta, id de intento de pago, payment id (id de la session de pago de stripe)
- Tiene relacion hacia varios Tickets (cuando este se cree)
- Tiene relacion hacia un User (cuando este se cree)
- Tiene relacion hacia una Orden (cuando este se cree)
- Tiene relacion hacia una RegistrationSheet (cuando este se cree)

REGISTRATION-SHEET:

- Guarda datos para el registros de usuario en evento, este Id sera el que se mandara al QR del email

ADMIN-TICKETS (Gift, group)

- Lorem ipsum......

---

## APP

### Normal Ticket

- FORM: Se llenan los datos del usuario, tipo de ticket (EARLY, STUDENT) y tipo de venta del ticket (NORMAL)
- ACTION (Checkout):
  1. OPCIONAL: Se consulta a la tabla si el usuario (email) existe (SI: continua, NO: Error de usuario existente)
  2. Se guardan datos del User
  3. Se crea el checkout session de stripe (SI: continua, NO: Error del checkout y se borra el usuario)
  4. Se guarda ORDER (user, checkout session id)
  5. Se Procede al ingreso de pago (SI: continua y se manda el webhook, FAIL/CANCEL: Se regresa al inicio del ticket y se manda el fail del webhook)
- WEBHOOKS:
  - SUCCESS: Se actualiza ORDER (buyer, checkout session id)
  - SUCCESS: Se crea el ticket (tycketType, userId, paymenIntent, paymentId, orderId)
  - SUCCESS: Se regristra el ticket en la tabla REGISTRATION-SHEET
  - SUCCESS: Se crea al QR
  - SUCCESS: Se mandal el ticket al user por email (cuando ticketTypeSale = NORMAL )
  - FAIL/CANCEL: Se Borrar User
  - FAIL/CANCEL: Se Borrar Order
  - OPCIONAL - FAIL/CANCEL: Mandar email de fallo o cancelacion de ticket

### GIFT (Validar por el ticketTypeSale = GIFT):

- FORM: Se llenan el email de usuario al que se regalará el ticket, tipo de ticket (EARLY, STUDENT) y tipo de venta del ticket (GIFT)
- ACTION (Checkout):
  1. OPCIONAL: Se consulta a la tabla si el usuario (email) existe (SI: continua, NO: Error de usuario existente)
  2. Se guardan datos del User (email)
  3. Se crea el checkout session de stripe (SI: continua, NO: Error del checkout y se borra el usuario)
  4. Se guarda ORDER (user, checkout session id)
  5. Se Procede al ingreso de pago (SI: continua y se manda el webhook, FAIL/CANCEL: Se regresa al inicio del ticket y se manda el fail del webhook)
- WEBHOOKS:
  - SUCCESS: Se actualiza ORDER (buyer, checkout session id)
  - SUCCESS: Se crea el ticket (tycketType, userId, paymenIntent, paymentId, orderId)
  - SUCCESS: Se regristra el ticket en la tabla REGISTRATION-SHEET
  - SUCCESS: Si el tipo de ticketTypeSale = GIFT
  - SUCCESS: Se crea un registro en la tabla links para forms (datos necesarios para el match)
  - SUCCESS: Se envia el link por email para completar registro
  - FAIL/CANCEL: Se Borrar User
  - FAIL/CANCEL: Se Borrar Order
  - OPCIONAL - FAIL/CANCEL: Mandar email de fallo o cancelacion de ticket
- COMPLETE FORM DATA:
  - El usuario recibe un email con un link para llenar los datos
  - Los datos se llenan y se envia (SI: regresar screen principal, NO: mostrar errores)
- ACTION (Complete form user data):
  - Se envia email con el ticket

### GROUP (Validar por el ticketTypeSale = GROUP):

- FORM: Se llenan los emails de los usuarios a los que se les regalará el ticket, tipo de ticket (EARLY, STUDENT) y tipo de venta del ticket (GROUP)
- ACTION (Checkout):
  1. OPCIONAL: Se consulta a la tabla algun usuario existe (email) (SI: continua, NO: Error de usuario existente)
  2. Se guardan los emails de los Users
  3. Se crea el checkout session de stripe con la cantidad de compra(SI: continua, NO: Error del checkout y se borran usuarios)
  4. Se guarda ORDER (users, checkout session id)
  5. Se Procede al ingreso de pago (SI: continua y se manda el webhook, FAIL/CANCEL: Se regresa al inicio del ticket y se manda el fail del webhook)
- WEBHOOKS:
  - SUCCESS: Se actualiza ORDER (buyer, checkout session id)
  - SUCCESS: Se crean los tickets (tycketType, userId, paymenIntent, paymentId, orderId)
  - SUCCESS: Se regristran los tickets en la tabla REGISTRATION-SHEET
  - SUCCESS: Si el tipo de ticketTypeSale = GROUP
  - SUCCESS: Se crea un registro en la tabla links para forms (datos necesarios para el match)
  - SUCCESS: Se envia el link por email x user para completar registro
  - FAIL/CANCEL: Se Borran Users
  - FAIL/CANCEL: Se Borran Orders
  - OPCIONAL - FAIL/CANCEL: Mandar email de fallo o cancelacion de ticket
- COMPLETE FORM DATA:
  - los usuarios reciben un email con un link para llenar los datos
  - Los datos se llenan y se envia (SI: regresar screen principal, NO: mostrar errores)
- ACTION (Complete form user data):
  - Se envia email con el ticket

**Quizas crear un hook para cada tipo (normal, gift, group)**

### ADMIN

- Listado de tickets:
  - Todos
  - Filtar x tipo de ticket, precio, etc..,
  - Cantidad de tickets vendidos
- Informacion de usuarios registrados
- Informacion de asistentes al evento por dia
- Scaner para registrar por dia
