import { vForm, vField ,ErrorMessage } from 'vee-validate';
const apiUri = 'https://hexschool.github.io/v2/';
const apiPath = 'bassjim';

const productModal = {
    props:['id'],
    data(){
        return{
            model:{},
            tempProduct:{},
        };
    },
    template:'#userProductModal',
    watch:{
        id(){
            console.log('productModal',this.id);
            if(this.id){
                const url = `${this.apiUri}api/${this.apiPath}/admin/Products/${this.id}`;
                console.log('productModal',this.id);
                this.modal = new bootstrap.Modal(this.$ref.Modal);
                this.modal.shows();
            }
            
        }
    },
    methods:{
        hide(){
            this.modal.hide()
        }
    },

};


const app = Vue.createApp({
    data(){
        return{
            modal:{},
            tempProduct:{},
            productId:"",
            qty:1,
            cart:{},
            loadingItem:"",
            product:[]
        }
    },
    methods: {
        getProducts(){
            const url = `${this.apiUri}api/${this.apiPath}/admin/Products/all`;
            axios.get(`${url}`)
            .then((res)=>{
                this.products = res.data.products;
                console.log(res);
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
        openModal(id){
            this.productId = id;

        },
        addToCarts(product_id,qty = 1){
            const url = `${this.apiUri}api/${this.apiPath}/admin/Products/all`;
            const data = {
                product_id,
                qty,
            }
            axios.get(`${this.apiUri}api/${this.apiPath}/admin/cart/`,{data})
            .then(res => {
                console.log(res);
                this.$ref.productModal;
            })
            .catch(err => {
                console.error(err); 
            })
        },
        getCarts(){
            axios.get(`${this.apiUri}api/${this.apiPath}/cart`,)
            .then((res)=>{
                this.products = res.data.products;
                console.log('購物車',res);
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
    
        },
        updatedCartItem(id) {
            const data = {
                product_id:Item.product.id,
                qty:Item.qty,
            };
            axios.put(`${this.apiUri}api/${this.apiPath}/cart`,)
            .then((res)=>{
                console.log(res);
            })
            .catch(err=>{
                alert(err.response.data.message);
            })
        },
    },
    components:{
        productModal,
        vForm,
        vField,
        ErrorMessage
    },
    mounted(){
        this.getProducts
    }
});
app.mount('#app');