// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import ProductModal from '/week5/components/ProductModal.js';

const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

loadLocaleFromURL('/week5/locale/zh_TW.json');
configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

// API Path
const API_URL = 'https://vue3-course-api.hexschool.io/v2';
const API_PATH = 'rayray-project';

const userModel = {
  name: '',
  email: '',
  tel: '',
  address: '',
};

const app = Vue.createApp({
  components: {
    ProductModal: ProductModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  data() {
    return {
      products: [],
      tmpProduct: {},
      product: {},
      cart: {},
      loadingItems: [],
      form: {
        user: { ...userModel },
        message: '',
      }
    };
  },
  methods: {
    getProducts(page = 1) {
      axios
        .get(`${API_URL}/api/${API_PATH}/products?page=${page}`)
        .then((res) => {
          // console.log('getProducts', res.data);
          this.products = res.data.products;
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    getCart() {
      axios
        .get(`${API_URL}/api/${API_PATH}/cart`)
        .then((res) => {
          // console.log('getCart', res.data);
          this.cart = res.data.data;
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      // console.log('cart id', id);
      this.loadingItems.push(id);
      const data = {
        product_id: id,
        qty
      };

      axios
        .post(`${API_URL}/api/${API_PATH}/cart`, { data })
        .then((res) => {
          // console.log('addToCart', res.data);
          this.getCart();
          this.loadingItems = this.loadingItems.filter(item => item !== id);
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    removeToCart(id) {
      this.loadingItems.push(id);

      axios
        .delete(`${API_URL}/api/${API_PATH}/cart/${id}`)
        .then((res) => {
          // console.log('removeToCart', res.data);
          this.getCart();
          this.loadingItems = this.loadingItems.filter(item => item !== id);
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    cleanCart() {
      this.loadingItems.push('cleanCart');

      axios
        .delete(`${API_URL}/api/${API_PATH}/carts`)
        .then((res) => {
          // console.log('cleanCart', res.data);
          this.getCart();
          this.loadingItems = [];
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    cartQtyChange(id, qty = 1) {
      this.loadingItems.push(id);

      const data = {
        product_id: id,
        qty
      };

      // console.log('cartQtyChange', data);

      axios
        .put(`${API_URL}/api/${API_PATH}/cart/${id}`, { data })
        .then((res) => {
          this.loadingItems = this.loadingItems.filter(item => item !== id);
          this.getCart();
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });

    },
    openModal(product) {
      // console.log('openModal', product);
      this.tmpProduct = { ...product };
      this.$refs.productModal.openModal();
    },
    onFormSubmit() {
      this.loadingItems.push('createOrder');

      // console.log('onFormSubmit', this.form);
      axios.post(`${API_URL}/api/${API_PATH}/order`, { data: this.form })
        .then((res) => {
          // console.log('onFormSubmit order', res.data);
          this.$refs.form.resetForm();
          this.getCart();
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        }).finally(() => {
          this.loadingItems = this.loadingItems.filter(item => item !== 'createOrder');
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  }
});


app.mount('#app');