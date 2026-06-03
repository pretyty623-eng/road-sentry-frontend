const STORAGE_KEY = 'roadSentryUserReports';

export const reportHistoryService = {
  getReports: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  saveReport: ({ reportId, imageUrl }) => {
    if (!reportId) return;

    const reports = reportHistoryService.getReports();
    const nextReports = [
      {
        reportId,
        imageUrl,
        submittedAt: new Date().toISOString()
      },
      ...reports.filter(report => report.reportId !== reportId)
    ].slice(0, 8);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextReports));
  }
};
