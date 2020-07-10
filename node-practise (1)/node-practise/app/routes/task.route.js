const express = require('express')
const router = express.Router()

const task_controller = require('../controllers/task.controller')

router.get('/text', task_controller.text);
router.post('/taskCreate', task_controller.createTask)
router.get("/getallTask", task_controller.getAllTask)
router.put("/updateTask", task_controller.updateTask)
router.delete("/delete/:userId",task_controller.deleteTask)

module.exports = router;