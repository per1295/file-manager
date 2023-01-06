import { defineStore } from "pinia";
import { reactive } from "vue";

export default defineStore("user-data", () => {
    const userData = reactive<{ [ key: string ]: any }>({
        userId: "",
        username: "",
        email: "",
        tel: "",
        password: "",
        profileImg: null
    });

    const setUserData = (data: { [ key: string ]: any }, isNeedDecode = false) => {
        for ( let [ key, value ] of Object.entries(data) ) {
            userData[key] = isNeedDecode ? decodeURIComponent(value) : value;
        }
    }

    return {
        userData,
        setUserData
    }
});