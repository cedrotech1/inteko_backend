import express from 'express';
import {
  addUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  activateOneUser,
  deactivateOneUser,
  changePassword,
  checkEmail,
  checkCode,
  ResetPassword,
  getUsersWithoutAppointments,
  processAddUsers,
  getAllUsers11
} from '../controllers/userController.js';
import { protect } from '../middlewares/protect.js';
import multer from 'multer';
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.get('/upload',protect, upload.single('file'),express.json(),processAddUsers);
router.get('/formission', protect, getUsersWithoutAppointments);
router.get('/', protect, getAllUsers);
router.get('/:id', protect, getOneUser);
router.post('/addUser', protect, addUser);
router.put('/update/:id', protect, updateOneUser);
router.delete('/delete/:id', protect, deleteOneUser);
router.put('/activate/:id', protect, activateOneUser);
router.put('/deactivate/:id', protect, deactivateOneUser);
router.put('/changePassword', protect, changePassword);

router.post('/check', checkEmail);
router.post('/code/:email', checkCode);
router.put('/resetPassword/:email', ResetPassword);

export default router;
