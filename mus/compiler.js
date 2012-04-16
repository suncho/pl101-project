var compile = function (musexpr) {
  var compiled = []
  var compile_inner = function (time, expr) {
    var time_l, time_r;

    switch (expr.tag) {
      case 'seq':
        time = compile_inner (time, expr.left);
        time = compile_inner (time, expr.right);
        break;
      case 'par':
        time_l = compile_inner (time, expr.left);
        time_r = compile_inner (time, expr.right);
        time = Math.max (time_l, time_r);
        break;
      case 'note':
        compiled.push ( 
          { tag: 'note', pitch: expr.pitch, start: time, dur: expr.dur }
        );
        time += expr.dur;
        break;
      case 'rest':
        time += expr.dur;
        break;
    }
    return time;
  };
  compile_inner (0, musexpr);  
  return compiled;
};

var melody_mus = 
  { tag: 'seq',
    left:
      { tag: 'seq',
        left: { tag: 'note', pitch: 'a4', dur: 250 },
        right:
          { tag: 'seq',
            left: { tag: 'rest', dur: 100 },
            right: { tag: 'note', pitch: 'b4', dur: 250 } } },
    right:
      { tag: 'seq',
        left: { tag: 'note', pitch: 'c4', dur: 500 },
        right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log (melody_mus);
console.log (compile(melody_mus));