import { useRef } from 'react';
import {
  FaArrowRight,
  FaChartBar,
  FaCheckCircle,
  FaClipboardList,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaRoad,
  FaShieldAlt
} from 'react-icons/fa';

const problems = [
  'Jalan rusak tidak dilaporkan karena ribet',
  'Laporan warga sering diabaikan atau hilang',
  'Tidak ada sistem pemantauan yang transparan',
  'Petugas tidak tahu mana kerusakan paling parah'
];

const solutions = [
  'Lapor cukup lewat HP dalam hitungan detik',
  'Setiap laporan tercatat dan bisa dilacak',
  'Status laporan transparan untuk semua pihak',
  'Sistem mengurutkan prioritas perbaikan otomatis'
];

const features = [
  { icon: FaMobileAlt, color: '#2563EB', bg: 'rgba(37,99,235,0.10)', tag: 'Mudah Digunakan', title: 'Laporkan Lewat HP', desc: 'Cukup foto jalan rusak, isi lokasi, lalu kirim. Semudah mengirim pesan!' },
  { icon: FaCheckCircle, color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)', tag: 'Cepat & Akurat', title: 'Verifikasi Otomatis', desc: 'Sistem memeriksa foto yang dikirim untuk memastikan laporan valid.' },
  { icon: FaMapMarkedAlt, color: '#06B6D4', bg: 'rgba(6,182,212,0.10)', tag: 'Peta Digital', title: 'Peta Kerusakan', desc: 'Semua laporan tampil di peta interaktif agar petugas tahu lokasinya.' },
  { icon: FaChartBar, color: '#10B981', bg: 'rgba(16,185,129,0.10)', tag: 'Terorganisir', title: 'Prioritas Perbaikan', desc: 'Sistem mengurutkan kerusakan paling berbahaya agar cepat ditangani.' },
  { icon: FaShieldAlt, color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', tag: 'Keselamatan', title: 'Keselamatan Berkendara', desc: 'Setiap laporan membantu mencegah kecelakaan. Kontribusi Anda penting!' },
  { icon: FaClipboardList, color: '#EF4444', bg: 'rgba(239,68,68,0.10)', tag: 'Transparan', title: 'Pantau Progres Laporan', desc: 'Dapatkan ID laporan dan lacak status penanganan kapan saja.' }
];

export const AboutSection = ({ onLaporanClick }) => {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      id="tentang"
      className="about-section about-visible"
    >
      <div className="about-header">
        <div className="about-label">
          <FaRoad />
          Tentang ROAD-SENTRY
        </div>
        <h2 className="about-title">
          Apa Itu <span className="about-title-accent">ROAD-SENTRY</span>?
        </h2>
        <p className="about-desc">
          Platform pelaporan jalan rusak yang menghubungkan <strong>warga</strong> dengan{' '}
          <strong>pemerintah</strong> secara cepat, transparan, dan terukur.
        </p>
      </div>

      <div className="about-ps-row">
        <div className="about-ps-card about-ps-problem">
          <div className="about-ps-header">
            <FaExclamationTriangle />
            <span>Masalah Saat Ini</span>
          </div>
          <ul className="about-ps-list">
            {problems.map(problem => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>

        <div className="about-ps-arrow">
          <div className="about-ps-arrow-circle">
            <FaArrowRight />
          </div>
          <span>Solusi</span>
        </div>

        <div className="about-ps-card about-ps-solution">
          <div className="about-ps-header">
            <FaCheckCircle />
            <span>Dengan ROAD-SENTRY</span>
          </div>
          <ul className="about-ps-list">
            {solutions.map(solution => (
              <li key={solution}>{solution}</li>
            ))}
          </ul>
        </div>
      </div>

      <p className="about-features-label">Fitur Utama Sistem</p>
      <div className="about-features-grid">
        {features.map((feature, index) => (
          <div key={feature.title} className="about-feature-card" style={{ '--delay': `${index * 0.07}s` }}>
            <div className="about-feature-icon" style={{ background: feature.bg, color: feature.color }}>
              <feature.icon />
            </div>
            <div className="about-feature-tag" style={{ color: feature.color, background: feature.bg }}>
              {feature.tag}
            </div>
            <h3 className="about-feature-title">{feature.title}</h3>
            <p className="about-feature-desc">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="about-cta-row">
        <button className="about-cta-btn-main" onClick={onLaporanClick}>
          Buat Laporan Sekarang
          <FaArrowRight />
        </button>
      </div>
    </section>
  );
};
