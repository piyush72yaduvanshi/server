// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleCompleted,
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// Protect routes with auth middleware
router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, getTasks);
router.put('/tasks/:id', authMiddleware, updateTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);
router.patch('/tasks/:id/toggle-completed', authMiddleware, toggleCompleted);

module.exports = router;