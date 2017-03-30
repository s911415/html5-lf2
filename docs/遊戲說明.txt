===============================================================================
                         Little Fighter 2 version 2.0a
                                  11 Jul 2009

                             Copyright 1999-2009,
                         Marti Wong and Starsky Wong, 
                             All rights reserved
    
                   Official Site: http://littlefighter.com/
                                  http://lf2.net  
===============================================================================


-------
UPDATES
-------
<11 Jul 2009>
1. Include the fix of the NumLock bug (In v2.0, NumLock keeps ON all the time,
   after the fix, user can turn off the NumLock)

2. Fix a critical bug in Geforce 9800 graphics card - Showing wrong sprite 
   pictures when character facing left.

   If you are typical players, this fix has no impact on you.

   But if you are LF2 data modifiers, you may be interested to the following
   details:
   
   Cause of the bug:
   The "left-right" mirror function of DirectDrew is no longer supported by
   some new graphics cards (Such as Geforce 9800).

   How did I fix it?
   I pre-rendered the mirrored pictures and put them along with the original 
   pictures.
   For example, for Davis, it's animation consisted of 
      davis_0.bmp,        davis_1.bmp,        davis_2.bmp
   In LF2 v2.0a, there are 
      davis_0_mirror.bmp, davis_1_mirror.bmp, davis_2_mirror.bmp, they are 
      the "mirrored" version of the 3 bmp above

   Impact to modifiers:
   It is recommended that you should create those *_mirror.bmp with your
   character    files.
   In case the mirrored pictures are not provided, LF2 will try to do the 
   mirroring programmatically.  It means even you don't provide *_mirror.bmp,
   LF2 may still work.  However, if you are using Geforce 9800, the "wrong
   sprite picture" bug will happen when those mirror pictures are missing.

   If you have any questions, you may go to http://lf2.net/forum for help.


<28 Jul 2008>
1. Add a Survival Stage (in stage mode)

