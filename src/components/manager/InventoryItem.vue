<template>
    <div
        :draggable="fileData ? true : false"
        ref="ceil"
        :class="[`inventory-ceil-${index}`, cursorClass]"
        data-theme="ignore"
        :data-cursor="fileData ? 'grabbing' : 'default'"
        @click="openModal"
        @dragstart="dragstart"
        @dragend="dragend"
        @dragover.prevent="dragover"
        @drop.prevent="drop"
    >
    </div>
</template>

<script setup lang="ts">
    import { PropType, ref, watch, computed } from 'vue';
    import axios from 'axios';
    import type { CustomResponse, AddedFile } from '../../../data-types';
    import useNotifications from '../../../pinia/useNotifications';
    import useFiles from "../../../pinia/useFiles";
    import useModal from '../../../pinia/useModal';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    const props = defineProps({
        index: {
            type: Number as PropType<number>,
            required: true
        }
    });

    const notificationsStore = useNotifications();
    const { addNotification } = notificationsStore;

    const filesStore = useFiles();
    const { addFileData, getFileData, replaceIndexOfCeilFileData } = filesStore;

    const modalStore = useModal();
    const { setModalFileData , setIsModalValue, resetModalFileData } = modalStore;
    const { isModalOpen } = storeToRefs(modalStore);

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    const isOpenCeil = ref(false);
    const ceil = ref<HTMLDivElement>();
    const fileData = computed(() => getFileData(props.index));

    const cursorClass = computed(() => {
        return theme.value === "light"
        ?
        fileData.value
        ?
        "cursor-grabbing-light"
        :
        "cursor-default-light"
        :
        fileData.value
        ?
        "cursor-grabbing-dark"
        :
        "cursor-default-dark";
    });

    watch(modalStore.modalFileData, (nowValue) => {
        if ( nowValue.indexOfCeil !== props.index ) isOpenCeil.value = false;
    });

    watch(isModalOpen, (nowValue) => {
        if ( !nowValue ) resetModalFileData();
    });

    watch(isOpenCeil, (nowValue) => {
        const ceilElem = ceil.value;

        if ( ceilElem ) {
            if ( nowValue ) {
                ceilElem.classList.add(`ceil-active-${props.index}`);

                setModalFileData(props.index);
                setIsModalValue(true);
            } else {
                ceilElem.classList.remove(`ceil-active-${props.index}`);
            }
        }
    });

    watch(fileData, nowFileData => {
        const ceilElem = ceil.value;

        if ( ceilElem && nowFileData ) {
            const fileImg = document.createElement("img");

            fileImg.className = `ceil-img ${cursorClass.value}`;
            fileImg.draggable = false;

            if ( /^text/.test(nowFileData.type) ) {
                fileImg.src = "/text-img.png";
                fileImg.alt = "file-text";
            }

            if ( /^image/.test(nowFileData.type) ) {
                fileImg.src = "/image-img.png";
                fileImg.alt = "file-image"
            }

            ceilElem.append(fileImg);
        } else if ( ceilElem && !nowFileData ) {
            const imgElem = ceilElem.querySelector("img.ceil-img") as HTMLImageElement;

            imgElem.remove();
        }
    });

    watch(theme, (nowTheme) => {
        const ceilElem = ceil.value as HTMLDivElement;
        const ceilElemImg = ceilElem.firstChild as HTMLImageElement | undefined;

        if ( !ceilElemImg ) return;

        if ( nowTheme === "light" ) {
            ceilElemImg.classList.add("cursor-grabbing-light");
            ceilElemImg.classList.remove("cursor-grabbing-dark");
        } else {
            ceilElemImg.classList.add("cursor-grabbing-dark");
            ceilElemImg.classList.remove("cursor-grabbing-light");
        }
    });

    const openModal = () => fileData.value ? isOpenCeil.value = true : undefined;

    const dragstart = (event: DragEvent) => {
        const dataTransfer = event.dataTransfer;
        const fileDataValue = fileData.value;
        const ceilElem = ceil.value as HTMLDivElement;
        const ceilElemImage = ceilElem.firstChild as HTMLImageElement;

        const { top, left } = ceilElem.getBoundingClientRect();
        const { clientY, clientX } = event;

        if ( dataTransfer && fileDataValue) {
            dataTransfer.dropEffect = "move";
            dataTransfer.setData("text/plain", `${props.index}`);

            const cloneCeilElem = document.createElement("div");

            cloneCeilElem.style.boxSizing = "border-box";
            cloneCeilElem.style.position = "absolute";
            cloneCeilElem.style.bottom = "0";
            cloneCeilElem.style.left = "0";
            cloneCeilElem.style.zIndex = "-9999";
            cloneCeilElem.style.backgroundColor = "#262626";
            cloneCeilElem.style.border = "1px solid #4D4D4D";
            cloneCeilElem.style.borderRadius = "24px";
            cloneCeilElem.style.display = "flex";
            cloneCeilElem.style.alignItems = "center";
            cloneCeilElem.style.justifyContent = "center";
            cloneCeilElem.style.width = ceilElem.offsetWidth + "px";
            cloneCeilElem.style.height = ceilElem.offsetHeight + "px";

            const cloneCeilElemImage = document.createElement("img");

            cloneCeilElemImage.className = ceilElemImage.className;
            cloneCeilElemImage.src = ceilElemImage.src;
            cloneCeilElemImage.alt = ceilElemImage.alt;
            cloneCeilElemImage.draggable = ceilElemImage.draggable;

            cloneCeilElemImage.style.maxHeight = "50%";
            cloneCeilElemImage.style.maxWidth = "50%";

            cloneCeilElem.append(cloneCeilElemImage);

            document.body.append(cloneCeilElem);

            dataTransfer.setDragImage(cloneCeilElem, clientX - left, clientY - top);
        };
    }

    const dragend = () => {
        const dragImage = document.querySelector("body > div:last-child") as HTMLDivElement;

        dragImage.remove();
    }

    const dragover = (event: DragEvent) => {
        const dataTransfer = event.dataTransfer;

        if ( dataTransfer ) {
            dataTransfer.dropEffect =
            dataTransfer.dropEffect !== "move"
            ?
            dataTransfer.dropEffect = "copy"
            :
            dataTransfer.dropEffect;
        };
    }

    const drop = (event: DragEvent) => {
        try {
            const dataTransfer = event.dataTransfer;

            if ( dataTransfer ) {
                const types = dataTransfer.types;
                const files = dataTransfer.files;
                let dropEffect = dataTransfer.dropEffect;

                if ( dropEffect === "none" ) {
                    const indexOfCeilFrom = dataTransfer.getData("text/plain");

                    if ( indexOfCeilFrom ) dropEffect = "move";
                    else dropEffect = "copy";
                }

                switch(dropEffect) {
                    case "copy":
                        types.forEach(item => {
                        item = item.toLowerCase();

                        switch(item) {
                            case "files":
                                const lastFile = Array.from(files).at(-1) as File;
                                const typeOfFile = lastFile.type;

                                const reader = new FileReader();

                                if ( /^image/.test(typeOfFile) ) reader.readAsDataURL(lastFile);
                                else if ( /^text/.test(typeOfFile) ) reader.readAsText(lastFile);
                                else throw new Error("Unsupported file`s type");

                                reader.addEventListener("load", async () => {
                                    const result = reader.result as string;

                                    const requestBody = Object.freeze({
                                        content: result,
                                        name: lastFile.name,
                                        type: lastFile.type
                                    });

                                    const response = await axios.post<CustomResponse<AddedFile>>("/add file", requestBody, {
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Accept": "application/json"
                                        }
                                    });

                                    const { status, message } = response.data;

                                    if ( status === "success" ) {
                                        addFileData(message, props.index);

                                        localStorage.setItem(`ceil-${props.index}`, message.id);

                                        addNotification({
                                            status: "success",
                                            title: "File was added"
                                        });
                                    } else {
                                        throw new Error("Adding new file was failed");
                                    }
                                });
                                break;
                            }
                        });
                        break;
                    case "move":
                        const indexOfCeilFrom = +dataTransfer.getData("text/plain");
                        replaceIndexOfCeilFileData(indexOfCeilFrom, props.index);
                        break;
                }
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
    @for $index from 1 through 25 {
        .inventory-ceil-#{$index} {
            grid-area: ceil-#{$index};
            background-color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all .35s ease-out;

            @if $index != 1 {
                @media screen and (max-width: 425px) {
                    border-top: 1px solid #4D4D4D;
                }
            }
            
            &:active {
                cursor: pointer;
            }
            
            .ceil-img {
                max-width: 50%;
                max-height: 50%;
            }

            @if $index % 5 != 0 {
                border-right: 1px solid #4D4D4D;

                @media screen and (max-width: 425px) {
                    border-right: none;
                }
            }

            @if $index != 21 and $index != 22 and $index != 23 and $index != 24 and $index != 25 {
                border-bottom: 1px solid #4D4D4D;

                @media screen and (max-width: 425px) {
                    border-bottom: none;
                }
            }

            @if $index == 1 {
                border-top-left-radius: 12px;

                @media screen and (max-width: 425px) {
                    border-top-right-radius: 12px;
                }
            }

            @if $index == 5 {
                border-top-right-radius: 12px;

                @media screen and (max-width: 425px) {
                    border-top-right-radius: unset;
                }
            }

            @if $index == 21 {
                border-bottom-left-radius: 12px;

                @media screen and (max-width: 425px) {
                    border-bottom-left-radius: none;
                }
            }

            @if $index == 25 {
                border-bottom-right-radius: 12px;

                @media screen and (max-width: 425px) {
                    border-bottom-left-radius: 12px;
                }
            }
        }
    }

    @for $index from 1 through 25 {
        .ceil-active-#{$index} {
            transition: all .25s ease-in;
            background-color: #1877F2;
        }
    }
</style>