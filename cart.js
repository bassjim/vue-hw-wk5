
const apiUri = 'https://vue3-course-api.hexschool.io/v2/';
const apiPath = 'bassjim';

const productModal ={
    props:['id','addToCart'],
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
            console.log(' productModal',this.id)
            const url = `${apiUri}api/${apiPath}/product/${this.id}`;
            axios.get(`${url}`)
            .then(res =>{
                console.log('單一產品',res.data.product);
                this.tempProduct = res.data.product;
                this.modal.show()
            })
        }
    },
    methods:{
        hide(){
            this.modal.hide()
        }
    },
    mounted(){
      this.modal =  new bootstrap.Modal(this.$refs.modal);
    //   this.modal.show()
    }
}

const app = Vue.createApp({
    data(){
        return{
            products: [],
            itemId:'',
            product: {},
            cart:{},
        }
    },
    methods: {
        getProducts(){
            const url = `${apiUri}api/${apiPath}/products/all`;
            axios.get(`${url}`)
            .then(res =>{
                console.log('產品列表',res.data.products);
                this.products = res.data.products;
            })
        },
        openModal(id){
            this.itemId = id;
            console.log('產品列表',id)
        },
        addToCart(product_id,qty = 1){
            const data = {
                product_id,
               qty,
            };
            const url = `${apiUri}api/${apiPath}/cart`;
            axios.post(`${url}`,{data})
            .then(res =>{
                console.log('加入購物車',res.data);
                this.$refs.productModal.hide();
                this.getCarts();
            })
        },
        getCarts(){
            const url = `${apiUri}api/${apiPath}/cart`;
            axios.get(`${url}`)
            .then(res =>{
                console.log('購物車',res.data);
                this.cart = res.data.data;
            })
        },
        
    },
    components:{
        productModal
    },
    mounted(){
        this.getProducts();
        this.getCarts();
    }

});
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);
app.mount('#app')