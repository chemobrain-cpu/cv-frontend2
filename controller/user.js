const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const { User, Cv } = require("../database/databaseConfig");
const crypto = require("crypto");  

const { generateAccessToken } = require("../utils/utils");




Cv.find().then(data=>{
   console.log(data)
})
module.exports.validateToken = async (req, res, next) => {
   try {
      
      // Get the token from the "Authorization" header and remove the "Bearer " prefix
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
         
         return res.status(401).json({
            response: "A token is required for authentication"
         });
      }

      // Verify the token with the secret key
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
      const user = await User.findOne({ email: decodedToken.email });
     
      if (!user) {
         
         // If the user does not exist, return a 404 response
         return res.status(404).json({
            response: "User not found"
         });
      }
      
     

      // Return a success response with user data if the token is valid
      return res.status(200).json({
         response: token,
         user:user
      });

   } catch (error) {
      // If the token is invalid or any other error occurs, handle it here
      return res.status(401).json({
         response: error.message || "An error occurred. Please try again later."
      });
   }
}


module.exports.signup = async (req, res, next) => {
   try {
      console.log('Signup initiated')

      // Destructure email and password from request body
      let { email, password,username,fullName } = req.body;

      // Check if the email already exists
      let userExist = await User.findOne({
         $or: [
           { email: email },
           { fullName: fullName },
           { username: username }
         ]
       });
       
       if (userExist) {
         let error = new Error("User with the same email, full name, or username is already registered");
         error.statusCode = 301;
         return next(error);
       }
       

      // Generate the access token
      let accessToken = generateAccessToken(email);
      if (!accessToken) {
         let error = new Error("Access token error");
         return next(error);
      }

      

      // Proceed to create a new user with default random values for username and fullName
      let newUser = new User({
         _id: new mongoose.Types.ObjectId(),
         username:username,   // Use random string for username
         fullName: fullName,   // Use random string for fullName
         email: email,
         password: password,
      });

      // Save the new user to the database
      let savedUser = await newUser.save();
      if (!savedUser) {
         let error = new Error("User could not be saved");
         return next(error);
      }

      // Create an access token for the saved user
      let token = generateAccessToken(savedUser.email);

      // Return success response with the user data and access token
      return res.status(200).json({
         response: 'Successfully registered',
         user: savedUser,
         userToken: token,
         userExpiresIn: '500',  // The expiry can be dynamic, based on your token generation logic
      });

   } catch (error) {
      // Handle any other errors
      error.message = error.message || "An error occurred, please try later";
      return next(error);
   }
};

//sign in user with different response pattern
module.exports.login = async (req, res, next) => {
   try {
      let { email, password } = req.body

      console.log(req.body)
      let userExist = await User.findOne({ email: email })

      if (!userExist) {
         return res.status(404).json({
            response: "user is not yet registered"
         })
      }

      //check if password corresponds
      if (userExist.password != password) {
         let error = new Error("Password does not match")
         return next(error)
      }


      //checking forphone or email verified



      let token = generateAccessToken(email)

      return res.status(200).json({
         response: {
            user: userExist,
            userToken: token,
            userExpiresIn: '5000',
            message: 'Login success'
         }
      })


   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }
}

