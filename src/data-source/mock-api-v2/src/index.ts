/**
 * Welcome to Cloudflare Workers! This is your first Durable Objects application.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your Durable Object in action
 * - Run `npm run deploy` to publish your application
 *
 * Learn more at https://developers.cloudflare.com/durable-objects
 */

/**
 * Associate bindings declared in wrangler.toml with the TypeScript type system
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

interface User {
	userId: string;
	username: string;
	webSocket: WebSocket | null;
	isConnected: boolean | null;
}

interface GameSession {
	gameId: string;
	creatorUserId: string;
	joinerUserId: string | null; // Initially null, set when another player joins
	price: number
	gameLink: string | null; // Set by the game creator
	status: string
}

interface InMemoryDB {
	users: Map<string, User>; // Keyed by userId
	gameSessions: Map<string, GameSession>; // Keyed by sessionId
}

/** A Durable Object's behavior is defined in an exported Javascript class */
export class MyDurableObject {
	/**
	 * The constructor is invoked once upon creation of the Durable Object, i.e. the first call to
	 * 	`DurableObjectStub::get` for a given identifier
	 *
	 * @param state - The interface for interacting with Durable Object state
	 * @param env - The interface to reference bindings declared in wrangler.toml
	 */
	state: DurableObjectState;
	db: InMemoryDB;
	users: Array<User>;

	constructor(state: DurableObjectState, env: Env) {
		this.state = state
		this.db = {
			users: new Map(),
			gameSessions: new Map()
		}
		this.users = [{userId: '1', username: 'many1', isConnected: null, webSocket: null}, {userId: '2', username: 'many2', isConnected: null, webSocket: null}]
		this.users.forEach((user) => {
			this.db.users.set(user.userId, user)
		})
	}

	/**
	 * The Durable Object fetch handler will be invoked when a Durable Object instance receives a
	 * 	request from a Worker via an associated stub
	 *
	 * @param request - The request submitted to a Durable Object instance from a Worker
	 * @returns The response to be sent back to the Worker
	 */
	async fetch(request: Request): Promise<Response> {
		if (request.url.endsWith('/websocket')) {
			const upgradeHeader = request.headers.get('Upgrade');
			if (!upgradeHeader || upgradeHeader !== 'websocket') {
				return new Response('Durable Object expected Upgrade: websocket', { status: 426 });
			}

			const webSocketPair = new WebSocketPair();
			const [client, server] = Object.values(webSocketPair);


			this.state.acceptWebSocket(server)

			console.log('Connect !')

			return new Response(null, {
				status: 101,
				webSocket: client,
			});

		}
		return new Response(`
This Durable Object supports the following endpoints:
  /websocket
    - Creates a WebSocket connection. Any messages sent to it are echoed with a prefix.
  /getCurrentConnections
    - A regular HTTP GET endpoint that returns the number of currently connected WebSocket clients.
`)
	}

	async webSocketMessage(ws: WebSocket, message: ArrayBuffer | string) {
		// Upon receiving a message from the client, reply with the same message,
		// but will prefix the message with "[Durable Object]: ".
		const msg = JSON.parse(message.toString())
		const { userId, username, isConnected } = msg.payload
		switch (msg.type) {
			case 'register':
				this.setUser(userId, username, isConnected, ws, msg)
				break;
			case 'create':
				const { price } = msg.payload
				if (this.isUserRegister(userId) && !this.isUserCreateGameSession(userId)) {
					this.setGameSession(userId, ws, msg, price)
				} else {
					console.log('User not exist and user already create  !')
				}
				break;
			case 'join':
				console.log('Request Join')
				const { gameId } = msg.payload
				if (this.db.gameSessions.get(gameId)) {
					this.setJoinerUserId(gameId, msg, ws)
				} else {
					console.log('Game not existing  !')
				}
				break;
			default:

				break;
		}
	}

