const WebSocket = require('ws')
const HOST = '0.0.0.0'
const PORT = 8080

// web socket server
const wss = new WebSocket.Server({
  host: HOST,
  port: PORT
})

let wssInstance;

/**
 * Методы
 */

/**
 * Обработка ошибки
 */
const onError = (...msg) => {
  throw new Error(msg)
}

/**
 * Подготовка данных к пересылке
 */
const serialize = data => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    onError('Функция serialize: ошибка сериализации в строку', error)
  }
}

/**
 * Десериализация, расшифровка данных от клиента
 */
const deserialize = data => {
  try {
    return JSON.parse(data)
  } catch (error) {
    onError('Функция deserialize: ошибка разбора строки', error)
  }
}

/**
 * Обработчик соединения с сокетом
 */
const onConnection = instance => {
  // store socket instance
  wssInstance = instance

  // init controllers and logic
  initCtrl(instance)

  // send greetings to client
  sendToClient({
    cmd: 'register',
    payload: `connect to server ${HOST}:${PORT} is successful`
  })
}

/**
 * Обработчик полученных данных
 */
const onMessage = msg => {
  try {
    const { cmd, payload } = deserialize(msg)

    // Если есть команда, для обработки, начинаем
    if (cmd) {
      cmdCtrl({ cmd, payload })
    } else {
      onError('Функция onMessage: нет команды для обработки')
    }
  } catch (error) {
    onError('Функция onMessage: ошибка разбора данных клиента', error)
  }
}

/**
 * Контроллер команд
 */
const cmdCtrl = ({ cmd, payload }) => {
  switch (cmd) {
    case 'register': {
      console.log(`Пользователь ${payload.user.username} подключился к серверу`)
      break
    }
    case 'info': {
      console.log(`Информация от клиента.\n${payload}`)
      break
    }
    case 'update': {
      console.log(`Обновляем ${JSON.stringify(payload)}`)
      sendToClient({
        cmd: 'info',
        payload: 'Данные получены, спасибо.'
      })
      break
    }
    default: {
      console.log('Команда ' + cmd)
      console.log('Данные ' + JSON.stringify(payload))
    }
  }
}

/**
 * Инициализация упрвляющего кода
 */
const initCtrl = instance => {
  // Подписываемся на получение уведомлений
  instance.on('message', onMessage)
}

/**
 * Отправка сообщения клиенту
 */
const sendToClient = param => {
  let { cmd, payload } = param

  if (wssInstance) {
    if (cmd && payload) {
      wssInstance.send(
        serialize({
          cmd,
          payload
        })
      )
    } else {
      onError('Функция sendToClient: не передана команда cmd и данные payload')
    }
  } else {
    onError('Функция sendToClient: Инстанс сервера веб сокетов не существует')
  }
}


/**
 * Подписываемся на события
 */
wss.on('connection', onConnection)

// Сервисное сообщение о запуске сервера
console.log(`server ${HOST}:${PORT} is running`)
