
const apiUri = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'bassjim';




const app = Vue.createApp({
    data(){
        return{
            products: [],
        }
    },
    methods: {
        getProducts(){
            const url = `${this.apiUri}api/${this.apiPath}/products/all`;
            axios.get(`${url}`)
            .then(res =>{
                console.log('產品列表',res.data.products);
   
            })
        },

    },
    mounted(){
        this.getProducts();
    }

});
app.mount('#app')