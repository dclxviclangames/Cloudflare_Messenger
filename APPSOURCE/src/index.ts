// src/index.ts
import { TaskCreate } from "./endpoints/taskCreate";
import { TaskDelete } from "./endpoints/taskDelete";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";



import { fromHono } from "chanfana";
import { Hono } from "hono";
// ... импорты для TaskCreate, TaskDelete, etc.

// Импортируем наши новые обработчики чата
import { getMessages, createMessage } from "./endpoints/messages";

// Start a Hono app
const app = new Hono<{ Bindings: Env }>();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints (endpoints for tasks already exist here)
openapi.get("/api/tasks", TaskList);
openapi.post("/api/tasks", TaskCreate);
// ... и так далее для задач...

// Добавляем маршруты для чата (мы используем app напрямую, так как они не в OpenAPI)
app.get("/api/messages", getMessages);
app.post("/api/messages", createMessage);

// Export the Hono app
export default app;

