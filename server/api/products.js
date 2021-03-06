const router = require('express').Router();
const { Product, Review, User } = require('../db/models');

router.get('/', (req, res, next) => {
  Product.findAll({
    include: {
      model: Review
    }
  })
    .then(products => res.json(products))
    .catch(next);
});

router.get('/:productId', (req, res, next) => {
  let id = req.params.productId;
  Product.findById(id)
    .then(product => res.json(product))
    .catch(next);
});

router.post('/', (req, res, next) => {
  Product.create(req.body)
    .then(newProduct => res.status(201).send(newProduct))
    .catch(next);
});

router.delete('/:productId', (req, res, next) => {
  let id = req.params.productId;
  Product.findById(id)
    .then(product => product.destroy())
    .then(() => res.send('deleted!'))
    .catch(next);
});

module.exports = router;

router.post('/:productId/review', function(req, res, next) {
  Review.create(req.body)
    .then(created => {
      return Review.findOne({
        where: { id: created.id },
        include: [{ model: User }]
      })
        .then(foundReview => {
          res.send(foundReview);
        })
        .catch(console.error);
    })
    .catch(next);
});
