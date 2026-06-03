import { forwardRef } from 'react';
import { FaUpload, FaBrain, FaChartLine, FaMapMarkedAlt } from 'react-icons/fa';

const steps = [
  { number: 'TAHAP 01', icon: FaUpload, title: 'Kirim Laporan', desc: 'Upload foto dan lokasi jalan rusak melalui form' },
  { number: 'TAHAP 02', icon: FaBrain, title: 'Validasi AI', desc: 'AI memverifikasi apakah gambar benar jalan rusak' },
  { number: 'TAHAP 03', icon: FaChartLine, title: 'Skoring Prioritas', desc: 'Sistem menghitung skala prioritas perbaikan' },
  { number: 'TAHAP 04', icon: FaMapMarkedAlt, title: 'Tindak Lanjut', desc: 'Laporan ke dashboard GIS admin untuk penanganan' }
];

export const WorkflowSection = forwardRef((props, ref) => {
  return (
    <section className="workflow" id="workflow" ref={ref}>
      <div className="section-label">Sistem Kerja</div>
      <h2 className="section-title">Bagaimana ROAD-SENTRY Bekerja?</h2>
      <p className="section-sub">Dari laporan masyarakat hingga tindakan nyata.</p>
      
      <div className="steps-grid">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          return (
            <div key={idx} className="step-card">
              <div className="step-number">{step.number}</div>
              <div className="step-icon">
                <IconComponent />
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
});

WorkflowSection.displayName = 'WorkflowSection';