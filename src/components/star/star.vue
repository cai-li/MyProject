<template>
    <div class='star'>
        <span v-for='starItem in stars' :class='starItem' class='star-item'></span>
    </div>
</template>
<script>
const LENGTH = 5;
const CLS_ON ='on';
const CLS_HALF ='half';
const ClS_OFF = 'off';
export default {
    name:'star',
    props:{
        size:{
            type:Number
        },
        score:{
            type:Number 
        }
    },
    computed:{
        stars(){
            let result = [];
            let hasDecimal = this.score%1!==0;
            let onlen =Math.floor(this.score);
            for(let i=0;i<onlen;i++){
                result.push(CLS_ON);
            }
            if(hasDecimal){
                result.push(CLS_HALF)
            }
            while(result.length<LENGTH){
                result.push(ClS_OFF)
            }
            return result
        }
    }
}
</script>
<style scope>
    .star{
        font-size: 0;
    }
    .star .star-item{
        display:inline-block;
        width:24px;
        height:24px;
        background-repeat: no-repeat;
        padding:0 8px;
    }
    .star span.on{
        background-image: url('star24_on@2x.png');
        background-size:24px 24px;
    }
    .star span.half{
        background-image: url('star24_half@2x.png');
        background-size:24px 24px;
    }
    .star span.off{
        background-image: url('star24_off@2x.png');
        background-size:24px 24px;
    }
</style>
