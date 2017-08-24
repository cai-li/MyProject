<template>
   <div class="header">
     <div class='content-wrapper'>
         <div class="h-avatar">
             <img width='64' height='64' :src="seller.avatar">
         </div>
         <div class='h-content'>
             <div class='h-title'>
                <span class='h-iconP'></span>
                <span class='h-titleC'>{{seller.name}}</span>
             </div>
             <div class='h-description'>{{seller.description}}&nbsp;/&nbsp;{{seller.deliveryTime}}分钟到达</div>
             <div v-if ="seller.supports" class='h-gonggao'>
                <span class='h-iconJ' :class="classMap[seller.supports[0].type]"></span>
                <span class='h-gonggaoJ'>{{seller.supports[0].description}}</span>
             </div>
         </div>
         <div v-if ="seller.supports" class='h-aside' @click="showdetail">
             <span class='h-supportsL'>{{seller.supports.length}}个</span>
             <i class='icon-keyboard_arrow_right'></i>
         </div>
     </div>
     <div class='content-gonggao'>
         <span class='hg_icong'></span><span class='hg_desc'>{{seller.bulletin}} </span><i class='icon-keyboard_arrow_right' @click="showdetail"></i>
     </div>
     <div class='bgkImg'>
         <img :src="seller.avatar">
     </div>
     <!-- sticky footers布局 -->
     <transition name='fade'>
       <div class='detail' v-if='detailShow'>
          <div class='detail-wrapper clearfix'>
              <div class='detail-main'>
                <h1 class='sellerName'>{{seller.name}}</h1>
                <div class='starGroup'>
                  <star :score = 'seller.score'></star>
                </div>
                <div class='huiInfo'>
                  <span class='line'></span>
                  <span class='info'>优惠信息</span>
                  <span class='line'></span>
                </div>
                <div class='allHui'>
                  <div class='h-gonggao' v-for= '(item,index) in seller.supports'>
                    <span class='h-iconJ' :class='classMap[item.type]'></span>
                    <span class='h-gonggaoJ'>{{item.description}}</span>
                  </div>
                </div>
                <div class='huiInfo'>
                  <span class='line'></span>
                  <span class='info'>商家公告</span>
                  <span class='line'></span>
                </div>
                <div class='Detailbulletin'>{{seller.bulletin}}</div>
              </div>    
          </div>
          <div class='detail-close' @click="showdetail">
              <i class='icon-close'></i>
          </div>
       </div>
       </transition>
     
   </div>
</template>
<script>
import star from '../star/star';
export default {
  name: 'header',
  components: {star},
  props:{
    seller:{
        type:Object
    },
    ratings:{
        type:Array
    }
  },
  data() {
    return {
        classMap:['decrease_1','discount_1','guarantee_1','invoice_1','special_1'],
        detailShow:false,
        
    }
  },
  created() {
  },
  methods: {
    showdetail:function() {
        this.detailShow = !this.detailShow;
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
@import "../../common/stylus/mixin.styl"
.header
    position: relative
    overflow:hidden
    background-color:rgba(7,17,27,0.5)
  .content-wrapper
      position:relative
      padding:24px 12px 18px 24px  
      font-size:0 /*解决inline-block中间一个空格*/

      .h-avatar
          display: inline-block
          vertical-align: top
      
          .h-avatar img
              border-radius:2px
          
      .h-content
          display: inline-block
          margin-left:16px
          color:#fff
      
          .h-title
              margin:2px 0 8px 0
          
              .h-iconP
                  vertical-align: top
                  display:inline-block
                  width:30px
                  height:18px
                  margin-right:6px
                  background-image: url('brand@2x.png') 
                  background-size:30px 18px
                  background-repeat: no-repeat
              
              .h-titleC
                  font-size:16px
                  font-weight: bold
                  line-height: 18px
              
          .h-description
              font-size:12px
              font-weight: 200
              line-height: 12px
          
          .h-gonggao
              margin:10px 0 2px 0
          
            .h-iconJ
                  display: inline-block;
                  vertical-align: top;
                  width:12px;
                  height:12px;
                  margin-right:4px;
                  background-size:12px 12px;
              
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
                  font-size: 10px
                  font-weight: 200
                  line-height: 14px
              
      .h-aside
          position: absolute
          right:12px
          bottom:14px
          padding:0 8px
          border-radius:14px
          height:24px
          line-height: 24px
          background-color:rgba(0,0,0,0.2)
          text-align:center
          color:#fff
      
          .h-supportsL
              vertical-align: top
              margin-right:2px
              font-size:10px
          
          .icon-keyboard_arrow_right
              font-size:10px
              line-height: 24px
          
  /* 公告部分 */
  .content-gonggao
      position: relative
      height:28px
      line-height: 28px
      padding:0 26px 0 12px
      white-space: nowrap
      overflow:hidden
      text-overflow: ellipsis
      background-color:rgba(7,17,27,0.2)
      color:#fff

      .hg_icong
          vertical-align: top
          display: inline-block
          width:22px
          height:12px
          background-image: url('bulletin@2x.png')
          background-size:22px 12px
          background-repeat: no-repeat
          margin-top:7px
      
      .hg_desc
          font-size:10px
          padding:0 4px
          vertical-align: top
      
      .icon-keyboard_arrow_right
          position: absolute
          right:12px
          top:0
          line-height:28px
      
  /*背景图*/
  .bgkImg
      position: absolute
      top:0
      left: 0
      width:100%
      height:100%
      filter:blur(10px)
      z-index:-1

  .bgkImg img
      width:100%
      height:100%

  /*详情弹框*/
  .detail 
      position: fixed
      left: 0
      top:0
      overflow: auto
      width:100%
      height:100%
      background-color:rgba(7,17,27,0.8)
      z-index:100
      color:#fff
      backdrop-filter: blur(10px)
      &.fade-enter-active, &.fade-leave-active 
        transition: all .7s
      &.fade-enter, &.fade-leave-to 
        opacity: 0
      .detail-wrapper
        width:100%
        min-height: 100%
        .detail-main
          padding: 64px 0
          .sellerName
            font-size: 16px
            font-weight: 700
            line-height:32px
            text-align:center
          .starGroup
            text-align: center
            margin:16px 0 28px 0
          .huiInfo
            display:flex
            width:80%
            margin:28px auto 24px auto
            font-size: 0
            .line
              flex:1
              display:inline-block
              height:1px
              background-color:rgba(255,255,255,0.2)
              margin: 6.3px 0
            .info
              padding:0 12px
              font-size:14px
              font-weight: 700
          .allHui
            width:80%
            margin:0 auto
            font-size: 0
            .h-gonggao
              margin:10px 0 2px 0
              .h-iconJ
                display:inline-block
                vertical-align:top
                width:16px
                height: 16px
                background-size:16px 16px
                margin-right: 6px
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
                display:inline-block
                font-size:12px
                line-height: 16px
          .Detailbulletin
            width: 80%
            font-size:12px
            font-weight: 200
            line-height: 24px
            margin:0 auto
        
      .detail-close
        position: relative
        width:32px
        height:32px
        margin:-64px auto 0 auto
        font-size: 32px
  
</style>
