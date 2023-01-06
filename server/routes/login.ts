import { Router, json } from "express";
import { ValuesValidator, createResponse, setCookies } from "../functions.js";
import type { LoginData, AppLocals, SignUpData, ServerVersion } from "../../data-types.js";

const loginRouter = Router();

const jsonParser = json();

loginRouter.post(encodeURI("/user data"), jsonParser, async (req, res) => {
    try {
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
                WHERE email = ?
            `,
            [ email ]
        );

        if ( existUsers.length === 0 ) {
            return res
                .status(404)
                .json(
                    createResponse("fail", "Email does not exists")
                );
        }

        const existsUser = existUsers[0] as ServerVersion<SignUpData>;
        const { id, username, tel } = existsUser;

        if ( existsUser.password !== password ) {
            return res
                .status(404)
                .json(
                    createResponse("fail", "Wrong password")
                );
        }

        const cookieObj = {
            userId: id,
            username,
            email,
            tel,
            password
        };

        if ( isRemembered ) setCookies(res, cookieObj);
        else setCookies(res, cookieObj, {});

        res
            .status(200)
            .json(
                createResponse("success", "Your login was successful")
            );
    } catch (error) {
        console.log(error);
        
        res
            .status(404)
            .json(
                createResponse("fail", "Failed request")
            );
    }
});

export default loginRouter;