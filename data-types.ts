import type { Connection } from "mysql2/promise";

export interface SignUpData {
    username: string;
    email: string;
    tel: string;
    password: string;
    isProfileImg: boolean;
}

export interface LoginData {
    email: string;
    password: string;
    isRemembered: boolean;
}

export interface AppLocals {
    connection: Connection;
}

export interface CustomResponse<MessageType = any> {
    status: "success" | "fail",
    message: MessageType;
}

export type IValidatorType = "string" | "number" | "boolean" | "object" | "array" | "null" | "undefined";

export interface INotification {
    id: number;
    status: "none" | "inf" | "success" | "warning" | "fail";
    title: string;
    description?: string;
}

export type ServerVersion<Type> = { id: string } & Type;

export type ClientVersion<Type> = { userId: string } & Type;

export interface AddedFile {
    id: string;
    userId: string;
    name: string;
    type: string;
    size: string;
    added: string;
}

export type FileSizeType = "bit" | "byte" | "kbyte" | "mbyte";

export type Theme = "light" | "dark";

export type Cursor = "default" | "pointer" | "grabbing"; 

export type DarkTheme = "default" | "section";

export interface CheckUserResponse {
    text: string;
    profileImg: string;
}

export interface DownloadFileResponse {
    name: string;
    type: string;
    content: string;
}

export interface AddProfileImageRequestBody {
    profileImg: string;
    name: string;
}