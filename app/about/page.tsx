import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-6 lg:py-16 space-y-12">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1523419400525-dc6c1e105d58?auto=format&fit=crop&w=1400&q=80"
            alt="Lipi Srivastava in her studio"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">About the artist</p>
          <h1 className="section-heading">Meet Lipi Srivastava</h1>
          <p className="text-lg leading-relaxed text-white/80">
            Hello! I’m Lipi Srivastava – an artist based in Hong Kong, a corporate professional, a wife, a mother of two
            teenage boys, and a proud pet parent to our Beagle.
          </p>
          <p className="leading-relaxed text-white/70">
            My journey as an artist was not something I had planned. For over 25 years, I built a career in Human
            Resources, working in global leadership roles across multinational companies in India and Hong Kong. With a
            background in Psychology and Organizational Behavior, my professional life was always about people, strategy,
            and leadership.
          </p>
          <p className="leading-relaxed text-white/70">
            But life took an unexpected turn in 2021 when I was diagnosed with cancer. What followed were multiple
            surgeries and chemotherapy – a phase that completely changed me. During this time, I turned to painting and
            music as a way to cope, heal, and rediscover myself. What started as a therapeutic outlet soon became a
            passion.
          </p>
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-4">
          <h2 className="font-display text-3xl text-sand-200">The Art I Create</h2>
          <p className="leading-relaxed text-white/80">
            I am a self-taught artist, and my work is mostly in acrylic and oil. I love bringing bold, vibrant themes to
            life on canvas and even on recycled bottles. For me, art is meditative – it connects me to my inner self,
            keeps me grounded in gratitude, and fills me with positive energy.
          </p>
          <p className="leading-relaxed text-white/70">
            My inspirations come from many places – from nature, spirituality, and photography to my Indian roots and
            global experiences. But most of all, they come from my own journey of resilience and self-discovery.
          </p>
          <p className="leading-relaxed text-white/80">
            Some of my most loved works include <em>Dreams Have No Boundaries</em>, <em>Cheers to Life</em>, <em>Finding
            the Buddha Within You</em>, <em>Womaniya – The Joys of Friendship</em>, <em>Still Waters</em>, <em>Third Eye</em>, and
            <em> Unbroken Bond</em>.
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-card">
          <Image
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80"
            alt="Lipi Srivastava presenting her paintings"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="card-glass rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-8 space-y-4">
        <h2 className="font-display text-3xl text-sand-200">Exhibitions & Community Work</h2>
        <p className="leading-relaxed text-white/80">
          Since beginning this journey, I’ve been fortunate to showcase my art at exhibitions such as the Indian
          Affordable Art Fair at the Hong Kong Visual Arts Centre, the Consulate General of India (Hong Kong), Lamma Art
          Collective, Expo Metro, Watermark Community Church in Sai Ying Pun, and ISKCON Temple Hong Kong, among others.
        </p>
        <p className="leading-relaxed text-white/80">
          Art has also given me a way to give back. I’ve conducted bottle art jamming workshops, contributed to mental
          wellbeing initiatives, and raised funds for NGOs such as Phenomenally Pink, The Zubin Foundation, and
          Dubai-based Spunk Go.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
