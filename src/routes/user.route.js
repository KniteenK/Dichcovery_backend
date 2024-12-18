import express from 'express';
import { signUp, signOut, signIn } from '../controllers/userAuth.controller.js'; 
import getEntityDetails from '../middlewares/getEntityDetials.middleware.js';
import getSubstituteIngredient from '../middlewares/getSubstitutes.middleware.js';
import webResults from '../controllers/webSearch.controller.js'; 
import compatibilityPredictor from "../controllers/compatibilityPredictor.controller.js"
import getSubstitute from '../controllers/getSubstitutes.controller.js';
import mealRecommendor from '../controllers/mealRecommendor.controller.js';
import advSearch from '../controllers/filteredSearch.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import runModel from '../controllers/guessDish.controller.js';

const router = new express.Router();

router.route('/signUp').post (signUp) ;

router.route('/signOut').post (signOut) ;
router.route('/signIn').post (signIn) ;

router.route('/getSubstitute').post (getEntityDetails, getSubstitute) ;

router.route('/compatibilityPredictor').post (compatibilityPredictor) ;

router.route('/mealRecommendation').post (mealRecommendor) ;

router.route('/webSearch'). post (webResults) ;

router.route('/advSearch').post (advSearch) ;

router.route('/guessDish'). post (upload.single('file'), runModel) ;
 
export default router ;