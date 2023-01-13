<template>
    <div class="inventory" ref="inventory" data-dark-theme="section">
        <inventory-item-vue v-for="index in 25" :key="index" :index="index"></inventory-item-vue>
    </div>
</template>

<script setup lang="ts">
    import InventoryItemVue from './InventoryItem.vue';
    import axios from 'axios';
    import { watch, ref } from 'vue';
    import useFiles from '../../../pinia/useFiles';
    import useNotifications from '../../../pinia/useNotifications';
    import useUserData from '../../../pinia/useUserData';
    import type { CustomResponse, AddedFile } from '../../../data-types';
    import { truthyObjectItems } from "../../functions";
    import { storeToRefs } from 'pinia';

    const inventory = ref<HTMLDivElement>();

    const filesStore = useFiles();
    const { addFileData } = filesStore;

    const notificationsStore = useNotifications();
    const { addNotification } = notificationsStore;

    const userDataStore = useUserData();
    const { userData } = storeToRefs(userDataStore);

    watch(userData, async (nowUserData, oldUserData) => {
        if (
            truthyObjectItems(nowUserData, "userId", "username", "email", "tel", "password")
            &&
            !oldUserData
        ) {
            try {
                const response = await axios.get<CustomResponse<AddedFile[]>>("/get all files", {
                    headers: {
                        "Accept": "application/json"
                    }
                });

                const { data } = response;
                const { status, message } = data;

                if ( status === "success" ) {
                    for ( let i = 0; i < message.length; i++ ) {
                        const { id } = message[i];
                        let isLocalStorageHasDocument = false;

                        for ( let j = 0; j < localStorage.length; j++ ) {
                            const key = localStorage.key(j) as string;

                            if ( !/^ceil/.test(key) ) continue;

                            const indexOfCeilMatch = key.match(/\d+/);

                            if ( indexOfCeilMatch ) {
                                const indexOfCeil = indexOfCeilMatch[0];

                                const idOfFile = localStorage.getItem(key) as string;

                                if ( id == idOfFile ) {
                                    addFileData(message[i], +indexOfCeil);
                                    isLocalStorageHasDocument = true;
                                }
                            }
                        }

                        if ( !isLocalStorageHasDocument ) {
                            const inventoryElem = inventory.value as HTMLDivElement;
                            let indexOfFirstChild: number | null = null;
                            const children = Array.from(inventoryElem.children as HTMLCollectionOf<HTMLDivElement>);

                            const firstEmptyChild = children.find((elem, index) => {
                                if ( !elem.draggable ) {
                                    indexOfFirstChild = index + 1;
                                    return true
                                }
                            });

                            if ( firstEmptyChild && indexOfFirstChild ) {
                                addFileData(message[i], indexOfFirstChild);
                                localStorage.setItem(`ceil-${indexOfFirstChild}`, `${id}`);
                            }
                        }
                    }

                    addNotification({
                        status: "success",
                        title: "Getting files was successful"
                    });
                } else {
                    throw new Error("Getting files was failed");
                }
            } catch (error) {
                const e = error as Error;

                console.log(e);

                addNotification({
                    status: "fail",
                    title: e.message
                });
            }
        }
    }, {
        deep: true
    });
</script>

<style lang="scss">
    .inventory {
        border: 1px solid #4D4D4D;
        width: 100%;
        height: 500px;
        border-radius: 12px;
        display: grid;
        grid-template-areas: 
        "ceil-1 ceil-2 ceil-3 ceil-4 ceil-5"
        "ceil-6 ceil-7 ceil-8 ceil-9 ceil-10"
        "ceil-11 ceil-12 ceil-13 ceil-14 ceil-15"
        "ceil-16 ceil-17 ceil-18 ceil-19 ceil-20"
        "ceil-21 ceil-22 ceil-23 ceil-24 ceil-25";
        grid-template-columns: repeat(5, 20%);
        grid-template-rows: repeat(5, 20%);
        z-index: 1;

        @media screen and (max-width: 425px) {
            grid-template-areas:
            "ceil-1"
            "ceil-2"
            "ceil-3"
            "ceil-4"
            "ceil-5"
            "ceil-6"
            "ceil-7"
            "ceil-8"
            "ceil-9"
            "ceil-10"
            "ceil-11"
            "ceil-12"
            "ceil-13"
            "ceil-14"
            "ceil-15"
            "ceil-16"
            "ceil-17"
            "ceil-18"
            "ceil-19"
            "ceil-20"
            "ceil-21"
            "ceil-22"
            "ceil-23"
            "ceil-24"
            "ceil-25";
            grid-template-columns: 100%;
            grid-template-rows: repeat(25, 50vw);
            height: auto;
            width: auto;
        }
    }
</style>