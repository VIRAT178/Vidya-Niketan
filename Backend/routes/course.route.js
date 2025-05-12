import express from 'express';
import { buyCourse, createCourse, deleteCourse, getallCourse, getCourse,updateCourse } from '../Controllers/course_controller.js';
import userMiddleware from '../middleware/user_mid.js';
import adminMiddleware from '../middleware/admin_mid.js';

const router = express.Router();
router.post('/create',adminMiddleware, createCourse);
router.put('/update/:courseId',adminMiddleware, updateCourse);
router.delete('/delete/:courseId',adminMiddleware, deleteCourse)

router.get('/courses', getallCourse)
router.get('/course/:courseId', getCourse)

router.post("/buy/:courseId", userMiddleware,buyCourse)


export default router;