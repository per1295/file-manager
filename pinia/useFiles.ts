import { defineStore } from "pinia";
import { ref } from "vue";
import type { AddedFile } from "../data-types";

export default defineStore("files", () => {
    const filesData = ref<(AddedFile & { indexOfCeil: number })[]>([]);

    const addFileData = (data: AddedFile, indexOfCeil: number) => filesData.value.push({ indexOfCeil, ...data });

    const removeFileData = (id: string) => filesData.value = filesData.value.filter(file => file.id !== id);

    const getFileData = (indexOfCeil: number) => filesData.value.find(file => file.indexOfCeil == indexOfCeil);

    const replaceIndexOfCeilFileData = (from: number, to: number) => {
        const fileDataOfFrom = filesData.value.find(file => file.indexOfCeil == from);
        const filtredFilesData = filesData.value.filter(file => file.indexOfCeil != from);

        if ( fileDataOfFrom ) {
            fileDataOfFrom.indexOfCeil = to;

            filtredFilesData.push(fileDataOfFrom);

            for ( let i = 0; i < localStorage.length; i++ ) {
                const key = localStorage.key(i) as string;
                
                if ( !/^ceil/.test(key) ) continue;

                if ( `ceil-${from}` === key ) {
                    const idOfFile = localStorage.getItem(key);
                    localStorage.removeItem(key);
                    localStorage.setItem(`ceil-${to}`, idOfFile);
                }
            }

            filesData.value = filtredFilesData;
        }
    }

    return {
        filesData,
        addFileData,
        getFileData,
        removeFileData,
        replaceIndexOfCeilFileData
    }
});