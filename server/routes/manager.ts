import { Router, json } from "express";
import type { AppLocals, SignUpData, AddedFile, AddProfileImageRequestBody } from "../../data-types";
import { createResponse, setCookies, ValuesValidator, ValueValidator, getFileSize, handlersWrapper } from "../functions.js";
import { getDateTime, getRandomId, normalizeBase64 } from "../../functions.js";
import { readFile, readdir, writeFile, stat, rm } from "fs/promises";
import { join, parse } from "path";

const managerRouter = Router();

const jsonParser = json({
    limit: "10mb"
});

const documents = join(process.cwd(), "server/documents");

managerRouter.get(encodeURI("/:id/check user"), ...handlersWrapper(
    async (req, res) => {
        const { id: userId, username, email, tel, password } = req.query as unknown as SignUpData;

        let { id: paramId } = req.params;

        if ( +paramId != userId ) throw new Error("Wrong id");

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

        const [ users ] = await connection.execute<any[]>(
            `
                SELECT isProfileImg FROM users
                WHERE id = ? and username = ? and email = ? and tel = ? and password = ?
            `,
            [ userId, username, email, tel, password ]
        );

        if ( users.length === 0 ) throw new Error("Failed MySQL request");

        const { isProfileImg } = users[0] as Pick<SignUpData, "isProfileImg">;

        let profileImg = "";

        if ( isProfileImg ) {
            const pathToUsersDocuments = join(documents, `user-${userId}`);

            const files = await readdir(pathToUsersDocuments);

            for ( let i = 0; i < files.length; i++ ) {
                const { name } = parse(files[i]);

                if ( name.toLowerCase() === "profile") {
                    const pathToProfileImg = join(pathToUsersDocuments, files[i]);
                    profileImg = await readFile(pathToProfileImg, { encoding: "base64" });
                    profileImg = normalizeBase64(profileImg);
                    break;
                }
            }
        }

        setCookies(res, {
            id: userId,
            username,
            email,
            tel,
            password
        });

        res.json(
            createResponse("success", {
                text: "User was confirmed",
                profileImg
            })
        );
    }
));

managerRouter.patch(encodeURI("/:id/add profile image"), jsonParser, ...handlersWrapper(
    async (req, res) => {
        const { profileImg, name } = req.body as AddProfileImageRequestBody;
        const { id } = req.params;

        const validator = new ValueValidator(profileImg);

        validator.type("string");

        const result = validator.getResult();

        if ( !result ) throw new Error("Img`s string failed validation");

        const { ext } = parse(name);
        const pathToProfileImg = join(documents, `user-${id}`, `profile${ext}`);

        const bufferProfileImg = Buffer.from(profileImg, "base64");

        await writeFile(pathToProfileImg, bufferProfileImg);

        const loadedProfileImg = await readFile(pathToProfileImg, { encoding: "base64" });

        const { connection } = req.app.locals as AppLocals;

        await connection.execute(
            `
                UPDATE users
                SET isProfileImg = ?
                WHERE id = ?
            `,
            [ true, id ]
        );

        res.json(
            createResponse("success", loadedProfileImg)
        );
    }
));

managerRouter.post(encodeURI("/:id/add file"), jsonParser, ...handlersWrapper(
    async (req, res) => {
        let { content, name, type } = req.body as Pick<AddedFile, "name" | "type" | "size"> & {
            content: string;
            type: string
        };
        const { id } = req.params;

        const pathToUsersDocuments = join(documents, `user-${id}`);

        if ( /^profile/i.test(name) ) {
            await (async function changeName() {
                const randomId = getRandomId(6);

                let files = await readdir(pathToUsersDocuments);
                files = files.filter(file => new RegExp(`${randomId}`).test(file));

                if ( files.length === 0 ) {
                    const { name: filename, ext } = parse(name);
                    name = `${filename}-${randomId}${ext}`
                } else {
                    await changeName();
                }
            })();
        }

        const pathToNewFile = join(pathToUsersDocuments, name);

        let encoding: BufferEncoding;

        if ( /^image/.test(type) ) encoding = "base64"
        else if ( /^text/.test(type) ) encoding = "utf-8";
        else throw new Error("Unsupported file`s type");

        await writeFile(pathToNewFile, content, { encoding });

        const { size, birthtimeMs } = await stat(pathToNewFile);

        const transformedSize = getFileSize(+size, "byte", "kbyte", 3);

        const dateTime = getDateTime(birthtimeMs);

        const { connection } = req.app.locals as AppLocals;

        await connection.execute(
            `
                INSERT INTO documents (name, type, size, userId, added)
                VALUES (?, ?, ?, ?, ?)
            `,
            [ name, type, transformedSize, id, dateTime ]
        );

        const [ addedFiles ] = await connection.execute<any[]>(
            `
                SELECT * from documents
                WHERE userId = ?
                ORDER BY id DESC
                LIMIT 1
            `,
            [ id ]
        );

        const lastAddedFile = addedFiles[0] as AddedFile;

        if ( !lastAddedFile ) throw new Error("Now added file was not defined");

        res.json(
            createResponse("success", lastAddedFile)
        );
    }
));

managerRouter.get(encodeURI("/:id/get all files"), ...handlersWrapper(
    async (req, res) => {
        const { id } = req.params;
        const { connection } = req.app.locals as AppLocals;

        const [ files ] = await connection.execute(
            `
                SELECT * FROM documents
                WHERE userId = ?
            `,
            [ id ]
        );

        res.json(
            createResponse("success", files)
        );
    }
));

managerRouter.get(encodeURI("/:id/download file"), ...handlersWrapper(
    async (req, res) => {
        const { id } = req.query as Pick<AddedFile, "id">;
        const { id: userId } = req.params;
        const { connection } = req.app.locals as AppLocals;

        const [ files ] = await connection.execute<any[]>(
            `
                SELECT type, name FROM documents
                WHERE id = ? and userId = ?
            `,
            [ id, userId ]
        );

        const { type, name } = files[0] as Pick<AddedFile, "type" | "name">;

        if ( !type || !name ) throw new Error("This document does not exist");

        const pathToFile = join(documents, `user-${userId}`, name);

        let encoding: BufferEncoding;

        if ( /^image/.test(type) ) encoding = "base64"
        else if ( /^text/.test(type) ) encoding = "utf-8";
        else throw new Error("Unsupported file`s type");

        const content = await readFile(pathToFile, { encoding });

        res.json(
            createResponse("success", {
                name,
                type,
                content
            })
        );
    }
));

managerRouter.delete(encodeURI("/:userId/delete file"), ...handlersWrapper(
    async (req, res) => {
        const { id } = req.query as Pick<AddedFile, "id">;
        const { userId } = req.params as Pick<AddedFile, "userId">;

        const { connection } = req.app.locals as AppLocals;

        const [ files ] = await connection.execute<any[]>(
            `
                SELECT name FROM documents
                WHERE userId = ? and id = ?
            `,
            [ userId, id ]
        );

        const { name } = files[0] as Pick<AddedFile, "name">;

        const pathToDeleteFile = join(documents, `user-${userId}`, name);

        await rm(pathToDeleteFile);

        await connection.execute(
            `
                DELETE FROM documents
                WHERE userId = ? and id = ?
            `,
            [ userId, id ]
        );

        res.json(
            createResponse("success", "Document was deleted")
        );
    }
));

export default managerRouter;