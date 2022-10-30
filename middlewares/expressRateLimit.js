const rateLimit = require('express-rate-limit');

module.exports.limit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничить каждый IP до 100 запросов на `окно` (здесь за 15 минут)
  message: { message: 'Запросы, поступившие с вашего IP-адреса, похожи на автоматические. Попробуйте повторить попытку позже' },
});
