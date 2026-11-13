import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  X, Camera, RotateCcw, ShoppingCart,
  AlertCircle, CheckCircle2, Loader2, PackageSearch,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import './BarcodeScannerModal.css';

// ── Known Indian brand prefixes ───────────────────────────────
const BRAND_HINTS = {
  '8901063': { brand: 'Britannia',       category: 'Bakery & Biscuits' },
  '8901058': { brand: 'Parle',           category: 'Bakery & Biscuits' },
  '8901030': { brand: 'ITC',             category: 'Snacks & Foods'    },
  '8901552': { brand: 'PepsiCo India',   category: 'Beverages'         },
  '8901262': { brand: 'Coca-Cola India', category: 'Beverages'         },
  '8904187': { brand: "Lay's India",     category: 'Snacks'            },
  '8901719': { brand: 'Nestle India',    category: 'Food'              },
  '8906003': { brand: 'Haldirams',       category: 'Snacks'            },
  '8901396': { brand: 'Amul',            category: 'Dairy'             },
  '8901725': { brand: 'Mother Dairy',    category: 'Dairy'             },
  '8906079': { brand: 'Patanjali',       category: 'Grocery'           },
  '8901670': { brand: 'Cadbury India',   category: 'Chocolates'        },
  '3017620': { brand: 'Nutella/Ferrero', category: 'Spreads'           },
  '4902430': { brand: 'Nestlé',          category: 'Chocolates'        },
  '5000159': { brand: 'Mars',            category: 'Chocolates'        },
  '8020477': { brand: 'Perfetti',        category: 'Confectionery'     },
};

const CAT_IMAGES = {
  'Bakery & Biscuits': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80',
  'Beverages':         'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&q=80',
  'Snacks':            'https://images.unsplash.com/photo-1558818498-28c1e002b655?w=200&q=80',
  'Dairy':             'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200&q=80',
  'Chocolates':        'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200&q=80',
  'Grocery':           'https://images.unsplash.com/photo-1584473457409-ae5c91117275?w=200&q=80',
  'Food':              'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&q=80',
};
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80';

const detectBrand = (barcode) => {
  for (const prefix of Object.keys(BRAND_HINTS)) {
    if (barcode.startsWith(prefix)) return BRAND_HINTS[prefix];
  }
  return null;
};

// Try multiple APIs IN PARALLEL for maximum speed
const fetchProduct = async (barcode) => {
  const urls = [
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
    `https://in.openfoodfacts.org/api/v0/product/${barcode}.json`,
  ];
  try {
    // Race both APIs — whichever responds first wins
    const result = await Promise.any(
      urls.map(async url => {
        const res  = await fetch(url, { signal: AbortSignal.timeout(2000) });
        const data = await res.json();
        const p    = data.product || data.products?.[0];
        if (p && (p.product_name || p.product_name_en)) return p;
        throw new Error('no product');
      })
    );
    return result;
  } catch {
    return null; // both failed — use fallback instantly
  }
};

// Map API response → SwiftCart product (NO discount)
const buildProduct = (barcode, apiProduct) => {
  const hint     = detectBrand(barcode);
  const price    = parseFloat(apiProduct?.price_100g) || Math.floor(Math.random() * 350) + 79;
  const name     = apiProduct?.product_name || apiProduct?.product_name_en
                   || (hint ? `${hint.brand} Product` : 'Scanned Product');
  const category = apiProduct?.categories_tags?.[0]?.replace('en:', '')
                   || hint?.category || 'Grocery';
  const brand    = apiProduct?.brands || hint?.brand || '';
  const image    = apiProduct?.image_front_url || apiProduct?.image_url
                   || CAT_IMAGES[hint?.category] || DEFAULT_IMG;

  return {
    _id: barcode, name, category, brand,
    price,                          // ← full price, no discount
    image, barcode,
    isFallback: !apiProduct,
    stockCount: 50,
    weight: apiProduct?.quantity || '',
    nutrition: {
      energy:  apiProduct?.nutriments?.energy_100g,
      fat:     apiProduct?.nutriments?.fat_100g,
      protein: apiProduct?.nutriments?.proteins_100g,
    },
  };
};

