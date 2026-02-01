const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

const { authenticateToken, authorizeAdmin } = require('../middlewares/authMiddleware');

router.post('/tasks', taskController.addTask);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId/:projectId', taskController.deleteTask);
router.get('/tasks', taskController.getUserTasks);

// Add Task - Restricted to Admin
router.post('/add', authenticateToken, authorizeAdmin, taskController.addTask);

// Delete Task - Restricted to Admin
router.delete('/:id', authenticateToken, authorizeAdmin, taskController.deleteTask);

router.patch("/:taskId/toggle", authenticateToken, taskController.toggleTaskCompletion);

module.exports = router;
