# Task Manager API

RESTful API for managing tasks using Node.js, Express, and MongoDB.

## Features

- Create, read, update, and delete tasks
- Mongoose schema with title, description, completed
- JSON-based API responses

## Tech Stack

- Node.js
- Express.js
- Mongoose

## Setup

```bash
git clone git@github.com:Wondirad-Kifelew/Task-Manager-Backend.git
cd TaskManager-Backend
npm install
```
---

## Then run the server:

```bash
npm run dev
```
## Setup

---
## API Endpoints

Tested using a REST client vs code extention for testing the API.

- `GET /api/tasks` — Get all tasks
- `POST /api/tasks` — Add a new task
- `PUT /api/tasks/:id` — Mark as completed
- `DELETE /api/tasks/:id` — Delete a task by ID
