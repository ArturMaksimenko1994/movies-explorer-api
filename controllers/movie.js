const Movie = require('../models/movie');

const ErrorValidation = require('../errors/error-validation');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorForbidden = require('../errors/error-forbidden');

// создаёт фильм с переданными в теле
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorValidation('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => (next(new ErrorNotFound('Фильм не найден'))))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id.toString()) {
        return movie.remove()
          .then(() => res.status(200).send({ message: 'Фильм удален' }));
      }
      return next(new ErrorForbidden('Вы не можете удалить этот фильм'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ErrorValidation('Невалидный id'));
      } return next(err);
    });
};

// возвращает все сохранённые текущим  пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((films) => res.send(films))
    .catch(next);
};
