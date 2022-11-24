//Faz a requisição das configurações das variáveis locais
require('dotenv').config();

/*
  1. Requisição do next.js para link com o app express
  2. Requisição do express.js
  3. Constante do protocolo http para efetuar a conversa de resposta e requisição com o servidor
  4. Requisição do conversor em JSON dos dados enviados pelo formulário de login
  5. Constante a ser usada para garantir a segurança na requisição de dados pela url
*/
const next = require('next');
const express = require("express");
const http = require("http");
//const cors = require('cors');

/*
  1. Requisição do módulo socket.io
  2. Requisição do método criar cliente da redis, banco de dados em memória
*/
const socket = require("socket.io");
const { createClient } = require('redis');

/*
  1. Requisição para criação de id aleatório dinamicamente
  2. Elemento para comparação e concatenação de dados
*/
const { v4 } = require('uuid');
const moment = require('moment');

/*
  1. Constante que estabelece a porta do navegador
  2. Constante que estabelece como modo de produção
*/
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

//Nova instância de um servidor socket.io
const io = new socket.Server();

//Instância que cria o cliente redis e passa a url chave de permissão que vem de uma variável na memória
const redisClient = createClient({
  url: process.env.REDIS_CLIENT
});

/*
  1. Conectando ao app Next
  2. Puxa as propriedades iniciais do app next
*/
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();


nextApp.prepare().then(async () => {
  /*
    1. Instância do app express
    2. Instância do servidor http
    3. Anexamos o servidor http ao servidor socket.io
    4. Instância da resposta json
    5. Instância dos protocolos de segurança de requisição ajax
  */
  const app = express();
  const server = http.createServer(app);
  io.attach(server);
  //app.use = (cors())
  app.use(express.json())
  //Mostra no console se houve erro ao conectar com o Redis banco de dados em memória
  redisClient.on('error', console.error)

  //Espera a promessa da conecção com o redis e retorna o status pelo console
  redisClient.connect()
    .then(() => console.log('Connected to redis '))
    .catch(() => {
      console.error('Error connecting to redis')
    })

  
  app.post('/api/join-room', async (req, res) => {
    console.log(req.body)
    /*
      1. Faz a requisição do username pelo formulário
      2. Faz a requisição do id enviado pelo formulário
    */
    const username = req.body.username
    const roomId = req.body.roomId

    // Verificamos se o parâmetro username existe e não está em branco
    /*if (!username || username === "") {
      return res.status(401).send({ error: true, message: "Nome de usuário não pode ficar em branco" })
    }*/

    /*
      Verifica a existência do roomId
      Cria um roomId com base no gerador de id, se o id tiver em branco
    */
    if (!roomId || roomId === "") {
      const roomId = v4()
      await redisClient.hSet(`${roomId}:info`, {
        created: new Date()
      })

      return res.status(200).send({ roomId })
    }

  })

  app.all('*', (req, res) => nextHandler(req, res));

  io.on('connection', (socket) => {
    socket.on('CODE_CHANGED', async (code) => {
      const { roomId, username } = await redisClient.hGetAll(socket.id)
      const roomName = `ROOM:${roomId}`
      // io.emit('CODE_CHANGED', code)
      socket.to(roomName).emit('CODE_CHANGED', code)
    })

    socket.on('DISSCONNECT_FROM_ROOM', async ({ roomId, username }) => { })

    socket.on('CONNECTED_TO_ROOM', async ({ roomId, username }) => {
      await redisClient.lPush(`${roomId}:users`, `${username}`)
      await redisClient.hSet(socket.id, { roomId, username })

      const users = await redisClient.lRange(`${roomId}:users`, 0, -1)
      const roomName = `ROOM:${roomId}`

      socket.join(roomName)
      socket.to(roomName).emit('ROOM:CONNECTION', users)
    })

    socket.on('disconnect', async () => {
      // TODO if 2 users have the same name
      const { roomId, username } = await redisClient.hGetAll(socket.id)
      const users = await redisClient.lRange(`${roomId}:users`, 0, -1)
      const newUsers = users.filter((user) => username !== user)

      if (newUsers.length) {
        await redisClient.del(`${roomId}:users`)
        await redisClient.lPush(`${roomId}:users`, newUsers)

      } else {
        await redisClient.del(`${roomId}:users`)
      }

      const roomName = `ROOM:${roomId}`
      io.in(roomName).emit('ROOM:CONNECTION', newUsers)

    })


  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});