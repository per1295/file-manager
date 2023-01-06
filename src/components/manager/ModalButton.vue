<template>
    <button
        class="modal-buttons-button"
        :class="theme === 'light' ? 'cursor-pointer-light' : 'cursor-pointer-dark'"
        :data-type="type"
        data-cursor="pointer"
        @pointerenter="overButton"
        @pointerleave="overButton"
        @click="click"
    >
        <slot></slot>
    </button>
</template>

<script setup lang="ts">
    import type { PropType } from 'vue';
    import { overElement } from '../../functions';
    import axios from 'axios';
    import useModal from '../../../pinia/useModal';
    import useNotifications from '../../../pinia/useNotifications';
    import useFiles from '../../../pinia/useFiles';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';
    import type { CustomResponse } from '../../../data-types';

    const props = defineProps({
        type: {
            type: String as PropType<"download" | "delete">,
            required: true
        }
    });

    const modalStore = useModal();
    const { modalFileData } = storeToRefs(modalStore);
    const { resetModalFileData, setIsModalValue } = modalStore;

    const notificationsStore = useNotifications();
    const { addNotification } = notificationsStore;

    const filesStore = useFiles();
    const { removeFileData } = filesStore;

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    const overButton = (event: Event) => {
        overElement(event, props.type === "download" ? "download-active" : "delete-active");
    }

    const click = async () => {
        try {
            switch(props.type) {
            case "download":
                const dowloadResponse = await axios.get("/download file", {
                    params: {
                        id: modalFileData.value.id
                    }
                });

                const { statusText, data: downloadData } = dowloadResponse;

                if ( statusText.toLowerCase() === "ok" ) {
                    const anchorElem = document.createElement("a");

                    anchorElem.download = modalFileData.value.name;
                    anchorElem.href = downloadData;

                    anchorElem.click();
                } else {
                    addNotification({
                        status: "fail",
                        title: "Download was failed"
                    });
                }
                break;
            case "delete":
                const deleteResponse = await axios.delete<CustomResponse<string>>("/delete file", {
                    params: {
                        id: modalFileData.value.id
                    }
                });

                const { data: deleteData } = deleteResponse;
                const { status, message } = deleteData;

                if ( status === "success" ) {
                    removeFileData(modalFileData.value.id);

                    localStorage.removeItem(`ceil-${modalFileData.value.id}`);

                    setIsModalValue(false);

                    resetModalFileData();

                    addNotification({
                        status: "success",
                        title: message
                    });
                } else {
                    throw new Error(message);
                }
                break;
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
</script>

<style lang="scss">
    .modal-buttons-button {
        width: 100px;
        height: 33px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        transition: all .35s ease;

        &[data-type=download] {
            background-color: #FFFFFF;
            color: #2D2D2D;
        }

        &[data-type=delete] {
            background: #FA7272;
            color: #FFFFFF;
        }
    }

    .download-active {
        background-color: rgba(255, 255, 255, .8) !important;
        color: rgba(45, 45, 45, .8) !important;
    }

    .delete-active {
        background-color: rgba(250, 114, 114, .8) !important;
        color: rgba(255, 255, 255, .8) !important;
    }
</style>