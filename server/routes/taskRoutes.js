const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/tasks', taskController.addTask);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId/:projectId', taskController.deleteTask);
router.get('/tasks', taskController.getUserTasks);

module.exports = router;
