<template>
    <v-app-instance class-name="SYNOCOMMUNITY.RRManager.AppInstance">
        <v-app-window width=850 height=574 ref="appWindow" :resizable="false" syno-id="SYNOCOMMUNITY.RRManager.AppWindow">
            <div class="example-package-app">
                Hello Synology Package
            </div>
        </v-app-window>
    </v-app-instance>
</template>

<script>
export default {
    data() {
        return {
        };
    },
    methods: {
        close() {
            this.$refs.appWindow.close();
        },
        resolveComponent() {
           
        },
    },
}
</script>
<style lang="scss">
.example-package-app {
    height: 100%;
}
</style>
