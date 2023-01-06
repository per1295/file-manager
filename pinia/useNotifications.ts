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

    const removeNotification = (id: number) => {
        notifications.value = notifications.value.filter(item => item.id !== id);
    }

    return {
        notifications,
        addNotification,
        removeNotification
    }
});