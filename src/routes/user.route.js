import express from 'express';
import { signUp, signOut } from '../controllers/userAuth.controller.js'; 

const router = new express.Router();

router.route('/signUp').post (signUp) ;

router.route('/signOut').post (signOut) ;

export default router ;