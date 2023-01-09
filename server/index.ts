import { readFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer, ViteDevServer } from 'vite';
import { config } from "dotenv";
import { createConnection } from "mysql2/promise";
import { initDB, getApiRoute } from './functions.js';
import { join } from "path";
import { mkdir } from "fs/promises";

import signUpRouter from './routes/signUp.js';
import loginRouter from './routes/login.js';
import managerRouter from './routes/manager.js';

config();

const {
    NODE_ENV,
    HOST = "localhost",
    PORT = 3000,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD
} = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));

process.on("SIGHUP", () => {
    console.log("Process was ended");
});

async function createServer() {
    const app = express();

    app.disable("x-powered-by");

    let vite: ViteDevServer;

    if ( NODE_ENV !== "production" ) {
        vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'custom'
        });
    
        app.use(vite.middlewares);
    }

    app.use(getApiRoute("/sign up"), signUpRouter);
    app.use(getApiRoute("/login"), loginRouter);
    app.use(getApiRoute("/manager"), managerRouter)

    app.use('*', async (req, res, next) => {
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
                const module = await import("/src/entry-server.js");
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