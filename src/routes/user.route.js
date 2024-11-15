import express from 'express';
import { signUp, signOut, signIn } from '../controllers/userAuth.controller.js'; 

const router = new express.Router();

router.route('/signUp').post (signUp) ;

router.route('/signOut').post (signOut) ;
router.route('/signIn').post (signIn) ;

export default router ;