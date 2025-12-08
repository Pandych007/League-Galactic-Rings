<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import NavBar from "./components/NavBar.vue";
const authStore = useAuthStore();

onMounted(() => {
  authStore.syncAuthState();
});
</script>
<style>
body {
  margin: 0;
  background: radial-gradient(circle at center, #7e11c5, #1d0558);
  font-family: "Segoe UI", Arial, sans-serif;
  color: #eee;
}

/* HEADER */
.header {
  background: #1c3b8b;
  padding: 15px 15px;
}

.header__content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 600;
}

/* HERO */
.hero {
  background: linear-gradient(180deg, #1c3b8b 0%, #586cb3 100%);
  padding: 120px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 40px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 18px;
  margin-bottom: 30px;
}

/* ABOUT */
.about {
  padding: 80px 0;
  color: #1c3b8b;
  background: white;
  text-align: center;
}

.about__text {
  max-width: 800px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.about__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.card {
  background: #fff;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.card__icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  font-size: 24px;
}

/* FEATURES */
.features {
  padding: 80px 0;
  background: #f2f2f2;
  color: #1c3b8b;
  text-align: center;
}

.subtitle {
  margin: 10px 0 40px;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.feature-card {
  background: #fff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.feature-card__icon {
  font-size: 28px;
  margin-bottom: 15px;
}

/* CTA */
.cta {
  background: #1c3b8b;
  padding: 80px 20px;
  text-align: center;
}
.header a {
  text-decoration: none;
  color: #fff;
}
.btn {
  background: #ff7b00;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn--outline {
  background: #ff7b00;
  padding: 10px 20px;
}
</style>
