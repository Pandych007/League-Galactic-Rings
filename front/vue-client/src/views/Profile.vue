<template>
  <h1 align="center">Мой профиль</h1>

  <div class="row">
    <div>
      <img :src="avatarUrl" width="120px" />
    </div>
    <div>
      <div class="imput_file">
        <label for="avatarUpload" class="imput_file_btm">
          Добавить аватар
        </label>
        <input
          type="file"
          id="avatarUpload"
          ref="fileInput"
          style="display: none"
          @change="uploadAvatar"
          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
        />
      </div>
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
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";
const fileImput2 = ref(null);
const router = useRouter();
const authStore = useAuthStore();

const uploadError = ref(null);
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
const avatarUrl = computed(() => {
  if (user.value?.avatar) {
    return `${api.defaults.baseURL}/avatar/${user.value.avatar}`;
  } else {
    return "http://localhost:3000/img/avatar_prof.png";
  }
});
const uploadAvatar = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    uploadError.value = "Файл слишком большой. Максимальный размер - 5М";
    return;
  }
  const formData = new FormData();
  formData.append("avatar", file);

  loading.value = true;
  uploadError.value = "";

  try {
    const response = await api.post("/avatar/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onDownloadProgress: (progressEvent) => {},
    });
    console.log("vue upload");

    console.log(response);
  } catch (error) {
    console.error(error);
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
