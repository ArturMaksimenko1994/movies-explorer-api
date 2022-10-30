require('dotenv').config(); // подключение ENV
const express = require('express'); // подключение express
const helmet = require('helmet'); // подключение Helmet
const mongoose = require('mongoose'); // подключение mongoose
const bodyParser = require('body-parser'); // подключение body-parser
const { errors } = require('celebrate'); // подключение celebrate

const { limit } = require('./middlewares/expressRateLimit'); // limit
const router = require('./routes/index'); // routes
const ErrorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');

const app = express(); // создаем сервер
const { PORT, DB_ADDRESS } = require('./congfig');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_ADDRESS);// подключаемся к серверу mongo

app.use(cors); // CORS запросы
app.use(requestLogger); // подключаем логгер запросов
app.use(helmet()); // Helmet для установки заголовков, связанных с безопасностью
app.use(limit); // для ограничения повторных запросов API
app.use('/', router); // подключение всех роутов приложения

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());// обработчик ошибок celebrate
app.use(ErrorHandler); // обрабатываем все ошибки

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт ${PORT}`); // порт приложение слушает
});
