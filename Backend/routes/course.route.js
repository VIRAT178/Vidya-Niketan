import express from 'express';
import { buyCourse, createCourse, deleteCourse, getOneCourse, getCourses,updateCourse } from '../Controllers/course_controller.js';
import userMiddleware from '../middleware/user_mid.js';
import adminMiddleware from '../middleware/admin_mid.js';

const router = express.Router();
router.post('/create',adminMiddleware, createCourse);
router.put('/update/:id',adminMiddleware, updateCourse);
router.delete('/delete/:id',adminMiddleware, deleteCourse)


router.get("/courses", getCourses);
router.get('/course/:id', getOneCourse)

router.post("/buy/:id", userMiddleware,buyCourse)


export default router;