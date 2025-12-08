<template>
  <!-- HEADER -->
  <header class="header">
    <div class="container header__content">
      <div class="logo">
        🏆 <span><router-link to="/">VirtualBasket</router-link></span>
      </div>

      <router-link to="/players">Игроки</router-link>
      <router-link to="/ranking">Статистика</router-link>
      <template v-if="isAuthenticated">
        <router-link to="/teams">Мои команды</router-link>
        <router-link to="/profile">Профиль</router-link>
        <button @click="logout" class="btn">Выйти ({{ user?.name }})</button>
      </template>
      <template v-else>
        <button class="btn btn--outline">
          <router-link to="/register">Зарегистрироваться</router-link>
        </button>
      </template>
    </div>
  </header>
</template>
<script setup>
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const { user, token } = storeToRefs(authStore);

const isAuthenticated = computed(() => !!token.value);

const forceUpdate = ref(0);

const logout = () => {
  authStore.logout();
  forceUpdate.value++;
  router.push("/");
};

watch(token, () => {
  forceUpdate.value++;
});
</script>
<style scoped></style>
