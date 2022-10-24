const router = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // подключение celebrate
const { createUser, login } = require('../controllers/users');
const userRouter = require('./users'); // импортируем роутер users
const movieRouter = require('./movies'); // импортируем роутер movie
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/error-not-found');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', auth, userRouter);
router.use('/movies', auth, movieRouter);

// централизованный обработчик ошибок
router.use(auth, ((req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
}));

module.exports = router;
