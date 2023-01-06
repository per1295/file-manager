import { renderToString } from "vue/server-renderer";
import SSRApp from "../general";

export async function render() {
    const ctx = {};
    const appHTML = await renderToString(SSRApp, ctx);

    return appHTML;
}