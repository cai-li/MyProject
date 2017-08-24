<template>
    <div class="goods">
        <div ref='menuWrapper'>
            <div class='goodsMenu'>
                <div v-for='(item,index) in goods' class='Menu-item Menu-hook' :class='{currentMenu:currentIndex===index}' @click='menuClick(index,$event)'>
                    <span class='itemText'><span v-show='item.type>0' class='h-iconJ' :class='classMap[item.type]'></span>{{item.name}}</span>
                </div> 
            </div> 
        </div>
        <div ref='foodsWrapper'>
            <div class='goodsLists'>
               <div class='listOne food-list-hook' v-for='item in goods'>
                   <h1 class='listOneTitle'>{{item.name}}</h1>
                   <div class='foodsOne' :class='{boderBottom:item.foods.length>1}' v-for='list in item.foods' @click='showfood(list,$event)'>
                        <cartcontrol @cartAdd ='_drop' :food ='list'></cartcontrol>
                        <div class='listImg'>
                            <img :src="list.image">
                        </div>
                        <div class='goodInfo'>
                            <div class='goodsName'>{{list.name}}</div>
                            <div class='goodsDesc'>{{list.description}}</div>
                            <div class='goodsxs'><span>月售{{list.sellCount}}份</span><span>好评率{{list.rating}}%</span></div>
                            <div class='foodsPrice'><span>￥{{list.price}}</span><span class='old' v-show='list.oldPrice!=""'>￥{{list.oldPrice}}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <cartshop ref='shopcart' :selectFoods = 'selectFoods' :minPrice = 'seller.minPrice' :deliveryPrice = 'seller.deliveryPrice'></cartshop>
        <food @cartAddEvent='_drop' ref='thisfood' :selectedfood = 'selectedfood'></food>
    </div>
</template>

