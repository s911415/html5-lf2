const DIST_DIR = 'dist/';

const gulp = require('gulp'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
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
        'src/js/lf2/define.js',
        'src/js/lf2/Utils.js',
        'src/js/lf2/Rectangle.js',
        'src/js/lf2/ImageInformation.js',
        'src/js/lf2/KeyboardConfig.js',

        'src/js/lf2/ColorBar.js',
        'src/js/lf2/Bound.js',
        'src/js/lf2/FrameStage.js',

        'src/js/lf2/BmpInfo.js',
        'src/js/lf2/Interaction.js',
        'src/js/lf2/ObjectPoint.js',
        'src/js/lf2/Body.js',
        'src/js/lf2/Frame.js',
        'src/js/lf2/GameObject.js',
        'src/js/lf2/GameObjectPool.js',
        'src/js/lf2/GameItem.js',
        'src/js/lf2/GameObjectBall.js',
        'src/js/lf2/GameObjectCharacter.js',

        'src/js/lf2/Ball.js',
        'src/js/lf2/Character.js',

        'src/js/lf2/PlayerStatusPanel.js',
        'src/js/lf2/Player.js',

        'src/js/lf2/GameMapLayer.js',
        'src/js/lf2/GameMap.js',
        'src/js/lf2/GameMapPool.js',

        'src/js/lf2/WorldScene.js',

        'src/js/lf2/LaunchMenu.js',
        'src/js/lf2/MySettingLevel.js',
        'src/js/lf2/LoadingLevel.js',
        'src/js/lf2/SelectionLevel.js',
        'src/js/lf2/FightLevel.js',

        'src/js/lf2/!MainGame.js',
    ])
        .pipe(sourcemaps.init())
        /*
        .pipe(babel({ //Something problem with extends Map
            presets: ['es2016', 'es2015']
        }))
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))*/
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
