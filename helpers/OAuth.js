const express = require("express");
const router =express.Router()
const dotenv = require('dotenv');
dotenv.config()

const {OAuth2Client} = require('google-auth-library');

const getDetails = async (access_token)=>{
    const data = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token${access_token}`)
    const response = await data.json()
    console.log(response)
}
router.get('/',async function(req,res){
    const code = req.query.code
    try {
        const redirectUrl='http://127.0.0.1:3000:oauth'
        const oAuth2Client = new OAuth2Client(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            redirectUrl
          );
          const res= await oAuth2Client.getToken(code)
          await oAuth2Client.setCredentials(res.tokens)
          console.log("Token aquired ")
          const user  = oAuth2Client.credentials
          console.log(user)
          await getDetails(user.access_token)
    } catch (error) {
        console.log(error);
    }

})

module.exports =router