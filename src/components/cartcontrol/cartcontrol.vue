<template>
    <div class='cartcontrol'>
      <transition name='move'>
        <div v-show='food.count>0' class='cart-decrease' @click.stop.prevent='decreaseCount'>
          <span class='icon-remove_circle_outline'></span>
        </div>
      </transition>
      <div v-show='food.count>0' class='cart-count'>{{food.count}}</div>
      <div class='cart-add' @click.stop.prevent='addCount'>
        <span class='icon-add_circle'></span>
      </div>
    </div>
</template>
<script>
    export default {
        name:'cartcontrol',
        props:{
          food:{
            type:Object
          }
        },
        methods:{
          addCount(event){
             if(!event._constructed) return;
             if(!this.food.count){
              this.$set(this.food, 'count', 1)
              }else{
                this.food.count++
              }
              this.$emit('cartAdd',event.target);
          },
          decreaseCount(event){
             if(!event._constructed) return;
             console.log(13)
             if(this.food.count<=1){
              this.$set(this.food, 'count', 0)
              }else{
                this.food.count--
              }
          }
        }

    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
.cartcontrol
  font-size:0
  .cart-decrease,
  .cart-add,
  .cart-count
    display:inline-block
    width:24px
    height:24px
    text-align:center
    line-height: 24px
    font-size:24px
    color:rgb(0,160,220)
  .cart-count
    vertical-align:top
    font-size:10px
    color:rgb(147,153,159)
  .move-enter-active, .move-leave-active 
    transition:all .8s ease
    transform:rotate3d(0,0,1,180deg) 
  .move-enter,.move-leave-to
    opacity:0
    transform:translate3d(24px,0,0)
</style>