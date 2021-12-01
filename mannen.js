window.onload= Main;

const baseURL = "http://localhost:3000";

function Main(){
	mannenApp =  new Vue({
		el:"#mannenApp",
		data:{
			input:"",
			mannens:[],
			cart:[],
			viewCart:[],
			detailItem:"",
			page: "top",
			isActive: false
		},
	methods:{
		addItem(mannen){
			this.cart.push(mannen);
			this.viewCart.push(mannen);

			const orderURL = baseURL + '/mannens/' + event.target.name;
			fetch(orderURL, { method: 'GET' })
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				let updatedStock = response.stock ;
				fetch(orderURL, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"stock": updatedStock,
						"name": response.name,
						"image": response.image,
						"price": response.price,
					})
				})
				.then((res) => {
					if(updatedStock <= 0){
						this.isActive = true;
					}	
				});
			})
			.catch((response) => {
				console.log(response);
			});
		},
		removeItem(index){
			this.cart.splice(index,1);
			this.viewCart.splice(index,1);

			const orderURL = baseURL + '/mannens/' + event.target.name;
			fetch(orderURL, { method: 'GET' })
			.then((response) => {
				return response.json();
			})
			.then((response) => {
				//console.log(response.stock);
				//console.log(updatedStock);
				let updatedStock = response.stock;
				fetch(orderURL, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						"stock": updatedStock,
						"name": response.name,
						"image": response.image,
						"price": response.price,
					})
				})
				.then((res) => {
				if(updatedStock > 3){
					updatedStock = 3;
				}
				});
			})
			.catch((response) => {
				console.log(response);
			});
		},
		toCart(page){
			this.page = "cart"
		},
		toTop(page){
			this.page = "top"
		},
		toAbout(page){
			this.page = "about"
		},
		toItem(page){
			this.page = "item"
		},
		toGet(page){
			this.page = "get";
			this.cart.splice(0);
		},
		showDetail(mannen){
			console.log(mannen);
			this.datailItem = mannen;
		},
		searchMannenByName:function(event){
			if(event.keyCode == 13){
				let url = "/mannens?name_like=" +this.input;
				url = baseURL+ encodeURI(url);
				this.updateMannens(url);
			}
		},
		updateMannens: function(url){
			fetch(url,{method:"GET"})
			.then((responce) => {
				return responce.json();
			})
			.then((res) => {
				if(Array.isArray(res)){
					this.mannens = res;
				}
				else{
					this.mannens = [res];
				}
			})
			.catch((res) => {
				console.log(res);
			});
		}
	},
	computed: {
		total: function (){
			let total = 0;
			this.cart.forEach(mannen => {
				total += mannen.price;
			});
			return total;
		}
	},
	mounted: function(event){
		this.updateMannens(baseURL + "/mannens");
	}
	});
}