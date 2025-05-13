import React, { useState, useEffect } from 'react';
import headerImage from '../assets/header.jpg';

const SearchBar = ({ userId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedQuery = localStorage.getItem('query');
    const savedResults = localStorage.getItem('results');
    const savedPage = localStorage.getItem('page');

    if (savedQuery) setQuery(savedQuery);
    if (savedResults) setResults(JSON.parse(savedResults));
    if (savedPage) setPage(Number(savedPage));
  }, []);

  const handleSearch = async (newPage = 1, append = false) => {
    if (!query.trim()) return;

    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, userId, page: newPage }),
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        const updatedResults = append ? [...results, ...data] : data;
        setResults(updatedResults);

        localStorage.setItem('query', query);
        localStorage.setItem('results', JSON.stringify(updatedResults));
        localStorage.setItem('page', newPage);
      } else if (data.message) {
        setMessage(data.message);
      } else {
        setMessage('Tidak ada hasil ditemukan');
      }

      setPage(newPage);
    } catch (err) {
      console.error('❌ Error saat pencarian:', err);
      setMessage('Terjadi kesalahan saat mengambil gambar.');
    }

    setIsLoading(false);
  };

  const handleLoadMore = () => {
    handleSearch(page + 1, true);
  };

  const handleReset = () => {
    setQuery('');
    setResults([]);
    setPage(1);
    setMessage('');
    localStorage.clear();
  };

  const handleDownload = async (image) => {
    try {
      const res = await fetch(image.largeImageURL);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Gagal mengunduh gambar.');
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', position: 'relative', marginTop: '10px' }}>
      {/* Gambar */}
      <img
        src={headerImage}
        alt="Header"
        style={{ maxWidth: '100%', height: 'auto', marginBottom: '10px' }}
      />

      {/* Overlay transparan buram */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '25%',
          borderRadius: '10px',
          // margin: '50px',
          width: '50%',
          height: '40%',
          background: 'rgba(255, 255, 255, 0.5)', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1
            style={{
              color: 'white',
              fontSize: '4vw',
              fontWeight: 'bold',
              opacity: 0.8,
              filter: 'blur(1px)',
              textShadow: '0 0 5px rgba(0,0,0,0.3)'
            }}
          >
            Image Finder &nbsp;
          </h1>

        <small style={{ color: 'black', opacity: 0.6, marginTop:'20px', fontSize:'0.9vw'}}> By Arfanvn</small>
      </div>
    </div>

    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '30px',
        gap: '10px',
        flexWrap: 'wrap'
      }}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(1);
          }
        }}
        placeholder="Cari gambar..."
        style={{
          padding: '10px',
          width: '300px',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }}
      />
      <button onClick={() => handleSearch(1)}>Cari</button>

      <button onClick={handleReset}>🔄 Reset</button>
    </div>


      {message && <p>{message}</p>}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '20px'
        }}
      >
        {results.map((item) => (
          <img
            key={`${item.id}-${item.pageURL}`}
            src={item.webformatURL}
            alt={item.tags}
            style={{
              width: '350px',
              height: 'auto',
              cursor: 'pointer',
              objectFit: 'cover',
              borderRadius: '6px'
            }}
            onClick={() => setSelectedImage(item)}
          />
        ))}
      </div>

      {results.length > 0 && !isLoading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleLoadMore}>⬇ Lihat Lebih Banyak</button>
        </div>
      )}

      {isLoading && (
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <p>Memuat gambar...</p>
        </div>
      )}

      {/* Modal untuk gambar */}
      {selectedImage && (
        <div style={{
          position: 'fixed', top: 0, left: 0,
          width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}
          onClick={() => setSelectedImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }}>
            <img
              src={selectedImage.largeImageURL}
              alt={selectedImage.tags}
              style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '8px' }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(selectedImage);
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,255,255,0.8)',
                padding: '6px 10px',
                borderRadius: '5px',
                textDecoration: 'none',
                color: '#333',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              ⬇ Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
