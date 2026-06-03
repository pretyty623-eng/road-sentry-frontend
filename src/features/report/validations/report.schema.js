export const validateReport = (data) => {
  const errors = {};

  if (!data.image) {
    errors.image = 'Foto jalan rusak wajib diupload';
  }

  if (!data.latitude || !data.longitude) {
    errors.location = 'Lokasi GPS tidak terdeteksi';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Deskripsi laporan wajib diisi';
  } else if (data.description.length < 10) {
    errors.description = 'Deskripsi minimal 10 karakter';
  }

  if (data.title && data.title.length > 100) {
    errors.title = 'Judul maksimal 100 karakter';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};