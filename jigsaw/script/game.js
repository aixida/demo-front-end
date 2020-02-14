/**
 * 游戏配置
 */
var config = {
    dom: document.getElementById("game"),  //游戏的dom对象
    width: 900,
    height: 900,
    rows: 3,  //行数
    cols: 2,  //列数
    url: "img/Ahri.png",  //图片路径
    success: false //游戏是否结束
};

//每一个拼图块的宽高
config.blockWidth = config.width / config.cols;
config.blockHeight = config.height / config.rows;

//拼图块的数量
config.blockNumber = config.rows * config.cols;

//存放拼图块信息
var blocks = [];

/**
 * 拼图块的构造函数
 * @param {*} left 
 * @param {*} top 
 * @param {*} isVisible 是否可见
 */
function Block(left, top, isVisible){
    this.left = left;
    this.top = top;
    this.correctBgX = -this.left;
    this.correctBgY = -this.top;
    this.isVisible = isVisible;//是否可见

    this.dom = document.createElement("div");
    this.dom.style.width = config.blockWidth + "px";
    this.dom.style.height = config.blockHeight + "px";
    this.dom.style.boxSizing = "border-box";
    this.dom.style.border = "2px solid #fff";
    this.dom.style.background = 'url("'+ config.url + '") ' + this.correctBgX + "px " + this.correctBgY + "px";
    this.dom.style.cursor = "pointer";
    this.dom.style.transition = ".5s";//css属性变化的时候，在0.5秒内完成
    if(!isVisible){
        this.dom.style.display = "none";
    }
    
    this.dom.style.position = "absolute";
    /**
     * 根据当前的left、top，显示div的位置
     */
    this.show = function(){
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
    }

    this.show();
    config.dom.appendChild(this.dom);
}

/**
 * 避免小数的不精确，将两数化整比较
 * @param {*} x 
 * @param {*} y 
 */
function isEqual(x, y){
    return parseInt(x) === parseInt(y);
}

init();

/**
 * 初始化游戏
 */
function init(){
    initGameDom();
    initBlocks();
    shuffle();
    regEvent();
    /**
     * 初始化游戏容器
     */
    function initGameDom(){
        config.dom.style.width = config.width + "px";
        config.dom.style.height = config.height + "px";
        config.dom.style.border = "2px solid #ccc";
        config.dom.style.position = "relative";
    }
    /**
     * 初始化拼图块的数组
     */
    function initBlocks(){
        for(var i = 0; i < config.rows; i++){
            for(var j = 0; j < config.cols; j++){
                var isVisible = true;
                if(i === config.rows-1 && j === config.cols-1){
                    isVisible = false;
                }
                blocks.push(new Block(j * config.blockWidth, i * config.blockHeight, isVisible));
            }
        }
    }
    /**
     * 给blocks数组重新排序
     */
    function shuffle(){
        for(var i = 0; i < blocks.length-1; i++){
            //随机产生一个下标
            var index = getRandom(0, blocks.length-2);
            //交换left、top
            exchangeBlock(blocks[i], blocks[index]); 
        }
    }
    /**
     * 生成[min, max]范围内的随机数
     * @param {*} min 
     * @param {*} max 
     */
    function getRandom(min, max){
        return Math.floor(Math.random() * (max +1 -min) + min);
    }
    /**
     * 交换两个拼图块的top、left，并在页面上重新显示
     * 参数都为拼图块对象
     * @param {*} x 
     * @param {*} y 
     */
    function exchangeBlock(x, y){
        //交换left
        var temp = x.left;
        x.left = y.left;
        y.left = temp;
        //交换top
        var temp = x.top;
        x.top = y.top;
        y.top = temp;
        //在页面重新显示
        x.show();
        y.show();
    }
    /**
     * 给拼图块注册点击事件
     */
    function regEvent(){
        //找到空白拼图块
        var inVisibleBlock = blocks.find(function(b){
            return !b.isVisible;
        });
        
        blocks.forEach(function(b){
            b.dom.onclick = function(){
                //若游戏结束
                if(config.success){
                    return;
                }
                if((isEqual(b.top, inVisibleBlock.top) && 
                    isEqual(Math.abs(b.left - inVisibleBlock.left), config.blockWidth))
                    ||
                    (isEqual(b.left, inVisibleBlock.left) &&
                    isEqual(Math.abs(b.top - inVisibleBlock.top), config.blockHeight))){
                        //交换看的见的拼图块与空白拼图块的坐标位置
                        exchangeBlock(b, inVisibleBlock);
                        //游戏结束判定
                        isWin();
                    }
            }
        });
    }
    /**
     * 游戏结束判定
     */
    function isWin(){
        //过滤出不在正确位置上的拼图块
        var mistakenBlocks = blocks.filter(function(b){
            return !(isEqual(b.left, -b.correctBgX) && isEqual(b.top, -b.correctBgY));
        });
        if(mistakenBlocks.length === 0){
            config.success = true;
            //游戏结束
            blocks.forEach(function(b){
                b.dom.style.border = "none";  //去掉所有拼图块的边框
                b.dom.style.display = "block";  //将最后一个拼图块也显示在页面上
            });
        }
    }
}