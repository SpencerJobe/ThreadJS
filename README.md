# ThreadJS
### A simple way to write threaded loops and async processing

A thread object is used to chain functions together. Each "link" in the chain is considered one step in the process. Each step is called over and over until it returns false or undefined.

```javascript

var thread = new Thread();

thread(function() {

//Step 1 

})(function() {

//Step 2

})(function() {

//Step 3

}).run();

```

You can also add labels to a step. This allows you to branch back and forth between different steps. 

```javascript
function example(callback) {
    
    var thread = new Thread();
    var x = 0;
    var y = 0;
    var size = 10000; //ten thousand
    var array = [];


    //here "outer_loop" is a label for Step 1
    thread("outer_loop",function() {

        y = 0;
        array[x] = [];

    })(function () {

        array[x][y] = x * y;
        y += 1;

        //repeat this function while y < size
        return y < size; 

    })(function() {

        x += 1;
        if (x < size) {

            //jump to the step labeled as "outer_loop"
            return "outer_loop";
        }

    })(function() {
    
        callback(array);

    }).run();

}
```

## Breaking Down a Simple Example
```html
(...)

<button onclick="example()">Run Example</button>

<div id="progress">Click button to start</div>

<script>
function example() {
    
    var thread = new Thread();
    var i = 0;
    var max = 5000000; // 5 million
    var sum = 0;
    var el = document.getElementById("progress");

    thread(function() {

        sum += i;
        el.innerHTML = "i = " + i + " Sum=" + sum;
        i += 1;
        return i < max;
    
    })(function() {

        alert("Sum is " + sum);
    
    }).run()
}
</script>
```
You can see in the first step that we are returning `i < max` which means that the thread will repeatedly step 1 while `i` is less than `max`.  Step one listed below:
```javascript 
function () {

    sum += i;
    el.innerHTML = "i = " + i + " Sum=" + sum;
    i += 1;
    return i < max;

}
```
Once `i` is greater than or equal to max, the thread will move on to the next step.
```javascript
function () {

    alert("Sum is " + sum);
}
```
This step doesn't return anything. So, the return value is undefined. The thread will treat this as false and will move on to the next step. However, this is the last step in the example, so nothing else is called. It's common to call a callback function in the last step. 


### Timing
The thread object has two time properties called `sprint` and `sleep`.  The `sprint` property is the max number of milliseconds that a thread should run before sleeping. And, thus, `sleep` is the number of milliseconds the thread should rest before resuming. 

The `sprint` property is set to 200 milliseconds by default and the `sleep` property is set to 100 milliseconds by default. These properties can be assigned when creating a new thread as seen below. 
```javascript
// Thread(<sprint>, <sleep>);
var thread = new Thread(500,1000);
```
This can help you dial back the speed of a thread. Pay close attention to these values if you modify them. Long sprint times will make the webpage feel clunky and slow.