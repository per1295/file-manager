import type { Connection } from "mysql2/promise";
import type { CustomResponse, IValidatorType, FileSizeType } from "../data-types.js";
import type { Response, CookieOptions } from "express";

export async function initDB(connection: Connection) {
    await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(10) UNIQUE NOT NULL,
            email VARCHAR(50) UNIQUE NOT NULL,
            tel VARCHAR(15) UNIQUE NOT NULL,
            password VARCHAR(50) NOT NULL,
            created DATETIME NOT NULL,
            profileImg LONGTEXT NULL
        )
    `);

    await connection.execute(`
       CREATE TABLE IF NOT EXISTS documents (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            content LONGTEXT NOT NULL,
            name VARCHAR(15) UNIQUE NOT NULL,
            type TEXT NOT NULL,
            size TEXT NOT NULL,
            added DATETIME NOT NULL
       )  
    `);
}

export function getApiRoute(path: string) {
    return encodeURI(`/api${path}`);
}

export function createResponse(status: "success" | "fail", message: any): Readonly<CustomResponse> {
    const response = Object.freeze({
        status,
        message
    });

    return response;
}

export function setCookies(res: Response, objCookies: { [key: string]: any }, customOptions?: CookieOptions) {
    const cookieOptions = {
        expires: new Date(Date.now() + 8.64e7) 
    };

    for ( let [ key, value ] of Object.entries(objCookies) ) {
        res.cookie(key, value, customOptions ?? cookieOptions);
    }
}

export class ValueValidator {
    private result = true;

    protected get _result() {
        if ( typeof this._type === "undefined" ) throw new TypeError(`Type of ${this.value} should be defined`);

        return this.result;
    }

    protected set _result(value: boolean) {
        if ( this.result ) {
            this.result = value;
        }
    }

    protected _type?: IValidatorType | undefined;

    constructor(
        public value: any
    ) {}

    public type(type: IValidatorType) {
        this._type = type;

        switch(type) {
            case "string":
                this._result = typeof this.value === type && this.value;
                break;
            case "number":
            case "boolean":
                this._result = typeof this.value === type;
                break;
            case "object":
                this._result = this.value instanceof Object;
                break
            case "array":
                this._result = Array.isArray(this.value);
                break;
            case "null":
                this._result = this.value === null;
                break;
            case "undefined":
                this._result = this.value === undefined
                break;
        }

        return this;
    }

    public lt(value: number) {
        if ( this._type !== "number" && this._type !== "string" ) {
            throw new TypeError(`${this.value} should be number or string`);
        };

        if ( this._type === "number" ) {
            this._result = this.value < value;
        } else {
            this._result = this.value.length < value;
        }

        return this;
    }

    public lte(value: number) {
        if ( this._type !== "number" && this._type !== "string" ) {
            throw new TypeError(`${this.value} should be number or string`);
        };

        if ( this._type === "number" ) {
            this._result = this.value <= value;
        } else {
            this._result = this.value.length <= value;
        }

        return this;
    }

    public gt(value: number) {
        if ( this._type !== "number" && this._type !== "string" ) {
            throw new TypeError(`${this.value} should be number or string`);
        };

        if ( this._type === "number" ) {
            this._result = this.value > value;
        } else {
            this._result = this.value.length > value;
        }

        return this;
    }

    public gte(value: number) {
        if ( this._type !== "number" && this._type !== "string" ) {
            throw new TypeError(`${this.value} should be number or string`);
        };

        if ( this._type === "number" ) {
            this._result = this.value >= value;
        } else {
            this._result = this.value.length >= value;
        }

        return this;
    }

    public length(value: number) {
        if ( this._type !== "array" && this._type !== "string" ) {
            throw new TypeError(`${this.value} should be array or string`);
        }

        this._result = this.value.length === value;

        return this;
    }

    public has(values: any[]) {
        if ( this._type !== "object" ) throw new TypeError(`${this.value} should be a object`);

        for ( let i = 0; i < values.length; i++ ) {
            this._result = this.value.hasOwnProperty(values[i]);
            if ( !this._result ) break;
        }

        return this;
    }

    public includes(values: any | any[]) {
        if ( this._type !== "array" && this._type !== "string" ) {
            throw new TypeError(`${this.value} should be array or string`);
        }

        for ( let i = 0; i < values.length; i++ ) {
            this._result = this.value.includes(values[i]);
            if ( !this._result ) break;
        }

        return this;
    }

    public getResult() {
        return this._result;
    }
}

export class ValuesValidator {
    [ key: `${string}Validator` ]: ValueValidator;

    constructor(values: { [key: string]: any }) {
        for ( let [ key, value ] of Object.entries(values) ) {
            this[`${key}Validator`] = new ValueValidator(value);
        } 
    }

    getAllResults() {
        const result = {} as { [ key: string ]: boolean }

        for ( let [ key, value ] of Object.entries(this) ) {
            if ( value instanceof ValueValidator ) {
                result[key] = value.getResult();
            }
        }

        return result;
    }
}

export function getFileSize(size: number, enterType: FileSizeType, outputType: FileSizeType, fix = 0): string {
    switch(enterType) {
        case "bit":
            switch(outputType) {
                case "byte":
                    size *= 1.25e-1;
                    break;
                case "kbyte":
                    size *= 1.25e-4;
                    break;
                case "mbyte":
                    size *= 1.25e-7
                    break;
            }
            break;
        case "byte":
            switch(outputType) {
                case "bit":
                    size *= 8;
                    break;
                case "kbyte":
                    size *= 1e-3;
                    break;
                case "mbyte":
                    size *= 1e-6;
                    break;
            }
            break;
        case "kbyte":
            switch(outputType) {
                case "bit":
                    size *= 8e3;
                    break;
                case "byte":
                    size *= 1e3;
                    break;
                case "mbyte":
                    size *= 1e-3;
                    break;
            }
            break;
        case "mbyte":
            switch(outputType) {
                case "bit":
                    size *= 8e6
                    break;
                case "byte":
                    size *= 1e6
                    break;
                case "kbyte":
                    size *= 1e3;
                    break;
            }
            break;
    }

    return `${size.toFixed(fix)}${outputType}`;
}