const DIST_DIR = 'dist/';

const gulp = require('gulp'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    babili = require("gulp-babili"),
    merge = require('merge-stream');

gulp.task('build', () => {

    return gulp.src([
        'src/js/utils.js',
        'src/js/jquery-3.1.1.min.js',

        "src/js/Framework/AttachableInterface.js",
        "src/js/Framework/KeyboardEventInterface.js",
        "src/js/Framework/MouseEventInterface.js",

        "src/js/Framework/Config.js",
        "src/js/Framework/Record.js",
        "src/js/Framework/Replay.js",
        "src/js/Framework/EqualCondition.js",
        "src/js/Framework/Util.js",
        "src/js/Framework/core.js",
        "src/js/Framework/DebugInfo.js",
        "src/js/Framework/FpsAnalysis.js",
        "src/js/Framework/Point.js",
        "src/js/Framework/Point3D.js",
        "src/js/Framework/GameObject.js",
        "src/js/Framework/Sprite.js",
        "src/js/Framework/AnimationSprite.js",
        "src/js/Framework/Scene.js",
        "src/js/Framework/ResourceManager.js",
        "src/js/Framework/Level.js",
        "src/js/Framework/Game.js",
        "src/js/Framework/MouseManager.js",
        "src/js/Framework/KeyBoardManager.js",
        "src/js/Framework/TouchManager.js",
        "src/js/Framework/GameMainMenu.js",
        "src/js/Framework/Audio.js",
        "src/js/Framework/triangleComponent.js",

        'src/js/lf2/game/define.js',

        'src/js/lf2/enums/Bound.js',
        'src/js/lf2/enums/Effect.js',
        'src/js/lf2/enums/FrameStage.js',
        'src/js/lf2/enums/ItrKind.js',

        'src/js/lf2/game/Utils.js',
        'src/js/lf2/game/KeyboardConfig.js',
        'src/js/lf2/game/KeyEventPool.js',
        'src/js/lf2/game/Rectangle.js',
        'src/js/lf2/game/Cube.js',

        'src/js/lf2/frame/ImageInformation.js',
        'src/js/lf2/frame/BmpInfo.js',
        'src/js/lf2/frame/Interaction.js',
        'src/js/lf2/frame/ObjectPoint.js',
        'src/js/lf2/frame/Body.js',
        'src/js/lf2/frame/Frame.js',

        'src/js/lf2/objects/GameObject.js',
        'src/js/lf2/objects/GameObjectBall.js',
        'src/js/lf2/objects/GameObjectWeapon.js',
        'src/js/lf2/objects/GameObjectCharacter.js',
        'src/js/lf2/objects/pool/GameObjectPool.js',
        'src/js/lf2/objects/GameMapLayer.js',
        'src/js/lf2/objects/GameMap.js',
        'src/js/lf2/objects/pool/GameMapPool.js',
        'src/js/lf2/objects/ColorBar.js',

        'src/js/lf2/items/GameItem.js',
        'src/js/lf2/items/Character.js',
        'src/js/lf2/items/Ball.js',
        'src/js/lf2/items/Weapon.js',

        'src/js/lf2/items/behavior/AbstractBehavior.js',
        'src/js/lf2/items/behavior/CenterTrackerBehavior.js',
        'src/js/lf2/items/behavior/FasterTrackerBehavior.js',
        'src/js/lf2/items/behavior/HorizontalTrackerBehavior.js',
        'src/js/lf2/items/behavior/JulianBallBeginBehavior.js',
        'src/js/lf2/items/behavior/FirzenDisasterFallDownBehavior.js',

        'src/js/lf2/player/PlayerStatusPanel.js',
        'src/js/lf2/player/Player.js',

        'src/js/lf2/game/scenes/WorldScene.js',

        'src/js/lf2/level/LaunchMenu.js',
        'src/js/lf2/level/MySettingLevel.js',
        'src/js/lf2/level/LoadingLevel.js',
        'src/js/lf2/level/SelectionLevel.js',
        'src/js/lf2/level/FightLevel.js',

        'src/js/lf2/!MainGame.js',
    ])
        .pipe(sourcemaps.init())
        /*
         .pipe(babel({ //Something problem with extends Map
         presets: ['es2016', 'es2015']
         }))*/
        .pipe(babili({
            mangle: {
                keepClassNames: true,
                keepFnName: true
            },
            simplify: {

            },
            removeConsole: true,
        }))
        .pipe(concat('js/load.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('resources', () => {
    //Copy resources
    let taskArr = [];
    console.log("Copy data folder");
    taskArr.push(
        gulp.src('src/data/**')
            .pipe(gulp.dest(DIST_DIR + 'data/'))
    );

    console.log("Copy image folder");
    taskArr.push(
        gulp.src('src/image/**')
            .pipe(gulp.dest(DIST_DIR + 'image/'))
    );

    console.log("Copy music folder");
    taskArr.push(
        gulp.src('src/music/**')
            .pipe(gulp.dest(DIST_DIR + 'music/'))
    );

    console.log("Copy css folder");
    taskArr.push(
        gulp.src('src/css/**')
            .pipe(gulp.dest(DIST_DIR + 'css/'))
    );

    return merge(taskArr);
});

gulp.task('default', ['resources', 'build']);
