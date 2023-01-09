<template>
    <div
        ref="notification"
        class="notification"
        :class="theme === 'light' ? [ 'light-theme', 'cursor-pointer-light' ] : [ 'dark-theme', 'cursor-pointer-dark' ]"
        @click="toggleOpen"
        @pointerdown="startMoving"
        @pointermove="moving"
        @pointerup="endMoving"
        @pointerleave="endMoving"
        @pointercancel="endMoving"
        data-cursor="pointer"
    >
        <div class="notification-conteiner" data-cursor="pointer">
            <span
                class="notification-conteiner-title"
                :class="theme === 'light' ? [ 'light-theme' ] : [ 'dark-theme' ]"
            >
                <span class="notification-conteiner-title-icon" :data-type="status" data-cursor="pointer"></span>
                <span class="notification-conteiner-title-content">
                    {{ title.replace(/\s/g, "&nbsp;") }}
                </span>
            </span>
            <svg
                @click.stop="remove"
                class="notification-conteiner-close"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M1 9L9 1M1 1L9 9" stroke="#666666" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <component
            :is="description ? NotificationDescriptionVue : null"
            :isNotificationFullOpen="isNotificationFullOpen"
            :description="description"
        />
    </div>
</template>

<script setup lang="ts">
    import { PropType, ref, watch } from 'vue';
    import useNotifications from '../../../pinia/useNotifications';
    import useTheme from '../../../pinia/useTheme';
    import { storeToRefs } from 'pinia';

    import NotificationDescriptionVue from './NotificationDescription.vue';

    const props = defineProps({
        id: {
            type: Number as PropType<number>,
            required: true
        },
        status: {
            type: String as PropType<string>,
            required: true
        },
        title: {
            type: String as PropType<string>,
            required: true
        },
        description: {
            type: String as PropType<string>
        }
    });

    const moveX = ref(0);
    const lastMovingMoveX = ref(0);
    const isMoving = ref(false);
    const notification = ref<HTMLDivElement>();

    const removeNotificationElem = () => {
        const notificationElem = notification.value;
        if ( !notificationElem ) return;

        notificationElem.remove();
        removeNotification(props.id);
    }

    const resetNotificationElem = () => {
        const notificationElem = notification.value;
        if ( !notificationElem ) return;

        notificationElem.style.removeProperty("transition");
        moveX.value = 0;
        lastMovingMoveX.value = 0;
    }

    watch([moveX, isMoving], (nowValues, oldValues) => {
        const [ nowMoveX, nowIsMoving ] = nowValues;
        const [ oldMoveX ] = oldValues;

        const notificationElem = notification.value;
        if ( !notificationElem ) return;

        if ( nowIsMoving ) {
            const translateXMatch = notificationElem.style.transform.match(/(?<=translatex\()\-\d+(?=px\))/i);

            if ( translateXMatch ) {
                const movedX = +translateXMatch.toString();
                const move = movedX - oldMoveX + nowMoveX;

                notificationElem.style.transform = `translateX(${move >= 0 ? 0 : move}px)`;
                notificationElem.style.opacity = `${100 + move <= 0 ? 0 : (100 + move) / 100 }`;

                lastMovingMoveX.value = oldMoveX;
            } else {
                const move = nowMoveX - oldMoveX;

                notificationElem.style.transform = `translateX(${move >= 0 ? 0 : move}px)`;
            }
        } else {
            notificationElem.style.transition = "all .35s ease";

            if ( nowMoveX >= lastMovingMoveX.value ) {
                notificationElem.style.transform = "translateX(0)";
                notificationElem.style.opacity = "1";
                notificationElem.addEventListener("transitionend", resetNotificationElem, { once: true });
            } else {
                notificationElem.style.transform = "translateX(-100px)";
                notificationElem.style.opacity = "0";
                notificationElem.addEventListener("transitionend", removeNotificationElem, { once: true });
            }
        }
    });

    const startMoving = (event: PointerEvent) => {
        isMoving.value = true;
        const movingValue = +event.clientX.toFixed();
        moveX.value = movingValue;
    }

    const moving = (event: PointerEvent) => {
        if ( !isMoving.value ) return;
        const movingValue = +event.clientX.toFixed();
        if ( moveX.value !== movingValue ) moveX.value = movingValue;
    }

    const endMoving = () => {
        isMoving.value = false;
    }

    const themeStore = useTheme();
    const { theme } = storeToRefs(themeStore);

    const isNotificationFullOpen = ref(false);

    const toggleOpen = () => isNotificationFullOpen.value = !isNotificationFullOpen.value;

    const notificationsStore = useNotifications();
    const { removeNotification } = notificationsStore;

    const remove = () => removeNotification(props.id);
