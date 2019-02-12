<template>
	<div style="height: 100%;">
	    <div class="center absolute" style="top: 40%;left: 50%;margin-left: -22px;z-index: 1000;">
	        <svg class="loading" width="44px" height="44px" viewBox="0 0 44 44">
                <circle class="path" fill="none" stroke-width="4" stroke-linecap="round" cx="22" cy="22" r="20"></circle>
            </svg>
	    </div>
	    <div class="loading-bg fixed" :style="style"></div>
	</div>
</template>
<script>
    export default {
        data:function(){
			return{
				style:{
					height:0
				}
			}
		},
		mounted:function(){
			var heightRem = window.innerHeight;
			this.style.height = heightRem+"px";
		},
    }
</script>
<style>
    .loading-text{
    	font-size: .22rem;
    }
    .loading-bg{
    	background: #fff;
        width: 100%;
        z-index:999;
    	top:0;
        left:0;
    }
    .mint-toast.is-placebottom{
        z-index: 1001;
    }
    .loading {
        animation: rotator 1.4s linear infinite;
    }
    @keyframes rotator {
        0% {
            transform: scale(0.5) rotate(0deg);
        }
        100% {
            transform: scale(0.5) rotate(270deg);
        }
    }
    .loading .path {
        stroke: #009dd7;
        stroke-dasharray: 126;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: dash 1.4s ease-in-out infinite;
    }
    @keyframes dash {
        0% {
            stroke-dashoffset: 126;
        }
        50% {
            stroke-dashoffset: 63;
            transform: rotate(135deg);
        }
        100% {
            stroke-dashoffset: 126;
            transform: rotate(450deg);
        }
    }
</style>