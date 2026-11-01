// cutify-ui pixel sprites. MIT.
// Turns 16 x 16 string grids into crisp SVG <symbol>s. One character per pixel; '.' is empty.
// Usage:
//   <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs id="pixdefs"></defs></svg>
//   <script src="pixel-sprites.js"></script>
//   <script>pixelSprites(CUTIFY_EXAMPLE_CAST)</script>          // or your own { palette, sprites, animate }
//   <svg class="sprite" viewBox="0 0 16 16" width="96" height="96" role="img" aria-label="Control tower"><use href="#ch-tower"/></svg>
(function (root) {
  function pixelSprites({ palette, sprites, animate = {}, defsId = 'pixdefs' }) {
    let defs = document.getElementById(defsId);
    if (!defs) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'); defs.id = defsId;
      svg.appendChild(defs); document.body.prepend(svg);
    }
    for (const [id, rows] of Object.entries(sprites)) {
      document.getElementById(id)?.remove();
      let out = `<symbol id="${id}" viewBox="0 0 16 16" shape-rendering="crispEdges">`;
      rows.forEach((row, y) => [...row].forEach((ch, x) => {
        if (ch === '.' || !palette[ch]) return;
        // an animate entry is a class, or [leftHalfClass, rightHalfClass] for mirrored parts like waving arms
        const a = animate[ch];
        const cls = !a ? '' : ` class="${Array.isArray(a) ? a[x < 8 ? 0 : 1] : a}"`;
        // 1.02 instead of 1 hides hairline seams between pixels when scaled
        out += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${palette[ch]}"${cls}/>`;
      }));
      defs.insertAdjacentHTML('beforeend', out + '</symbol>');
    }
  }

  // Example cast drawn for SkyQueue (Apron theme): a control tower, a pilot, a ramp marshal and a note reader.
  // Use them as models for proportions and outlines; draw your own cast for your product.
  const CUTIFY_EXAMPLE_CAST = {
    palette: { k: '#16171a', b: '#6aa8ff', w: '#cfe3ff', g: '#5b6472', r: '#ff5a4e', s: '#f1c7a3', p: '#b98cff', y: '#ffd400',
      d: '#2d2a4a', m: '#7a3b2e', W: '#f2f0ea', c: '#c99470', o: '#ff9a4a', v: '#ff6b1a' },
    animate: { r: 'px-blink', v: ['px-wl', 'px-wr'] },
    sprites: {
      'ch-tower': ['.......rr.......', '.......kk.......', '...kkkkkkkkkk...', '..kbbbbbbbbbbk..', '..kwwkwwkwwkwk..', '..kwwkwwkwwkwk..',
        '..kbbbbbbbbbbk..', '...kkkkkkkkkk...', '......kggk......', '......kggk......', '......kggk......', '......kggk......',
        '......kggk......', '......kggk......', '....kkkkkkkk....', '...kggggggggk...'],
      'ch-pilot': ['....kkkkkkkk....', '...kppppppppk...', '..kpppyyyypppk..', '..kkkkkkkkkkkk..', '...kssssssssk...', '...kskksskksk...',
        '...kssssssssk...', '...ksssmmsssk...', '....kssssssk....', '.....kkkkkk.....', '...kddddddddk...', '..kdddWWWWdddk..',
        '..kddddWWddddk..', '..kddddddddddk..', '..kdyddddddydk..', '..kkkkkkkkkkkk..'],
      'ch-marshal': ['....kkkkkkkk....', '...kyyyyyyyyk...', '..kyyyyyyyyyyk..', '..kkkkkkkkkkkk..', '...kcccccccck...', '...kckkcckkck...',
        '...kcccccccck...', '....kcccccck....', 'vv...kkkkkk...vv', '.vvkooooooookvv.', '..kkooWWWWookk..', '...kooooooook...',
        '...kWWWWWWWWk...', '...kooooooook...', '...kook..kook...', '...kkk....kkk...'],
      'ch-reader': ['.......kk.......', '......kWWk......', '.....kWWWWk.....', '....kWWWWWWk....', '...kWWWkkWWWk...', '..kWWWWkkWWWWk..',
        '.kWWWWWWWWWWWWk.', 'kWWWWWkkkkWWWWWk', '.kWWWWWWWWWWWWk.', '..kWWWWWWWWWWk..', '...kWWWWWWWWk...', '....kWWWWWWk....',
        '.....kWWWWk.....', '......kWWk......', '.......kk.......', '................'],
    },
  };

  root.pixelSprites = pixelSprites;
  root.CUTIFY_EXAMPLE_CAST = CUTIFY_EXAMPLE_CAST;
})(typeof window !== 'undefined' ? window : globalThis);
