const movieRoutes = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const { RegularExpressions } = require('../validator/regular-expressions');
const {
  createMovie,
  deleteMovie,
  getMovie,
} = require('../controllers/movie');

movieRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.string().required().min(2).max(30),
    year: Joi.string().required().min(2).max(30),
    description: Joi.string().required().min(2).max(30),
    image: Joi.string().required().regex(RegularExpressions),
    trailerLink: Joi.string().required().regex(RegularExpressions),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
    thumbnail: Joi.string().required().regex(RegularExpressions),
    movieId: Joi.string().required().min(2).max(30),
  }),
}), createMovie);

movieRoutes.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().alphanum().hex().length(24),
  }),
}), deleteMovie);

movieRoutes.get('/', getMovie);

module.exports = movieRoutes;
