require('dotenv').config(); // подключение ENV
const express = require('express'); // подключение express
const mongoose = require('mongoose'); // подключение mongoose
const bodyParser = require('body-parser'); // подключение body-parser
const { errors } = require('celebrate'); // подключение celebrate

const router = require('./routes/index'); // routes
const ErrorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const app = express(); // создаем сервер
const { PORT = 3000 } = process.env; // слушаем 3000 порт

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');// подключаемся к серверу mongo

app.use(cors); // CORS запросы
app.use(requestLogger); // подключаем логгер запросов

app.use('/', router); // подключение всех роутов приложения

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());// обработчик ошибок celebrate
app.use(ErrorHandler); // обрабатываем все ошибки

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт ${PORT}`); // порт приложение слушает
});
