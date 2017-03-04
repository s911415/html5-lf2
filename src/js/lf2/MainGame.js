//當有要加關卡時, 可以使用addNewLevel
//第一個被加進來的Level就是啟動點, 所以一開始遊戲就進入MyMenu
'use strict';
{
    Framework.Game.addNewLevel({menu: new lf2.LaunchMenu()});
    Framework.Game.addNewLevel({control: new lf2.MySettingLevel()});
    Framework.Game.addNewLevel({MapLevel: new lf2.MapLevel()});
    //Framework.Game.addNewLevel({level1: new lf2.MyGame()});

    //讓Game開始運行
    Framework.Game.start();
}
