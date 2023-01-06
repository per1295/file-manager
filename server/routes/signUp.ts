import { Router, json } from "express";
import type { SignUpData, AppLocals, ServerVersion } from "../../data-types.js";
import { createResponse, setCookies, ValuesValidator } from "../functions.js";
import { getDateTime } from "../../functions.js";

const signUpRouter = Router();

const jsonParser = json();

signUpRouter.post(encodeURI("/user data"), jsonParser, async (req, res) => {
    try {
        let { username, email, tel, password } = req.body as SignUpData;

        const validator = new ValuesValidator({
            username,
            email,
            tel,
            password
        });

        const {
            usernameValidator,
            emailValidator,
            telValidator,
            passwordValidator
        } = validator;

        usernameValidator.type("string").gte(1).lte(10);
        emailValidator.type("string").gte(5).lte(50);
        telValidator.type("string").gte(10).lte(15);
        passwordValidator.type("string").gte(10).lte(50);

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
                WHERE username = ? or email = ? or tel = ?
            `,
            [ username, email, tel ]
        );

        if ( existUsers.length > 0 ) throw new Error("This user already exists");

        const dateTime = getDateTime();

        await connection.execute(
            `
                INSERT INTO users (username, email, tel, password, created)
                VALUES (?, ?, ?, ?, ?)
            `,
            [ username, email, tel, password, dateTime ]
        );

        const [ updateExistUsers ] = await connection.execute<any[]>(
            `
                SELECT id from users
                WHERE username = ? and email = ? and tel = ?
            `,
            [ username, email, tel ]
        );

        const newUser = updateExistUsers[0] as ServerVersion<SignUpData>;

        const { id } = newUser;

        setCookies(res, {
            userId: id,
            username,
            email,
            tel,
            password
        });

        res
            .status(200)
            .json(
                createResponse("success", "Your registration was successful")
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

export default signUpRouter;