// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

import ProductModal from './components/ProductModal.js';
import FormComponent from './components/FormComponent.js';

// API Path
const API_URL = 'https://vue3-course-api.hexschool.io/v2';
const API_PATH = 'rayray-project';

const app = Vue.createApp({
  components: {
    ProductModal: ProductModal,
    FormComponent: FormComponent
  },
  data() {
    return {
      products: [],
      tmpProduct: {},
      product: {},
      cart: {},
      loadingItems: []
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
          this.loadingItems = this.loadingItems.filter(item => item !== 'cleanCart');
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
    onFormSubmit(data, cb) {
      this.loadingItems.push('createOrder');

      axios.post(`${API_URL}/api/${API_PATH}/order`, { data })
        .then((res) => {
          // console.log('onFormSubmit order', res.data);
          cb();
          this.getCart();
          alert(res.data.message);
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        }).finally(() => {
          this.loadingItems = this.loadingItems.filter(item => item !== 'createOrder');
        });
    }
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
  computed: {
    disableBtn() {
      if (!this.cart.carts?.length) return true;
      if (this.loadingItems.includes('cleanCart')) return true;
      if (this.loadingItems.includes('createOrder')) return true;
      return false;
    },
  },
});

app.mount('#app');
