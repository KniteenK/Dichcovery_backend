import multer from 'multer' ;


const storage = multer.diskStorage({
    destination: function(req, file, cb, next) {
        cb(null, './public/temp')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
}) ;

export const upload = multer({ storage: storage }) ;