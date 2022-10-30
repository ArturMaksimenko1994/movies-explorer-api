const userRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  getUserInfo,
  updatesUserInfo,
} = require('../controllers/users');

userRouter.get('/me', getUserInfo);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().min(2).max(30),
  }),
}), updatesUserInfo);

module.exports = userRouter;
