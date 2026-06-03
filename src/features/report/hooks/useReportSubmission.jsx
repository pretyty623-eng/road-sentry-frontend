import { useState } from 'react';
import { reportService } from '../services/report.service';

export const useReportSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const submitReport = async (data) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await reportService.submitReport(data);
      return response;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitReport, isSubmitting, error };
};