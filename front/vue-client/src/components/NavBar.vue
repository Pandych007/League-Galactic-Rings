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
        </template>
        <template v-else>
          <router-link to="/admin/players">Управление игроками</router-link>
          <router-link to="/admin/teams">Управление командами</router-link>
          <router-link to="/admin/users">Управление пользователями</router-link>
        </template>
        <div
          class="header_logo"
          style="display: flex; align-items: center; gap: 5px"
          @click="showHideBlockLk"
        >
          <div class="header_avatar" style="height: 30px">
            <img
              :src="avatarUrl"
              width="30px"
              style="margin-bottom: 30px; border-radius: 50%"
            />
          </div>
          <div class="header_login">
            {{ user_data?.name }}
          </div>
        </div>
        <div v-if="isBlockLk" class="list_lk">
          <div>
            <router-link to="/profile">Профиль</router-link>
          </div>
          <div>
            <a @click="logout">Выйти</a>
          </div>
        </div>
        <!-- <button @click="logout" class="btn">Выйти ({{ user?.name }})</button> -->
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
      {{ BUDGET_LIMIT }}
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
import api from "../services/api";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const user_data = ref(null);
const { user, token } = storeToRefs(authStore);
const isAuthenticated = computed(() => !!token.value);
const BUDGET_LIMIT = ref(0);
const isBlockLk = ref(false);
//let BUDGET_LIMIT = 0;
const forceUpdate = ref(0);

const showHideBlockLk = () => {
  if (isBlockLk.value) {
    isBlockLk.value = false;
  } else {
    isBlockLk.value = true;
  }
};
const logout = () => {
  authStore.logout();
  forceUpdate.value++;
  router.push("/");
};
const avatarUrl = computed(() => {
  if (user_data.value?.avatar) {
    return `${api.defaults.baseURL}/avatar/${user_data.value.avatar}`;
  } else {
    return "http://localhost:3000/img/avatar_prof.png";
  }
}); // avatar
const loadUserData = async () => {
  loading.value = true;
  try {
    const userResponse = await api.get("/auth/me");
    user_data.value = userResponse.data.user;
    BUDGET_LIMIT.value = user_data.value.budget;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadUserData();
});

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
.list_lk {
  position: absolute;
  right: 5px;
  top: 61px;
  width: 200px;
  background-color: #31066b;
  padding: 10px;
}
</style>
