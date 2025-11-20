import { Router, Request, Response, NextFunction } from 'express';
import db from './db';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET_KEY = process.env.JWT_SECRET || 'supersecretkey';

// Middleware para Autenticación
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Usuario registrado
 */
router.post('/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    try {
        const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        const info = stmt.run(name, email, password);
        res.json({ id: info.lastInsertRowid, name, email });
    } catch (error) {
        res.status(400).json({ error: 'El correo electrónico ya existe' });
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 */
router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? AND password = ?');
    const user = stmt.get(email, password) as any;

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, SECRET_KEY);
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/events', (req, res) => {
    const stmt = db.prepare('SELECT * FROM events');
    res.json(stmt.all());
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obtener detalles del evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del evento
 */
router.get('/events/:id', (req, res) => {
    const stmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = stmt.get(req.params.id);
    if (event) res.json(event);
    else res.status(404).json({ error: 'Evento no encontrado' });
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Crear un nuevo evento (Admin)
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento creado
 */
router.post('/events', (req, res) => {
    const { title, description, date, location, price, availableSeats } = req.body;
    const stmt = db.prepare('INSERT INTO events (title, description, date, location, price, availableSeats) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, description, date, location, price, availableSeats);
    res.json({ id: info.lastInsertRowid });
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Actualizar un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento actualizado
 */
router.put('/events/:id', (req, res) => {
    const { title, description, date, location, price, availableSeats } = req.body;
    const stmt = db.prepare('UPDATE events SET title=?, description=?, date=?, location=?, price=?, availableSeats=? WHERE id=?');
    stmt.run(title, description, date, location, price, availableSeats, req.params.id);
    res.json({ success: true });
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Evento eliminado
 */
router.delete('/events/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM events WHERE id = ?');
    stmt.run(req.params.id);
    res.json({ success: true });
});

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Comprar boletos
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId: { type: integer }
 *               ticketCount: { type: integer }
 *     responses:
 *       200:
 *         description: Reserva confirmada
 */
router.post('/bookings', authenticateToken, (req: any, res) => {
    const { eventId, ticketCount } = req.body;
    const userId = req.user.id;

    const eventStmt = db.prepare('SELECT * FROM events WHERE id = ?');
    const event = eventStmt.get(eventId) as any;

    if (!event || event.availableSeats < ticketCount) {
        return res.status(400).json({ error: 'No hay suficientes asientos' });
    }

    const totalAmount = event.price * ticketCount;

    const bookStmt = db.prepare('INSERT INTO bookings (userId, eventId, ticketCount, totalAmount) VALUES (?, ?, ?, ?)');
    bookStmt.run(userId, eventId, ticketCount, totalAmount);

    const updateEventStmt = db.prepare('UPDATE events SET availableSeats = availableSeats - ? WHERE id = ?');
    updateEventStmt.run(ticketCount, eventId);

    res.json({ success: true });
});

/**
 * @swagger
 * /bookings/my-bookings:
 *   get:
 *     summary: Obtener reservas del usuario
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reservas del usuario
 */
router.get('/bookings/my-bookings', authenticateToken, (req: any, res) => {
    const stmt = db.prepare(`
    SELECT b.*, e.title as eventTitle, e.date as eventDate 
    FROM bookings b 
    JOIN events e ON b.eventId = e.id 
    WHERE b.userId = ?
  `);
    res.json(stmt.all(req.user.id));
});

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Obtener perfil de usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de usuario
 */
router.get('/users/profile', authenticateToken, (req: any, res) => {
    const stmt = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?');
    res.json(stmt.get(req.user.id));
});

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/categories', (req, res) => {
    const stmt = db.prepare('SELECT * FROM categories');
    res.json(stmt.all());
});

export default router;
