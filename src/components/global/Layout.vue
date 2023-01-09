<template>
    <div class="conteiner">
        <slot></slot>
        <notifications-vue/>
        <change-theme-vue/>
    </div>
</template>

<script setup lang="ts">
    import NotificationsVue from './Notifications.vue';
    import ChangeThemeVue from './ChangeTheme.vue';
</script>