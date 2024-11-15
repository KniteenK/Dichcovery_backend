import express from 'express';
import { signUp, signOut, signIn } from '../controllers/userAuth.controller.js'; 
import getEntityDetails from '../middlewares/getEntityDetials.middleware.js';
import getSubstituteIngredient from '../middlewares/getSubstitutes.middleware.js';
import webResults from '../controllers/webSearch.controller.js'; 

const router = new express.Router();

router.route('/signUp').post (signUp) ;

router.route('/signOut').post (signOut) ;
router.route('/signIn').post (signIn) ;

router.route('getSubstitute').post (getEntityDetails, getSubstituteIngredient, webResults) ;

router.route('')

export default router ;