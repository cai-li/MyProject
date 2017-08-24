<template>
        <transition name='food'>
            <div class="food" v-show='showthis' ref='food'>
                <!-- 为bettter scroll 添加div层 -->
                <div>
                    <!-- 商品图片 -->
                    <div class='foodImg'>
                        <img :src="selectedfood.image">
                    </div>
                    <!-- 返回到商品foods.vue页面 -->
                    <div class='backGoods' @click='hidethisfood'><span class='icon-arrow_lift'></span></div>
                    <!-- 商品信息 -->
                    <div class='foodInfo border-1px'>
                        <div class='goodsName'>{{selectedfood.name}}</div>
                        <div class='goodsxs'><span>月售{{selectedfood.sellCount}}份</span><span>好评率{{selectedfood.rating}}%</span></div>
                        <div class='foodsPrice'><span>￥{{selectedfood.price}}</span><span class='old' v-show='selectedfood.oldPrice!=""'>￥{{selectedfood.oldPrice}}</span>
                        </div>
                        <div class='cartcontrol-wrapper'>
                            <cartcontrol @cartAdd ='cartAddcontrol' :food ='selectedfood'></cartcontrol>
                        </div>
                        <transition name='firstAdd'>
                        <div class='addtocart' v-show='selectedfood.count===0||!selectedfood.count' @click.stop.prevent='addCount($event)'>加入购物车</div>
                        </transition>
                    </div>
                    <!-- 商品介绍 -->
                    <div class='foodDetail border-1px borderTop-1px'>
                        <h1 class='food-header'>商品介绍</h1>
                        <div class='food-content'>{{selectedfood.info}}</div>
                    </div>
                    <div class='foodAsses borderTop-1px border-1px'>
                        <h1 class='Asses-header'>商品评价</h1>
                        <ratingSelecte :ratings = 'selectedfood.ratings' :suggestion ='suggestion' :selectType = 'selectType' :onlyContent='onlyContent' @onlyshow='onlyshowcon' @selectCon = 'selectContent'></ratingSelecte>
                        <div class='select-content'>
                            <ul v-if='selectedfood.ratings&&selectedfood.ratings.length>0'> 
                                <li v-show='showRating(rating)' class='ratingGroup border-1px' v-for='rating in selectedfood.ratings'>
                                    <div class='ratingH clearfix'>
                                        <div class='time'>{{rating.rateTime | dateString}}</div>
                                        <div class='user'><span class='username'>{{rating.username}}</span><img class='userImg' :src='rating.avatar'></div>
                                    </div>
                                    <div class='ratingC'><span class='iconThumb' :class='{"icon-thumb_up":rating.rateType===0,"icon-thumb_down":rating.rateType===1}'></span><span class='text'>{{rating.text}}</span></div>
                                </li>
                            </ul>
                            <div class='no-ratings' v-else='!selectedfood.ratings||selectedfood.ratings.length==0'>
                                暂无评价
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
</template>
<script>
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import ratingSelecte from '../ratingSelecte/ratingSelecte.vue';
import {DateToString} from '../../common/js/common.js';
//商品评价的筛选状态
const SATISFY=0; //推荐
const UNSATISFY=1; //吐槽
const All=2; //全部
    export default{
        name:'food',
        props:{
            selectedfood:{
                type:Object
            }
        },
        data(){
            return{
                showthis:false,//显示或隐藏改组件
                suggestion:{
                    all:'全部',
                    satisfy:'推荐',
                    unsatisfy:'吐槽'
                },
                selectType:All,
                onlyContent:false//只看内容
            }
        },
        methods:{
            showthisfood(){
                this.showthis = true;
                //初始化筛选内容
                this.selectType=All,
                this.onlyContent=false//只看内容
                this.$nextTick(()=>{
                    //better scroll需要更新DOM对象
                    if(!this.scroll){
                        this.scroll = new BScroll(this.$refs.food, {
                            click:true
                        });

                    }else{
                        this.scroll.refresh();
                    }
                })
            },
            hidethisfood(){
                this.showthis = false;
            },
            cartAddcontrol(el){
                this.$emit('cartAddEvent',el);
            },
            addCount(el){
                //防止多次点击触发cartAddEvent事件
                if(!this.selectedfood.count){
                    //为food数量置1
                    this.$set(this.selectedfood,'count',1)
                    //派发小球点击事件，做抛物动画
                    this.$emit('cartAddEvent',el.target);
                }
                
            },
            //切换评价筛选条件
            selectContent(type){
                this.selectType = type
                //切换筛选条件时，更新了DOM节点，要更新better scroll
                this.$nextTick(()=>{
                    this.scroll.refresh()
                })
            },
            onlyshowcon(){
                this.onlyContent = !this.onlyContent
                this.$nextTick(()=>{
                    this.scroll.refresh()
                })
            },
            //是否显示评价信息
            showRating(rating){
                //只看评价时，不显示的
                if(this.onlyContent && rating.text==''){
                    return false;
                }
                //点击三个评价筛选
                if(this.selectType===All){
                    return true;
                }else{
                    return this.selectType ===rating.rateType;
                }
            }
        },
        components:{cartcontrol,ratingSelecte}
        ,
        filters:{
            //将字符串时间转换成时间格式
            dateString(datenumber) {
                let date = new Date(datenumber);
                return DateToString(date,"yyyy-MM-dd hh:mm:ss");
            }
        
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
@import '../../common/stylus/mixin.styl'
.food
    position:fixed
    top:0
    left:0
    bottom:48px
    width:100%
    background-color:#f3f5f7
    z-index:30
    &.food-enter-active,&.food-leave-active
        transition:all 0.4s
    &.food-enter,&.food-leave-to
        transform:translate3d(100%,0,0)
    .foodImg
        position:relative
        width:100%
        height:0
        padding-top:100%
        img
            position:absolute
            left:0
            top:0
            width:100%
            height:100%
    .backGoods
        position:absolute
        left:10px
        top:10px
        .icon-arrow_lift
            color:#fff
    .foodInfo
        position:relative
        padding:18px;
        background-color:#fff
        border-1px(rgba(7,17,27,0.1))
        .goodsName 
           font-size:14px
           font-weight:700
           color:rgb(7,17,27)
           line-heigth:14px
        .goodsxs
            margin:8px 0 18px 0
            line-height:10px
            font-size:10px
            color:rgb(147,153,159)
            span:first-child
                margin-right:12px
        .foodsPrice
            font-size:10px
            color:rgb(240,20,20)
            font-weight: normal
            line-height: 14px
            margin-top:8px
            .old
                text-decoration:line-through
                margin-left:8px
                color:rgb(147,153,159)
        .cartcontrol-wrapper,
        .addtocart
            position:absolute
            bottom:18px
            right:18px
        .addtocart
            width:74px
            height:24px
            color:#fff
            font-size:10px
            line-height:24px
            text-align:center
            border-radius:12px
            background-color:rgb(0,160,220)
            &.firstAdd-enter-active,&.firstAdd-leave-active
                transition:opacity 0.6s
            &.firstAdd-enter,&.firstAdd-leave-to
                opacity:0
    .foodDetail
        margin:16px 0
        padding:18px
        background-color:#fff
        border-1px(rgba(7,17,27,0.1))
        borderTop-1px(rgba(7,17,27,0.1))
        .food-header
            font-size:14px
            font-weight:500
        .food-content
            margin-top:6px
            padding:0 8px
            font-size:12px
            font-weight:200
            line-height:24px
            color:rgb(77,85,93)
    .foodAsses
        background-color:#fff
        border-1px(rgba(7,17,27,0.1))
        borderTop-1px(rgba(7,17,27,0.1))
        .Asses-header
            padding:18px 18px 6px 18px
            font-size:14px
            font-weight:500
        .select-content
            padding:0 18px
            .no-ratings   
                padding: 12px 0;
                font-size: 12px;
            .ratingGroup:last-child
                border-none() 
            .ratingGroup
                padding:16px 0
                border-1px(rgba(7,17,27,0.1)) 
                .ratingH
                    margin-bottom:6px
                    .time
                        float:left
                        line-height:12px
                        color:rgb(147,153,159)
                        font-size:10px
                    .user
                        float:right
                        height:12px
                        .username
                            display:inline-block
                            vertical-align:top
                            line-height:12px
                            color:rgb(147,153,159)
                            font-size:10px  
                            margin-right:6px
                        .userImg
                            display:inline-block
                            vertical-align:top
                            width:12px
                            height:12px
                            border-radius:50%
                            img
                                width:100%
                                height:100%
                .ratingC
                    line-height: 24px;
                    height: 24px;
                    .iconThumb
                        font-size:12px 
                        display:inline-block
                        vertical-align:middle
                        margin-right:4px
                    .icon-thumb_down
                        color:rgb(147,153,159)
                    .icon-thumb_up
                        color:rgb(0,160,222)
                    .text
                        font-size:12px
</style>