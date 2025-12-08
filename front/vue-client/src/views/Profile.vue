<template>
  <h1 align="center">Мой профиль</h1>

  <div class="row">
    <div>
      <img src="http://localhost:3000/img/avatar_prof.png" width="120px" />
    </div>
    <div>
      <div v-if="user" class="row-b">
        <div>
          <label>Имя:</label>
          <span class="bold">{{ user.name }}</span>
        </div>
        <div>
          <label>Email:</label>
          <span class="bold">{{ user.email }}</span>
        </div>
        <div>
          <label>Роль:</label>
          <span class="bold">{{ user.role }}</span>
        </div>
        <div>
          <button @click="logout" class="btn">Выйти из профиля</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

const router = useRouter();
const authStore = useAuthStore();

const user = ref(null);
const loading = ref(false);

const loadUserData = async () => {
  loading.value = true;
  try {
    const userResponse = await api.get("/auth/me");

    user.value = userResponse.data.user;
  } catch (er) {
    console.error(er);
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push("/");
};
onMounted(() => {
  loadUserData();
});
</script>
<style>
.row {
  display: flex;
  justify-content: center;
  gap: 50px;
  align-items: center;
}
.row-b {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bold {
  font-weight: bolder;
  padding-left: 10px;
}
</style>
