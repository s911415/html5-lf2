//由於JS尚未支援Class(ECMAScript 6以後, 宣稱會支援)
//目前Class寫法都是以function的方式
//只要是this.XXX皆會是Public的property
var Character = function(file, options) {
    this.url = file;      
    //AnimationSprite當圖片是一整張圖片(連續圖), 而非Array時一定要給col, row三個(url是一定要的)   
    this.sprite = new Framework.AnimationSprite({url:this.url, col:10 , row:7 , loop:true , speed:2}); 
    //以下這句話的意思是當options.position為undefined時this.sprite.position = x: 0, y: 0}
    //若options.position有值, 則this.sprite.position = options.position
    //原因是在JS中, undefined會被cast成false
    this.sprite.position = options.position || {x: 0, y: 0};
    this.sprite.scale = options.scale || 1;

    //由於0會被cast成false, 故不能用上面的方法來簡化
    this.sprite.rotation = (Framework.Util.isUndefined(options.rotation))?0:options.rotation;

    //播放人物在跑步的圖
    this.run = function() {
        this.sprite.start({ from: options.run.from, to: options.run.to, loop: true });
    };

    //播放人物被攻擊的圖
    this.beHit = function(finishPlaying) {
        //AnimationSprite.start可以指定要播放的張數(可倒著播放), 並且可以設定當播放完動作後, 要發生的事件
        this.sprite.start({ from: options.beHit.from, to: options.beHit.to, loop: false, finishPlaying: finishPlaying });
    };

    //播放人物在攻擊的圖
    this.hit = function(finishPlaying) {
        var characterThis = this;
        this.sprite.start({ from: options.hit.from, to: options.hit.to, loop: false, finishPlaying: finishPlaying});
    };

    //General的碰撞函式, 近期內Framework將加入Box2D, 同學將不需要自行判斷碰撞 
    this.collide = function(target) {
        if(this.sprite.upperLeft.y <= target.sprite.lowerRight.y &&
            this.sprite.lowerLeft.y >= target.sprite.upperLeft.y &&
            this.sprite.upperLeft.x <= target.sprite.lowerRight.x &&
            this.sprite.lowerRight.x >= target.sprite.upperLeft.x) {

            return true;
        }
    };

    //預設人物就是在跑步
    this.run();

};