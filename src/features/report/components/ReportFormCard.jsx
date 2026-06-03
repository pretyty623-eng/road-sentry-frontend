import { useState, useRef, useCallback, useMemo } from 'react';
import { FaCloudUploadAlt, FaMapMarkerAlt, FaSyncAlt, FaPaperPlane, FaSpinner, FaTrash, FaKeyboard } from 'react-icons/fa';
import { useGeolocation } from '../hooks/useGeolocation';
import { validateReport } from '../validations/report.schema';
import { createPortal } from 'react-dom';
import { UserMapPreview } from './UserMapPreview';

const geocodeAddress = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=id`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'id', 'User-Agent': 'RoadSentry/1.0' }
  });
  if (!res.ok) throw new Error('Nominatim error');
  return res.json();
};

export const ReportFormCard = ({ onSubmit, isSubmitting }) => {
  const { coords, loading: gpsLoading, error: gpsError, getLocation } = useGeolocation();
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);
  const wrapperRef = useRef(null);
  const geocodeTimer = useRef(null);

  const [locationMode, setLocationMode] = useState('gps');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    reportType: 'PENGADUAN'
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [tiltStyle, setTiltStyle] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [addressQuery, setAddressQuery] = useState('');
  const [addressResults, setAddressResults] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [manualCoords, setManualCoords] = useState({ lat: null, lng: null });
  const [dragActive, setDragActive] = useState(false);

  const activeCoords = useMemo(() => (
    locationMode === 'gps'
      ? { lat: coords.lat, lng: coords.lng }
      : { lat: manualCoords.lat, lng: manualCoords.lng }
  ), [coords.lat, coords.lng, locationMode, manualCoords.lat, manualCoords.lng]);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !wrapperRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
      transition: 'transform 0.1s ease-out'
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform 0.3s ease-out'
    });
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));
    }
  }, []);

  const handleRemoveImage = useCallback((e) => {
    e.stopPropagation();
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // Handler untuk drag & drop
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, image: null }));
    }
  }, []);

  const handleAddressChange = useCallback((e) => {
    const value = e.target.value;
    setAddressQuery(value);
    setAddressResults([]);
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    if (value.trim().length < 4) return;
    geocodeTimer.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const results = await geocodeAddress(value);
        setAddressResults(results);
      } catch {
        setAddressResults([]);
      }
      finally { setAddressLoading(false); }
    }, 500);
  }, []);

  const handleSelectAddress = useCallback((result) => {
    setManualCoords({ lat: parseFloat(result.lat), lng: parseFloat(result.lon) });
    setAddressQuery(result.display_name);
    setAddressResults([]);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validation = validateReport({
      image: formData.image,
      latitude: activeCoords.lat,
      longitude: activeCoords.lng,
      description: formData.description,
      title: formData.title
    });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    const fullDescription = formData.title
      ? `${formData.title}\n\n${formData.description}`
      : formData.description;
    await onSubmit({
      image: formData.image,
      latitude: activeCoords.lat,
      longitude: activeCoords.lng,
      description: fullDescription
    });
    setSubmitted(true);
    setFormData({ title: '', description: '', image: null, reportType: 'PENGADUAN' });
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [formData, activeCoords, onSubmit]);

  return (
    <div
      className="form-wrapper"
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="form-card" ref={cardRef} style={tiltStyle}>
        <div className="card-header">
          <div className="header-dot header-dot-red" />
          <div className="header-dot header-dot-yellow" />
          <div className="header-dot header-dot-green" />
          <h2>Form Pelaporan Jalan Rusak</h2>
        </div>

        <form onSubmit={handleSubmit} className="card-body" noValidate>

          <input
            type="text"
            className="input-field"
            placeholder="Judul laporan"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />

          <textarea
            className={`textarea-field ${errors.description ? 'input-error' : ''}`}
            placeholder="Detail lokasi / ciri kerusakan"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
          {errors.description && <div className="error-message">{errors.description}</div>}

          {/* Upload area - dengan Drag & Drop */}
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onClick={() => !imagePreview && fileInputRef.current?.click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{ cursor: imagePreview ? 'default' : 'pointer' }}
          >
            {imagePreview ? (
              <>
                <div className="image-preview-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="image-preview-img"
                    onClick={(e) => { e.stopPropagation(); setShowPreviewModal(true); }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="btn-remove-image"
                    aria-label="Hapus foto"
                  >
                    <FaTrash />
                  </button>
                </div>
                <p>Foto siap diupload · klik foto untuk preview</p>
                <span
                  style={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer' }}
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Ganti foto
                </span>
              </>
            ) : (
              <>
                <FaCloudUploadAlt className="upload-icon" />
                <p>Upload foto jalan rusak</p>
                <span>Drag & drop atau klik untuk upload · JPG, PNG maks. 5MB</span>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
          {errors.image && <div className="error-message">{errors.image}</div>}
          {errors.location && <div className="error-message">{errors.location}</div>}

          <div className="location-mode-tabs">
            <button
              type="button"
              className={`loc-tab ${locationMode === 'gps' ? 'active' : ''}`}
              onClick={() => setLocationMode('gps')}
            >
              <FaMapMarkerAlt /> GPS Otomatis
            </button>
            <button
              type="button"
              className={`loc-tab ${locationMode === 'manual' ? 'active' : ''}`}
              onClick={() => setLocationMode('manual')}
            >
              <FaKeyboard /> Cari Alamat
            </button>
          </div>

          {locationMode === 'gps' && (
            <div className="gps-bar">
              <FaMapMarkerAlt className="gps-icon" />
              <div className="gps-text">
                <span className="gps-label">GPS Auto-detect</span>
                <strong className={`gps-status ${gpsError ? 'error' : gpsLoading ? 'loading' : 'success'}`}>
                  {gpsLoading
                    ? 'Mendeteksi lokasi...'
                    : gpsError
                      ? 'Lokasi tidak terdeteksi'
                      : `${coords.lat?.toFixed(6)}, ${coords.lng?.toFixed(6)}`}
                </strong>
              </div>
              <button type="button" onClick={getLocation} className="gps-refresh" title="Refresh lokasi">
                <FaSyncAlt />
              </button>
            </div>
          )}

          {locationMode === 'manual' && (
            <div className="address-search-wrapper">
              <div className="address-input-row">
                <input
                  type="text"
                  className="input-field address-input"
                  placeholder="Ketik nama jalan..."
                  value={addressQuery}
                  onChange={handleAddressChange}
                  autoComplete="off"
                />
                {addressLoading && <FaSpinner className="animate-spin address-spinner" />}
              </div>
              {addressResults.length > 0 && (
                <ul className="address-results">
                  {addressResults.map((r, i) => (
                    <li key={i} className="address-result-item" onClick={() => handleSelectAddress(r)}>
                      <FaMapMarkerAlt className="result-icon" />
                      <span>{r.display_name}</span>
                    </li>
                  ))}
                </ul>
              )}
              {manualCoords.lat && (
                <div className="gps-bar" style={{ marginTop: '0.5rem' }}>
                  <div className="gps-dot" style={{ background: '#3B82F6' }} />
                  <span>Lokasi: <strong>{manualCoords.lat?.toFixed(6)}, {manualCoords.lng?.toFixed(6)}</strong></span>
                </div>
              )}
            </div>
          )}

          <UserMapPreview
            lat={activeCoords.lat}
            lng={activeCoords.lng}
            submitted={submitted}
            onLocationChange={() => { }}
          />

          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting || (locationMode === 'gps' && gpsLoading)}
          >
            {isSubmitting ? (
              <><FaSpinner className="animate-spin" /> Memproses...</>
            ) : (
              <><FaPaperPlane /> Kirim Laporan</>
            )}
          </button>

        </form>
      </div>

      {showPreviewModal && createPortal(
        <div className="image-modal" onClick={() => setShowPreviewModal(false)}>
          <img
            src={imagePreview}
            alt="Preview"
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          />
        </div>,
        document.body
      )}
    </div>
  );
};
