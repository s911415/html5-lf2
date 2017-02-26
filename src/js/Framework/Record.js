var Framework = (function (Framework) {
    'use strict';


    Framework.Record = function () {
        this.record = [];
        this.waitCounter = 0;
        this.recordDiv;
        this.isRecording = false;
        this.isPause = false;

        this.inputCommand = function (command) {
            this.recordWait();
            this.record.push(command);
            this.addDivString('&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[this.record.length - 1] + '<br>');
        };
        this.start = function () {
            this.waitCounter = 0;
            if (this.isRecording === false) {
                this.isRecording = true;
                this.isPause = false;
                var recordString = 'QUnit.asyncTest( "Test Script", function( assert ) {<br>';
                this.addDivString(recordString);
            } else {
                if (this.isPause) {
                    this.isPause = false;
                }
            }
        };
        this.pause = function () {
            if (this.isRecording) {
                this.recordWait();  // 2016.10.27 added by cbh
                this.isPause = true;
            }
        };
        this.stop = function () {
            if (this.isRecording) {
                this.isRecording = false;
                this.isPause = false;
                this.addDivString("});<br>");
            }
        };

        this.addDivString = function (addString) {
            document.getElementById("record_div").innerHTML += addString;
        };

        this.update = function () {
            this.waitCounter++;
        };
        this.click = function (e) {
            this.recordWait();
            this.record.push("Framework.Replay.mouseClick(" + e.x + "," + e.y + ");");
            this.addDivString('&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[this.record.length - 1] + '<br>');
            this.scrollToBottom();
        };
        this.mousedown = function (e) {
            this.recordWait();
        };
        this.mouseup = function (e) {
            this.recordWait();
        };
        this.mousemove = function (e) {
            this.recordWait();
            this.record.push("Framework.Replay.mouseMove(" + e.x + "," + e.y + ");");
            this.addDivString('&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[this.record.length - 1] + '<br>');
            this.scrollToBottom();
        };
        //keyboard Event
        this.keydown = function (e) {
            this.recordWait();
            this.record.push("Framework.Replay.keyDown('" + e.key + "');");
            this.addDivString('&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[this.record.length - 1] + '<br>');
            this.scrollToBottom();
        };
        this.keyup = function (e) {
            this.recordWait();
            this.record.push("Framework.Replay.keyUp('" + e.key + "');");
            this.addDivString('&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[this.record.length - 1] + '<br>');
            this.scrollToBottom();
        };
        this.keypress = function (e) {
            this.recordWait();
        };

        this.recordWait = function () {
            if (this.waitCounter > 0) {
                this.waitCounter++;
                this.record.push("Framework.Replay.waitFor(" + this.waitCounter + ");");
                this.addDivString('&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[this.record.length - 1] + '<br>');
                this.waitCounter = 0;
            }
        };

        this.CallFunction = function (InForm, Agrs) {
            // TestCount++;
            // if (IsFunction(InForm.SetRecordData)) {
            // } else {
            //     if (TestCount <= 10) {
            //         setTimeout(function() { CallFunction(InForm, Agrs); }, 1000);
            //     } else {
            //         alert("放棄");
            //     }
            // }
            InForm.SetRecordData(Agrs);
        };
        var m_record = this;
        this.save = function () {
            var recordString = 'QUnit.asyncTest( "Test Script", function( assert ) {<br>';
            for (var i = 0; i < this.record.length; i++) {
                recordString += '&nbsp;&nbsp;&nbsp;&nbsp;' + this.record[i] + '<br>';
            }
            recordString += '});<br>';
            var form = window.open("record.html", "form2", "_blank", "");
            setTimeout(function () {
                m_record.CallFunction(form, recordString);
            }, 1000);

            //document.getElementById('recordscript').innerHTML = recordString;
        };

        this.InsertCommand = function (command) {
            this.recordWait();
            this.record.push(command);
        };

        this.scrollToBottom = function () {
            document.getElementById("record_div").scrollTop = document.getElementById("record_div").scrollHeight
        }
    };

    return Framework;
})(Framework || {});