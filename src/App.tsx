type Result = {
  name: string;
  file: string;
  green: string;
  red: string;
  status?: 'failure';
};

const basePath = '/cs180-proj1';
const asset = (path: string) => `${basePath}${path}`;

const singleScale = [
  { name: 'Cathedral', slug: 'cathedral', green: '(2, 5)', red: '(3, 12)' },
  { name: 'Monastery', slug: 'monastery', green: '(2, −3)', red: '(2, 3)' },
  { name: 'Tobolsk', slug: 'tobolsk', green: '(3, 3)', red: '(3, 6)' },
];

const pyramidResults: Result[] = [
  { name: 'Cathedral', file: 'cathedral_ncc.jpg', green: '(2, 5)', red: '(3, 12)' },
  { name: 'Church', file: 'church_ncc.jpg', green: '(4, 25)', red: '(−4, 58)' },
  { name: 'Emir', file: 'emir_ncc.jpg', green: '(24, 49)', red: '(−455, 416)', status: 'failure' },
  { name: 'Harvesters', file: 'harvesters_ncc.jpg', green: '(17, 60)', red: '(13, 124)' },
  { name: 'Icon', file: 'icon_ncc.jpg', green: '(17, 41)', red: '(23, 89)' },
  { name: 'Ilemselga', file: 'ilemselga_ncc.jpg', green: '(7, 40)', red: '(11, 130)' },
  { name: 'Melons', file: 'melons_ncc.jpg', green: '(11, 82)', red: '(13, 178)' },
  { name: 'Monastery', file: 'monastery_ncc.jpg', green: '(2, −3)', red: '(2, 3)' },
  { name: 'Religious painting', file: 'religous_painting_ncc.jpg', green: '(3, 28)', red: '(7, 68)' },
  { name: 'Self portrait', file: 'self_portrait_ncc.jpg', green: '(29, 79)', red: '(37, 176)' },
  { name: 'Siren', file: 'siren_ncc.jpg', green: '(−6, 49)', red: '(−25, 96)' },
  { name: 'Three generations', file: 'three_generations_ncc.jpg', green: '(14, 53)', red: '(11, 112)' },
  { name: 'Tobolsk', file: 'tobolsk_ncc.jpg', green: '(3, 3)', red: '(3, 6)' },
  { name: 'Wharf', file: 'wharf_ncc.jpg', green: '(−7, 15)', red: '(−16, 83)' },
];

const extraResults = [
  { name: 'Village of Iskor', file: 'iskor_ncc.jpg', green: '(13, 57)', red: '(16, 124)', source: 'https://www.loc.gov/resource/prok.00687/' },
  { name: 'Compound locomotive', file: 'locomotive_ncc.jpg', green: '(6, 43)', red: '(32, 87)', source: 'https://www.loc.gov/resource/prok.00458/' },
  { name: 'Trestle bridge', file: 'trestle_bridge_ncc.jpg', green: '(25, 47)', red: '(30, 108)', source: 'https://www.loc.gov/resource/prok.00076/' },
];

function OffsetLine({ green, red }: { green: string; red: string }) {
  return (
    <span className="offset-line">
      <span>G → B&nbsp; {green}</span>
      <span>R → B&nbsp; {red}</span>
    </span>
  );
}

function ResultFigure({ result, folder }: { result: Result; folder: 'pyramid' | 'extras' }) {
  return (
    <figure className="result-figure">
      <div className="image-frame">
        <img src={asset(`/images/${folder}/${result.file}`)} alt={`${result.name} reconstructed color photograph`} />
      </div>
      <figcaption>
        <span className="caption-title">{result.name}</span>
        <OffsetLine green={result.green} red={result.red} />
      </figcaption>
    </figure>
  );
}