// ── Component ──────────────────────────────────────────────────
const BarcodeScannerModal = ({ onClose }) => {
  const dispatch   = useDispatch();
  const html5QrRef = useRef(null);
  const processing = useRef(false);

  const [phase,      setPhase]      = useState('scanning');
  const [product,    setProduct]    = useState(null);
  const [errMsg,     setErrMsg]     = useState('');
  const [liveCode,   setLiveCode]   = useState('');   // ← live barcode digits shown while scanning

  // ── Init scanner ─────────────────────────────────────────────
  useEffect(() => {
    const qr = new Html5Qrcode('sc-scanner-view');
    html5QrRef.current = qr;

    qr.start(
      { facingMode: 'environment' },
      {
        fps:         30,                             // ← max FPS
        qrbox:       { width: 260, height: 100 },    // wide & thin = barcode optimised
        aspectRatio: 1.7778,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,       // ← native Chrome API — near instant
        },
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.ITF,
          Html5QrcodeSupportedFormats.RSS_14,
        ],
      },
      handleDecode,
      (errorMsg) => {
        // show partial barcode if the error contains a numeric string = partial detection
        const match = errorMsg?.match?.(/\d{4,}/);
        if (match) setLiveCode(match[0]);
      }
    ).catch(() => {
      setErrMsg('Camera blocked. Allow camera permission in browser settings.');
      setPhase('error');
    });

    return () => { try { qr.stop(); } catch {} };
  }, []);

  // ── Barcode fully decoded ─────────────────────────────────────
  const handleDecode = useCallback(async (barcode) => {
    if (processing.current) return;
    processing.current = true;

    setLiveCode(barcode);
    try { html5QrRef.current?.pause(true); } catch {}

    // ⚡ 1. Show fallback product INSTANTLY — no waiting
    const instant = buildProduct(barcode, null);
    setProduct(instant);
    setPhase('found');

    // 2. Silently fetch real data and upgrade details in background
    fetchProduct(barcode).then(apiProduct => {
      if (apiProduct) {
        setProduct(buildProduct(barcode, apiProduct));
      }
    });
  }, []);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setPhase('added');
    setTimeout(() => onClose(), 1400);
  };

  const handleScanAgain = () => {
    processing.current = false;
    setProduct(null);
    setErrMsg('');
    setLiveCode('');
    setPhase('scanning');
    try { html5QrRef.current?.resume(); } catch {}
  };

  return (
    <div className="bsm-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bsm-modal glass-card animate-fade-in">

        {/* Header */}
        <div className="bsm-header">
          <div className="bsm-header-left">
            <Camera size={20} className="bsm-cam-icon" />
            <span>Barcode Scanner</span>
          </div>
          <button className="bsm-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Camera viewport */}
        <div
          id="sc-scanner-view"
          className={`bsm-viewport ${phase !== 'scanning' ? 'bsm-viewport-hidden' : ''}`}
        />

        {/* ── Live barcode number display ── */}
        {phase === 'scanning' && (
          <div className="bsm-live-wrap">
            <div className={`bsm-live-code ${liveCode ? 'bsm-live-active' : ''}`}>
              {liveCode
                ? liveCode.split('').map((ch, i) => (
                    <span key={i} className="bsm-live-digit">{ch}</span>
                  ))
                : <span className="bsm-live-placeholder">Waiting for barcode…</span>
              }
            </div>
            <p className="bsm-hint">Hold barcode <strong>horizontally</strong> inside the frame</p>
          </div>
        )}

        {/* Loading */}
        {phase === 'loading' && (
          <div className="bsm-state-box">
            <Loader2 size={42} className="bsm-spin bsm-icon-purple" />
            <p className="bsm-state-title">Looking up product…</p>
            <div className="bsm-loading-code">
              {liveCode.split('').map((ch, i) => (
                <span key={i} className="bsm-live-digit">{ch}</span>
              ))}
            </div>
          </div>
        )}

        {/* Found */}
        {phase === 'found' && product && (
          <div className="bsm-result animate-fade-in">
            {product.isFallback ? (
              <div className="bsm-fallback-banner">
                <PackageSearch size={14} />
                <span>Scanned · product details from brand database</span>
              </div>
            ) : (
              <div className="bsm-found-banner">
                <CheckCircle2 size={14} /> Product found!
              </div>
            )}

            <div className="bsm-product-row">
              <img
                src={product.image}
                alt={product.name}
                className="bsm-product-img"
                onError={e => { e.target.src = DEFAULT_IMG; }}
              />
              <div className="bsm-product-info">
                <span className="bsm-pcat">{product.category}</span>
                <h3 className="bsm-pname">{product.name}</h3>
                {product.brand  && <p className="bsm-pbrand">by {product.brand}</p>}
                {product.weight && <p className="bsm-pweight">{product.weight}</p>}
                <p className="bsm-barcode-txt">#{product.barcode}</p>
                <p className="bsm-pprice">₹{product.price.toFixed(2)}</p>
              </div>
            </div>

            {!product.isFallback && product.nutrition?.energy && (
              <div className="bsm-nutrition">
                <span>🔥 {Math.round(product.nutrition.energy)} kcal</span>
                {product.nutrition.fat     && <span>🧈 {product.nutrition.fat}g fat</span>}
                {product.nutrition.protein && <span>💪 {product.nutrition.protein}g protein</span>}
              </div>
            )}

            <div className="bsm-actions">
              <button className="bsm-add-btn" onClick={handleAddToCart}>
                <ShoppingCart size={16} /> Add to Cart — ₹{product.price.toFixed(2)}
              </button>
              <button className="bsm-scan-again" onClick={handleScanAgain}>
                <RotateCcw size={14} /> Scan Again
              </button>
            </div>
          </div>
        )}

        {/* Camera error */}
        {phase === 'error' && (
          <div className="bsm-state-box">
            <AlertCircle size={42} className="bsm-icon-red" />
            <p className="bsm-state-title">Camera Blocked</p>
            <p className="bsm-state-sub">{errMsg}</p>
            <div className="bsm-permission-steps">
              <p>1. Click the 🔒 lock icon in the address bar</p>
              <p>2. Set Camera → <strong>Allow</strong></p>
              <p>3. Reload the page</p>
            </div>
            <button className="bsm-scan-again" onClick={() => window.location.reload()}>
              <RotateCcw size={14} /> Reload Page
            </button>
          </div>
        )}

        {/* Added */}
        {phase === 'added' && (
          <div className="bsm-state-box bsm-added">
            <CheckCircle2 size={52} className="bsm-icon-green" />
            <p className="bsm-state-title">Added to Cart! 🛒</p>
            <p className="bsm-state-sub">{product?.name} — ₹{product?.price.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarcodeScannerModal;
