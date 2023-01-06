import { isProxy, toRaw, unref } from "vue";

export function updateValue(event: Event, $emit: (e: any, ...args: any[]) => void) {
    const element = event.currentTarget as HTMLInputElement;
    const type = element.getAttribute("name");

    switch(type) {
        case "email":
            $emit("update:email", element.value);
            break;
        case "password":
            $emit("update:password", element.value);
            break;
        case "isRemembered":
            $emit("update:isRemembered", element.checked);
            break;
        case "username":
            $emit("update:username", element.value);
            break;
        case "tel":
            $emit("update:tel", element.value);
            break;
    }
}

export function transformRequestBody(data: any) {
    if ( data instanceof Object ) {
        if ( isProxy(data) ) data = toRaw(data); 

        const decodedData = {} as { [key: string]: any };

        for ( let [ key, value ] of Object.entries(data) ) {
            decodedData[key] = typeof value === "string" ? decodeURIComponent(value) : value;
        }

        return JSON.stringify(decodedData);
    }

    return unref(data);
}

export function overElement(event: Event, ...classList: string[]) {
    const element = event.currentTarget as HTMLDivElement;
    const type = event.type.toLowerCase();
    const className = classList.join(" ");

    switch(type) {
        case "pointerenter":
            element.classList.add(className);
            break;
        case "pointerleave":
            element.classList.remove(className);
            break;
    }
}

export function truthyObjectItems<ObjectType extends Object>(obj: ObjectType, ...keys: (keyof ObjectType)[]): boolean {
    let result = true;

    if ( isProxy(obj) ) obj = toRaw(obj);

    for ( let key in obj ) {
        if ( keys.includes(key) && result ) {
            result = !!obj[key];
        }
    }

    return result;
}