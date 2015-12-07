var S = {
    init: function(str) {
        S.Drawing.init('.canvas');
        document.body.classList.add('body--ready');

        S.UI.simulate(str);

        S.Drawing.loop(function() {
            S.shape.render();
        });
    }
};

S.Drawing = (function() {
    var canvas,
        context,
        renderFn,
        requestFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };

    return {
        init: function(ele) {
            canvas = document.querySelector(ele);
            context = canvas.getContext('2d');
            this.adjustCanvas();
            window.addEventListener('resize', function(e) {
                S.Drawing.adjustCanvas();
            });
        },
        loop: function(fn) {
            //console.log(1);
            renderFn = !renderFn ? fn : renderFn;
            this.clearFrame();
            renderFn();
            requestFrame.call(window, this.loop.bind(this));
        },

        adjustCanvas: function() {
            canvas.width = $('.m-me .title').innerWidth();
            canvas.height = canvas.width*0.3;
        },

        clearFrame: function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        },

        getArea: function(){
            return {
                w: canvas.width,
                h: canvas.height
            };
        },
        drawCircle: function(p, c) {
            context.fillStyle = c.render();
            context.beginPath();
            context.arc(p.x, p.y, 4, 0, 2 * Math.PI, true);
            /*context.arc(p.x, p.y, p.z, 0, 2 * Math.PI, true);*/
            context.closePath();
            context.fill();
        }
    };
}());

S.delay = 5000;

S.UI = (function() {
    var input = document.querySelector('.ui-input'),
        canvas = document.querySelector('.canvas'),
        interval,
        startInterval,
        time,
        //存放所写
        sequence = [],
        currentAction,
        cmd = '#';

    function formatTime(date) {
        var h = date.getHours(),
            m = date.getMinutes(),
            m = m < 10 ? '0' + m : m;
        return h + ':' + m;
    }

    //循环动作
    function timedAction(fn, max, delay, reverse){
        clearInterval(interval);
        currentAction = reverse ? max : 1;
        fn(currentAction);

        if (!max || (!reverse && currentAction < max) || (reverse && currentAction > 0)) {
            interval = setInterval(function() {


                if ((!reverse && max && currentAction === max) || (reverse && currentAction <= 0)) {
                    clearInterval(interval);
                    clearInterval(startInterval);
                }else{
                    currentAction = reverse ? currentAction - 1 : currentAction + 1;
                    fn(currentAction);
                }

            }, delay);
        }
    }
    //获取当前动作
    function getAction(val){
        var val = val && val.split(' ')[0];
        return val && val[0] === cmd && val.substring(1);
    }
    //
    function getValue(val) {
        return val && val.split(' ')[1];
    }
    //执行动作
    function performAction(value) {
        var action,
            value,
            current;

        sequence = typeof(value) === 'object' ? value : sequence.concat(value.split('|'));
        input.value = '';

        startInterval = timedAction(function(){
            current = sequence.shift();
            action = getAction(current);
            value = getValue(current);
            switch(action){
                case 'countdown':
                    value = parseInt(value) || 10;
                    value = value > 0 ? value : 10;

                    timedAction(function(index) {
                        console.log(index);
                        if (index === 0) {
                            if (sequence.length === 0) {
                                S.shape.switchShape(S.shapeBuilder.letter(''));
                            } else {
                                clearInterval(interval);
                                performAction(sequence);
                            }
                        } else {
                            S.shape.switchShape(S.shapeBuilder.letter(index), true);
                        }
                    }, value, 1000,  true);
                    break;
                case 'time':
                    var t = formatTime(new Date());

                    if (sequence.length > 0) {
                        S.shape.switchShape(S.ShapeBuilder.letter(t));
                    } else {
                        timedAction(function() {
                            t = formatTime(new Date());
                            if (t !== time) {
                                time = t;
                                S.shape.switchShape(S.shapeBuilder.letter(time));
                            }
                        }, 1000);
                    }
                    break;
                default:
                    console.log(current);
                    clearInterval(interval);
                    clearInterval(startInterval);
                    S.shape.switchShape(S.shapeBuilder.letter(current[0] === cmd ? 'What?' : current));
                    break;
            }
        }, sequence.length, 5000);
    }

    function reset(destroy) {
        clearInterval(interval);
        sequence = [];
        //time = null;
        destroy && S.Shape.switchShape(S.ShapeBuilder.letter(''));
    }
    //
    function bindEvent(){
        document.getElementById('canvas-input').addEventListener('keydown', function(e) {
            input.focus();

            if (e.keyCode === 13) {
                firstAction = false;
                reset();
                performAction(input.value);
            }
        });
    }
    function init(){
        bindEvent();
    }
    init();
    return {
        simulate: function(strAction) {
            performAction(strAction);
        }
    }
}());

