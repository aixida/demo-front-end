(function(){
    /**
     * 配置
     */
    var config = {
        smallBg: "imgs/small.jpg",
        bigBg: "imgs/big.jpg",
        smallDiv: document.querySelector(".small"),
        bigDiv: document.querySelector(".big"),
        magnifierDiv: document.querySelector(".small .magnifier"),
        smallDivSize: {  //小图尺寸（即小的div的尺寸）
            width: 384,
            height: 216
        },
        bigDivSize: {  //大的div的尺寸
            width: 576,
            height: 324
        },
        bigBgSize: {  //大图尺寸
            width: 1920,
            height: 1080
        },
        

    };
    //放大镜div的宽、高
    config.magnifierDivSize = {
        width: config.bigDivSize.width / config.bigBgSize.width * config.smallDivSize.width,
        height: config.bigDivSize.height / config.bigBgSize.height * config.smallDivSize.height
    };

    initDiv();
    initMagnifierDiv();
    initSmallDivEvent();

    /**
     * 初始化div.small、div.big
     */
    function initDiv(){
        //div.small
        style = config.smallDiv.style;
        style.width = config.smallDivSize.width + 'px';
        style.height = config.smallDivSize.height + 'px';
        style.background = 'url("' + config.smallBg + '") no-repeat left top/100% 100%';
        //div.big
        style = config.bigDiv.style;
        style.width = config.bigDivSize.width + 'px';
        style.height = config.bigDivSize.height + 'px';
        style.background = 'url("' + config.bigBg + '") no-repeat';
        style.display = 'none';
    }

    
    /**
     * 初始化div.magnifier
     */
    function initMagnifierDiv(){
        style = config.magnifierDiv.style;
        style.width = config.magnifierDivSize.width + 'px';
        style.height = config.magnifierDivSize.height + 'px';
        style.display = 'none';
    }

    /**
     * 给div.small注册鼠标事件
     */
    function initSmallDivEvent(){
        dom = config.smallDiv;

        dom.onmouseenter = function(){
            config.magnifierDiv.style.display = 'block';
            config.bigDiv.style.display = 'block';
        }

        dom.onmouseleave = function(){
            config.magnifierDiv.style.display = 'none';
            config.bigDiv.style.display = 'none';
        }


        dom.onmousemove = function(e){
            var offset = getOffset(e);
            setPosition(offset);
            setBigDivBg();

            /**
             * 得到鼠标在div.small的偏移量（坐标）
             * @param {MouseEvent} e 
             */
            function getOffset(e){
                if(e.target === config.smallDiv){
                    return {
                        x: e.offsetX,
                        y: e.offsetY
                    }
                }else{
                    var style = getComputedStyle(config.magnifierDiv);
                    var left = parseFloat(style.left);  //parseFloat()去掉单位px
                    var top = parseFloat(style.top);
                    return {
                        x: e.offsetX + left + 1,
                        y: e.offsetY + top + 1
                    }
                }
            }

            /**
             * 根据鼠标的偏移量，设置div.magnifier的left、top
             * @param {*} offset 
             */
            function setPosition(offset){
                var left = offset.x - config.magnifierDivSize.width / 2;
                var top = offset.y - config.magnifierDivSize.height / 2;
                if(left < 0){
                    left = 0;
                }
                if(top < 0){
                    top = 0;
                }
                if(left > config.smallDivSize.width - config.magnifierDivSize.width){
                    left = config.smallDivSize.width - config.magnifierDivSize.width;
                }
                if(top > config.smallDivSize.height - config.magnifierDivSize.height){
                    top = config.smallDivSize.height - config.magnifierDivSize.height;
                }
                config.magnifierDiv.style.left = left + 'px';
                config.magnifierDiv.style.top = top +'px';
            }
        }

        /**
         * 图片经过放大镜后，在div.big的映射
         */
        function setBigDivBg(){
            var bgLeft = -1 * parseFloat(getComputedStyle(config.magnifierDiv).left) / config.smallDivSize.width * config.bigBgSize.width; 
            var bgTop = -1 * parseFloat(getComputedStyle(config.magnifierDiv).top) / config.smallDivSize.height * config.bigBgSize.height;
            config.bigDiv.style.backgroundPosition = bgLeft + 'px ' + bgTop + 'px';
        }
    }

}())