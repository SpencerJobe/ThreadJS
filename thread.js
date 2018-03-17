/*---------------------------------------------------------------------------------------------------------
     MODULE: thread.js 
    VERSION: 0.1a
     AUTHOR: Spencer A. Jobe
  COPYRIGHT: 2018
DESCRIPTION: A simple way the write threaded loops and async processing.

--BEGIN LICENSE--

    ThreadJS (thread.js)
    Copyright 2018 Spencer A. Jobe

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
    associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

        The above copyright notice and this permission notice shall be included in 
        all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
    SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

--END LICENSE--

---------------------------------------------------------------------------------------------------------*/
(function loadThread(win) {

    var Thread = function (sprint, sleep) {
                
        var self = this;
        
        self.sprint = sprint || 200;
        self.sleep = sleep || 100;
        self.steps = [];
        self.labels = {};
        self.index = 0;
        
        var proxy = function (label,step) {
            
            if (typeof label === "string") {
            
                self.labels[label] = self.steps.length;
            
            } else {
            
                step = label;
            }
            
            self.steps.push(step);
            return proxy;
        };
        
        proxy.run = function () {
        
            self.run();
        };
        
        return proxy;
    };

    Thread.prototype.run = function () {
        
        var self = this;
        var time = Date.now();
        var result;

        while (Date.now() - time < self.sprint) {
            
            result = self.steps[self.index]();
            
            if (typeof result === "string") {

                if (self.labels.hasOwnProperty(result)) {
                    
                    self.index = self.labels[result];
                } else {

                    throw new Error("Thread does not have label '" + result + "'");
                }
            } else if (result === false || result === undefined) {
        
                self.index += 1;
        
                if (self.index >= self.steps.length) {
        
                    return;
                }
                break;
            }
        }
        
        setTimeout(function() {
        
            self.run();

        },self.sleep);
    };

    win.Thread = Thread;

}(window));