//给出点的参数
S.Point = function(args) {
    this.x = args.x;
    this.y = args.y;
    this.z = args.z;
    this.a = args.a;
    this.h = args.h;
};

S.Color = function(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
};

S.Color.prototype = {
    render: function() {
        return 'rgba(' + this.r + ',' + +this.g + ',' + this.b + ',' + this.a + ')';
    }
};


S.Dot = function(x, y) {
    this.p = new S.Point({
        x: x,
        y: y,
        z: 5,
        a: 1,
        h: 0
    });

    this.e = 0.07;
    this.s = true;

    this.c = new S.Color(255, 255, 255, this.p.a);

    this.t = this.clone();
    this.q = [];
};

S.Dot.prototype = {
    clone: function() {
        return new S.Point({
            x: this.x,
            y: this.y,
            z: this.z,
            a: this.a,
            h: this.h
        });
    },

    _draw: function() {
        this.c.a = this.p.a;
        S.Drawing.drawCircle(this.p, this.c);
    },

    _moveTowards: function(n) {
        var details = this.distanceTo(n, true),
            dx = details[0],
            dy = details[1],
            d = details[2],
            e = this.e * d;

        if (this.p.h === -1) {
            this.p.x = n.x;
            this.p.y = n.y;
            return true;
        }

        if (d > 1) {
            this.p.x -= ((dx / d) * e);
            this.p.y -= ((dy / d) * e);
        } else {
            if (this.p.h > 0) {
                this.p.h--;
            } else {
                return true;
            }
        }

        return false;
    },

    _update: function() {
        if (this._moveTowards(this.t)) {
            var p = this.q.shift();

            if (p) {
                this.t.x = p.x || this.p.x;
                this.t.y = p.y || this.p.y;
                this.t.z = p.z || this.p.z;
                this.t.a = p.a || this.p.a;
                this.p.h = p.h || 0;
            } else {
                if (this.s) {
                    this.p.x -= Math.sin(Math.random() * 3.142);
                    this.p.y -= Math.sin(Math.random() * 3.142);
                } else {
                    this.move(new S.Point({
                        x: this.p.x + (Math.random() * 50) - 25,
                        y: this.p.y + (Math.random() * 50) - 25,
                    }));
                }
            }
        }

        d = this.p.a - this.t.a;
        this.p.a = Math.max(0.1, this.p.a - (d * 0.05));
        d = this.p.z - this.t.z;
        this.p.z = Math.max(1, this.p.z - (d * 0.05));
    },

    distanceTo: function(n, details) {
        var dx = this.p.x - n.x,
            dy = this.p.y - n.y,
            d = Math.sqrt(dx * dx + dy * dy);

        return details ? [dx, dy, d] : d;
    },

    move: function(p, avoidStatic) {
        if (!avoidStatic || (avoidStatic && this.distanceTo(p) > 1)) {
            this.q.push(p);
        }
    },

    render: function() {
        this._update();
        this._draw();
    }
}