export default function App() {
  const alignedResults = pyramidResults.filter((result) => result.status !== 'failure');
  const emir = pyramidResults.find((result) => result.status === 'failure')!;

  return (
    <main id="top">
      <header className="site-header">
        <a className="wordmark" href="#top">CS 180 <span>· Project 1</span></a>
        <nav aria-label="Project sections">
          <a href="#method">Method</a>
          <a href="#single-scale">Single scale</a>
          <a href="#pyramid">Pyramid</a>
          <a href="#collection">Collection</a>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="kicker">Project 1 · Fall 2026</p>
          <h1>Images of the Russian Empire</h1>
          <p className="summary">
            Reconstructing color photographs from Prokudin-Gorskii’s glass plates through exhaustive channel
            alignment and a coarse-to-fine image pyramid.
          </p>
          <p className="byline">Jiawei Tang · CS 180: Intro to Computer Vision and Computational Photography</p>
        </div>
        <figure className="hero-figure">
          <img src={asset('/images/pyramid/church_ncc.jpg')} alt="Reconstructed color photograph of a church beside a river" />
          <figcaption><span>Church</span><span>G (4, 25) · R (−4, 58)</span></figcaption>
        </figure>
      </section>

      <section className="intro shell" aria-label="Project overview">
        <p>
          Prokudin-Gorskii recorded each scene through blue, green, and red filters on a single glass plate. The three
          exposures are spatially displaced, so simply stacking them creates colored ghosting. My goal is to estimate
          two translations—green to blue and red to blue—and combine the aligned channels into one RGB image.
        </p>
        <dl className="project-facts">
          <div><dt>Reference</dt><dd>Blue channel</dd></div>
          <div><dt>Model</dt><dd>Integer translation</dd></div>
          <div><dt>Reported offsets</dt><dd>(x, y) pixels</dd></div>
        </dl>
      </section>

      <section id="method" className="section shell">
        <div className="section-heading">
          <p className="kicker">01 · Method</p>
          <h2>Building the color image</h2>
          <p>One pipeline is used throughout the project; only the search strategy changes with image size.</p>
        </div>

        <ol className="pipeline">
          <li><span>01</span><div><h3>Separate</h3><p>Divide the plate vertically into equal B, G, and R exposures and convert pixel values to floating point.</p></div></li>
          <li><span>02</span><div><h3>Search</h3><p>Shift green and red independently over candidate integer offsets, always comparing them with blue.</p></div></li>
          <li><span>03</span><div><h3>Score</h3><p>Evaluate L2 or NCC on the interior 80% of the images, avoiding the high-contrast plate borders.</p></div></li>
          <li><span>04</span><div><h3>Reconstruct</h3><p>Apply the best shifts, stack the channels in RGB order, remove wrapped regions, and trim 10% for display.</p></div></li>
        </ol>

        <div className="metric-section">
          <article>
            <p className="metric-label">Euclidean distance</p><h3>L2</h3>
            <p className="equation">√ Σ (I₁ − I₂)²</p>
            <p>The sum measures pixel-wise disagreement. The displacement with the smallest value wins.</p>
          </article>
          <article>
            <p className="metric-label">Normalized cross-correlation</p><h3>NCC</h3>
            <p className="equation">(Ĩ₁ · Ĩ₂) / (‖Ĩ₁‖ ‖Ĩ₂‖)</p>
            <p>I mean-center both vectors before normalization. The displacement with the largest correlation wins.</p>
          </article>
        </div>
        <p className="convention">
          <strong>Offset convention.</strong> Every result below is reported as <strong>(x, y)</strong>: positive x
          moves the channel right, and positive y moves it down.
        </p>
      </section>

      <section id="single-scale" className="section shell">
        <div className="section-heading split-heading">
          <div><p className="kicker">02 · Low-resolution alignment</p><h2>Exhaustive single-scale search</h2></div>
          <p>
            For each JPEG, I test every displacement in a 31 × 31 window from −15 to +15 pixels along both axes.
            L2 and NCC independently recover the same offsets on all three images.
          </p>
        </div>

        <div className="comparison-list">
          {singleScale.map((result, index) => (
            <article className="comparison" key={result.slug}>
              <div className="comparison-header">
                <span className="result-index">{String(index + 1).padStart(2, '0')}</span>
                <div><h3>{result.name}</h3><OffsetLine green={result.green} red={result.red} /></div>
              </div>
              <div className="comparison-images">
                <figure>
                  <img src={asset(`/images/single-scale/${result.slug}_l2.jpg`)} alt={`${result.name} aligned using L2`} />
                  <figcaption><span>L2</span><span>minimum score</span></figcaption>
                </figure>
                <figure>
                  <img src={asset(`/images/single-scale/${result.slug}_ncc.jpg`)} alt={`${result.name} aligned using NCC`} />
                  <figcaption><span>NCC</span><span>maximum score</span></figcaption>
                </figure>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="pyramid" className="section shell">
        <div className="section-heading split-heading">
          <div><p className="kicker">03 · High-resolution alignment</p><h2>Coarse-to-fine pyramid</h2></div>
          <p>
            Full-resolution TIFFs require much larger displacements, making a wide exhaustive search too expensive.
            The pyramid finds a rough shift cheaply at low resolution and uses it to guide small searches at finer scales.
          </p>
        </div>

        <div className="pyramid-explainer">
          <ol>
            <li><span>Coarsen</span>Downsample by ½ with anti-aliasing until the longest side is at most 200 pixels.</li>
            <li><span>Estimate</span>Search ±15 pixels in x and y at the smallest level using pixel-value NCC.</li>
            <li><span>Propagate</span>Move one level finer and multiply both components of the estimate by two.</li>
            <li><span>Refine</span>Search ±2 pixels around that prediction; repeat until reaching full resolution.</li>
          </ol>
          <pre aria-label="Image pyramid pseudocode"><code>{`offset = (0, 0)\nfor level in coarsest → finest:\n    if not coarsest:\n        offset = 2 × offset\n    window = 15 if coarsest else 2\n    offset = search(level, center=offset, window)`}</code></pre>
        </div>

        <div className="subsection-heading">
          <div><p className="kicker">Course images</p><h3>13 successful alignments</h3></div>
          <p>All results use the same pyramid parameters and NCC on raw pixel intensities.</p>
        </div>
        <div className="results-grid">
          {alignedResults.map((result) => <ResultFigure result={result} folder="pyramid" key={result.file} />)}
        </div>

        <article className="failure-analysis">
          <div className="failure-image"><img src={asset(`/images/pyramid/${emir.file}`)} alt="Misaligned Emir reconstruction with channel ghosting" /></div>
          <div className="failure-copy">
            <p className="kicker">Failure analysis · 1 of 14</p>
            <h3>Why Emir does not align</h3>
            <OffsetLine green={emir.green} red={emir.red} />
            <p>
              Emir is the one failed course image. His bright blue robe produces very different intensity patterns in
              the three filtered exposures. Because pixel-value NCC assumes corresponding structures have similar
              patterns, the red channel locks onto a false correlation peak at (−455, 416).
            </p>
            <p>
              A feature based on edges or image gradients would reduce sensitivity to cross-channel brightness and is
              the natural next improvement. The other 13 of 14 course images align without visible color ghosting.
            </p>
          </div>
        </article>
      </section>

      <section id="collection" className="section shell">
        <div className="section-heading split-heading">
          <div><p className="kicker">04 · Additional photographs</p><h2>Selections from the collection</h2></div>
          <p>
            I downloaded three additional glass-plate scans from the Library of Congress and processed them without
            changing any parameters. All three use the same NCC pyramid described above.
          </p>
        </div>
        <div className="collection-grid">
          {extraResults.map((result) => (
            <article key={result.file}>
              <ResultFigure result={result} folder="extras" />
              <a className="source-link" href={result.source} target="_blank" rel="noreferrer">
                View Library of Congress source <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer shell">
        <p>Jiawei Tang · CS 180 · Fall 2026</p>
        <a href="#top">Back to top ↑</a>
        <p className="print-url">jiaweitang22.github.io/cs180-proj1</p>
      </footer>
    </main>
  );
}
