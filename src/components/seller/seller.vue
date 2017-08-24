<template>
    <div class='seller' ref='sellerInfos'>
        <div class='sellerWrapper'>
            <div class='sellerInfo'>
                <div class='head border-1px'>
                    <div class='sellerName'>{{seller.name}}</div>
                    <div class='selldetail'>
                      <star :score='seller.score'></star>
                      <span class='score'>({{seller.score}})</span> 
                      <span class='sellCount'>月售{{seller.sellCount}}单</span> 
                    </div>
                    <div class="saveseller" @click='isfavorite($event)'>
                        <div class='icon-favorite' :class='{isfavor:favoriter==true}'></div>
                        <div class='fav'>{{favorText}}</div>
                    </div>
                </div>
                <div class='content'>
                    <div class="contentInfo">
                        <div class='miaoshu'>起送价</div>
                        <div><span class='number'>{{seller.minPrice}}</span><span class='ms'>元</span></div>
                        <div class="border-right"></div>
                    </div>
                    <div class="contentInfo">
                        <div class='miaoshu'>商家配送</div>
                        <div><span class='number'>{{seller.deliveryPrice}}</span><span class='ms'>元</span></div>
                        <div class="border-right"></div>
                    </div>
                    <div class="contentInfo">
                        <div class='miaoshu'>平均配送时间</div>
                        <div><span class='number'>{{seller.deliveryTime}}</span><span class='ms'>分钟</span></div>
                    </div>
                </div>
            </div>
            <div class='sellerNotice'>
                <h3 class='NoticeTitle'>公告与活动</h3>
                <div class='noticeInfo'>{{seller.bulletin}}</div>
                <div class='Allsupports'>
                    <div class='h-gonggao borderTop-1px' v-for='suppport in seller.supports'>
                        <span class='h-iconJ' :class='classMap[suppport.type]'></span>
                        <span class='h-gonggaoJ'>{{suppport.description}}</span>
                    </div>
                </div>
            </div>
            <div class='liveAction'>
                <h3 class='liveTit'>商家实景</h3>
                <!-- 包裹层 -->
                <div class='pictures' ref='pics'>
                    <ul ref='picWrap'>
                        <li class='pic-item' v-for='pic in seller.pics'>
                            <img :src="pic">
                        </li>
                    </ul>
                </div>
            </div>
            <div class='sellerDetail'>
                <h3 class='detailTit'>商家信息</h3>
                <ul class='Details'>
                    <li class='info borderTop-1px' v-for='info in seller.infos'>{{info}}</li>
                </ul>
            </div>
        </div>    
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import star from '../star/star';
import {saveToLocal,getToLocal} from '../../common/js/common.js'
export default {
  name: 'seller',
  props:{
    seller : {
        type:Object
    },
    goods:{
        type:Array
    },
    ratings:{
        type:Array
      }
  },
  data(){
    return {
        classMap:[],     //存储活动图标Class
        favoriter:(()=>{
            return getToLocal(this.seller.id,'favoriter',false)
        })() //是否已收藏
    }
  },
  watch:{
    'seller'(){
        this._initScroll();
        this._initPicScroll();
    },
    'goods'(){
        this._initScroll();
        this._initPicScroll();
    }
  },
  mounted(){
    this.$nextTick(()=>{
        this._initScroll();
        this._initPicScroll();
    })
  },
  created(){
    this.classMap=['decrease_1','discount_1','guarantee_1','invoice_1','special_1'];
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
    //是否收藏的文案
    favorText(){
        return (this.favoriter===true)?'已收藏':'收藏';
    }
  },
  methods:{
    _initScroll(){
        if(!this.sellerscroll){
            this.sellerscroll = new BScroll(this.$refs.sellerInfos, {
                    click:true
                });
        }else{
            this.sellerscroll.refresh();
        }
    },
    _initPicScroll(){
        if(this.seller.pics){
            let PicWidth = 120
            let picmarin = 6
            let picLen = this.seller.pics.length
            let picWrap = this.$refs.picWrap;
            picWrap.style.width = PicWidth*picLen+picmarin*(picLen-1)+'px';
            if(!this.picscroll){
                this.picscroll = new BScroll(this.$refs.pics, {
                        scrollX: true,
                        eventPassthrough: 'vertical'
                    });
            }else{
                this.picscroll.refresh();
            }
        }
    },
    //收藏功能
    isfavorite(event){
        if (!event._constructed) {
          return;
        }
        this.favoriter = !this.favoriter;
        //将favoriter属性缓存，赋值到用户关联的信息中
        saveToLocal(this.seller.id, 'favoriter',this.favoriter)
    }
  },
  components:{star}
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
@import '../../common/stylus/mixin.styl'
.seller
    position:absolute
    bottom:0
    top:176.4px
    left:0
    width:100%
    overflow: hidden
    .sellerWrapper
        background-color:#f3f5f7
        .sellerInfo
            background-color:#fff
            border-bottom:1px solid rgba(7,17,27,0.1)
            margin-bottom:16px
            .head
                position:relative
                margin:0 18px
                padding:18px 0
                border-1px(rgba(7,17,27,0.1))
                .sellerName
                    font-size:14px
                    color:rgb(7,17,27)
                    height:14px
                    line-height:14px
                    margin-bottom:8px
                .selldetail
                    font-size:0
                    .star
                        display:inline-block
                        vertical-align:top;
                        margin-right:4px
                        .star-item
                          width:18px
                          height:18px
                          background-size:contain
                          padding:0
                          margin-right:4px
                    .score,
                    .sellCount
                        display:inline-block
                        margin-right:12px
                        font-size:10px
                        color:rgb(77,85,93)
                        line-height:18px
                .saveseller
                    position:absolute
                    right:18px
                    bottom:18px
                    .icon-favorite
                        text-align:center
                        font-size:24px
                        color:rgb(147,153,159)
                        line-height:24px
                    .isfavor
                        color:rgb(240,20,20)
                    .fav
                        font-size:10px
                        color:rgb(77,85,93)
                        line-height:10px
                        margin-top:4px
            .content
                display:flex
                padding:18px 0
                .contentInfo
                    position:relative
                    flex:1 
                    text-align:center
                    .border-right
                      position:absolute
                      right:0
                      top:0
                      width:1px
                      height:100%
                      transform:scaleX(0.5)
                      background-color:rgba(7,17,27,0.1)
                    .miaoshu
                        font-size:10px
                        color:rgb(147,153,159)
                        line-heigth:10px
                        margin-bottom:4px 
                    .number
                        color:rgb(7,17,27)
                        font-size:24px
                        font-weight:200
                        line-height:24px 
                    .ms
                        font-size:10px 
                        color:rgb(7,17,27)   
        .sellerNotice
            background-color:#fff
            padding:18px 18px 0
            margin-bottom:18px
            border-top:1px solid rgba(7,17,27,0.1)
            border-bottom:1px solid rgba(7,17,27,0.1)
            .NoticeTitle
                font-size:14px
                color:rgb(7,17,27)
                height:14px
                line-height:14px
                margin-bottom:8px
            .noticeInfo
                font-size:14px
                font-weight:200
                color:rgb(240,20,20)
                line-height:24px
                padding:0 12px 16px
            .Allsupports
                .h-gonggao
                    font-size:0
                    padding:16px 12px
                    borderTop-1px(rgba(7,17,27,0.1))
                    .h-iconJ
                      display: inline-block;
                      vertical-align: top;
                      width:16px;
                      height:16px;
                      margin-right:6px;
                      background-size:16px 16px;
                    .decrease_1
                      background-image: url('decrease_1@2x.png')

                    .discount_1
                       background-image: url('discount_1@2x.png')

                    .guarantee_1
                       background-image: url('guarantee_1@2x.png')

                    .invoice_1
                       background-image: url('invoice_1@2x.png')

                    .special_1
                       background-image: url('special_1@2x.png')

                    .h-gonggaoJ
                        display: inline-block;
                        font-size: 12px
                        font-weight: 200
                        line-height: 16px
                        color:rgb(7,17,27)
        .liveAction
            background-color:#fff
            position:relative
            padding:18px 0 18px 18px
            margin-bottom:18px
            border-top:1px solid rgba(7,17,27,0.1)
            border-bottom:1px solid rgba(7,17,27,0.1)
            .liveTit
                font-size:14px
                color:rgb(7,17,27)
                height:14px
                line-height:14px
                padding-bottom:12px
            .pictures
                width:100%
                overflow:hidden
                white-space: nowrap
                ul
                    font-size:0
                    .pic-item:last-child
                        margin-right:0
                    .pic-item
                        width:120px
                        height:90px
                        display:inline-block
                        margin-right:6px
                        img
                            width:100%
                            height:100%
        .sellerDetail
            background-color:#fff
            padding:18px 18px 0 18px  
            border-top:1px solid rgba(7,17,27,0.1)
            .detailTit
                font-size:14px
                color:rgb(7,17,27)
                height:14px
                line-height:14px
                padding-bottom:12px
            .Details
                .info
                    font-size:12px
                    font-weight:200
                    color:rgb(7,17,27)
                    line-height:16px
                    padding:16px 12px
                    borderTop-1px(rgba(7,17,27,0.1))
                    
                          
                    
</style>
