<template>
  <div class="ratings" ref='ratings'>
      <div class='ratings-wrapper'>
        <!-- 头部评价分析 -->
        <div class='rating-header border-1px'>
          <div class='multipleInfo'>
            <h1 class='allscore'>{{seller.score}}</h1>
            <p class='multText'>综合评分</p>
            <p class='duibi'>高于周边商家{{seller.rankRate}}%</p>
            <div class="border-right"></div>
          </div>
          <div class='otherInfo'>
            <div class='attitude'>
              <span class='attiType'>服务态度</span>
              <star :score = 'seller.serviceScore'></star>
              <span class='score'>{{seller.serviceScore}}</span>
            </div>
            <div class='attitude'>
              <span class='attiType'>食物评分</span>
              <star :score = 'seller.foodScore'></star>
              <span class='score'>{{seller.foodScore}}</span>
            </div>
            <div class='attitude'>
              <span class='attiType'>送达时间</span><span class='time'>{{seller.deliveryTime}}分钟</span>
            </div>
          </div>
        </div>
        <div class='rating-content'>
          <ratingSelecte :ratings = 'ratings' :suggestion ='suggestion' :selectType = 'selectType' :onlyContent='onlyContent' @onlyshow='onlyshowcon' @selectCon = 'selectContent'></ratingSelecte>
          <div class='select-content'>
            <ul v-if='ratings&&ratings.length>0'> 
                <li v-show='showRating(rating)' class='ratingGroup border-1px' v-for='rating in ratings'>
                    <div class='rateHeader'>
                      <div class='userImg'><img :src="rating.avatar"></div>
                      <div class='userInfo'>
                        <div class='user'>
                          <span class='userName'>{{rating.username}}</span>
                          <span class='rateTime'>{{rating.rateTime | dateString}}</span>
                        </div>
                        <div class='scoreStar'>
                          <star :score = 'rating.score'></star>
                          <span class='deliveryDate'>{{rating.deliveryTime}}分钟送达</span>
                        </div>
                        <div class='text'>{{rating.text}}</div>
                        <div class='tuijian'>
                          <span class='iconThumb' :class='{"icon-thumb_up":rating.rateType===0,"icon-thumb_down":rating.rateType===1}'></span>
                          <div class='recommend'>
                            <span class='menuItem' v-for="menu in rating.recommend">
                            {{menu}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class='rateContent'>
                      
                    </div>
                </li>
            </ul>
            <div class='no-ratings' v-else='!ratings||ratings.length==0'>
                暂无评价
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import star from '../star/star';
  import ratingSelecte from '../ratingSelecte/ratingSelecte';
  import {DateToString} from '../../common/js/common.js';
  //商品评价的筛选状态
  const SATISFY=0; //推荐
  const UNSATISFY=1; //吐槽
  const All=2; //全部
  export default {
    name: 'ratings',
    props:{
      seller:{
        type:Object
      },
      ratings:{
        type:Array
      },
      goods:{
        type:Array
      }
    },
    data(){
      return {
        suggestion:{
                      all:'全部',
                      satisfy:'满意',
                      unsatisfy:'不满意'
                  },
        selectType:All,
        onlyContent:false//只看内容
      }
    }, 
    watch:{
      'seller'(){
          this._initScroll()
      },
      'goods'(){
          this._initScroll()
      }
    },
    mounted(){
      this.$nextTick(()=>{
          this._initScroll()
      })
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
      }
    },
    methods:{
      _initScroll(){
        if(!this.scroll){
          this.scroll = new BScroll(this.$refs.ratings, {
                click:true
            });
        }else{
          this.scroll.refresh();
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
    filters:{
              //将字符串时间转换成时间格式
              dateString(datenumber) {
                  let date = new Date(datenumber);
                  return DateToString(date,"yyyy-MM-dd hh:mm:ss");
              }
          
          },
    components:{star,ratingSelecte}
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
@import '../../common/stylus/mixin.styl'
  .ratings
    position:absolute
    bottom:0
    top:176.4px
    left:0
    width:100%
    overflow: hidden
    .ratings-wrapper 
      background-color:#f3f5f7
      .rating-header
        display: flex 
        margin-bottom:16px
        background-color:#fff
        border-1px(rgba(7,17,27,0.1))
        .multipleInfo
          margin:18px 0
          position:relative
          flex:0 1 auto
          width:137px
          text-align:center
          .allscore
            font-size:24px
            color:rgb(255,153,0)
            line-height:28px
            margin-bottom:6px
          .multText
            font-size:12px
            color:rgb(7,17,27)
            line-height:18px
          .duibi
            font-size:10px
            line-height:10px
            margin:8px 0 6px 0
          .border-right
            position:absolute
            right:0
            top:0
            width:1px
            height:100%
            transform:scaleX(0.5)
            background-color:rgba(7,17,27,0.1)
        .otherInfo
          flex:1 1 auto 
          width:237px
          box-sizing:border-box
          .attitude:nth-child(2)
            margin:8px 0
          .attitude
            font-size:0
            .attiType
              display:inline-block
              font-size:12px
              color:rgb(7,17,27)
              line-height:16px
              margin-right:12px
            .star
              display:inline-block
              vertical-align:top;
              margin-right:8px
              .star-item
                width:16px
                height:16px
                background-size:contain
                padding:0
                margin-right:4px
            .score
              display:inline-block
              font-size:12px
              color:rgb(255,153,0)
              line-height:16px
            .time
              display:inline-block
              font-size:12px
              color:rgb(147,153,159)
              line-height:16px 
      .rating-content
        background-color:#fff
        padding-top:6px
        .select-content
            padding:0 18px
            .no-ratings   
                padding: 12px 0;
                font-size: 12px;
            .ratingGroup:last-child
                border-none() 
            .ratingGroup
                padding:16px 0 12px 0
                border-1px(rgba(7,17,27,0.1)) 
            .rateHeader
              display:flex
              width:100%
              font-size:0
              .userImg
                flex:0 0 28px
                display:inline-block
                width:28px
                margin-right:12px
                img
                  width:28px
                  height:28px
                  border-radius:50%  
              .userInfo
                flex:1
                display:inline-block
                .user
                  overflow:hidden
                  height:12px
                  line-height:12px
                  font-size:10px
                  .userName
                    float:left
                    color:rgb(7,17,27)
                  .rateTime
                    float:right
                    color:rgb(147,153,159)
                .scoreStar
                  margin:4px 0 6px 0
                  height:12px
                  .star
                    display:inline-block
                    vertical-align:bottom;
                    margin-right:6px
                    .star-item
                      width:12px
                      height:12px
                      background-size:contain
                      padding:0
                      margin-right:2px  
                  .deliveryDate
                    display:inline-block
                    font-size:10px
                    color:rgb(147,153,159)
                .text
                  font-size:12px
                  line-height:18px
                  color:rgb(7,17,27)
                  margin-bottom:8px
                .tuijian
                  display:flex
                  .iconThumb
                    flex:0 0 12px
                    width:12px
                    font-size: 12px;
                    display: inline-block;
                    vertical-align: top;
                    margin-right: 4px;
                    padding: 3px 0;
                  .icon-thumb_down
                    color:rgb(147,153,159)
                  .icon-thumb_up
                    color:rgb(0,160,222)
                  .recommend
                    flex:1
                    display:inline-block
                    .menuItem
                      display:inline-block
                      padding:0 6px
                      width:48px
                      height:16px
                      line-height:16px
                      font-size:9px
                      white-space: nowrap
                      overflow:hidden
                      text-overflow: ellipsis
                      color:rgb(147,153,159)
                      border:1px solid rgba(7,17,27,0.1)
                      margin-left:8px
                      margin-bottom:4px
                    
                    
@media (max-width:321px)
  .otherInfo
    padding:18px 0 18px 12px
@media (min-width:321px)
  .otherInfo
    padding:18px 0 18px 24px       
</style>
