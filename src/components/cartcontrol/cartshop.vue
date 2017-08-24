<template>
    <div class='cartshop'>
        <div class='content'>
            <div class='content-left' @click='toggleList'>
                <div class='cartWrap'>
                    <div class='icon-shopping_cart' :class='{highColor:foodCount>0}'></div>
                </div>
                <div v-if='foodCount>0' class='foodcount'>{{foodCount}}</div>
                <div class='allPrice' :class='{highColor:foodCount>0}'>￥{{AllPrice}}</div>
                <div class='peisong'>另需配送费￥{{deliveryPrice}}元</div>
            </div>
            <div class='content-right' :class='{highColor:AllPrice>minPrice}'>
                <p>{{DescPric}}</p><!-- ￥{{minPrice}}(22)起送 -->
            </div>
        </div>
        <!-- 抛物线小球 -->
        <div class='ball-container'>
          <div v-for='ball in balls'>
            <transition name='drop' @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
              <div v-show='ball.show' class='ball'>
                <div class="inner inner-hook"></div>
              </div>
            </transition>
          </div>
        </div>
        <!-- 点击购物车弹出选中商品列表 -->
        <transition name='cList'>
          <div class='cartlist' v-show='showlist'>
            <div class='cartlist-header'>
              <h3 class='title'>购物车</h3>
              <span class='empty' @click='clearlist'>清空</span>
            </div>
            <div class='cartlist-content' ref='cartlistContent'>
              <ul>
                <li class='fooditem' v-for='food in selectFoods'>
                  <div class='goodsName'>{{food.name}}</div>
                  <div class='foodsPrice'>￥{{food.price}}</div>
                  <cartcontrol @cartAdd ='drop' :food ='food'></cartcontrol>
                </li>
              </ul>
            </div>
          </div>
        </transition>
        <transition name='bcart'>
          <div class='bgcart' v-show='showlist' @click='toggleList'></div>
        </transition>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from './cartcontrol.vue';
    export default {
        props: {
            //选中商品
            selectFoods:{
                type:Array
            },
            //起送价
            minPrice:{
                type:Number
            },
            //配送费
            deliveryPrice:{
                type:Number
            }
        },
        data(){
            return{
              balls:[{
                show:false
              },{
                show:false
              },{
                show:false
              },{
                show:false
              },{
                show:false
              }],
              dropBalls:[],//当前正在做动画的抛物线小球
              fold:true
           }
        },
        computed:{
            AllPrice:function(){
               let ap = 0;
               this.selectFoods.forEach((item)=>{
                    ap +=item.price*item.count;
                  }) 
               return ap
            },
            foodCount:function(){
                let count = 0;
                this.selectFoods.forEach((item)=>{
                    count +=item.count;
               })
               return count; 
            },
            DescPric:function(){
                if(this.AllPrice==0){
                    return '￥'+this.minPrice+'起送';
                }else if(this.AllPrice<this.minPrice){
                    let price =this.minPrice -this.AllPrice;
                    return '还差￥'+price+'起送';
                }else if(this.AllPrice>this.minPrice){
                    return '结算';
                }
            },
            showlist:function(){
              if(!this.foodCount){
                this.fold =true
                return false;
              }
              let show = !this.fold
              if(show){
                this.$nextTick(()=>{
                  //仅初始化一次
                  if(!this.cartlistScroll){
                    this.cartlistScroll = new BScroll(this.$refs.cartlistContent, {
                      click:true
                    });
                  }else{
                    this.cartlistScroll.refresh()
                  }
                })
              }
              return show;
            }
        },
        methods:{
          drop(el){
            for(let i=0; i<this.balls.length;i++){
              let ball = this.balls[i];
              if(!ball.show){
                ball.show=true;
                ball.el = el;
                this.dropBalls.push(ball)
                return;
              }
            }
          },
          beforeEnter(el){
            let count = this.balls.length;
            while (count--) {
              let ball = this.balls[count];
              if (ball.show===true) {
                //cartcontrol组件的加号DOM对象相对视窗的距离
                let rect = ball.el.getBoundingClientRect();
                let x =rect.left - 32;
                let y = -(window.innerHeight - rect.top - 23);
                el.style.display = '';
                //小球纵轴做动画
                el.style.webkitTransform = `translate3d(0,${y}px,0)`;
                el.style.transform = `translate3d(0,${y}px,0)`;
                //小球横轴做动画 向左平移
                let inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
                inner.style.transform = `translate3d(${x}px,0,0)`;
              }
            }
          },
          enter(el){
            //触发浏览器重绘
            let rf = el.offsetHeight;
            //重置样式
            this.$nextTick(() => {
              el.style.webkitTransform = 'translate3d(0,0,0)';
              el.style.transform = 'translate3d(0,0,0)';
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.webkitTransform = 'translate3d(0,0,0)';
              inner.style.transform = 'translate3d(0,0,0)';
            });

          },
          afterEnter(el){
             let ball = this.dropBalls.shift();
              if (ball) {
                el.style.display = 'none';
                ball.show = false;
              }
          },
          //切换显示购物车列表
          toggleList(){
            if(!this.foodCount){
              return false;
            }
            this.fold = !this.fold
          },
          //清空购物车
          clearlist(){
            //清空其数量
            this.selectFoods.forEach((food)=>{
              food.count = 0
            })
          }
        },
        components:{cartcontrol}
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
@import "../../common/stylus/mixin.styl"
.cartshop
    position:fixed
    left:0
    bottom:0
    width:100%
    height:48px
    z-index:99
    .content
        display:flex
        width:100%
        background-color:#141d27
        .content-left
            position:relative
            display:inline-block
            flex:1
            .foodcount
               position:absolute
               top:-8px
               left:44px
               width:24px
               border-radius:6px
               box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
               font-size:9px
               font-weight:700
               text-align:center
               line-height:16px
               color:#fff
               background-color:rgb(240,20,20)
            .cartWrap
               position:absolute
               top:-10px
               left:12px
               width:56px
               height:56px
               padding:6px
               box-sizing:border-box
               border-radius:50%
               background-color:#141d27
               font-size:0
               .icon-shopping_cart
                    width: 100%
                    height: 100%
                    line-height: 44px
                    border-radius: 50%
                    font-size: 28px
                    text-align: center
                    color: rgba(255,255,255,0.4)
                    background-color: #2b343c
                    &.highColor
                        background-color:rgb(0,160,220)
                        color:#fff
                   
            .allPrice
                 display:inline-block
                 line-height:24px
                 margin: 12px 0 0 80px
                 padding-right:12px
                 border-right:1px solid rgba(255,255,255,0.1)
                 font-size: 16px
                 font-weight:700
                 color:rgba(255,255,255,0.4)
                 &.highColor
                   color:rgb(255,255,255)  
            .peisong
                display:inline-block
                padding-left:12px
                line-height:48px
                font-size:12px
                font-weight:400
                color:rgba(255,255,255,0.4)
            
        .content-right  
            display:inline-block 
            height:48px
            line-height: 48px
            flex:0 0 105px
            padding:0 8px
            box-sizing:border-box 
            background-color:#2B333B
            &.highColor
               background-color:#1f9324 
            &.highColor p
                color:#fff
            p
                font-size:12px
                font-weight:700
                text-align:center
                color:rgba(255,255,255,0.4)
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.6s cubic-bezier(.76,-0.75,.36,.94)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear        
    .cartlist
      position:absolute
      left:0
      bottom:48px
      width:100%
      z-index:-1
      transition:all 0.4s
      &.cList-enter,&.cList-leave-to
        transform:translate3d(0,100%,0)
      .cartlist-header
        overflow:hidden
        height:40px
        line-height: 40px
        padding:0 18px
        background-color:#f3f5f7
        border-bottom:1px solid rgba(7,17,27,0.1)
        .title
          float:left
          font-size:14px
          font-weight:200
          color:rgb(7,17,27)
        .empty
          float:right
          font-size:12px
          color:rgb(0,160,220)
      .cartlist-content
        padding:0 18px
        background-color:#fff
        padding-bottom:20px
        max-height:224.5px
        overflow:hidden
        ul
          width:100%
          li.fooditem
            position:relative
            overflow:hidden
            width:100%
            padding:12px 0
            border-1px(rgba(7,17,27,0.1))
            .goodsName
              float:left
              font-size:12px
              color:rgb(7,17,27)
              line-height:24px
            .foodsPrice
              position:absolute
              right:84px
              top:12px
              padding-left:18px
              font-size:10px
              font-weight:normal
              line-height:24px
              color:rgb(240,20,20)
            .cartcontrol
              float:right
.bgcart
  position:fixed
  left:0
  top:0
  width:100%
  height:100%
  background-color:rgba(7,17,27,0.6)
  z-index:-2
  transition:all 0.4s
  &.bcart-enter,&.bcart-leave-to
    opacity:0
</style>