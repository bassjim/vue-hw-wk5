Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
      VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
  });
  // 讀取外部的資源
  VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
  
  // Activate the locale
  VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
  });


const apiUri = 'https://vue3-course-api.hexschool.io/v2/';
const apiPath = 'bassjim';

const productModal ={
    props:['id','addToCart','openModal'],
    data(){
       return{
        modal:{},
        tempProduct:{},
        qty:1,
        
       };
    },
    template:'#userProductModal',
    watch:{
        id(){
            if(this.id){
                const url = `${apiUri}api/${apiPath}/product/${this.id}`;
                axios.get(`${url}`)
                .then((res) =>{
                    this.tempProduct = res.data.product;
                    this.modal.show()
                });
            }

        },
    },
    methods:{
        hide(){
            this.modal.hide()
        }
    },
    mounted(){
        this.modal =  new bootstrap.Modal(this.$refs.modal);
        //   監聽DOM，當MODAL關閉時....要做的事
        this.$refs.modal.addEventListener('hidden.bs.modal', event => {
            this.openModal('')
      });
    }
}

const app = Vue.createApp({
    data(){
        return{
            products: [],
            itemId:'',
            product: {},
            cart:{},
            loadingItem:'',//存ID
            isLoading: false,
            form: {
                user: {
                  name: '',
                  email: '',
                  tel: '',
                  address: '',
                },
                message: '',
        
              }
              
        }
    },
    methods: {
        getProducts(){
            const url = `${apiUri}api/${apiPath}/products/all`;
            axios.get(`${url}`)
            .then((res) =>{
                this.products = res.data.products;
                this.isLoading = false;
            })
            .catch((err)=>{
                console.log(err)
              })
        },
        openModal(id){
            this.itemId = id;

        },
        addToCart(product_id,qty = 1){
            const data = {
                product_id,
                qty,
            };
            const url = `${apiUri}api/${apiPath}/cart`;
            axios.post(`${url}`,{data})
            .then((res) =>{
                Swal.fire(
                    {
                        title: "加入購物車", //標題
                        icon: "success"
                    }
                );
                this.isLoading = true;
                setTimeout(() => {
                  // 0.3 秒後結束 loading
                  this.isLoading = false;
                },300);
                this.$refs.productModal.hide();
                this.getCarts();
            })
        },
        getCarts(){
            const url = `${apiUri}api/${apiPath}/cart`;
            axios.get(`${url}`)
            .then((res) =>{
                this.cart = res.data.data;
            })
            .catch((err)=>{
                console.log(err)
              })
        },
        updateCartItem(item){
            const data ={
                product_id:item.product.id,
                qty: item.qty,
            };
            this.loadingItem = item.id;
            const url = `${apiUri}api/${apiPath}/cart/${item.id}`;
            axios.put(`${url}`,{data})
            .then((res) =>{
                this.cart = res.data.data;
                this.getCarts();
                this.loadingItem = '';
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        deleteItem(id){
            this.loadingItem = id;
            axios
            .delete(`${apiUri}api/${apiPath}/cart/${id}`)
            .then((res) =>{
                this.getCarts();
                this.isLoading = true;
                setTimeout(() => {
                  // 0.3 秒後結束 loading
                  this.isLoading = false;
                },300);
            })
            .catch((err)=>{
                console.log(err)
            })
        },
        clearCart(){            
            axios.delete(`${apiUri}/api/${apiPath}/carts`)  
            .then((res)=>{
                Swal.fire({
                    title: "購物車目前沒有商品", //標題
                    icon: "question"
                }
                );                
              this.getCarts();
              this.loadingItem = ''
            })
            .catch((err)=>{
              console.log(err)
            })
        },
        //自訂驗證
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '需要正確的電話號碼'
         },       
        createOrder(){
            axios.post(`${apiUri}/api/${apiPath}/order`,{ data :this.form })
            .then((res)=>{
                alert(res.data.message);
                this.getCarts();
                this.$refs.form.resetForm();
                this.clearCart('');
            })
            .catch(error=>{            
                console.log(error);
            })
        },
    },
    components:{
        productModal,
    },
    mounted(){
        this.isLoading = true;
        this.getProducts();
        this.getCarts();
        this.clearCart('');
    }

});
app.use(VueLoading.LoadingPlugin);
app.component('loading', VueLoading.Component);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app')