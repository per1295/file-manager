import { Router, text, json } from "express";
import type { AppLocals, SignUpData, ClientVersion, AddedFile } from "../../data-types";
import { createResponse, setCookies, ValuesValidator, ValueValidator, getFileSize } from "../functions.js";
import { getDateTime } from "../../functions.js";
import { readdir, mkdir, writeFile } from "fs/promises";
import { join, parse } from "path";

const managerRouter = Router();

const textParser = text({
    limit: "10mb"
});

const jsonParser = json({
    limit: "10mb"
});

managerRouter.get(encodeURI("/:userId/check user"), async (req, res) => {
    try {
        const { userId: id, username, email, tel, password } = req.query as unknown as ClientVersion<SignUpData>;
        let { userId } = req.params as Pick<ClientVersion<SignUpData>, "userId">;
        
        if ( userId != id) throw new Error("Wrong userId");

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
                SELECT * FROM users
                WHERE id = ? and username = ? and email = ? and tel = ? and password = ?
            `,
            [ id, username, email, tel, password ]
        );

        if ( users.length === 0 ) throw new Error("Failed MySQL request");

        const { profileImg } = users[0] as SignUpData;

        setCookies(res, {
            userId,
            username,
            email,
            tel,
            password
        });

        res
            .status(200)
            .json(
                createResponse("success", {
                    text: "User was confirmed",
                    profileImg
                })
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

managerRouter.patch(encodeURI("/:userId/add profile image"), textParser, async (req, res) => {
    try {
        const profileImg = req.body as string;
        const { userId } = req.params;

        const validator = new ValueValidator(profileImg);

        validator.type("string");

        const result = validator.getResult();

        if ( !result ) throw new Error("Img`s string failed validation");

        const { connection } = req.app.locals as AppLocals;

        await connection.execute(
            `
                UPDATE users
                SET profileImg = ?
                WHERE id = ?
            `,
            [ profileImg, userId ]
        );

        res
            .status(200)
            .json(
                createResponse("success", profileImg)
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

managerRouter.post(encodeURI("/:userId/add file"), jsonParser, async (req, res) => {
    try {
        let { content, name, type, size } = req.body as Pick<AddedFile, "content" | "name" | "type" | "size">;
        const { userId } = req.params as Pick<AddedFile, "userId">;
        
        const dateTime = getDateTime();
        size = getFileSize(+size, "byte", "kbyte", 3);

        const { connection } = req.app.locals as AppLocals;

        await connection.execute(
            `
                INSERT INTO documents (content, name, type, size, userId, added)
                VALUES (?, ?, ?, ?, ?, ?)
            `,
            [ content, name, type, size, userId, dateTime ]
        );

        const [ addedFiles ] = await connection.execute<any[]>(
            `
                SELECT * from documents
                WHERE userId = ?
                ORDER BY id DESC
                LIMIT 1
            `,
            [ userId ]
        );

        const lastAddedFile = addedFiles[0] as AddedFile;

        if ( !lastAddedFile ) throw new Error("Now added file was not defined");

        res
            .status(200)
            .json(
                createResponse("success", lastAddedFile)
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

managerRouter.get(encodeURI("/:userId/get all files"), async (req, res) => {
    try {
        const { userId } = req.params as Pick<AddedFile, "userId">;
        const { connection } = req.app.locals as AppLocals;

        const [ files ] = await connection.execute(
            `
                SELECT * FROM documents
                WHERE userId = ?
            `,
            [ userId ]
        );

        res
            .status(200)
            .json(
                createResponse("success", files)
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

managerRouter.get(encodeURI("/:userId/download file"), async (req, res) => {
    try {
        const { id } = req.query as Pick<AddedFile, "id">;
        const { userId } = req.params as Pick<AddedFile, "userId">;
        const { connection } = req.app.locals as AppLocals;

        const [ files ] = await connection.execute<any[]>(
            `
                SELECT content, type, name, userId FROM documents
                WHERE id = ? and userId = ?
            `,
            [ id, userId ]
        );

        const { content, type, name, userId: userIdDoc } = files[0] as Pick<AddedFile, "content" | "type" | "name" | "userId">;

        if ( !content || !type || !name ) throw new Error("This document does not exist");

        const pathToFilesDir = join(process.cwd(), "server/documents", userIdDoc);
        const pathToFile = join(pathToFilesDir, name);
        
        await mkdir(pathToFilesDir, { recursive: true });

        const dirFiles = await readdir(pathToFilesDir);

        dirFiles.forEach(async file => {
            const { base } = parse(file);

            if ( base.toLowerCase() === name.toLowerCase() ) res.sendFile(pathToFile);
        });

        if ( /^text/.test(type) ) {
            await writeFile(pathToFile, content, { encoding: "utf-8" });
        } else if ( /^image/.test(type) ) {
            await writeFile(pathToFile, Buffer.from(content));
        } else {
            throw new Error("Unsupported file`s type");
        }

        res.sendFile(pathToFile);
    } catch (error) {
        console.log(error);
        
        res
            .status(404)
            .json(
                createResponse("fail", "Failed request")
            );
    }
});

managerRouter.delete(encodeURI("/:userId/delete file"), async (req, res) => {
    try {
        const { id } = req.query as Pick<AddedFile, "id">;

        const { connection } = req.app.locals as AppLocals;

        await connection.execute(
            `
                DELETE FROM documents
                WHERE id = ?
            `,
            [ id ]
        );

        res
            .status(200)
            .json(
                createResponse("success", "Document was deleted")
            );
    } catch (error) {
        
    }
});

export default managerRouter;