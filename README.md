# RSSchool NodeJS websocket task template

> Static http server and base task packages.
> By default WebSocket client tries to connect to the 3000 port.

## Installation

1. Clone/download repo
2. `npm install`

## Usage

**Development**

`npm run start:dev`

- App served @ `http://localhost:8181` with `tsx` in watch mode

**Production**

`npm run start:prod`

- App served @ `http://localhost:8181` in prod mode after build

`npm run start:build`

- Run `build` and start app served @ `http://localhost:8181` in prod mode

---

**All commands**

| Command               | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `npm run start:dev`   | App served @ `http://localhost:8181` with `tsx` in watch mode           |
| `npm run start:prod`  | App served @ `http://localhost:8181` in prod mode after build           |
| `npm run start:build` | Run `build` and start app served @ `http://localhost:8181` in prod mode |
| `npm run build`       | Transpile TypeScript to JavaScript in the dist folder                   |
| `npm run lint`        | Run ESLint with Prettier plugin to check .ts files                      |
| `npm run lint:fix`    | Run ESLint with Prettier plugin to check and fix .ts files              |
| `npm run format`      | Format code with Prettier                                               |

**Note**: replace `npm` with `yarn` in `package.json` if you use yarn.