</script>

<style lang="scss">
    .notification {
        max-width: 260px;
        width: 40vw;
        background: #FFFFFF;
        box-shadow: 0px 2px 8px rgba(72, 72, 72, 0.25);
        border-radius: 4px;
        padding: 8.5px 8px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        row-gap: 8.5px;

        .notification-conteiner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 100%;
            width: 100%;

            @media screen and (max-width: 320px) {
                column-gap: unset;
            }

            .notification-conteiner-title {
                display: flex;
                align-items: center;
                column-gap: 6px;
                max-width: calc(80% - 20px);

                .notification-conteiner-title-icon {
                    min-height: 20px;
                    min-width: 20px;
                    background-position: center;
                    background-size: contain;
                    background-repeat: no-repeat;

                    &[data-type=none] {
                        display: none;
                    }

                    &[data-type=inf] {
                        background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.5 6.5L6.52733 6.48667C6.61282 6.44396 6.70875 6.42664 6.80378 6.43677C6.8988 6.4469 6.98893 6.48404 7.0635 6.54381C7.13806 6.60357 7.19394 6.68345 7.22451 6.77399C7.25508 6.86453 7.25907 6.96193 7.236 7.05467L6.764 8.94533C6.74076 9.03811 6.74463 9.13561 6.77513 9.22626C6.80563 9.31691 6.86149 9.39691 6.93609 9.45678C7.01069 9.51664 7.10089 9.55384 7.196 9.56399C7.2911 9.57413 7.38712 9.55678 7.47267 9.514L7.5 9.5M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7ZM7 4.5H7.00533V4.50533H7V4.5Z' stroke='%2300D1FF' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                    }

                    &[data-type=success] {
                        background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 7.5L6.5 9L9 5.5M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7Z' stroke='%2300CE3A' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                    }

                    &[data-type=warning] {
                        background-image: url("data:image/svg+xml,%3Csvg width='14' height='13' viewBox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 5.00001V7.50001M0.797999 9.75068C0.220666 10.7507 0.942666 12 2.09667 12H11.9033C13.0567 12 13.7787 10.7507 13.202 9.75068L8.29933 1.25201C7.722 0.252014 6.278 0.252014 5.70067 1.25201L0.797999 9.75068V9.75068ZM7 9.50001H7.00466V9.50535H7V9.50001Z' stroke='%23FFB800' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
                    }
                    
                    &[data-type=fail] {
                        background-image: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 5V7.5M13 7C13 7.78793 12.8448 8.56815 12.5433 9.2961C12.2417 10.0241 11.7998 10.6855 11.2426 11.2426C10.6855 11.7998 10.0241 12.2417 9.2961 12.5433C8.56815 12.8448 7.78793 13 7 13C6.21207 13 5.43185 12.8448 4.7039 12.5433C3.97595 12.2417 3.31451 11.7998 2.75736 11.2426C2.20021 10.6855 1.75825 10.0241 1.45672 9.2961C1.15519 8.56815 1 7.78793 1 7C1 5.4087 1.63214 3.88258 2.75736 2.75736C3.88258 1.63214 5.4087 1 7 1C8.5913 1 10.1174 1.63214 11.2426 2.75736C12.3679 3.88258 13 5.4087 13 7ZM7 9.5H7.00533V9.50533H7V9.5Z' stroke='%23FF0000' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E%0A");
                    }
                }

                .notification-conteiner-title-content {
                    font-family: 'Inter';
                    font-style: normal;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 15px;
                    overflow-x: hidden;
                    text-overflow: ellipsis;
                    max-width: 100%;
                }
            }

            .notification-conteiner-close {
                min-height: 20px;
                min-width: 20px;
                max-height: 20px;
                max-width: 20px;
            }
        }
    }
</style>