const router = require("express").Router();
const UserModel = require('../models/User.model')
const FavTrips = require("../models/favTrips.model");
const uploader = require('../middlewares/cloudinary.config.js');

const isLogged = (req, res, next) => {
    req.session.myProperty ? next() : res.redirect('/auth')
}

router.get('/profile', isLogged, (req, res, next) => {
    
    let userInfo = req.session.myProperty
    let start = ""
    let end = ""

    FavTrips.find({userId: req.session.myProperty._id })
    .then((result) => {
        if (result.length > 0){
            let date = new Date(result[0].start)
            start = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
            let endDate = new Date(result[0].end)
            end = endDate.getFullYear() + "-" + endDate.getMonth() + "-" + endDate.getDate()            
        }

        if (result.length == 0 )  {
            res.render('profile/profile.hbs', {layout:'logged-in-layout.hbs', username: userInfo.name});
        }
        else {
            res.render('profile/profile.hbs', {layout:'logged-in-layout.hbs', username: userInfo.name, destination: result[0].destination, start, end} )
 
        }
    })
    .catch((err) => {
        next(err)
    })


    
})

router.post('/profile', (req, res, next) => {
    
    const {destination, start, end} = req.body

    FavTrips.create({destination, start, end})
    .then(() => {
        res.redirect('/mytrips')
    })
    .catch((err) => {
        next(err)
    })

})

router.get('/profile/edit', isLogged, (req, res, next) => {
    UserModel.findById(req.session.myProperty._id)
    .then((result)=> {
    console.log(result.image)
        res.render('profile/edit-profile.hbs', {layout: 'logged-in-layout.hbs', name: req.session.myProperty.name, image: result.image})
    })
    .catch((err) => {
        next(err)
    })


})

router.post('/profile/edit/upload', uploader.single("imageUrl"), (req, res, next) => {
    console.log(req.file.path)

    UserModel.findByIdAndUpdate(req.session.myProperty._id, {image: req.file.path })
    .then(()=> {
        res.redirect('/profile');
    })
    .catch((err) => {
        next(err)
    })
});

module.exports = router;