S.shapeBuilder = (function() {
    var gap = 8,
        shapeCanvas = document.createElement('canvas'),
        shapeContext = shapeCanvas.getContext('2d'),
        fontSize = 500,
        fontFamily = 'Avenir, Helvetica Neue, Helvetica, Arial, sans-serif';

    function fit() {
        shapeCanvas.width = Math.floor($('.m-me .title').innerWidth() / gap) * gap;
        shapeCanvas.height = Math.floor($('.m-me .title').innerWidth()*0.3 / gap) * gap;
        shapeContext.fillStyle = 'red';
        shapeContext.textBaseline = 'middle';
        shapeContext.textAlign = 'center';
    }

    function setFontSize(s) {
        shapeContext.font = 'bold ' + s + 'px ' + fontFamily;
    }

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //获取像素点
    function processCanvas() {
        var pixels = shapeContext.getImageData(0, 0, shapeCanvas.width, shapeCanvas.height).data,
            dots = [],
            x = 0,
            y = 0,
            fx = shapeCanvas.width,
            fy = shapeCanvas.height,
            w = 0,
            h = 0;

        for (var p = 0; p < pixels.length; p += (4 * gap)) {
            if (pixels[p + 3] > 0) {
                dots.push(new S.Point({
                    x: x,
                    y: y
                }));

                w = x > w ? x : w;
                h = y > h ? y : h;
                fx = x < fx ? x : fx;
                fy = y < fy ? y : fy;
            }

            x += gap;

            if (x >= shapeCanvas.width) {
                x = 0;
                y += gap;
                p += gap * 4 * shapeCanvas.width;
            }
        }
        /*console.log({
            dots: dots,
            w: w + fx,
            h: h + fy
        });*/
        return {
            dots: dots,
            w: w + fx,
            h: h + fy
        };
    }

    function init() {
        fit();
        window.addEventListener('resize', fit);
    }

    // Init
    init();

    return {
        letter: function(str) {
            //设置字体大小，使文字大约占满一屏
            var px = 0;
            setFontSize(fontSize);
            px = Math.min(fontSize, (shapeCanvas.width/shapeContext.measureText(str).width *0.8 *fontSize), (shapeCanvas.height / fontSize) * (isNumber(str) ? 1 : 0.45) * fontSize);
            setFontSize(px);
            shapeContext.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
            shapeContext.fillText(str, shapeCanvas.width / 2, shapeCanvas.height / 2);
            //返还像素点
            return processCanvas();
        }
    };
}());

S.shape = (function() {
    var dots = [],
        width = 0,
        height = 0,
        cx = 0,
        cy = 0;
    function compensate() {
        var a = S.Drawing.getArea();

        cx = a.w / 2 - width / 2;
        cy = a.h / 2 - height / 2;
    }

    return {
        switchShape: function(n, fast){
            var size,
                //获取canvas绘图区域
                a = S.Drawing.getArea();
            //获取文本canvas绘图
            width = n.w;
            height = n.h;

            compensate();

            if (n.dots.length > dots.length) {
                size = n.dots.length - dots.length;
                for (var d = 1; d <= size; d++) {
                    dots.push(new S.Dot(a.w / 2, a.h / 2));
                }
            }
            var d = 0,
                i = 0;

            while (n.dots.length > 0) {
                i = Math.floor(Math.random() * n.dots.length);
                dots[d].e = fast ? 0.25 : (dots[d].s ? 0.14 : 0.11);

                /*if (dots[d].s) {
                    dots[d].move(new S.Point({
                        z: Math.random() * 20 + 10,
                        a: Math.random(),
                        h: 18
                    }));
                } else {
                    dots[d].move(new S.Point({
                        z: Math.random() * 5 + 5,
                        h: fast ? 18 : 30
                    }));
                }*/

                dots[d].s = true;
                dots[d].move(new S.Point({
                    x: n.dots[i].x + cx,
                    y: n.dots[i].y + cy,
                    a: 1,
                    z: 5,
                    h: 0
                }));

                n.dots.splice(i, 1);
                //n.dots = n.dots.slice(0, i).concat(n.dots.slice(i + 1));
                d++;
            }

            for (var i = d; i < dots.length; i++) {
                if (dots[i].s) {
                    dots[i].move(new S.Point({
                        z: Math.random() * 20 + 10,
                        a: Math.random(),
                        h: 20
                    }));

                    dots[i].s = false;
                    dots[i].e = 0.04;
                    dots[i].move(new S.Point({
                        x: Math.random() * a.w,
                        y: Math.random() * a.h,
                        a: .5, //.4
                        z: Math.random(),
                        h: 0
                    }));
                }
            }
        },

        render: function() {
            for (var d = 0; d < dots.length; d++) {
                dots[d].render();
            }
        }
    }
}());