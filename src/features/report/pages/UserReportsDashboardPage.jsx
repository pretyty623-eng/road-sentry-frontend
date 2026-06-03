import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiSearch } from 'react-icons/fi';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { ParticleCanvas } from '../../../components/ui/ParticleCanvas';
import { GradientBackground } from '../../../components/ui/GradientBackground';
import axios from '../../../services/axios';
import ReportStatus from '../components/ReportStatus';
import { reportHistoryService } from '../services/reportHistory.service';

export const UserReportsDashboardPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(reportId || '');
  const [report, setReport] = useState(null);
  const [recentReports, setRecentReports] = useState(() => reportHistoryService.getReports());
  const [loading, setLoading] = useState(Boolean(reportId));
  const [error, setError] = useState('');

  const normalizedReportId = useMemo(() => reportId?.trim(), [reportId]);

  useEffect(() => {
    if (!normalizedReportId) {
      return;
    }

    const controller = new AbortController();

    const fetchReport = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get(`/reports/${normalizedReportId}`, {
          signal: controller.signal
        });
        setReport(response.data.data);
      } catch (err) {
        if (err.name === 'CanceledError') return;
        setReport(null);
        setError('Laporan tidak ditemukan. Pastikan ID laporan sudah benar.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchReport();

    return () => controller.abort();
  }, [normalizedReportId]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextReportId = query.trim();
    if (!nextReportId) return;
    navigate(`/status/${nextReportId}`);
  };

  const handleRecentClick = (selectedReport) => {
    setRecentReports(reportHistoryService.getReports());
    setQuery(selectedReport.reportId);
    navigate(`/status/${selectedReport.reportId}`);
  };

  return (
    <>
      <ParticleCanvas />
      <GradientBackground />
      <Navbar />

      <main className="user-dashboard-page">
        <section className="user-dashboard-shell">
          <div className="user-dashboard-heading">
            <Link to="/" className="back-home-link">
              <FiArrowLeft />
              Beranda
            </Link>
            <div>
              <p className="user-dashboard-eyebrow">Status Laporan</p>
              <h1>Dashboard Laporan Anda</h1>
              <p>Cek perkembangan laporan jalan rusak menggunakan ID laporan yang didapat setelah mengirim laporan.</p>
            </div>
          </div>

          <div className="user-dashboard-grid">
            <aside className="user-report-panel">
              <form onSubmit={handleSubmit} className="report-search-form">
                <label htmlFor="report-id-search">ID Laporan</label>
                <div className="report-search-row">
                  <input
                    id="report-id-search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Contoh: RPT_aB3xK9"
                  />
                  <button type="submit" aria-label="Cari laporan">
                    <FiSearch />
                  </button>
                </div>
              </form>

              <div className="recent-report-section">
                <div className="recent-report-title">
                  <FiClock />
                  Laporan Terakhir
                </div>
                {recentReports.length > 0 ? (
                  <div className="recent-report-list">
                    {recentReports.map(item => (
                      <button
                        key={item.reportId}
                        type="button"
                        className={item.reportId === normalizedReportId ? 'recent-report-item active' : 'recent-report-item'}
                        onClick={() => handleRecentClick(item)}
                      >
                        <span>{item.reportId}</span>
                        <small>{new Date(item.submittedAt).toLocaleDateString('id-ID')}</small>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="recent-report-empty">Belum ada laporan tersimpan di perangkat ini.</p>
                )}
              </div>
            </aside>

            <section className="user-status-panel">
              {!normalizedReportId && (
                <div className="status-placeholder">
                  <FiSearch />
                  <h2>Masukkan ID laporan</h2>
                  <p>Status laporan, hasil AI, dan tindak lanjut akan tampil di sini.</p>
                </div>
              )}

              {normalizedReportId && loading && (
                <div className="status-placeholder">
                  <FiClock />
                  <h2>Memuat laporan</h2>
                  <p>Sedang mengambil data laporan Anda.</p>
                </div>
              )}

              {normalizedReportId && error && !loading && (
                <div className="status-placeholder status-placeholder-error">
                  <h2>{error}</h2>
                  <p>Coba salin ID laporan persis seperti yang muncul setelah laporan berhasil dikirim.</p>
                </div>
              )}

              {normalizedReportId && report && !loading && (
                <ReportStatus reportId={normalizedReportId} originalImage={report.imageUrl} />
              )}
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};
