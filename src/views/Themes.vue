


<template>
  <div class="themes">
    <p>{{userProfile}}</p>
    <ul>
      <li v-for="(item,index) in  userProfile && userProfile.functions">{{item.label}}</li>
    </ul>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Theme',
  title() {
    return {
      title: 'Themes',
      keywords: 'vue-ssr服务端脚手架, themes',
      description: 'vue-ssr-template, vue-server-renderer, themes'
    }
  },
  computed: {
    ...mapGetters({
      userProfile: 'getUserProfile'
    })
  },
  methods: {
    themeView(id) {
      this.$router.push({ path: '/theme/' + id, params: { id } })
    }
  },
  asyncData({ store }) {
    return store.dispatch('getUserProfile')
  }
}
</script>

