import Database from 'better-sqlite3';

const db = new Database('database.sqlite');

export function initializeDB() {
  // Crear Tabla de Usuarios
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

  // Crear Tabla de Eventos
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      price REAL NOT NULL,
      availableSeats INTEGER NOT NULL
    )
  `);

  // Crear Tabla de Reservas
  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      eventId INTEGER,
      ticketCount INTEGER,
      totalAmount REAL,
      purchaseDate TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(eventId) REFERENCES events(id)
    )
  `);

  // Crear Tabla de Categorías
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  // Sembrar datos si está vacío
  const userCount = db.prepare('SELECT count(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    console.log('Sembrando datos...');
    db.exec(`
      INSERT INTO categories(name) VALUES('Concierto'), ('Teatro'), ('Deportes');
      
      INSERT INTO events(title, description, date, location, price, availableSeats) VALUES
    ('Concierto de Rock', 'La mejor banda de rock', '2023-12-01', 'Estadio A', 50.0, 100),
    ('Noche de Jazz', 'Velada de jazz suave', '2023-12-05', 'Club B', 30.0, 50),
    ('Partido de Fútbol', 'Equipo A vs Equipo B', '2023-12-10', 'Estadio C', 20.0, 2000);
  `);
  }

  console.log('Base de datos inicializada');
}

export default db;