	async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
		// If the client closes the connection, the runtime will invoke the webSocketClose() handler.
		console.log('Disconnect !')
		ws.close(code, "Durable Object is closing WebSocket");
	}

	guid(): string {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
			const v = c === 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	setUser(userId: string, username: string, isConnected: boolean, ws: WebSocket, msg: any) {
		try {
			const user: User = { userId: userId, username: username, webSocket: ws, isConnected: isConnected }
			this.db.users.set(userId, user)
			const data = {
				type: msg.type,
				payload: {
					isValid: true
				}
			}
			console.log(this.db.users)
			ws.send(JSON.stringify(data))
		} catch (e) {
			console.log(e)
			const data = {
				type: msg.type,
				payload: {
					isValid: false
				}
			}
			ws.send(JSON.stringify(data))
		}
	}

	setGameSession(userId: string, ws: WebSocket, msg: any, price: number) {
		const gameId = this.guid()
		try {
			const gameSession: GameSession = {
				gameId: gameId,
				creatorUserId: userId,
				joinerUserId: null,
				price: price,
				gameLink: null,
				status: 'waiting'
			}

			this.db.gameSessions.set(gameId, gameSession)

			const data = {
				type: msg.type,
				payload: {
					isValid: true,
					gameId: gameId
				}
			}
			ws.send(JSON.stringify(data))

		} catch (e) {
			console.log(e)
			const data = {
				type: msg.type,
				payload: {
					isValid: false,
					error: 'Error 002: Please contact support.'
				}
			}
			ws.send(JSON.stringify(data))
		}
	}

	setJoinerUserId(gameId: string, msg: any, ws: WebSocket) {
		try {
			const gamesession = this.db.gameSessions.get(gameId)
			if (gamesession && gamesession.joinerUserId == null && gamesession.status == 'waiting') {
				this.db.gameSessions.forEach((_gamesession) => {
					if (_gamesession.joinerUserId == null && _gamesession.status == 'waiting' && gamesession.gameId != _gamesession.gameId) {
						gamesession.joinerUserId = _gamesession.creatorUserId
						this.db.gameSessions.delete(_gamesession.gameId)
						gamesession.status = 'progress'
						console.log('Found !')
						this.isMatchFound(gameId, ws)
					}
				})
			} else {
				console.log('Game Session Not Found !')
				const data = {
					type: msg.type,
					payload: {
						isValid: false,
						error: 'Error 001: Please contact support.'
					}
				}
				ws.send(JSON.stringify(data))
			}
		} catch (e) {
			console.log(e)
			const data = {
				type: msg.type,
				payload: {
					isValid: false,
					error: 'Error 003: Please contact support.'
				}
			}
			ws.send(JSON.stringify(data))
		}
	}

	isMatchFound(gameId: string, ws: WebSocket) {

		const creator_data = {
			type: 'join',
			payload: {
				isValid: true,
				gameId: gameId,
				username_opponent: this.getUsername(this.db.gameSessions.get(gameId)?.joinerUserId),
				oppenentId: this.db.gameSessions.get(gameId)?.joinerUserId
			}
		}

		const joiner_data = {
			type: 'join',
			payload: {
				isValid: true,
				gameId: gameId,
				username_opponent: this.getUsername(this.db.gameSessions.get(gameId)?.creatorUserId),
				oppenentId: this.db.gameSessions.get(gameId)?.creatorUserId
			}
		}

		console.log(this.db.gameSessions)
		console.log(this.db.users)
		this.getWs(this.db.gameSessions.get(gameId)?.creatorUserId)?.send(JSON.stringify(creator_data))
		this.getWs(this.db.gameSessions.get(gameId)?.joinerUserId)?.send(JSON.stringify(joiner_data))

	}

	getUsername(userId: any) {
		return this.db.users.get(userId)?.username
	}

	getWs(userId: any) {
		return this.db.users.get(userId)?.webSocket
	}

	isUserRegister(userId: string) {
		const user = this.db.users.get(userId)
		if (user) {
			return true
		} else {
			return false
		}
	}

	isUserCreateGameSession(userId: string) {
		for (const gamesession in this.db.gameSessions) {
			if (this.db.gameSessions.get(gamesession)?.creatorUserId == userId) {
				return true
			}
		}

		return false
	}

}

// Worker
export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.toml
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// We will create a `DurableObjectId` using the pathname from the Worker request
		// This id refers to a unique instance of our 'MyDurableObject' class above
		let id: DurableObjectId = env.MY_DURABLE_OBJECT.idFromName(new URL(request.url).pathname);

		// This stub creates a communication channel with the Durable Object instance
		// The Durable Object constructor will be invoked upon the first call for a given id
		let stub: DurableObjectStub = env.MY_DURABLE_OBJECT.get(id);

		// We call `fetch()` on the stub to send a request to the Durable Object instance
		// The Durable Object instance will invoke its fetch handler to handle the request
		let response = await stub.fetch(request);

		return response;
	}, 
};
