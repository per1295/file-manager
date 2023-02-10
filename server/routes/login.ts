import { Router, json } from "express";
import { ValuesValidator, createResponse, setCookies, handlersWrapper } from "../functions.js";
import type { LoginData, AppLocals, SignUpData } from "../../data-types.js";
import { join } from "path";
import { mkdir } from "fs/promises";

const loginRouter = Router();

const jsonParser = json();

const documents = join(process.cwd(), "server/documents");

loginRouter.post(encodeURI("/user data"), jsonParser, ...handlersWrapper(
    async (req, res) => {
        const { email, password, isRemembered } = req.body as LoginData;

        const validator = new ValuesValidator({
            email,
            password,
            isRemembered
        });

        const { emailValidator, passwordValidator, isRememberedValidator } = validator;

        emailValidator.type("string").gte(5).lte(50);
        passwordValidator.type("string").gte(10).lte(50);
        isRememberedValidator.type("boolean");

        const results = validator.getAllResults();

        const failedKeys = Object
            .entries(results)
            .filter(([ _key, result ]) => !result)
            .map(([ key ]) => key);

        if ( failedKeys.length > 0 ) throw new Error(`${failedKeys.join(", ")} failed validation`);

        const { connection } = req.app.locals as AppLocals;

        const [ existUsers ] = await connection.execute<any[]>(
            `
                SELECT * from users
                WHERE email = ? and password = ?
            `,
            [ email, password ]
        );

        if ( existUsers.length === 0 ) {
            return res.json(
                createResponse("fail", "Email does not exists")
            );
        }

        const existsUser = existUsers[0] as SignUpData;
        const { id, username, tel } = existsUser;

        const pathToUsersDocuments = join(documents, `user-${id}`);

        await mkdir(pathToUsersDocuments, { recursive: true });

        const cookieObj = {
            id,
            username,
            email,
            tel,
            password
        };

        if ( isRemembered ) setCookies(res, cookieObj);
        else setCookies(res, cookieObj, {});

        res.json(
            createResponse("success", "Your login was successful")
        );
    }
));

export default loginRouter;