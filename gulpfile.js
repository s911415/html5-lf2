const gulp = require('gulp'),
    clean = require('gulp-clean'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    babili = require("gulp-babili"),
    merge = require('merge-stream'),
    del = require('del'),
    gulpSequence = require('gulp-sequence'),
    zip = require('gulp-zip'),
    fs = require('fs'),
    jsdoc = require('gulp-jsdoc3')
;
const DIST_DIR = 'dist/';
const JS_SRCS = [
    'src/js/utils.js',
    'src/js/jquery-3.2.1.js',
    'src/js/jquery-ui-1.12.1.js',
    'src/js/jszip.min.js',

    "src/js/Framework/AttachableInterface.js",
    "src/js/Framework/KeyboardEventInterface.js",
    "src/js/Framework/MouseEventInterface.js",

    "src/js/Framework/Config.js",
    "src/js/Framework/Record.js",
    "src/js/Framework/Replay.js",
    // "src/js/Framework/EqualCondition.js",
    "src/js/Framework/Util.js",
    // "src/js/Framework/core.js",
    "src/js/Framework/DebugInfo.js",
    // "src/js/Framework/FpsAnalysis.js",
    "src/js/Framework/Point.js",
    "src/js/Framework/Point3D.js",
    "src/js/Framework/GameObject.js",
    // "src/js/Framework/Sprite.js",
    // "src/js/Framework/AnimationSprite.js",
    "src/js/Framework/Scene.js",
    "src/js/Framework/ResourceManager.js",
    "src/js/Framework/Level.js",
    "src/js/Framework/Game.js",
    "src/js/Framework/MouseManager.js",
    "src/js/Framework/KeyBoardManager.js",
    // "src/js/Framework/TouchManager.js",
    // "src/js/Framework/GameMainMenu.js",
    "src/js/Framework/Audio.js",
    // "src/js/Framework/triangleComponent.js",

    'src/js/lf2/game/define.js',

    'src/js/lf2/enums/Bound.js',
    'src/js/lf2/enums/Effect.js',
    'src/js/lf2/enums/FrameStage.js',
    'src/js/lf2/enums/ItrKind.js',

    'src/js/lf2/game/Prefetch.js',
    'src/js/lf2/game/Bezier.js',
    'src/js/lf2/game/Utils.js',
    'src/js/lf2/game/KeyboardConfig.js',
    'src/js/lf2/game/KeyEventPool.js',
    'src/js/lf2/game/Rectangle.js',
    'src/js/lf2/game/Cube.js',
    'src/js/lf2/game/Egg.js',

    'src/js/lf2/frame/ImageInformation.js',
    'src/js/lf2/frame/BmpInfo.js',
    'src/js/lf2/frame/Interaction.js',
    'src/js/lf2/frame/ObjectPoint.js',
    'src/js/lf2/frame/Body.js',
    'src/js/lf2/frame/BloodPoint.js',

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
    'src/js/lf2/items/behavior/SpeedUpTrackerBehavior.js',
    'src/js/lf2/items/behavior/JulianBallBeginBehavior.js',
    'src/js/lf2/items/behavior/JulianBallTrackerBehavior.js',
    'src/js/lf2/items/behavior/FirzenDisasterFallDownBeginBehavior.js',
    'src/js/lf2/items/behavior/FirzenDisasterFallDownBehavior.js',

    'src/js/lf2/player/Team.js',
    'src/js/lf2/player/PlayerStatusPanel.js',
    'src/js/lf2/player/Player.js',

    'src/js/lf2/game/scenes/WorldScene.js',

    'src/js/lf2/level/LaunchMenu.js',
    'src/js/lf2/level/MySettingLevel.js',
    'src/js/lf2/level/LoadingLevel.js',
    'src/js/lf2/level/HelpLevel.js',
    'src/js/lf2/level/SelectionLevel.js',
    'src/js/lf2/level/FightLevel.js',

    'src/js/lf2/!MainGame.js',
];

gulp.task('buildJs', () => {
    return gulp.src(JS_SRCS)
        .pipe(sourcemaps.init())
        /*
         .pipe(babel({ //Something problem with extends Map
         presets: ['latest']
         }))*/
        .pipe(babili({
            mangle: {
                keepClassNames: true,
                keepFnName: true
            },
            simplify: {},
            removeConsole: true,
        }))
        .pipe(concat('js/load.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(DIST_DIR));
});

gulp.task('buildCss', () => {
    return del([
        'dist/css/style.css',
    ]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    }).then(() => {
        gulp.src([
            'src/css/jquery-ui-1.12.1.css',
            'src/css/style.css',
        ])
            .pipe(sourcemaps.init())
            .pipe(concat('css/style.css'))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(DIST_DIR));
    });

});

gulp.task('line', function () {
    let lineArr = [];

    JS_SRCS.forEach(k => {
        let obj = {name: k, count: 0};
        let p = new Promise((a, b) => {
            fs.readFile(k, 'utf8', function (err, dat) {
                if (err) {
                    console.log("Error");
                    b(err);
                } else {
                    obj.count = dat.split("\n").length;
                    a(obj);
                }
            });
        });
        lineArr.push(p);
    });

    return Promise.all(lineArr).then(x => {
        x.forEach((v) => {
            console.log(v.name, v.count);
        });
    });
});

gulp.task('clean', () => {
    return del([
        'dist/**',
        '!dist',
        '!dist/favicon.ico',
        '!dist/index.html',
    ]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

gulp.task('zipData', () => {
    return gulp.src('src/data/**/*.txt')
        .pipe(zip('zip/data.zip'))
        .pipe(gulp.dest(DIST_DIR))
});

gulp.task('zipResources', () => {
    return gulp.src([
        'src/**/music/*.m4a'
    ])
        .pipe(zip('zip/resources.zip'))
        .pipe(gulp.dest(DIST_DIR))
});

gulp.task('zipEgg', () => {
    return gulp.src([
        'src/music/egg/*.m4a'
    ])
        .pipe(zip('zip/egg.zip'))
        .pipe(gulp.dest(DIST_DIR))
});

gulp.task('docs', (cb) => {
    const config = require('./doc_conf.json');
    return new Promise((a, b) => {
        gulp.src(['README.md', './src/**/*.js'], {read: false})
            .pipe(
                jsdoc(config, function (cb) {
                    "use strict";
                    a();
                })
            );
    });
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

gulp.task(
    'default',
    gulpSequence(
        'clean',
        'resources',
        [
            'buildJs',
            'buildCss'
        ],
        [
            'zipData',
            'zipResources',
            'zipEgg'
        ],
        'docs'
    )
);
