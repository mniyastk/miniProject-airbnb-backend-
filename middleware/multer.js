const multer = require('multer');
module.exports=multer({
    storage:multer.diskStorage({}),
    fileFilter:(req,file,cb)=>{
        if(!file.mimetype.match(/jpeg||jpg||png/)){
            cb(new Error("File does not suppport"),false);
            return
        }
        cb(null,true)
    }
})