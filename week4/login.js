import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  data() {
    return {
      userData: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';

      axios
        .post(api, this.userData)
        .then((res) => {
          if (res.data.success && res.data.token) {
            const { token, expired } = res.data;
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}; path=/`;

            window.location = 'products.html';
          } else {
            alert('登入失敗');
          }
        })
        .catch((err) => {
          // console.dir(err.data);
          if (err?.data?.message) {
            // console.log(err.data.message);
            alert(err.data.message);
          }
        });
    },
  },
}).mount('#app');
