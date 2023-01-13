import { defineStore } from "pinia";
import { readonly, ref } from "vue";
import type { INotification } from "../data-types";
import { getRandomId } from "../functions";

export default defineStore("notifications", () => {
    const notifications = ref<INotification[]>([]);

    const getRandomId6 = getRandomId.bind(null, 6) as () => number;

    const addNotification = (notification: Omit<INotification, "id">) => {
        const id = getRandomId6();

        const newNotification = readonly<INotification>({
            id,
            ...notification
        });

        if ( notifications.value.length >= 5 ) {
            notifications.value.pop();
        }

        notifications.value = [ newNotification, ...notifications.value ];
    };

    const addNotifications = (...notifications: Omit<INotification, "id">[]) => {
        for ( let i = 0; i < notifications.length; i++ ) {
            addNotification(notifications[i]);
        }
    }

    const removeNotification = (id: number) => {
        notifications.value = notifications.value.filter(item => item.id !== id);
    }

    const clearWaitingNotifications = () => {
        const filtredNotifications = notifications.value.filter(notification => !/wait\sa\sbit/i.test(notification.title));
        notifications.value = filtredNotifications;
    }

    return {
        notifications,
        addNotification,
        addNotifications,
        removeNotification,
        clearWaitingNotifications
    }
});