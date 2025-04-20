import { Router } from 'express';
import { getUserInfo, login, register, uploadImage } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', protect, getUserInfo);
router.get('/test', (_req, res) => {
    res.status(200).json({ message: "Backend is alive" });
});
router.head('/test', (_req, res) => {
    res.status(200).end();
});
router.post("/upload-image", upload.single("image"), uploadImage)

export default router;