import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import useFiles from "./useFiles";

export default defineStore("modal", () => {
    const modalFileData = reactive<{[ key: string ]: any}>({
        id: "",
        userId: "",
        content: "",
        name: "",
        type: "",
        size: "",
        added: "",
        indexOfCeil: null
    });

    const setModalFileData = (indexOfCeil: number) => {
        const filesStore = useFiles();
        const { getFileData } = filesStore;

        const fileData = getFileData(indexOfCeil);

        if ( fileData ) {
            for ( let [ key, value ] of Object.entries(fileData) ) {
                modalFileData[key] = value;
            }
        }
    }

    const resetModalFileData = () => {
        const reset = {
            id: "",
            userId: "",
            content: "",
            name: "",
            type: "",
            size: "",
            added: "",
            indexOfCeil: null
        };

        for ( let [ key, value ] of Object.entries(reset) ) {
            modalFileData[key] = value
        }
    }

    const isModalOpen = ref(false);

    const setIsModalValue = (value: boolean) => isModalOpen.value = value;

    return {
        modalFileData,
        setModalFileData,
        isModalOpen,
        setIsModalValue,
        resetModalFileData
    }
});