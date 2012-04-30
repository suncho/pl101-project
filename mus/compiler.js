// Converts a pitch (e.g. 'c4' into a corresponding MIDI number
var pitch2midi = function (pitch) {
  var octave0 = [21, 23, 12, 14, 16, 17, 19];

  note = pitch[0].toLowerCase().charCodeAt() - 'a'.charCodeAt();
  octave = parseInt (pitch[1]);
  return octave0[note] + octave * 12;
}

var compile = function (musexpr) {
  var compiled = []
  var compile_inner = function (time, expr) {
    var time_l, time_r;

    switch (expr.tag) {
      case 'note': // Process a single note.
        compiled.push ( 
        { tag: 'note', 
          pitch: pitch2midi(expr.pitch), 
          start: time, 
          dur: expr.dur }
        );
        time += expr.dur;
        break;
      case 'par': // Process two mus expressions concurrently.
        time_l = compile_inner (time, expr.left);
        time_r = compile_inner (time, expr.right);
        time = Math.max (time_l, time_r);
        break;
      case 'repeat': // Repeat an expression 'count' times.
        for (i = expr.count; i > 0; --i)
          time = compile_inner (time, expr.section);
        break;
      case 'rest': // Play nothing for a duration.
        time += expr.dur;
        break;
      case 'seq': // Process two mus expressions in sequence.
        time = compile_inner (time, expr.left);
        time = compile_inner (time, expr.right);
        break;
    }
    return time;
  };
  compile_inner (0, musexpr);
  return compiled;
};

var melody_mus = 
{ tag: 'par',
  left:
  { tag: 'seq',
    left:
    { tag: 'seq',
      left: { tag: 'note', pitch: 'a4', dur: 250 },
      right:
        { tag: 'seq',
          left: { tag: 'rest', dur: 100 },
          right: { tag: 'note', pitch: 'b4', dur: 250 } } 
    },
    right:
    { tag: 'repeat',
      section: { tag: 'note', pitch: 'c5', dur: 251 }, 
      count: 6 }
  },
  right : 
  { tag: 'seq',
    left:
    { tag: 'repeat',
      section: { tag: 'note', pitch: 'g2', dur: 123 }, 
      count: 2 },
    right:
    { tag: 'repeat',
      section: { tag: 'note', pitch: 'f6', dur: 333 }, 
      count: 5 }
  }
};

console.log (melody_mus);
console.log (compile(melody_mus));