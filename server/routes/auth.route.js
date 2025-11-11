import { Router } from 'express';
import authController from '../controllers/auth.controller.js'

export default Router()
  .get('/validate', authMiddleware, (req, res) => {
     console.log("validate: ")
    res.status(200).json({ valid: true, user: req.user });
  })

  .post('/logout', (_, res) => {
    console.log("Logout: ")
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
  })
  .post('/login', authController.signin);
