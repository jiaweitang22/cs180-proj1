type Result = { name: string; file: string; green: string; red: string; status?: 'failure' };

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
  return <span className="offsets"><span><i className="dot green" />G {green}</span><span><i className="dot red" />R {red}</span></span>;
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top">CS 180 · Project 1</a>
        <nav aria-label="Project sections"><a href="#approach">Approach</a><a href="#single-scale">Single-scale</a><a href="#pyramid">Pyramid</a><a href="#collection">Collection</a></nav>
      </header>

      <section id="top" className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">Computational photography · Fall 2026</p>
          <h1>Images of the<br />Russian Empire</h1>
          <p className="dek">Reconstructing Sergei Prokudin-Gorskii&apos;s century-old glass-plate negatives with exhaustive search and coarse-to-fine alignment.</p>
        </div>
        <figure className="hero-image"><img src="/images/pyramid/cathedral_ncc.jpg" alt="Color reconstruction of a cathedral on a hillside" /><figcaption><span>Cathedral</span><span>NCC pyramid alignment</span></figcaption></figure>
      </section>

      <section id="approach" className="section shell intro-grid">
        <div><p className="section-number">01 · Approach</p><h2>From three exposures to one photograph</h2></div>
        <div className="prose lead">
          <p>Each scan stores blue, green, and red exposures vertically. I split the plate into thirds, use blue as the reference, align green and red with integer translations, and stack the channels in RGB order.</p>
          <p>Alignment scores ignore the outer 10% of each channel, where plate borders can dominate the metric. After shifting, I retain the region shared by all three channels and apply a fixed 10% trim for display. Offsets below are reported as <strong>(x, y)</strong> relative to blue.</p>
        </div>
      </section>

      <section id="single-scale" className="section shell">
        <div className="section-heading"><div><p className="section-number">02 · Low-resolution JPEGs</p><h2>Single-scale alignment</h2></div><p>Exhaustive search over every integer translation in a ±15-pixel window.</p></div>
        <div className="metric-strip"><p><strong>L2 distance</strong> sums squared pixel differences; the lowest score wins.</p><p><strong>NCC</strong> mean-centers and normalizes both images, then selects the largest dot product.</p></div>
        <div className="single-results">
          {singleScale.map((result) => (
            <article className="comparison-row" key={result.slug}>
              <div className="result-title"><h3>{result.name}</h3><Offsets green={result.green} red={result.red} /></div>
              <figure><img src={`/images/single-scale/${result.slug}_l2.jpg`} alt={`${result.name} aligned with L2 distance`} /><figcaption><strong>L2</strong></figcaption></figure>
              <figure><img src={`/images/single-scale/${result.slug}_ncc.jpg`} alt={`${result.name} aligned with normalized cross-correlation`} /><figcaption><strong>NCC</strong></figcaption></figure>
            </article>
          ))}
        </div>
      </section>

      <section id="pyramid" className="section pyramid-section">
        <div className="shell">
          <div className="section-heading light-heading"><div><p className="section-number">03 · All provided images</p><h2>Coarse-to-fine pyramid</h2></div><p>Pixel-value NCC at every scale. Thirteen of fourteen images align cleanly.</p></div>
          <div className="pyramid-method"><span>½</span><p>I repeatedly downsample each channel by two with anti-aliasing until its largest dimension is at most 200 pixels. At the coarsest level I search ±15 pixels. At each finer level, I double the previous offset and refine it within ±2 pixels.</p></div>
          <div className="result-grid">
            {pyramidResults.map((result) => (
              <article className={`result-card ${result.status === 'failure' ? 'failed' : ''}`} key={result.file}>
                <figure><img src={`/images/pyramid/${result.file}`} alt={`${result.name} reconstructed with pyramid alignment`} /></figure>
                <div className="card-caption"><div><h3>{result.name}</h3>{result.status === 'failure' && <span className="status">alignment failure</span>}</div><Offsets green={result.green} red={result.red} /></div>
                {result.status === 'failure' && <p className="failure-note">The emir&apos;s bright blue clothing has very different intensity patterns across channels. Pixel-value NCC locks the red channel onto a false match instead of the subject&apos;s structure.</p>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="collection" className="section shell">
        <div className="section-heading"><div><p className="section-number">04 · Personal selections</p><h2>More from the collection</h2></div><p>Three additional Library of Congress glass plates, aligned with the same NCC pyramid.</p></div>
        <div className="extra-grid">
          {extraResults.map((result) => (
            <article className="extra-card" key={result.file}><figure><img src={`/images/extras/${result.file}`} alt={`${result.name} color reconstruction`} /></figure><div className="extra-caption"><h3>{result.name}</h3><Offsets green={result.green} red={result.red} /><a href={result.source} target="_blank" rel="noreferrer">View source plate ↗</a></div></article>
          ))}
        </div>
      </section>

      <footer className="footer shell"><p>CS 180 · Intro to Computer Vision and Computational Photography</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
