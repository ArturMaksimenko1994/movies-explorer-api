const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorValidation = require('../errors/error-validation');
const ErrorUnauthorization = require('../errors/error-unauthorization');
const ErrorNotFound = require('../errors/error-not-found');
const ErrorConflict = require('../errors/error-conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

// создание нового пользователя
module.exports.createUser = (req, res, next) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, 10)// хешируем пароль
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorValidation('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new ErrorConflict('Пользователь уже существует'));
      }
      return next(err);
    });
};

// аутентификация(вход на сайт) пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new ErrorUnauthorization('Неправильные почта или пароль'));
      }
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', { expiresIn: '7d' }); // токен будет просрочен через 7 дней
      return bcrypt.compare(password, user.password) // сравниваем переданный пароль и хеш из базы
        .then((matched) => {
          if (!matched) {
            return next(new ErrorUnauthorization('Неправильные почта или пароль'));
          }
          // вернём токен
          return res.send({ token });
        })
        .catch(() => {
          next(new ErrorUnauthorization('Введите почту и пароль'));
        })
        .catch(next);
    })
    .catch((err) => {
      next(err);
    });
};

// возвращает информацию о пользователе
module.exports.getUserInfo = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

// обновляет информацию о пользователе (email и имя)
module.exports.updatesUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ErrorValidation('Переданы некорректные данные при обновлении профиля'));
      }
      if (err.message === 'NotFound') {
        return next(new ErrorNotFound('Пользователь с указанным _id не найден'));
      }
      if (err.code === 11000) {
        return next(new ErrorConflict('Пользователь с указаным email уже существует'));
      }
      return next(err);
    });
};
