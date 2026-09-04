type Result = { name: string; file: string; green: string; red: string; status?: 'failure' };

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
  { name: 'Iskor', file: 'iskor_ncc.jpg', green: '(13, 57)', red: '(16, 124)', source: 'https://www.loc.gov/resource/prok.00687/' },
  { name: 'Locomotive', file: 'locomotive_ncc.jpg', green: '(6, 43)', red: '(32, 87)', source: 'https://www.loc.gov/resource/prok.00458/' },
  { name: 'Trestle bridge', file: 'trestle_bridge_ncc.jpg', green: '(25, 47)', red: '(30, 108)', source: 'https://www.loc.gov/resource/prok.00076/' },
];

function Offsets({ green, red }: { green: string; red: string }) {
  return (
    <span className="offsets">
      <span>G {green}</span>
      <span>R {red}</span>
    </span>
  );
}

export default function App() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top">
          CS 180 · Project 1
        </a>
        <nav aria-label="Project sections">
          <a href="#approach">Approach</a>
          <a href="#single-scale">Single-scale</a>
          <a href="#pyramid">Pyramid</a>
          <a href="#collection">Collection</a>
        </nav>
      </header>

      <section id="top" className="hero shell">
        <div>
          <p className="eyebrow">Computational photography · Fall 2026</p>
          <h1>Images of the Russian Empire</h1>
          <p className="dek">
            Colorizing Sergei Prokudin-Gorskii&apos;s glass-plate negatives by aligning the green and red exposures to
            blue with exhaustive search, then a coarse-to-fine image pyramid.
          </p>
        </div>
        <figure className="hero-image">
          <img src={asset('/images/pyramid/cathedral_ncc.jpg')} alt="Color reconstruction of a cathedral on a hillside" />
          <figcaption>
            <span>Cathedral</span>
            <span>NCC pyramid</span>
          </figcaption>
        </figure>
      </section>

      <section id="approach" className="section shell">
        <p className="section-number">01 · Approach</p>
        <h2>From three exposures to one photograph</h2>
        <div className="prose">
          <p>
            Each scan stores blue, green, and red exposures from top to bottom. I split the plate into thirds, treat
            blue as the reference, search for integer <strong>(x, y)</strong> translations of green and red, and stack
            the shifted channels in RGB order.
          </p>
          <p>
            Scores are computed on the interior 80% of each channel so plate borders cannot dominate the metric. After
            shifting, I keep the overlap shared by all three channels and apply a fixed 10% trim for display. The same
            parameters are used for every image.
          </p>
        </div>
      </section>

      <section id="single-scale" className="section shell">
        <p className="section-number">02 · Low-resolution JPEGs</p>
        <h2>Single-scale alignment</h2>
        <p className="lede">
          On the three JPEG plates I search every integer offset in a ±15-pixel window. L2 and NCC find the same
          displacements.
        </p>
        <div className="metric-strip">
          <p>
            <strong>L2</strong> is the Euclidean distance between corresponding pixels. The lowest score wins.
          </p>
          <p>
            <strong>NCC</strong> mean-centers both images, normalizes them, and takes their dot product. The highest
            score wins.
          </p>
        </div>
        <div className="single-results">
          {singleScale.map((result) => (
            <article className="comparison-row" key={result.slug}>
              <div className="result-title">
                <h3>{result.name}</h3>
                <Offsets green={result.green} red={result.red} />
              </div>
              <figure>
                <img src={asset(`/images/single-scale/${result.slug}_l2.jpg`)} alt={`${result.name} aligned with L2`} />
                <figcaption>L2</figcaption>
              </figure>
              <figure>
                <img src={asset(`/images/single-scale/${result.slug}_ncc.jpg`)} alt={`${result.name} aligned with NCC`} />
                <figcaption>NCC</figcaption>
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section id="pyramid" className="section shell">
        <p className="section-number">03 · All provided images</p>
        <h2>Coarse-to-fine pyramid</h2>
        <p className="lede">
          Full-size TIFFs need larger displacements than ±15 pixels. I downsample each channel by ½ with anti-aliasing
          until the longest side is at most 200 pixels, search ±15 at that coarsest level, then double the offset and
          refine within ±2 pixels at every finer level. Alignment uses pixel-value NCC.
        </p>
        <div className="result-grid">
          {pyramidResults.map((result) => (
            <article className={`result-card${result.status === 'failure' ? ' failed' : ''}`} key={result.file}>
              <figure>
                <img src={asset(`/images/pyramid/${result.file}`)} alt={`${result.name} pyramid alignment`} />
              </figure>
              <div className="card-caption">
                <h3>
                  {result.name}
                  {result.status === 'failure' && <span className="status">failed</span>}
                </h3>
                <Offsets green={result.green} red={result.red} />
              </div>
            </article>
          ))}
        </div>
        <aside className="failure-note">
          <strong>Emir is the allowed failure.</strong> The robe is a bright, nearly uniform blue, so the three
          channels do not share the same intensity pattern. Pixel-value NCC still finds a reasonable green offset, but
          the red channel locks onto a false peak at (−455, 416). The other 13 course images align cleanly.
        </aside>
        <table className="offset-table">
          <caption>Offsets relative to blue, reported as (x, y)</caption>
          <thead>
            <tr>
              <th>Image</th>
              <th>Green</th>
              <th>Red</th>
            </tr>
          </thead>
          <tbody>
            {pyramidResults.map((result) => (
              <tr key={result.file} className={result.status === 'failure' ? 'failed-row' : undefined}>
                <td>
                  {result.name}
                  {result.status === 'failure' ? ' (failed)' : ''}
                </td>
                <td>{result.green}</td>
                <td>{result.red}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section id="collection" className="section shell">
        <p className="section-number">04 · Personal selections</p>
        <h2>More from the collection</h2>
        <p className="lede">
          Three additional Library of Congress glass plates, aligned with the same NCC pyramid and the same parameters.
        </p>
        <div className="extra-grid">
          {extraResults.map((result) => (
            <article className="result-card" key={result.file}>
              <figure>
                <img src={asset(`/images/extras/${result.file}`)} alt={`${result.name} color reconstruction`} />
              </figure>
              <div className="card-caption">
                <h3>{result.name}</h3>
                <Offsets green={result.green} red={result.red} />
                <a href={result.source} target="_blank" rel="noreferrer">
                  LoC source
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer shell">
        <p>CS 180 · Intro to Computer Vision and Computational Photography</p>
        <p className="print-url">https://jiaweitang22.github.io/cs180-proj1/</p>
      </footer>
    </main>
  );
}
