<script>
import firebaseApp from "../firebase";

export default {
    name: "MyComponent",
    mounted() {
        console.log("Firebase App:", firebaseApp);
    },
};
</script>

<template>
    <div>

    </div>
</template>