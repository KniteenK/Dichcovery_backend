import { user } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js"


const signUp = asyncHandler ( async (req , res) => {
    try {
        const {username , email , password, region, gender, age, allergies} = req.body ;
        const { continent, subRegion } = region;
    
        if (
            [username, email, password, continent, subRegion].some((field) => field.trim() === "")
        ){
            throw new Error("All fields are required") ;
        }
    
        const isExisting = await user.findOne({
            $or: [{ username }, { email }]
        }) ;
    
        if (isExisting) {
            throw new Error("User already exists") ;
        } ;
    
        // const coverImageLocalPath = req.files?.coverImage?.[0]?.path ;
    
        // let uploadedCoverImage;
        // if (coverImageLocalPath) {
        //     uploadedCoverImage = await uploadOnCloudinary(coverImageLocalPath);
        //     if (!uploadedCoverImage) {
        //         throw new apiError(500, "Failed to upload cover image");
        //     }
        // }
        
        const isUser = await user.create({
            username,
            email,
            password,
            gender,
            age,
            allergies,
            region: {
                city,
                country,
            },
        }) ;
    
        if (!isUser) {
            throw new Error("Failed to create user") ;
        }
        
        const accessToken = isClient.generateAccessToken()
        const refreshToken = isClient.generateRefreshToken()
        isClient.accessToken = accessToken
        isClient.save({ validateBeforeSave: false })


        // console.log(isClient)
    
        return res.status(201).json(
            new apiResponse(200 , {isClient , accessToken , refreshToken} , "User created successfully") 
        )

    } catch (error) {
        console.log('error: ', error.message) ;
    }


}) ;

const signOut = asyncHandler(async (req, res) => {
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                accessToken: 1
            }
        },
        { 
            new: true  
        }
    )

    return res
    .status(200)
    .json(new apiResponse(200, {}, "User logged Out Successfully"))
});


export {
    signUp,
    signOut
}