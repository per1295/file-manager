<template>
    <div class="notifications">
        <transition-group name="notification">
            <notification-vue
                v-for="notification of notifications"
                :key="notification.id"
                :id="notification.id"
                :status="notification.status"
                :title="notification.title"
                :description="notification.description"
            />
        </transition-group>
    </div>
</template>

<script setup lang="ts">
    import NotificationVue from './Notification.vue';
    import { storeToRefs } from 'pinia';
    import useNotifications from "../../../pinia/useNotifications";

    const notificationsStore = useNotifications();
    const { notifications } = storeToRefs(notificationsStore);
</script>

<style lang="scss">
    .notifications {
        position: fixed;
        bottom: 20px;
        left: 20px;
        display: flex;
        flex-direction: column;
        row-gap: 24px;
    }

    .notification-enter-active, .notification-leave-active {
        transition: all .35s !important;
    }

    .notification-enter-from, .notification-leave-to {
        transform: translateX(-20px);
        opacity: 0;
    }
</style>