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
        <template v-if="user.role != 'admin'">
          <router-link to="/teams">Моя команда</router-link>
          <router-link to="/profile">Профиль</router-link>
        </template>
        <template v-else>
          <router-link to="/admin/players">Управление игроками</router-link>
          <router-link to="/admin/teams">Управление командами</router-link>
          <router-link to="/admin/users">Управление пользователями</router-link>
        </template>
        <button @click="logout" class="btn">Выйти ({{ user?.name }})</button>
      </template>
      <template v-else>
        <button class="btn btn--outline">
          <router-link to="/register">Зарегистрироваться</router-link>
        </button>
      </template>
    </div>
  </header>
  <div
    v-if="isAuthenticated && user.role != 'admin' && $route.path != '/'"
    class="nav-budget"
  >
    <div>
      {{ user?.budget }}
    </div>
    <div>
      <img
        width="20px"
        height="20px"
        src="http://localhost:3000/img/basket-coin.png"
      />
    </div>
  </div>
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
<style scoped>
.nav-budget {
  display: flex;
  justify-content: right;
  padding: 20px;
  gap: 10px;
}
</style>
