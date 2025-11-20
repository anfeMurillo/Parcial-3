# TicketFlow - Parcial 3

**Integrantes:**
- Andrés Hurtado
- Andrés Díaz

## ¿Cómo organizamos el código? (Estructura)

Aquí les contamos cómo ordenamos todo para que no sea un desastre:

1.  **`frontend/` (Lo que se ve):**
    *   Aquí está toda la parte visual, la página web que usa la gente.
    *   Usamos **Vue** porque nos pareció chévere y ordenado.
    *   Dentro de `src/views` pusimos cada página por separado (como el Login, el Home, etc.) para saber dónde buscar si algo se ve mal.

2.  **`backend/` (El cerebro):**
    *   Aquí está la lógica que nadie ve pero que hace que todo funcione.
    *   Es el que conecta con la base de datos y le responde al frontend cuando pide información de los eventos.

3.  **`design/` (Los planos):**
    *   Aquí guardamos la documentación y los diagramas para no olvidarnos de qué teníamos que hacer.

## ¿Por qué lo hicimos así? (Decisiones de Diseño)

*   **Separar Frontend y Backend:** Decidimos ponerlos en carpetas distintas para que no se mezclaran los archivos. Así, si uno de nosotros trabaja en el diseño y el otro en la lógica, no nos estorbamos.
*   **Nombres en Inglés:** Le pusimos nombres en inglés a las carpetas y archivos (como `views`, `routes`, `db`) porque vimos que en los tutoriales y en las empresas lo hacen así :v, y queríamos seguir las buenas prácticas (aunque los comentarios a veces van en español).
*   **Componentes:** En el frontend intentamos no repetir código. Si veíamos que algo se usaba mucho (como un botón o una tarjeta de evento), lo volvíamos un componente para reutilizarlo.