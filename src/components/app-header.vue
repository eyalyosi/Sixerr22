<template>
  <header
    class="app-header full"
    :class="{ 'change-color': scrollPosition > 50 }"
  >
    <button class="hamburger hide">☰</button>
    <main class="main-header" ref="nav">
      <div class="main-layout header-flex">
        <div class="logo-and-search">
          <h1 to="/">
            <router-link class="logo" to="/">
              <div class="logo-part">
                <p :class="$route.meta.logoClass">
                  Sixerr
                  <span class="point">.</span>
                </p>
              </div>
            </router-link>
          </h1>
          <!-- <form
            class="search-bar-header"
            :class="{ 'search-header': scrollPosition > 100 }"
          >
            <div>
              <div class="sticky-search">
                <img src="../assets/logo/magnifying-glass.png" alt />
                <input
                  type="text"
                  placeholder="Find Services"
                  v-model="filterBy.title"
                  @change="setFilter"
                />
                <button class="search-header-btn">Search</button>
              </div>
            </div>
          </form> -->
          <gig-filter-header @setFilter="setFilter" :class="{ 'search-header': scrollPosition > 100 }" class="hide"/>
        </div>
        <nav class="nav">
          <router-link to="/explore" class="explore">
            <a :class="$route.meta.logoClass" href @click="showAllCategories"
              >Explore</a
            >
          </router-link>
          <router-link :class="$route.meta.logoClass" to="/" class="become-seller"
            >Become A Seller</router-link
          >
          <div v-if="!loggedInUser">
            <a @click="toggleLogin" :class="$route.meta.logoClass">Sign in</a>
            <a @click="toggleSignup" class="join" :class="$route.meta.bodyClass"
              >Join</a
            >
          </div>
          <div class="login-modal" v-show="showLogin" @click="closeLogin">
            <login
              @toggleLogin="toggleLogin"
              @join="join"
              @closeLogin="toggleLogin"
            />
          </div>
          <div class="signup-modal" v-show="showSignup" @click="closeSignup">
            <signup @toggleSignup="toggleSignup" @closeSignup="toggleSignup" />
          </div>
          <div
            v-if="loggedInUser"
            class="avatar-box"
            @click.stop="openProfileModal"
          >
            <el-avatar :size="40" :src="loggedInUser.imgUrl">{{
              userLatter
            }}</el-avatar>
            <div class="online-dot"></div>
          </div>
          <ul class="profile-nav" v-show="showProfileNav">
            <li>
              <router-link
                to="/user-profile"
                class="profile-txt"
                @click="closeNav"
                >Profile</router-link
              >
            </li>
            <li class="line"></li>
            <li class="logout-btn" @click="doLogout">Logout</li>
            <div class="triangle"></div>
          </ul>
        </nav>
      </div>
    </main>
  </header>
</template>
<script>
import login from "./login.vue";
import signup from "./signup.vue";
import gigFilterHeader from "./gig.filter.header.vue";

export default {
  data() {
    return {
      showSignup: false,
      showLogin: false,
      scrollPosition: null,
      showProfileNav: false,
      filterBy: {
        title: "",
      },
    };
  },
  created() {
    window.addEventListener("scroll", this.updateScroll);
    document.body.addEventListener("click", this.closeProfilePopover);
  },
  methods: {
    closeProfilePopover(event) {
      const elModal = document.getElementsByClassName("profile-nav")[0];
      if (elModal.contains(event.target)) return;
      this.showProfileNav = false;
    },
    setFilter(filterBy) {
      // console.log("filterBy:", filterBy);
      this.$store.dispatch({ type: "setFilter", filterBy });
      this.$router.push("/explore");
    },
    showAllCategories() {
      this.setFilter("");
      // console.log("route:", this.$route);
      if (this.$route.path === "/explore") return;
      this.$router.push("/explore");
    },
    closeSignup(event) {
      const elModal = document.getElementsByClassName("sign-up-container")[0];
      if (elModal.contains(event.target)) return;
      this.showSignup = false;
    },
    closeLogin(event) {
      const elModal = document.getElementsByClassName("login-container")[0];
      if (elModal.contains(event.target)) return;
      this.showLogin = false;
    },
    openProfileModal() {
      this.showProfileNav = true;
    },
    closeNav() {
      this.showProfileNav = false;
    },
    doLogout() {
      this.showProfileNav = false;
      this.$store.dispatch({ type: "logout" });
    },
    join() {
      this.toggleLogin();
      this.toggleSignup();
    },
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    toggleSignup() {
      this.showSignup = !this.showSignup;
    },
    updateScroll() {
      if (!this.isHome) {
        return;
      }
      this.scrollPosition = window.scrollY;
    },
  },
  mounted() {
    window.addEventListener("scroll", this.updateScroll);
  },
  computed: {
    isHome() {
      return this.$route.path === "/";
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser;
    },
    userLatter() {
      const username = this.$store.getters.loggedinUser.username;
      if (username) {
        return username.charAt(0).toUpperCase();
      }
    },
    userImg(){
      return this.$store.getters.loggedinUser.username.imgUrl
    }
  },
  watch: {
    isHome: {
      handler() {
        if (!this.isHome) this.scrollPosition = 0;
      },
    },
  },
  components: {
    login,
    signup,
    gigFilterHeader
  },
};
</script>
