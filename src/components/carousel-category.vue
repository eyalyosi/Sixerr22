<template>
  <section>
    <h2 class="category-title">Popular professional services</h2>

    <Carousel :items-to-show="5" :wrap-around="true">
      <Slide v-for="category in categories" :key="category.name">
        <li class="category-preview-box" @click="explore(category.name)">
          <div class="category-txt-name-box">
            <small class="category-txt">{{ category.txt }}</small>
            <h4 class="category-name">{{ category.name }}</h4>
          </div>
          <img :src="category.img" alt />
        </li>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { Carousel, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
export default defineComponent({
  name: "WrapAround",
  props: {
    categories: {
      type: Array,
    },
  },
  computed: {
    categoryImg() {
      return this.category.img;
    },
  },
  methods: {
    explore(filter) {
      this.$emit("explore", filter);
      this.$router.push(`/explore/${filter}`);
    },
  },
  components: {
    Carousel,
    Slide,
    Navigation,
  },
});
</script>
