import { readFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { config } from "dotenv";
import { createConnection } from "mysql2/promise";
import { initDB, getApiRoute, handlersWrapper, getArgsLikeObject } from './functions.js';
import { join } from "path";
import compression from "compression";
import cookie from "cookie-parser";
import { checkFields } from '../functions.js';
import type { AppLocals, SignUpData } from '../data-types.js';

import signUpRouter from './routes/signUp.js';
import loginRouter from './routes/login.js';
import managerRouter from './routes/manager.js';

config();

const {
    HOST = "localhost",
    PORT = 3000,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD
} = process.env;
const { NODE_ENV } = getArgsLikeObject();
console.log(NODE_ENV);
const __dirname = dirname(fileURLToPath(import.meta.url));
const client = join(process.cwd(), "dist", "client");

process.on("SIGHUP", () => {
    console.log("Process was ended");
});

const compressionParser = compression();
const cookieParser = cookie(undefined, {
    decode: decodeURIComponent
});

async function createServer() {
    const app = express();

    app.disable("x-powered-by");

    let vite: ViteDevServer;

    app.use(compressionParser);
    app.use(cookieParser);

    if ( NODE_ENV !== "production" ) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        });

        app.use(vite.middlewares);
    } else {
        app.use(
            express.static(client)
        );
    }

    app.use(getApiRoute("/sign up"), signUpRouter);
    app.use(getApiRoute("/login"), loginRouter);
    app.use(getApiRoute("/manager"), managerRouter)

    app.get(getApiRoute("/check user"), ...handlersWrapper(
        async (req, res) => {
            const { connection } = req.app.locals as AppLocals;
            const cookies = req.cookies as unknown as SignUpData;

            if ( !checkFields(cookies, "id", "username", "email", "tel", "password") ) return res.send("New user");

            const [ users ] = await connection.execute<any[]>(
                `
                    SELECT * FROM users
                    WHERE id = ? and username = ? and email = ? and tel = ? and password = ?
                    LIMIT 1
                `,
                [ cookies.id, cookies.username, cookies.email, cookies.tel, cookies.password ]
            );

            if ( !users.length ) res.send("New user");
            
            const user = users[0] as SignUpData;

            res.json(user);
        }
    ));

    app.use("*", async (req, res, next) => {
        const url = req.originalUrl;

        try {
            let pathToHTML: string;

            if ( NODE_ENV === "production" ) {
                pathToHTML = "dist/client/index.html";
            } else {
                pathToHTML = resolve(__dirname, '../index.html');
            }

            let template = await readFile(pathToHTML, 'utf-8');

            if ( NODE_ENV !== "production" ) template = await vite.transformIndexHtml(url, template);

            let render: any;

            if ( NODE_ENV === "production" ) {
                // @ts-ignore
                const module = await import("../dist/server/ssr.js");
                render = module?.render;
            } else {
                const module = await vite.ssrLoadModule('/server/ssr.ts');
                render = module?.render;
            }

            const appHtml = await render();

            const html = template.replace(`<!--ssr-outlet-->`, appHtml);

            res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
        } catch (e) {
            const error = e as Error;
            console.log(error);
            vite.ssrFixStacktrace(error);
            next(error);
        }
    })

    return app;
}

async function startApplication() {
    const connection = await createConnection({
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: "file_manager"
    });

    await initDB(connection);

    const pathToDocuments = join(process.cwd(), "server", "documents");

    await mkdir(pathToDocuments, { recursive: true });

    const app = await createServer();

    app.locals.connection = connection;

    app.listen(+PORT, HOST, () => {
        console.log(`Server is running on: http://${HOST}:${PORT}`);
    });
}

startApplication();