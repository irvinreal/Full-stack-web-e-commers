const express = require('express')
const { body } = require('express-validator')

const adminController = require('../controllers/admin')
const isAuth = require('../middlewares/is-auth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)

router.get('/products', isAuth, adminController.getProducts)

router.post(
  '/add-product',
  [
    body('title', 'Title must be greater than 3 characters length.')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description', 'Enter a text between 5 and 400 characters')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postAddProduct,
)

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)

router.post(
  '/edit-product',
  [
    body('title', 'Title must be greater than 3 characters length.')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('price').isFloat(),
    body('description', 'Enter a text between 5 and 400 characters')
      .isLength({ min: 5, max: 400 })
      .trim(),
  ],
  isAuth,
  adminController.postEditProduct,
)

// router.post("/delete-product", isAuth, adminController.postDeleteProduct);
router.delete('/product/:productId', isAuth, adminController.deleteProduct)

module.exports = router
