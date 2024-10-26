const express = require('express');
const router = express.Router();
const {Auth,isOwner} = require('../middleware/midd');
const ejs = require('ejs');
const wrapAsync = require('../utils/wrapAsync');
const expressError = require('../utils/expressError');
const listingController = require('../controller/listing');
const multer  = require('multer')
const {storage} = require('../cloudConfig');
const upload = multer({storage});


router.get("/", wrapAsync(listingController.showListing));

//creating new properties
router.get("/newProperty",Auth,listingController.newListingForm);

router.post("/newProperty", Auth, upload.single('image'), wrapAsync(listingController.newListing)); 


// detail view of properties
router.get("/:id", wrapAsync(listingController.detailListing));

//updating the details of properties

router.get("/:id/edit",Auth,isOwner,wrapAsync(listingController.updateListingForm));
router.post("/:id/edit",isOwner,upload.single('image'), wrapAsync(listingController.updateListing));

//deleting list
router.get("/:id/delete",isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
