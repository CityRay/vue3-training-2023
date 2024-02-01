import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

const loginPage = 'login.html';

// productModel
const productModel = {
  category: "",
  content: "",
  description: "",
  imageUrl: "",
  imagesUrl: [],
  is_enabled: 1,
  origin_price: 0,
  price: 0,
  title: "",
  unit: "bottle",
  num: 0
};

// API Path
const API_URL = 'https://vue3-course-api.hexschool.io/v2';
const API_PATH = 'rayray-project';

// Modal
let productModal = null;
let delProductModal = null;


const app = createApp({
  data() {
    return {
      products: [],
      productDetail: {},
      tempProduct: {},
      pagination: {}
    };
  },
  methods: {
    userCheck() {
      axios
        .post(`${API_URL}/api/user/check`)
        .then((res) => {
          // console.log(res.data);
          if (res.data.success) {
            this.getProducts();
          } else {
            window.location = loginPage;
          }
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
          window.location = loginPage;
        });
    },
    getProducts(page = 1) {
      axios
        .get(`${API_URL}/api/${API_PATH}/admin/products?page=${page}`)
        .then((res) => {
          // console.log('getProducts', res.data);
          this.products = res.data.products;
          this.pagination = res.data.pagination;
        })
        .catch((err) => {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    openModal(status, product) {
      // console.log('openModal: ', status, product);
      switch (status) {
        case 'add':
          this.tempProduct = { ...productModel };
          if (productModal) {
            productModal.show();
          }
          break;
        case 'edit':
          this.tempProduct = { ...product };
          console.log('this.tempProduct: ', this.tempProduct);
          if (productModal) {
            productModal.show();
          }
          break;
        case 'delete':
          this.tempProduct = { ...product };
          if (delProductModal) {
            delProductModal.show();
          }
          break;
        default:
          break;
      }
    },
  },
  mounted() {
    const tokenCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    if (tokenCookie === '') {
      window.location = loginPage;
    } else {
      // console.log('tokenCookie: ', tokenCookie);
      axios.defaults.headers.common.Authorization = tokenCookie;

      this.userCheck();
    }
  },
});

// Component: ProductModal
app.component('product-modal', {
  template: '#productModal',
  props: ['tempProduct'],
  data() {
    return {
      innerProduct: {}
    };
  },
  mounted() {
    productModal = new bootstrap.Modal('#productModal', {
      keyboard: false,
      backdrop: 'static'
    });
  },
  watch: {
    tempProduct() {
      this.innerProduct = JSON.parse(JSON.stringify(this.tempProduct));
    }
  },
  methods: {
    addImage() {
      if (this.innerProduct.imagesUrl && Array.isArray(this.innerProduct.imagesUrl)) {
        this.innerProduct.imagesUrl.push('');
      } else {
        this.innerProduct.imagesUrl = [''];
      }
    },
    deleteImage() {
      this.innerProduct.imagesUrl.pop();
    },
    handleAddOrUpdate() {
      // console.log('handleAddOrUpdate: ', this.innerProduct);
      if (this.innerProduct.id) {
        // update product
        axios.put(
          `${API_URL}/api/${API_PATH}/admin/product/${this.innerProduct.id}`, { data: this.innerProduct }
        )
          .then((res) => {
            // console.log('update data: ', res.data);
            this.$emit('update');
            alert(res.data.message);
            productModal.hide();
          })
          .catch((err) => {
            alert(err.response.data.message);
            productModal.hide();
          });
      } else {
        // add product
        axios.post(
          `${API_URL}/api/${API_PATH}/admin/product`, { data: this.innerProduct }
        )
          .then((res) => {
            //console.log('update data: ', res.data);
            this.$emit('update');
            alert(res.data.message);
            productModal.hide();
          })
          .catch((err) => {
            alert(err.response.data.message);
            // productModal.hide();
          });
      }
    }
  }
});

// component: DelProductModal
app.component('del-product-modal', {
  template: '#delProductModal',
  props: ['tempProduct'],
  mounted() {
    delProductModal = new bootstrap.Modal('#delProductModal', {
      keyboard: false,
      backdrop: 'static'
    });
  },
  methods: {
    handleDelete() {
      this.$emit('update');
      if (this.tempProduct.id) {
        axios
          .delete(`${API_URL}/api/${API_PATH}/admin/product/${this.tempProduct.id}`)
          .then((res) => {
            // console.log(res.data);
            this.$emit('update');
            alert(res.data.message);
            delProductModal.hide();
          })
          .catch((err) => {
            console.error(err);
            if (err.response) {
              alert(err.response.data.message);
            } else {
              alert(err);
            }

            delProductModal.hide();
          });
      } else {
        delProductModal.hide();
      }
    }
  }
});

// component: Pagination
app.component('pagination', {
  template: '#pagination',
  props: ['paginationData'],
  methods: {
    pageChange(page) {
      // console.log('emitPage', page);
      if (this.paginationData.current_page === page) return;
      this.$emit('emit-page', page);
    }
  }
});

app.mount('#app');
