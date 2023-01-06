declare module "*.vue" {
    import { defineComponent } from "vue";
    var app: ReturnType<typeof defineComponent>;
    export default app;
}

declare module "*.js";