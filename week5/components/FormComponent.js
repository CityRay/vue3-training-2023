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

const userModel = {
  name: '',
  email: '',
  tel: '',
  address: '',
};

export default {
  template: '#formComponent',
  components: {
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  props: {
    cart: {
      type: Object,
      default() {
        return {};
      }
    },
    disableBtn: {
      type: Boolean,
      default() {
        return false;
      }
    },
    loadingItems: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      form: {
        user: { ...userModel },
        message: '',
      }
    };
  },
  methods: {
    onFormSubmit() {
      this.$refs.form.validate().then(() => {
        // console.log('onFormSubmit', this.form);
        this.$emit('submit-form', this.form, () => {
          this.$refs.form.resetForm();
        });
      });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : '需要正確的電話號碼';
    }
  }
};
