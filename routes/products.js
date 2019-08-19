const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/products');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};



const upload = multer({
  
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


const Product = require("../models/product");

router.get("/", (req, res, next) => {
  Product.find()
    .select("prod_name prod_price _id prod_image prod_desc")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            prod_name: doc.prod_name,
            prod_price: doc.prod_price,
            prod_desc:doc.prod_desc,
            prod_image:doc.prod_image,
  
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
      //   } else {
      //       res.status(404).json({
      //           message: 'No entries found'
      //       });
      //   }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// router.post("/", function(req, res) {
//   upload(req, res, function(err) {
//       if (err) {
//           return res.end("Something went wrong!");
//       }
//       return res.end("File uploaded sucessfully!.");
//   });
// });



router.post("/",upload.single('prod_image'), (req, res, next) => {
//  console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
  //console.log(req);
  //console.log("%%%%%%%%%%%%");
  //console.log(req.body);
  //console.log("@@@@@@@@@@@@");
  //console.log(req.file);
  const product = new Product({
    
    _id: new mongoose.Types.ObjectId(),
    prod_name: req.body.prod_name,
    prod_desc:req.body.prod_desc,
    prod_price: req.body.prod_price,
    prod_image:req.body.prod_image
   // prod_image: req.file.path 

  });
  //console.log('&&&&&&&&&&&');
  //console.log(product);
  product
    .save()
    .then(result => {
      console.log('**********************');
      console.log(result);
      res.status(201).json({
        message: "Created product successfully &&&&&&&&&&&&&&&&&&&&",
        createdProduct: {
            prod_name: result.prod_name,
            prod_price: result.prod_price,
            prod_desc:result.prod_desc,
           prod_image:result.prod_image,
           // prod_image: req.file.path ,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://localhost:3000/products/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message:"tttttttttttttttttttttttttttttttttttttttttttttttttttttt",
        error: err
      });
    });
});

router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    //.select('prod_name prod_price prod_desc prod_image _id ')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
            product: doc,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products'
            }
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

// router.put('/:id', function(req, res, next) {

//   console.log("^^^^^^^^^^^^^^^^^^ pUT  ");
//   Book.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

router.put("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  console.log('rquest^^^^^^^^^^^^^^');
  console.log(req.body);
  // for (const ops of req.body) {
  //   console.log("HHHHHHHHHHHHHHHHHHPPPPPPPPPPPPPPPPPPPPPPPPPPPP");
  //   updateOps[ops.propName] = ops.value;
  // }
  console.log('kkkkkkkkkkkkkk');
  console.log(updateOps);
  Product.update({ _id: id }, { $set: {prod_name:req.body.product.prod_name,
                      prod_desc:req.body.product.prod_desc,
                    prod_price:req.body.product.prod_price,
                    prod_image:req.body.product.prod_image
                  } })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product updated',
          id:id,
          request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + id
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// router.patch("/:productId", (req, res, next) => {

//   console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhlllllllllllll");
//   const id = req.params.productId;
//   const updateOps = {};
//   for (const ops of req.body) {
//     updateOps[ops.propName] = ops.value;
//   }
//   Product.update({ _id: id }, { $set: updateOps })
//     .exec()
//     .then(result => {
//       res.status(200).json({
//           message: 'Product updated',
         
//           request: {
//               type: 'GET',
//               url: 'http://localhost:3030/products/' + id
//           }
//       });
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
          message: 'Product deleted',
          request: {
              type: 'POST',
              url: 'http://localhost:3000/products',
              body: { prod_name: 'String',prod_desc:'String', prod_price: 'Number' }
          }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;