2. Add Gameplay Recording feature 
   (for details, go to http://littlefighter.com/record/)

3. Hold a competition to celebrate 10th year anniversary of LF2
   (for details, go to http://littlefighter.com/challenge/)

4. Add background musics

5. Fix bugs:
   a. Ask Yes/No after pressing ESC to quit
   b. Fix the busy waiting issue in framerate controller (save CPU resources)
   c. Remove the "dirty" pixels from some character's action bmps
   d. Disable the menu key - F10 and ALT key

6. Other improvements:
   a. User can adjust volume by pressing F11/F12
   b. Compress all the bmps
   c. Allow user to set Full Screen by pressing the maximize button on 
      upper left corner of window
   d. Add update news feature (inform players for any update.)


-------------------
SYSTEM REQUIREMENTS
-------------------
CPU: Celeron 300 / K6-2 300 or above
Memory: >32 MB Ram
Display Card: Supports Direct X acceleration
Platform: Win 2000/Vista with Direct X 9.0 or above
Resolution: 800 x 600 or above, _MUST BE_ 32 bit colors


-------------
Function Keys
-------------
F1: Pause
F2: Pause/Step
F3: Function Keys Locked (F6,F7,F8,F9)
F4: Restart
F5: Turn off the frame control timer (Speed up)
F6: Unlimited MP
F7: Recover
F8: Drop weapons from the sky
F9: Destroy all weapons
F11: Audio volume +
F12: Audio Volume -
ESC: Quit

(F5 ~ F9 are disabled in stage mode.)

-------------
SPECIAL MOVES
-------------

Template, Bandit and Hunter do not have special moves.

('D' means Defend button, 'A' means Attack button, 'J' means Jump button)
('>', '^', 'v' means the arrow buttons)
You can setup the Key Configuration by choosing "Control Settings" in the
main menu.


==John==
1.Energy Blast (15mp) 
  Input method: D + > + A
2.Heal (others) (70mp)
  Input method: D + ^ + J
3.Energy Shield: (20mp)
  Input method: D + > + J  
4.Energy Disk: (50mp)
  Input method: D + ^ + A
5.Heal (myself): (70mp)
  Input method: D + v + J  


==Deep==
1.Energy Blast (15mp) 
  Input method: D + > + A  ( + A + A...)
2.Strike (15mp)
  Input method: D + v + A
3.Leap Attack: (15mp)
  Input method: D + ^ + J + A
4.Leap Attack2: (15mp)
  Input method: Strike + J + A  
5.Dashing Strafe: (30mp)
  Input method: D + > + J  


==Henry==
1.Dragon Palm (30mp) 
  Input method: D + > + A
2.Multiple Shot (30mp)
  Input method: D + J + A  ( + A + A...)
2.Critical Shot (40mp)
  Input method: D + > + J
2.Sonata of the Death (70mp)
  Input method: D + ^ + J


==Rudolf==
1.Leap Attack: (0mp)
  Input method: D + > + J
2.Multiple Ninja Star: (20mp)
  Input method: D + > + A  ( + A + A...)
2.Transform (30mp) 
  Input method: Gripping Other + D + J + A
3.Hide (70mp)
  Input method: D + ^ + J
4.Double (70mp)
  Input method: D + v + J


==Louis==
1.Thunder Punch (10mp) 
  Input method: Run + A
2.Thunder Punch (15mp) 
  Input method: Run + J +  A
3.Thunder Kick (10mp) 
  Input method: D + > + J
4.Whirlwind Throw (15mp) 
  Input method: D + ^ + J
5.Phoenix Palm (30mp) 
  Input method: D + > + A


==LouisEX==
1.Phoenix Dance (0mp)
  Input method: D + v + A
2.Thunder Punch (6mp) 
  Input method: Run + A
3.Thunder Punch (8mp) 
  Input method: Run + J +  A
4.Phoenix Palm (20mp) 
  Input method: D + > + A ( + A + A...)


==Firen==
1.Fire Ball (15mp) 
  Input method: D + > + A  ( + A + A...) 
2.Blaze (15mp +...)
  Input method: D + > + J
3.Inferno (30mp +...)
  Input method: D + v + J
4.Explosion (60mp + 8hp)
  Input method: D + ^ + J


==Freeze==
1.Ice Blast (20mp) 
  Input method: D + > + A
2.Summon Sword (30mp)
  Input method: D + v + J
3.Icicle (30mp)
  Input method: D + > + J
4.Whirlwind (60mp)
  Input method: D + ^ + J


==Firzen==
1.Firzen Cannon (5mp +...) 
  Input method: D + > + J
2.Overwhelming Disaster (20mp)
  Input method: D + ^ + A ( + A + A...)
3.Arctic Volcano (50mp)
  Input method: D + ^ + J
  

==Dennis==
1.Energy Blast (8mp) 
  Input method: D + > + A  ( + A + A...) 
2.Shrafe (15mp) 
  Input method: D + v + A
3.Whirlwind Kick (15mp + ...) 
  Input method: D + > + J
4.Chasing Blast (20mp) 
  Input method: D + ^ + A


==Woody==
1.Flip Kick (0mp) 
  Input method: D + ^ + A
2.Turning Kick (10mp) 
  Input method: D + v + A
3.Teleport (10mp) 
  Input method: D + ^ + J (to enemy)   /   D + v + J (to friend)
4.Energy Blast (25mp) 
  Input method: D + > + A
5.Tiger Dash (40mp) 
  Input method: D + > + J


==Davis==
1.Leap Attack (5mp) 
  Input method: D + ^ + J + A 
2.Energy Blast (8mp) 
  Input method: D + > + A  ( + A + A...) 
3.Shrafe (15mp) 
  Input method: D + v + A
4.Dragon Punch (45mp) 
  Input method: D + ^ + A 


==Bandit==
No special moves.


==Hunter==
No special moves.


==Mark==
1.Crash Punch (0mp) 
  Input method: D + > + A (+ A)
2.Body Attack (0mp + ...) 
  Input method: D + > + J


==Jack==
1.Energy Blast (10mp) 
  Input method: D + > + A
2.Flash Kick (25mp)
  Input method: D + ^ + A


==Sorcerer==
1.Ice Blast (25mp) 
  Input method: D + > + J
2.Fire Ball (15mp) 
  Input method: D + > + A  ( + A + A...) 
3.Heal (others) (70mp)
  Input method: D + ^ + J
4.Heal (myself): (70mp)
  Input method: D + v + J  


==Monk==
1.ShaoLin Palm (20mp) 
  Input method: D + > + A


==Jan==
1.Devil's Judgement (30mp) 
  Input method: D + ^ + A
2.Angel's Blessing (40mp)
  Input method: D + ^ + J


==Knight==
No special moves.


==Justin==
1.Wolf Punch (15mp) 
  Input method: D + v + A ( + A...)
2.Energy Blast (15mp)
  Input method: D + > + A


==Bat==
1.Speed Punch (10mp) 
  Input method: D + > + J
2.Eye Laser (25mp) 
  Input method: D + > + A
3.Summon Bats (40mp) 
  Input method: D + ^ + J


==Julian==
1.Soul Punch (0mp) 
  Input method: Run + A
2.Uppercut (0mp) 
  Input method: D + ^ + A ( + A)
3.Skull Blast (2mp + ...)
  Input method: D + > + A ( + A...)
4.Mirror Image (5mp) 
  Input method: D + J + A ( + J...)
5.Big Bang (20mp)
  Input method: D + ^ + J
6.Soul Bomb (25mp)
  Input method: D + > + J


-----------------------------
Command Computer Teammate(s):
-----------------------------
Come:  D + J + D + J
Stay:  D + D + D + D
Move:  D + A + D + A


----------------------
How to record gameplay
----------------------
To record your gameplay in LF2(v2.0), you have to turn on recording feature 
by the following steps:

1. Start LF2
2. Choose "Recording info" at the main menu
3. Type "Your name" and "More info" (these info will be shown when others 
   replaying your recording)
4. Check the "Turn on recording" box
5. Click "ok"

Then LF2 will automatically record and save each of your gameplay to the 
folder "recording\" under LF2 game directory.

For details, please visit http://lf2.net/record/


------
Donate
------
If you like our game, you may show your support by paypal donating (say US $8)
Here is the link:
https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=donate%40lf2%2enet&lc=US&item_name=Little%20Fighter&amount=8%2e00&currency_code=USD&no_note=0&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest


----------
DISCLAIMER
----------
Authors of this program will not be held liable for any damages to either the 
user or the system it is run on, that may occur as a direct or indirect result 
of the use of this program.


==============================================================================
You may goto "http://littlefighter.com/" or "http://lf2.net" to check the news 
of LF2 and other games developed by us.
==============================================================================
