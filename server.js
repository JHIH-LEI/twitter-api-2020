const jwt = require('jsonwebtoken')
const db = require('./models')
const { User, Room, Message } = db

module.exports = (io) => {
  const public = io.of('/public')

  // 使用者驗證,並拿到user資料
  public.use((socket, next) => {
    if (socket.handshake.auth.token) {
      jwt.verify(socket.handshake.auth.token, process.env.TOKEN_SECRET, async (err, decoded) => {
        // decoded會拿到登入user的id
        const id = decoded.id
        if (err) return next(new Error('請先登入在使用'));
        socket.decoded = decoded;
        const user = await User.findOne({
          attributes: ['id', 'avatar', 'name', 'account'],
          where: { id }
        })
        // 將登入者存到socket.request中
        socket.request.user = user.toJSON()
        next();
      });
    }
    else {
      next(new Error('請先登入在使用'));
    }
  })
    .on('connection', async (socket) => {
      try {
        const user = socket.request.user
        user.socketId = socket.id

        socket.join('public')
        publicRoom = public.to('public')

        // 更新歷史訊息
        const messages = await Message.findAll({
          raw: true, nest: true,
          attributes: ['content', 'createdAt'],
          where: { RoomId: 1 },
          include: {
            model: User,
            attributes: ['id', 'avatar']
          },
          order: [['createdAt', 'ASC']]
        })
        publicRoom.emit('history', messages)

        publicRoom.emit('connection', `${user.name} 上線`)

        // 事件監聽
        socket.on('send message', async obj => {
          try {
            obj.user = user
            // 加入到歷史訊息
            await Message.create({
              content: obj.message,
              RoomId: 1,
              UserId: user.id
            })
            publicRoom.emit('updated message', obj)
          } catch (err) {
            console.warn(err)
          }
        })

        socket.on('disconnect', async () => {
          socket.leave("public")
          publicRoom.emit('connection', `${user.name} 離線`)
        })
      } catch (err) {
        console.warn(err)
      }
    })
}