<template>
    <div id='app'>
        <v-header :seller = "seller"></v-header>
        <div class='tab'>
            <div class='tab-item'>
              <router-link :to="{name:'goods'}">商品</router-link>
            </div>
            <div class='tab-item'>
              <router-link :to="{name:'ratings'}">评论</router-link>
            </div>
            <div class='tab-item'>
              <router-link :to="{name:'seller'}">商家</router-link>
            </div>
        </div>
        <keep-alive>
          <router-view :seller ='seller' :ratings='ratings' :goods='goods'></router-view>
        </keep-alive>
    </div>
</template>

<script>
import header from './components/header/header.vue';
import {analyzeUrlParam} from './common/js/utils.js';
export default {
  name:'app',
  data(){
    return{
      seller:{
        id:(()=>{
          let urlInfo = analyzeUrlParam();
          return urlInfo.id
        })()
      },
      ratings:[],
      goods:[]
    }
  },
  created(){
    analyzeUrlParam();
    this.$http.get('/api/seller').then((response)=>{
      response = response.body;
      if(response.errno){
        //将两个对象的属性合并
        this.seller = Object.assign({},this.seller,response.data);
      }
    },(response)=>{
      console.log(response)
    });
    //预防切换tab时数据闪烁
    this.$http.get('/api/ratings').then((response)=>{
        response = response.body;
        if(response.errno){
          this.ratings =response.data;
        }
      },(response)=>{
        console.log(response)
    });
    //goods商品数据请求
    this.$http.get('/api/goods').then((response)=>{
      response = response.body;
      if(response.errno){
        this.goods =response.data;
       }
    },(response)=>{
      console.log(response)
    }); 
  },
  components:{'v-header':header}
}
</script>
<style scope>
/*flex盒子布局 其中兼容性写法由vue-loader中的postcss去解决兼容问题*/
#app .tab{
  position: relative;
  display: flex;
  width:100%;
  height:40px;
  line-height: 40px;
}
.tab:after{
    content: '';
    width:100%;
    position:absolute;
    bottom:0;
    left:0;
    border-top: 1px solid rgba(7,17,27,0.1); 
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
}
.tab .tab-item{
  flex:1;
  text-align: center;
}
.tab .tab-item a{
  display:block;
  width:100%;
  text-decoration: none;
  font-size:14px;
  color:rgb(77,85,93);
}
.tab .tab-item .router-link-active{
  color:rgb(240,20,20);
}
</style>
