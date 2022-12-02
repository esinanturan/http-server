/*
 * @adonisjs/http-server
 *
 * (c) AdonisJS
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import proxyaddr from 'proxy-addr'
import { createServer } from 'node:http'
import Encryption from '@adonisjs/encryption'
import { Application } from '@adonisjs/application'

import { Server } from '../src/server/main.js'

const app = new Application(new URL('./', import.meta.url), { environment: 'web' })
await app.init()

const encryption = new Encryption({ secret: 'averylongrandom32charslongsecret' })

const server = new Server(app, encryption, {
  etag: false,
  jsonpCallbackName: 'callback',
  cookie: {},
  subdomainOffset: 2,
  generateRequestId: false,
  trustProxy: proxyaddr.compile('loopback'),
  allowMethodSpoofing: false,
})

server.use([], [], {})

server.router!.get('/', async (ctx) => {
  return ctx.response.send({ hello: 'world' })
})
await server.boot()

createServer(server.handle.bind(server)).listen(4000, () => {
  console.log('listening on 4000')
})