<script>
    import BScroll from 'better-scroll';
    import cartcontrol from '../cartcontrol/cartcontrol.vue';
    import cartshop from '../cartcontrol/cartshop.vue';
    import food from '../food/food.vue';
    export default {
        name: 'goods',
        components:{cartcontrol,cartshop,food},
        props: {
            seller:{
                type:Object
            },
            ratings:{
                type:Array
            }
        },
        data(){
            return{
                goods:[],
               listHeight:[],//每个菜单将要滑动的height
               scrollY:0,
               selectedfood:{}//被点击的商品信息
            }
        },
        computed:{ 
            //选中到购物车中的商品数据,由每一个food对象组成
            selectFoods:function(){
                let foods =[];
                this.goods.forEach((item)=>{
                    item.foods.forEach((fd)=>{
                        if(fd.count){
                            foods.push(fd)
                        }
                    })
                })
                return foods;
            },
            currentIndex:function(){
                for(let i=0;i<this.listHeight.length;i++){
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];
                    if(!height2||(this.scrollY>=height1&&this.scrollY<height2)){
                        return i
                    }
                }
            },
            //被点击的商品food
        },
        created(){
            //左侧菜单图标信息
            this.classMap=['decrease_3','discount_3','guarantee_3','invoice_3','special_3'];
            //goods商品数据请求
            this.$http.get('/api/goods').then((response)=>{
              response = response.body;
              if(response.errno){
                this.goods =response.data;
                this.$nextTick(()=>{
                  this._initScroll();
                  this._calculateHeight();
                })
               }
            },(response)=>{
              console.log(response)
            }); 
            
        },
        methods:{
            //点击展示商品详情界面
            showfood(food,event){
                if(!event._constructed) return false;
                this.selectedfood = food;
                this.$refs.thisfood.showthisfood()
            },
            //获取子组件的数据
            _drop(el){
                    this.$refs.shopcart.drop(el)
            },
            //点击菜单显示右侧相应菜单
            menuClick(index,event){
                if(!event._constructed) return false;
                let foodLists = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                let el =foodLists[index];
                this.foodsScroll.scrollToElement(el, 500)
            },
            //初始化better-scroll
            _initScroll() {
                if(!this.meunScroll){
                    //获取better-scroll实例
                    this.meunScroll = new BScroll(this.$refs.menuWrapper, {
                        click:true
                    });
                }else{
                    this.meunScroll.refresh();
                }
                if(!this.foodsScroll){
                    this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                        click:true,
                        probeType:3
                    });
                }else{
                    this.foodsScroll.refresh();
                }
                this.foodsScroll.on('scroll',(pos)=>{
                    this.scrollY =Math.abs(Math.round(pos.y));
                    let len =this.listHeight.length;
                    //滑动到极限时滚动
                    if(this.scrollY<this.listHeight[1]&&this.scrollY>this.listHeight[0]){
                        this.meunScroll.scrollTo(0,0,500);
                    }else if(this.scrollY<this.listHeight[len-1]&&this.scrollY>this.listHeight[len-2]){
                        this.meunScroll.scrollTo(0,-37,500);
                    }
                })
            },
              //获取右侧商品每个列表的y坐标,组成数组listHeight
            _calculateHeight() {
                if(this.$refs.foodsWrapper){
                    let foodLists = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
                    //第一个列表坐标
                    let height=0;
                    this.listHeight.push(height);
                    for(let i=0,len=foodLists.length;i<len;i++){
                        let item =foodLists[i];
                        height += item.clientHeight;
                        this.listHeight.push(height);
                    } 
                }
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
.goods
    position:absolute
    display: flex
    width:100%
    bottom:46px
    top:176.4px
    overflow: hidden
    .goodsMenu
        flex: 0,0,80px
        width:80px
        padding:0 12px
        background-color:#f3f5f7
        box-sizing:border-box
        .Menu-item:after
            position:absolute
            content: ''
            width:100%
            bottom:0
            left:0
            border-top: 1px solid rgba(7,17,27,0.1)
            -webkit-transform: scaleY(0.5)
            transform: scaleY(0.5)
        
        .Menu-item:last-child:after
            border-top:none;        
        .currentMenu
            background-color:#fff
            color:#000
            padding: 0 12px
            margin: -1px 0 0 -12px
            border:none
        .Menu-item
            position:relative
            display: table
            width:100%
            height:54px
            font-size:0
            .itemText
                display: table-cell
                font-size:12px
                color:#07111B
                font-weight: 200
                line-height: 14px
                vertical-align: middle
                .h-iconJ
                    display: inline-block
                    width:14px
                    height:14px
                    margin-right:4px
                    background-size:14px 14px
                
                .decrease_3
                    background-image: url('decrease_3@2x.png')
                
                .discount_3
                   background-image: url('discount_3@2x.png')
               
               .guarantee_3
                   background-image: url('guarantee_3@2x.png')
               
               .invoice_3
                   background-image: url('invoice_3@2x.png')
               
               .special_3
                   background-image: url('special_3@2x.png')

   /*右侧商品区*/
   .goodsLists
       flex: 1
       /*一个菜单分类*/
       .listOne
            width:100%
            /*分类名*/
            .listOneTitle
                width:100%
                height:26px
                line-height: 26px
                border-left:2px solid #d9dde1
                background-color:#f3f5f7
                padding-left:14px
                font-size:12px
                color:rgb(147,153,159)
                box-sizing:border-box

            /*商品介绍*/
            .foodsOne
                position: relative
                display:flex
                margin:18px
                font-size:0px
                box-sizing:border-box

            .boderBottom 
                /*border-bottom:1px solid rgba(7,17,27,0.1);*/
                padding-bottom: 18px
            .boderBottom:after
                position:absolute
                content: ''
                width:100%
                bottom:0
                left:0
                border-top: 1px solid rgba(7,17,27,0.1)
                -webkit-transform: scaleY(0.5)
                transform: scaleY(0.5)
            .boderBottom:last-child:after
                border-top:none;   
            .boderBottom:last-child
                /*border-bottom:none;*/
                padding-bottom: 0

            .cartcontrol
                position: absolute
                bottom:18px
                right:0

            .listImg
                flex:0,0,58px
                display:inline-block
                width:58px
                height:58px
                vertical-align: top

            .listImg img
                width:100%
                height:100%
                
            .goodInfo
                flex:1
                display:inline-block
                margin:2px 0 0 10px
            .goodInfo .goodsName
                font-size:14px
                color:rgb(7,17,27)
                line-height: 14px

            .goodInfo .goodsDesc,
            .goodInfo .goodsxs
                font-size:10px
                color:rgb(147,153,159)
                line-height: 12px
                margin-top:8px

            .goodInfo .goodsxs span:first-child
                margin-right:12px

            .goodInfo .foodsPrice
                font-size:10px
                color:rgb(240,20,20)
                font-weight: normal
                line-height: 14px
                margin-top:8px

            .goodInfo .foodsPrice .old
                text-decoration:line-through
                margin-left:8px
                color:rgb(147,153,159)
</style>
