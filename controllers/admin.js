const fileHelper = require('../util/file')
const formatAmount = require('../util/formatAmount.js')

const { validationResult } = require('express-validator')

const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const image = req.file
  const price = req.body.price
  const description = req.body.description
  console.log('image: ', image)

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description,
      },
      errorMessage: 'Attached file is not an image.',
      validationErrors: [],
    })
  }

  const imageUrl = image.path

  const product = new Product({ title, price, description, imageUrl, userId: req.user })
  product
    .save()
    .then((result) => {
      console.log('Created Product')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const image = req.file
  const updatedDescription = req.body.description

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        _id: prodId,
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    })
  }

  Product.findById(prodId)
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        res.redirect('/')
      }
      product.title = updatedTitle
      product.price = updatedPrice
      product.description = updatedDescription
      if (image) {
        fileHelper(product.imageUrl)
        product.imageUrl = image.path
      }
      return product.save().then((result) => {
        console.log('UPDATED PRODUCT!')
        res.redirect('/admin/products')
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then((products) => {
      const fixedProducts = products.map((prod) => {
        return { ...prod._doc, formatedPrice: formatAmount(prod.price) }
      })
      res.render('admin/products', {
        prods: fixedProducts,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      })
    })
    .catch((err) => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId
//   Product.findById(prodId)
//     .then((product) => {
//       if (!product) {
//         return next(new Error('Product not found.'))
//       }
//       fileHelper(product.imageUrl)
//       return Product.deleteOne({ _id: prodId, userId: req.user._id })
//     })
//     .then(() => {
//       console.log('PRODUCT DELETED!')
//       res.redirect('/admin/products')
//     })
//     .catch((err) => {
//       const error = new Error(err)
//       error.httpStatusCode = 500
//       return next(error)
//     })
// }
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return next(new Error('Product not found.'))
      }
      fileHelper(product.imageUrl)
      return Product.deleteOne({ _id: prodId, userId: req.user._id })
    })
    .then(() => {
      console.log('PRODUCT DELETED!')
      res.status(200).json({ message: 'Success!' })
    })
    .catch((err) => {
      res.status(500).json({ message: 'Deleting product failed.' })
    })
}
