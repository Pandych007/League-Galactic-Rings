<template>
  <div class="timer-container">
    <div class="timer-display">
      <div class="timer-r">
        <h2>До обнуления:</h2>
        <div class="timer-units">
          <div class="time-unit">
            <span class="value">{{ days }}</span>
            <span class="label"> дней</span>
          </div>
          <div class="time-unit">
            <span class="value">{{ hours }}</span>
            <span class="label"> часов</span>
          </div>
          <div class="time-unit">
            <span class="value">{{ minutes }}</span>
            <span class="label"> минут</span>
          </div>
          <div class="time-unit">
            <span class="value">{{ seconds }}</span>
            <span class="label"> секунд</span>
          </div>
        </div>
      </div>
      <div class="timer-info">
        <p><strong>Следующее обнуление: </strong>{{ nextResetDate }}</p>
        <div class="progress-block">
          <p><strong>Прогресс:</strong> {{ progressPercent }}%</p>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!--<p>до клнца соревнования осталось 7 д ч м с</p>
    <p>статистика обновляется каждые 2 дня</p>-->
  </div>
</template>

<script setup>
//admin/time1
import { redirect } from "react-router-dom";
import api from "../services/api";
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const props = defineProps({
  startDate: {
    type: Date,
    default: () => new Date("2026-02-04T00:00:00"), //отчет от этой даты
  },
  resetIntervalDays: {
    type: Number,
    default: 1,
  },
});
const startDate = ref(props.startDate);
const now = ref(new Date());
const timerInterval = ref(null);

const RESET_INTERVAL = computed(
  // 60
  () => props.resetIntervalDays * 2 * 60 * 1000, // * 24
);

const timeUntilReset = computed(() => {
  const e = now.value.getTime() - startDate.value.getTime();
  const t = e % RESET_INTERVAL.value;
  return RESET_INTERVAL.value - t;
});

const days = computed(() =>
  Math.floor(timeUntilReset.value / (1000 * 60 * 60 * 24)),
);

const hours = computed(() =>
  Math.floor((timeUntilReset.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
);

const minutes = computed(() =>
  Math.floor((timeUntilReset.value % (1000 * 60 * 60)) / (1000 * 60)),
);

const seconds = computed(() =>
  Math.floor((timeUntilReset.value % (1000 * 60)) / 1000),
);

const nextResetDate = computed(() => {
  const resetDate = new Date(now.value.getTime() + timeUntilReset.value);
  return resetDate.toLocaleString("ru-RU");
});

const progressPercent = computed(() => {
  return Math.floor(100 - (timeUntilReset.value / RESET_INTERVAL.value) * 100);
});

const updateNow = () => {
  //console.log(1);
  //
  if (
    days.value == 0 &&
    hours.value == 0 &&
    minutes.value == 0 &&
    seconds.value == 0
  ) {
    clearAllTeams();
  }
  now.value = new Date();
};

const clearAllTeams = async () => {
  //const token = localStorage.getItem('token');
  try {
    const response = await api.get("/admin/clearTeams");
    if (response.data.success) {
      await router.push("/ranking");
    }
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  const savedDate = localStorage.getItem("timerStartDate");
  if (savedDate) {
    startDate.value = new Date(parseInt(savedDate));
  }
  timerInterval.value = setInterval(updateNow, 1000);
});

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

defineExpose({
  resetTimer: () => {
    startDate.value = new Date();
    localStorage.setItem(
      "timerStartDate",
      startDate.value.getTime().toString(),
    );
  },
});
const timeL = computed(() => {
  if (!startTime.value) return COMP_DURATION;
  const r = currentTime.value - startTime.value;
});
</script>
<style>
.timer-units {
  display: flex;
  gap: 20px;
}
.time-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 80px;
}
.timer-container {
  margin-top: -45px;
}
.timer-display {
  display: flex;
}
.timer-info {
  padding-top: 45px;
}
.progress-fill {
  height: 20px;
  background: linear-gradient(90deg, #4cd964, #5ac8fa);
  border-radius: 10px;
  transition: with 1s ease;
}
.progress-bar {
  background-color: #000;
  border-radius: 10px;
  height: 20px;
  width: 200px;
}
.progress-block {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: -21px;
}
</style>