module.exports.allCvs = async (req, res, next) => {
   try {
      console.log(req.params)
      let { id } = req.params
      let cvExist = await Cv.find({ user: id })
      if (!cvExist) {
         return res.status(404).json({
            response: "No cv yet"
         })
      }
      return res.status(200).json({
         cvs:cvExist
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }


}
 

module.exports.cv = async (req, res, next) => {
   try {
      let { id } = req.params
      console.log('initiated')
      let cvExist = await Cv.findOne({ _id: id })
      if (!cvExist) {
         return res.status(404).json({
            response: "cv does not exist"
         })
      }

      console.log(cvExist)

      return res.status(200).json({
         cv:cvExist
      })

   } catch (error) {
      error.message = error.message || "an error occured try later"
      return next(error)

   }


}


module.exports.updateAccount = async (req, res, next) => {
  try {
    const id = req.params.id; // Assuming the user's ID is passed in the route as a parameter
    const { fullName, email, phone, username, password, jobTitle, company, cardNumber,
    expiryDate, 
    cvv,
    billingAddress} = req.body; // Destructuring updated user info from the request body
  
    // Check if the user exists
    let user = await User.findById(id);
    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if email or username already exists (ignoring current user)
    let emailExist = await User.findOne({ email: email, _id: { $ne: id } });
    if (emailExist) {
      let error = new Error("Email already in use");
      error.statusCode = 409;
      return next(error);
    }

    let usernameExist = await User.findOne({ username: username, _id: { $ne: id } });
    if (usernameExist) {
      let error = new Error("Username already taken");
      error.statusCode = 409;
      return next(error);
    }

    // Update user fields only if they exist in the request
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (username) user.username = username;
    if (password) user.password = password; // Ideally, you should hash the password before saving
    if (jobTitle) user.jobTitle = jobTitle;
    if (company) user.company = company;
    
    if (cardNumber) user.cardNumber = cardNumber
    if (expiryDate)  user.expiryDate = expiryDate 
    if (cvv)  user.cvv = cvv
    if (billingAddress)  user.billingAddress = billingAddress
      
    // Save the updated user info to the database
    let updatedUser = await user.save();
    if (!updatedUser) {
      let error = new Error("Failed to update user");
      return next(error);
    }

    // Send back updated user data
    return res.status(200).json({
      message: 'User account updated successfully',
      user: updatedUser
    });
  } catch (error) {
    error.message = error.message || "An error occurred while updating the account";
    return next(error);
  }
};




module.exports.createCv = async (req, res, next) => {
   try {
     const { id } = req.params;
 
     const {
       name, jobTitle, phone, email, location, profile, linkedin, socialMedia, summary,
       education, experiences, workExperience, researchExperience, publications,
       awards, achievements, certifications, skills, skillset, cvTemplateType, skills3, languages, aboutMe, address,employmentHistory,contact, references,skills4
     } = req.body;
 
     // Check if the user exists
     let user = await User.findById(id);
     if (!user) {
      
       let error = new Error("User not found");
       console.log(error)
       error.statusCode = 404;
       return next(error);
     }
 
     // Create a new CV document using the CV schema
     let newCv = new Cv({
       aboutMe,
       name,
       jobTitle,
       phone,
       email,
       location,
       profile,
       linkedin,
       socialMedia,
       summary,
       education,
       experiences,
       workExperience,
       researchExperience,
       publications,
       awards,
       achievements,
       certifications,
       skills,  // Keep the old skills field, but you can add logic if needed
       skillset,  // New skillset field
       skills3,
       skills4,
       cvTemplateType,
       languages,
       address,
       employmentHistory,
       user: user._id ,// Link the CV to the user who created it
       contact,
       references
     });
 
     // Save the new CV to the database
     let savedCv = await newCv.save();
     if (!savedCv) {
     
       let error = new Error("Failed to create CV");
       console.log(error)
       return next(error);
     }

    
 
     // Send a success response with the saved CV
     return res.status(200).json({
       message: "CV created successfully",
       cv: savedCv
     });
 
   } catch (error) {
     error.message = error.message || "An error occurred while creating the CV";
     console.log(error)
     return next(error);
   }
 };
 


 module.exports.updateCv = async (req, res, next) => {
   try {
       const { id } = req.params;
       const {
           name, jobTitle, phone, email, location, profile, linkedin, socialMedia, summary,
           education, experiences, workExperience, researchExperience, publications,
           awards, achievements, certifications, skills, skillset, cvTemplateType, skills3, languages, aboutMe, address,employmentHistory,contact, references,skills4
       } = req.body;

       console.log(req.body);

       // Check if the user exists
       let user = await User.findById(id);
       if (!user) {
           let error = new Error("User not found");
           error.statusCode = 404;
           return next(error);
       }

       // Check if the CV exists for the user
       let existingCv = await Cv.findOne({ user: user._id });
       if (!existingCv) {
           let error = new Error("CV not found for the user");
           error.statusCode = 404;
           return next(error);
       }

       // Update basic fields in the CV document
       existingCv.name = name || existingCv.name;
       existingCv.jobTitle = jobTitle || existingCv.jobTitle;
       existingCv.phone = phone || existingCv.phone;
       existingCv.email = email || existingCv.email;
       existingCv.location = location || existingCv.location;
       existingCv.profile = profile || existingCv.profile;
       existingCv.linkedin = linkedin || existingCv.linkedin;
       existingCv.socialMedia = socialMedia || existingCv.socialMedia;
       existingCv.summary = summary || existingCv.summary;

       // Update the 'education' and other nested fields
       existingCv.education = education || existingCv.education;
       existingCv.experiences = experiences || existingCv.experiences;
       existingCv.employmentHistory = employmentHistory || existingCv.employmentHistory;
       existingCv.workExperience = workExperience || existingCv.workExperience;
       existingCv.researchExperience = researchExperience || existingCv.researchExperience;
       existingCv.publications = publications || existingCv.publications;
       existingCv.awards = awards || existingCv.awards;
       existingCv.achievements = achievements || existingCv.achievements;
       existingCv.certifications = certifications || existingCv.certifications;

       // Handle the 'skills' and 'skillset' fields separately
       existingCv.skills = skills || existingCv.skills;
       existingCv.skills4 = skills4 || existingCv.skills4;
       existingCv.skillset = skillset || existingCv.skillset;  // Add this new field for 'skillset'
       existingCv.skills3 = skills3 || existingCv.skills3;
       existingCv.cvTemplateType = cvTemplateType || existingCv.cvTemplateType;
       existingCv.aboutMe = aboutMe || existingCv.aboutMe;
       existingCv.address = address || existingCv.address;
       existingCv.contact = contact || existingCv.contact;
       existingCv.references = references || existingCv.references;
       

       // Handle the languages field update
       if (Array.isArray(languages)) {
           // Replace the existing array if provided
           existingCv.languages = languages.map(lang => ({
               language: lang.language || "",
               proficiency: lang.proficiency || ""
           }));
       }

       // Save the updated CV
       let updatedCv = await existingCv.save();
       if (!updatedCv) {
           let error = new Error("Failed to update CV");
           return next(error);
       }

       // Send a success response with the updated CV
       return res.status(200).json({
           message: "CV updated successfully",
           cv: updatedCv
       });

   } catch (error) {
       error.message = error.message || "An error occurred while updating the CV";
       return next(error);
   }
};




module.exports.deleteCv = async (req, res, next) => {
   try {
       const { id } = req.params;

       // Check if the user exists
       let user = await User.findById(id);
       if (!user) {
           let error = new Error("User not found");
           error.statusCode = 404;
           return next(error);
       }

       // Check if the CV exists for the user
       let existingCv = await Cv.findOne({ user: user._id });
       if (!existingCv) {
           let error = new Error("CV not found for the user");
           error.statusCode = 404;
           return next(error);
       }

       // Delete the CV
       await Cv.deleteOne({ user: user._id });

       // Send a success response
       return res.status(200).json({
           message: "CV deleted successfully"
       });

   } catch (error) {
       error.message = error.message || "An error occurred while deleting the CV";
       return next(error);
   }
};

 


