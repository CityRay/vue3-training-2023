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
  unit: "",
  num: 0
};

// Modal
let productModal = null;
let delProductModal = null;


createApp({
  data()
  {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'rayray-project',
      products: [],
      productDetail: {},
      tempProduct: {}
    };
  },
  methods: {
    userCheck()
    {
      axios
        .post(`${this.apiUrl}/api/user/check`)
        .then((res) =>
        {
          // console.log(res.data);
          if (res.data.success)
          {
            this.getProducts();
          } else
          {
            window.location = loginPage;
          }
        })
        .catch((err) =>
        {
          // console.log(err);
          alert(err.response.data.message);
          window.location = loginPage;
        });
    },
    getProducts()
    {
      axios
        .get(`${this.apiUrl}/api/${this.apiPath}/admin/products`)
        .then((res) =>
        {
          // console.log(res.data);
          this.products = res.data.products;
        })
        .catch((err) =>
        {
          // console.log(err);
          alert(err.response.data.message);
        });
    },
    openModal(status, product)
    {
      // console.log('openModal: ', status, product);
      switch (status)
      {
        case 'add':
          this.tempProduct = { ...productModel };
          productModal.show();
          break;
        case 'edit':
          this.tempProduct = { ...product };
          productModal.show();
          break;
        case 'delete':
          this.tempProduct = { ...product };
          delProductModal.show();
          break;
        default:
          break;
      }
    },
    handleAddOrUpdate()
    {
      // console.log('handleSave: ', this.tempProduct);
      if (this.tempProduct.id)
      {
        // update product
        axios.put(
          `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`, { data: this.tempProduct }
        )
          .then((res) =>
          {
            // console.log('update data: ', res.data);
            this.getProducts();
            alert(res.data.message);
            productModal.hide();
          })
          .catch((err) =>
          {
            alert(err.response.data.message);
            productModal.hide();
          });
      } else
      {
        // add product
        axios.post(
          `${this.apiUrl}/api/${this.apiPath}/admin/product`, { data: this.tempProduct }
        )
          .then((res) =>
          {
            // console.log('update data: ', res.data);
            this.getProducts();
            alert(res.data.message);
            productModal.hide();
          })
          .catch((err) =>
          {
            alert(err.response.data.message);
            productModal.hide();
          });
      }
    },
    handleDelete()
    {
      // console.log('handleDelete: ', this.tempProduct);
      if (this.tempProduct.id)
      {
        axios
          .delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`)
          .then((res) =>
          {
            // console.log(res.data);
            this.getProducts();
            alert(res.data.message);
            delProductModal.hide();
          })
          .catch((err) =>
          {
            // console.error(err.response.data);
            alert(err.response.data.message);
            delProductModal.hide();
          });
      } else
      {
        delProductModal.hide();
      }
    }
  },
  mounted()
  {
    const tokenCookie = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      '$1'
    );

    if (tokenCookie === '')
    {
      window.location = loginPage;
    } else
    {
      // console.log('tokenCookie: ', tokenCookie);
      axios.defaults.headers.common.Authorization = tokenCookie;

      productModal = new bootstrap.Modal('#productModal', {
        keyboard: false,
        backdrop: 'static'
      });

      delProductModal = new bootstrap.Modal('#delProductModal', {
        keyboard: false,
        backdrop: 'static'
      });

      this.userCheck();
    }
  },
}).mount('#app');
