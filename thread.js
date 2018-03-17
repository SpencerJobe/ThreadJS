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