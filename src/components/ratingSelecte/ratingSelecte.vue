<template>
    <div class='ratingSelect'>
        <div class='select-header'>
            <div v-if='ratings' class='suggestion border-1px'>
                <span class='su' :class="{on:selectType == 2}" @click='_selectContent(2)'>{{suggestion.all}}&nbsp;{{ratings.length}}</span>
                <span class='su' :class="{on:selectType == 0}" @click='_selectContent(0)'>{{suggestion.satisfy}}&nbsp;{{satisfyNumber.length}}</span>
                <span class='no' :class="{on:selectType == 1}" @click='_selectContent(1)'>{{suggestion.unsatisfy}}&nbsp;{{unsatisfyNumber.length}}</span>
            </div>
            <div class='onlyContent border-1px' @click='_onlyshowcon'>
                <span class='icon-check_circle' :class='{oncheck_circle:onlyContent===true}'></span><span class='text'>只看有内容的评价</span>
            </div>
        </div>
    </div>
</template>
<script>
const SATISFY=0; //推荐
const UNSATISFY=1; //吐槽
const All=2; //全部
    export default{
        name:'ratingSelect',
        props:{
            ratings:{
                type:Array
            },
            suggestion:{
                type:Object
            },
            //筛选条件之一
            selectType:{
                type:Number,
                default:All
            },
            //是否只看内容
            onlyContent:{
                type:Boolean,
                default:false
            }
        },
        computed:{
            satisfyNumber(){
                return this.ratings.filter((rating)=>{
                    return rating.rateType === SATISFY
                })
            },
            unsatisfyNumber(){
                return this.ratings.filter((rating)=>{
                    return rating.rateType === UNSATISFY
                })
            }
        },
        methods:{
            _selectContent(type){
                if (!event._constructed) {
                  return;
                }
                // this.selectType = type
                this.$emit('selectCon',type)
            },
            _onlyshowcon(){
                if (!event._constructed) {
                  return;
                }
                // this.onlyContent = !this.onlyContent
                this.$emit('onlyshow')
            }
        }
    }
</script>
<style lang="stylus" rel="stylesheet/stylus" scope>
@import '../../common/stylus/mixin.styl'
    .ratingSelect
        .select-header
            .suggestion
                padding:12px 0 18px 0
                margin:0 18px
                border-1px(rgba(7,17,27,0.1))
                font-size:0
                .su,.no
                    display:inline-block
                    font-size:12px
                    padding:8px 12px
                    border-radius:2px
                .su
                    margin-right:8px
                    background-color:rgba(0,160,220,0.2)
                .no
                    background-color:rgba(77,85,93,0.2)
                .on
                    background-color:rgb(0,160,220)
                    color:#fff
            .onlyContent
                padding:12px 18px
                border-1px(rgba(7,17,27,0.1))
                .icon-check_circle
                    display:inline-block
                    vertical-align:middle
                    font-size:24px
                    color:rgb(147,153,159)
                    margin-right:4px
                .oncheck_circle
                    color: #00c850
                .text
                    display:inline-block
                    color:rgb(147,153,159)
                    font-size:12px
                    line-height:24px
           
</style>