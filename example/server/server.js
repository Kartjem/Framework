import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import db from "./db.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../")));
app.use("/framework", express.static(path.join(__dirname, "../../framework")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/api/tasks", (req, res) => {
  const { page = 1, limit = 5, filter } = req.query;
  const offset = (page - 1) * limit;

  let sql = `SELECT * FROM tasks WHERE 1=1`;
  const params = [];

  if (filter && filter !== "all") {
    sql += ` AND done = ?`;
    params.push(filter === "completed" ? 1 : 0);
  }

  sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const tasks = rows.map((r) => ({ ...r, done: !!r.done }));
    res.json({ tasks });
  });
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const sql = `INSERT INTO tasks (text, done, created_at, updated_at) VALUES (?, ?, ?, ?)`;
  db.run(sql, [text, 0, createdAt, updatedAt], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      text,
      done: false,
      created_at: createdAt,
      updated_at: updatedAt,
    });
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM tasks WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Task deleted" });
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { text, done } = req.body;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const fields = [];
  const values = [];

  if (text !== undefined) {
    fields.push("text = ?");
    values.push(text);
  }

  if (done !== undefined) {
    fields.push("done = ?");
    values.push(done ? 1 : 0);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  const updatedAt = new Date().toISOString();
  const sql = `UPDATE tasks SET ${fields.join(", ")}, updated_at = ? WHERE id = ?`;
  values.push(updatedAt, taskId);

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    db.get("SELECT * FROM tasks WHERE id = ?", [taskId], (err2, row) => {
      if (err2) {
        return res.status(500).json({ error: err2.message });
      }
      res.json({ ...row, done: !!row.done });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});