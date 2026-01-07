<template>
  <router-view />
</template>
<script setup>
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
const { isAdmin, user } = storeToRefs(authStore);

onMounted(() => {
  if (!isAdmin.value) {
    router.push("/");
  }
});
watch(isAdmin, (newVal) => {
  if (!newVal) {
    router.push("/");
  }
});
</script>
