import { useState, useEffect, useRef, useCallback } from 'react';
import { ReportFormCard } from '../components/ReportFormCard';
import { StatsSection } from '../components/StatsSection';
import { WorkflowSection } from '../components/WorkflowSection';
import { useReportSubmission } from '../hooks/useReportSubmission';
import { reportService } from '../services/report.service';
import { Toast } from '../../../components/ui/Toast';
import { ParticleCanvas } from '../../../components/ui/ParticleCanvas';
import { GradientBackground } from '../../../components/ui/GradientBackground';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import ReportStatus from '../components/ReportStatus';

export const ReportPage = () => {
  const { submitReport, isSubmitting } = useReportSubmission();
  const workflowRef = useRef(null);
  const statsRef = useRef(null);  
  
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [toast, setToast] = useState(null);
  
  // State untuk status setelah submit
  const [submittedReport, setSubmittedReport] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await reportService.getStats();
        if (response.success) {
          setStats({
            total: response.data.total,
            pending: response.data.pending,
            resolved: response.data.resolved
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setStats({ total: 124, pending: 23, resolved: 89 });
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );
    
    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) observer.observe(statsSection);
    
    return () => observer.disconnect();
  }, [statsAnimated]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // Handler setelah submit berhasil
  const handleSubmitSuccess = useCallback((reportId, imageUrl) => {
    setSubmittedReport({ reportId, imageUrl });
  }, []);

  // Reset form untuk buat laporan baru
  const handleResetForm = useCallback(() => {
    setSubmittedReport(null);
  }, []);

 const handleSubmit = useCallback(async (data) => {
  try {
    const response = await submitReport(data);
    showToast('Laporan terkirim! AI sedang memvalidasi...', 'success');

    handleSubmitSuccess(response.reportId, response.imageUrl);
    
  } catch (error) {
    console.error(error);
    showToast('Gagal mengirim laporan', 'error');
  }
}, [submitReport, showToast, handleSubmitSuccess]);

  const scrollToWorkflow = useCallback(() => {
    workflowRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToStats = useCallback(() => {
    statsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <>
      <ParticleCanvas />
      <GradientBackground />
      <Navbar onTentangClick={scrollToWorkflow} onStatistikClick={scrollToStats} />
      
      <main>
        <section className="hero">
          <div className="hero-badge animate-float">
            <div className="hero-badge-dot" />
            AI-POWERED · GIS INTEGRATION · REAL-TIME
          </div>
          
          <h1 className="hero-title">
            Deteksi & Pelaporan <span className="hero-title-accent">Jalan Rusak</span>
          </h1>
          <p className="hero-sub">
            Sampaikan laporan Anda, biarkan AI memvalidasi, dan sistem memprioritaskan perbaikan secara otomatis.
          </p>

          {submittedReport ? (
            <div className="max-w-md mx-auto p-4">
              <ReportStatus
                reportId={submittedReport.reportId}
                originalImage={submittedReport.imageUrl}
              />
              <button
                onClick={handleResetForm}
                className="btn-reset-laporan"
              >
                + Buat Laporan Baru
              </button>
            </div>
          ) : (
            <ReportFormCard onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          )}

          <div ref={statsRef}>
            <StatsSection stats={stats} animated={statsAnimated} />
          </div>

          <div className="scroll-hint">
            <span>Scroll untuk informasi lebih lanjut</span>
            <div className="scroll-arrow" />
          </div>
        </section>

        <WorkflowSection ref={workflowRef} />
      </main>
      
      <Footer />
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
};