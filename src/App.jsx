// SETUP:
// 1. Paste this into src/App.jsx (replace everything)
// 2. Run: npm install @supabase/supabase-js
// 3. Run supabase_setup.sql in your Supabase SQL Editor
// 4. npm run dev

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SB_URL = 'https://tbaqsorosbenkswgxksr.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiYXFzb3Jvc2Jlbmtzd2d4a3NyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MzA3MzAsImV4cCI6MjA5MDAwNjczMH0.G7aiEIAxjggVY3w86GcwBY8g4BPYSM8r10jfJk2nd1c';
const CLD_NAME = 'dczsrcbyj';
const CLD_PRESET = "DEBBIE'S SCENT";
const sb = createClient(SB_URL, SB_KEY);
const fmt = n => `₦${Number(n).toLocaleString()}`;

const uploadToCloudinary = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLD_NAME}/image/upload`, { method: 'POST', body: fd });
  const d = await res.json();
  if (d.error) throw new Error(d.error.message);
  return d.secure_url;
};

const buildWAMsg = (cart, wa) => {
  const lines = cart.map(i => `• ${i.name} x${i.qty} (${fmt(i.price * i.qty)})`).join('\n');
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const msg = `Hello Debbie's Savvy Collection!\n\nI would like to order:\n\n${lines}\n\nTotal: ${fmt(total)}\n\nPlease confirm availability and delivery. Thank you!`;
  return `https://wa.me/${wa}?text=${encodeURIComponent(msg)}`;
};

// ─────────────────────────────────────────────────────────
// CSS
// ─────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
:root{--ivory:#FDF8F3;--cream:#F7EFE5;--rose:#C8926A;--gold:#C9A84C;--deep:#1A0A00;--muted:#8A7060;--blush:#F2D9CA;--green:#25D366;--red:#e74c3c;}
html{scroll-behavior:smooth;background:var(--deep);}
html,body{font-family:'DM Sans',sans-serif;background:var(--ivory);color:var(--deep);overflow-x:hidden;margin:0;padding:0;height:100%;}

@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes floatIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes shieldPulse{0%,100%{opacity:.05}50%{opacity:.1}}
.page-anim{animation:fadeUp .35s ease both;}

.toast-wrap{position:fixed;top:84px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;}
.toast{background:var(--deep);color:var(--ivory);padding:12px 18px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:10px;box-shadow:0 8px 28px rgba(26,10,0,.25);border-radius:8px;border-left:3px solid var(--gold);animation:toastIn .3s ease both;min-width:220px;max-width:300px;pointer-events:auto;}
.toast.err{background:#7f1d1d;border-left-color:#ef4444;}
.toast-icon{font-size:18px;flex-shrink:0;}

.skeleton{background:linear-gradient(90deg,#ede8e3 25%,#f5f0eb 50%,#ede8e3 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;}

.nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:70px;background:rgba(253,248,243,.96);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,168,76,.2);}
.nav-logo{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--deep);cursor:pointer;white-space:nowrap;background:none;border:none;}
.nav-logo span{color:var(--gold);font-style:italic;}
.nav-links{display:flex;gap:24px;align-items:center;}
.nav-btn{background:none;border:none;font-size:11px;font-weight:500;letter-spacing:1.2px;text-transform:uppercase;color:var(--muted);cursor:pointer;transition:color .2s;font-family:'DM Sans',sans-serif;padding:4px 0;position:relative;}
.nav-btn::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1.5px;background:var(--gold);transform:scaleX(0);transition:transform .2s;}
.nav-btn:hover,.nav-btn.active{color:var(--gold);}
.nav-btn:hover::after,.nav-btn.active::after{transform:scaleX(1);}
.nav-cart-btn{background:none;border:1.5px solid var(--deep);color:var(--deep);padding:8px 16px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:8px;border-radius:8px;}
.nav-cart-btn:hover{background:var(--deep);color:var(--ivory);}
.cart-badge{background:var(--gold);color:white;width:18px;height:18px;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.hamburger{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:5px;}
.hamburger span{display:block;width:22px;height:2px;background:var(--deep);transition:all .3s;transform-origin:center;}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
.hamburger.open span:nth-child(2){opacity:0;}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
.mobile-menu{display:none;position:fixed;top:70px;left:0;right:0;z-index:199;background:rgba(253,248,243,.98);backdrop-filter:blur(16px);border-bottom:1px solid rgba(201,168,76,.2);flex-direction:column;padding:16px 24px 24px;gap:4px;}
.mobile-menu.open{display:flex;}
.mobile-nav-btn{background:none;border:none;font-size:14px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:var(--muted);cursor:pointer;font-family:'DM Sans',sans-serif;padding:12px 0;text-align:left;border-bottom:1px solid rgba(201,168,76,.1);transition:color .2s;}
.mobile-nav-btn:hover,.mobile-nav-btn.active{color:var(--gold);}
.mobile-cart-btn{margin-top:12px;background:var(--deep);color:var(--ivory);border:none;padding:14px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:8px;}

.wa-float{position:fixed;bottom:28px;right:28px;z-index:998;background:var(--green);border:none;width:58px;height:58px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(37,211,102,.45);transition:transform .2s,box-shadow .2s;}
.wa-float:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(37,211,102,.6);}

.hero{min-height:100vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:100px 48px 60px;}
.hero-bg{position:absolute;inset:0;z-index:0;background:radial-gradient(ellipse at 70% 40%,rgba(247,197,213,.55) 0%,transparent 55%),radial-gradient(ellipse at 20% 80%,rgba(201,168,76,.18) 0%,transparent 50%),linear-gradient(135deg,#FDF8F3 0%,#F7EFE5 40%,#F2D9CA 75%,#EDD0CF 100%);}
.hero-bg-text{position:absolute;right:-20px;top:50%;transform:translateY(-50%);font-family:'Playfair Display',serif;font-size:clamp(80px,18vw,220px);font-weight:700;font-style:italic;color:rgba(201,168,76,.07);line-height:1;pointer-events:none;user-select:none;white-space:nowrap;z-index:0;}
.hero-content{position:relative;z-index:1;max-width:580px;}
.hero-tag{display:inline-flex;align-items:center;gap:8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:24px;font-weight:600;}
.hero-tag::before,.hero-tag::after{content:'✦';}
.hero-title{font-family:'Playfair Display',serif;font-size:clamp(42px,7vw,88px);line-height:1.02;color:var(--deep);margin-bottom:10px;}
.hero-title em{color:var(--gold);font-style:italic;display:block;}
.hero-brand{font-family:'Cormorant Garamond',serif;font-size:20px;color:var(--rose);margin-bottom:20px;letter-spacing:1px;}
.hero-sub{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--muted);line-height:1.75;margin-bottom:38px;max-width:460px;}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;}
.btn-dark{background:var(--deep);color:var(--ivory);border:none;padding:14px 30px;font-size:11.5px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .25s;font-family:'DM Sans',sans-serif;}
.btn-dark:hover{background:var(--gold);transform:translateY(-2px);}
.btn-ghost{background:transparent;color:var(--deep);border:1.5px solid var(--deep);padding:14px 30px;font-size:11.5px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .25s;font-family:'DM Sans',sans-serif;}
.btn-ghost:hover{border-color:var(--gold);color:var(--gold);transform:translateY(-2px);}
.hero-pills{position:absolute;right:48px;top:50%;transform:translateY(-50%);z-index:1;display:flex;flex-direction:column;gap:16px;align-items:flex-end;}
.hero-pill{background:white;border:1px solid rgba(201,168,76,.3);padding:12px 20px;display:flex;align-items:center;gap:12px;box-shadow:0 4px 20px rgba(26,10,0,.08);border-radius:12px;animation:floatIn .6s ease both;}
.hero-pill:nth-child(2){animation-delay:.15s;}
.hero-pill:nth-child(3){animation-delay:.3s;}
.hero-pill-icon{font-size:24px;}
.hero-pill-text{font-size:13px;font-weight:600;color:var(--deep);}
.hero-pill-sub{font-size:11px;color:var(--muted);}

.marquee-wrap{background:var(--deep);padding:14px 0;overflow:hidden;display:flex;white-space:nowrap;}
.marquee-track{display:flex;gap:48px;animation:marquee 22s linear infinite;white-space:nowrap;flex-shrink:0;}
.marquee-item{font-size:11.5px;letter-spacing:2px;text-transform:uppercase;color:rgba(253,248,243,.6);display:flex;align-items:center;gap:16px;flex-shrink:0;}
.marquee-item span{color:var(--gold);}

.section{padding:90px 48px;}
.section-label{text-align:center;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-weight:600;}
.section-title{font-family:'Playfair Display',serif;font-size:clamp(30px,4vw,48px);text-align:center;color:var(--deep);margin-bottom:56px;}

.cat-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:900px;margin:0 auto;}
.cat-card{height:360px;position:relative;overflow:hidden;cursor:pointer;border-radius:16px;}
.cat-bg{position:absolute;inset:0;transition:transform .5s ease;}
.cat-card:hover .cat-bg{transform:scale(1.05);}
.cat-perfume .cat-bg{background:linear-gradient(135deg,#2A1130 0%,#7B4E7B 45%,#C9A0C4 100%);}
.cat-fashion .cat-bg{background:linear-gradient(135deg,#1A0A00 0%,#5C3010 50%,#C8926A 100%);}
.cat-overlay{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding:36px;background:linear-gradient(to top,rgba(0,0,0,.6) 0%,transparent 55%);}
.cat-icon{font-size:44px;margin-bottom:10px;}
.cat-name{font-family:'Playfair Display',serif;font-size:28px;color:white;margin-bottom:6px;}
.cat-desc{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.65);margin-bottom:18px;}
.cat-cta{background:white;color:var(--deep);border:none;padding:9px 26px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;border-radius:20px;}
.cat-cta:hover{background:var(--gold);color:white;}

.about-strip{background:var(--deep);padding:80px 48px;display:flex;align-items:center;gap:64px;flex-wrap:wrap;}
.strip-text{flex:1;min-width:220px;}
.strip-tag{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:14px;font-weight:600;}
.strip-title{font-family:'Playfair Display',serif;font-size:clamp(26px,3vw,40px);color:var(--ivory);line-height:1.2;margin-bottom:16px;}
.strip-body{font-size:14px;color:rgba(253,248,243,.6);line-height:1.8;}
.strip-stat{text-align:center;}
.stat-num{font-family:'Playfair Display',serif;font-size:48px;color:var(--gold);line-height:1;}
.stat-label{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(253,248,243,.45);margin-top:4px;}

.admin-shield{display:flex;justify-content:center;padding:8px 0 4px; 5s ease-in-out infinite;}
.admin-shield svg{width:16px;height:16px;color:rgb(255, 221, 0);transition:color .3s;}
.admin-shield:hover svg{color:rgba(253,248,243,.2);}

.footer{background:var(--deep);padding:48px 48px 12px;box-sizing:border-box;}
.footer-top{display:grid;grid-template-columns:1.5fr 1fr 1fr;gap:40px;margin-bottom:40px;}
.footer-brand{font-family:'Playfair Display',serif;font-size:18px;color:var(--ivory);margin-bottom:12px;}
.footer-brand span{color:var(--gold);font-style:italic;}
.footer-tagline{font-size:13px;color:rgba(253,248,243,.45);line-height:1.7;max-width:220px;}
.footer-col-title{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;font-weight:600;}
.footer-link{display:block;background:none;border:none;font-size:13px;color:rgba(253,248,243,.5);cursor:pointer;padding:4px 0;text-align:left;font-family:'DM Sans',sans-serif;transition:color .2s;}
.footer-link:hover{color:var(--ivory);}
.footer-contact-item{font-size:13px;color:rgba(253,248,243,.5);padding:4px 0;}
.footer-bottom{border-top:1px solid rgba(201,168,76,.15);padding-top:16px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;width:100%;box-sizing:border-box;}
.footer-copy{font-size:12px;color:rgba(253,248,243,.25);}
.footer-dev{font-size:11px;color:rgba(253,248,243,.2);letter-spacing:1px;text-transform:uppercase;}
.footer-dev span{color:rgba(201,168,76,.35);}

.products-page{padding:100px 48px 60px;min-height:100vh;}
.products-header{text-align:center;margin-bottom:40px;}
.products-header h1{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,60px);color:var(--deep);margin-bottom:10px;}
.products-header h1 em{color:var(--gold);font-style:italic;}
.products-header p{font-family:'Cormorant Garamond',serif;font-size:18px;color:var(--muted);}
.filter-bar{display:flex;align-items:center;gap:14px;margin-bottom:36px;flex-wrap:wrap;max-width:1100px;margin-left:auto;margin-right:auto;}
.search-wrap{position:relative;flex:1;min-width:200px;}
.search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;display:flex;align-items:center;}
.search-input{width:100%;padding:10px 14px 10px 40px;border:1.5px solid rgba(201,168,76,.3);background:white;font-size:13px;font-family:'DM Sans',sans-serif;color:var(--deep);outline:none;transition:border-color .2s;border-radius:8px;}
.search-input:focus{border-color:var(--gold);}
.search-input::placeholder{color:var(--muted);}
.filter-select{padding:10px 14px;border:1.5px solid rgba(201,168,76,.3);background:white;font-size:13px;font-family:'DM Sans',sans-serif;color:var(--deep);outline:none;cursor:pointer;min-width:150px;border-radius:8px;}
.results-count{font-size:12px;color:var(--muted);letter-spacing:.5px;white-space:nowrap;}

.product-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto;}
.no-results{text-align:center;padding:80px 0;grid-column:1/-1;}
.no-results-icon{font-size:56px;margin-bottom:16px;}
.no-results h3{font-family:'Playfair Display',serif;font-size:26px;color:var(--deep);margin-bottom:8px;}
.no-results p{font-size:14px;color:var(--muted);}

.product-card{background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(26,10,0,.06);transition:transform .3s,box-shadow .3s;position:relative;display:flex;flex-direction:column;}
.product-card:hover{transform:translateY(-5px);box-shadow:0 10px 36px rgba(26,10,0,.13);}
.product-card.out-of-stock{opacity:.7;}
.product-img{height:200px;display:flex;align-items:center;justify-content:center;font-size:58px;position:relative;cursor:pointer;overflow:hidden;}
.product-img img{width:100%;height:100%;object-fit:contain;transition:transform .4s;}
.product-card:hover .product-img img{transform:scale(1.05);}
.img-perfume{background:linear-gradient(135deg,#EDD5C0 0%,#D4A0C4 100%);}
.img-fashion{background:linear-gradient(135deg,#D4C4B8 0%,#C8926A 100%);}
.product-badges{position:absolute;top:10px;left:10px;display:flex;flex-direction:column;gap:4px;z-index:2;}
.badge{font-size:9.5px;font-weight:700;padding:4px 10px;letter-spacing:.8px;text-transform:uppercase;border-radius:20px;}
.badge-bestseller{background:var(--deep);color:var(--gold);}
.badge-new{background:var(--gold);color:white;}
.badge-limited{background:#9B6B9B;color:white;}
.badge-trending{background:var(--rose);color:white;}
.badge-sold{background:#999;color:white;}
.stock-indicator{position:absolute;bottom:10px;right:10px;font-size:10px;font-weight:600;padding:3px 10px;letter-spacing:.5px;border-radius:20px;z-index:2;}
.stock-ok{background:rgba(37,211,102,.15);color:#1a8a42;}
.stock-low{background:rgba(255,160,0,.15);color:#b36200;}
.stock-out{background:rgba(231,76,60,.12);color:var(--red);}
.in-cart-badge{position:absolute;top:10px;right:10px;background:var(--green);color:white;font-size:10px;font-weight:700;padding:3px 10px;letter-spacing:.5px;border-radius:20px;z-index:2;}
.product-info{padding:18px;flex:1;display:flex;flex-direction:column;}
.product-name{font-family:'Playfair Display',serif;font-size:17px;color:var(--deep);margin-bottom:4px;}
.product-meta{font-size:11px;color:var(--gold);margin-bottom:4px;letter-spacing:.5px;}
.product-desc{font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.55;flex:1;}
.product-footer{display:flex;align-items:center;justify-content:space-between;gap:8px;}
.product-price{font-size:17px;font-weight:700;color:var(--rose);}
.add-btn{background:var(--deep);color:white;border:none;padding:8px 14px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;white-space:nowrap;border-radius:8px;}
.add-btn:hover:not(:disabled){background:var(--gold);}
.add-btn.added{background:var(--green);}
.add-btn:disabled{background:#ccc;cursor:not-allowed;}
.view-btn{background:none;border:none;font-size:11px;color:var(--muted);cursor:pointer;text-decoration:underline;letter-spacing:.5px;font-family:'DM Sans',sans-serif;transition:color .2s;padding:0;margin-top:8px;text-align:left;}
.view-btn:hover{color:var(--gold);}

.combo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto;}
.combo-card{background:linear-gradient(135deg,#2A1130,#7B4E7B);border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(26,10,0,.15);transition:transform .3s;cursor:pointer;}
.combo-card:hover{transform:translateY(-4px);}
.combo-img{height:160px;display:flex;align-items:center;justify-content:center;font-size:50px;overflow:hidden;}
.combo-img img{width:100%;height:100%;object-fit:cover;}
.combo-info{padding:16px;}
.combo-name{font-family:'Playfair Display',serif;font-size:18px;color:white;margin-bottom:4px;}
.combo-desc{font-size:12px;color:rgba(255,255,255,.65);margin-bottom:12px;line-height:1.5;}
.combo-pricing{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.combo-price{font-size:20px;font-weight:700;color:var(--gold);}
.combo-original{font-size:13px;color:rgba(255,255,255,.4);text-decoration:line-through;}
.combo-save{background:var(--green);color:white;font-size:9px;font-weight:700;padding:3px 8px;border-radius:20px;letter-spacing:.5px;}

.modal-overlay{position:fixed;inset:0;z-index:500;background:rgba(26,10,0,.65);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
.modal{background:var(--ivory);max-width:680px;width:100%;max-height:90vh;overflow-y:auto;position:relative;border-radius:16px;animation:slideUp .3s ease;}
.modal-close{position:absolute;top:16px;right:16px;z-index:10;background:white;border:1px solid rgba(201,168,76,.3);width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;color:var(--deep);font-size:16px;}
.modal-close:hover{background:var(--deep);color:var(--ivory);}
.modal-img{height:280px;display:flex;align-items:center;justify-content:center;font-size:80px;position:relative;overflow:hidden;border-radius:16px 16px 0 0;}
.modal-img img{width:100%;height:100%;object-fit:contain;background:#f9f5f0;}
.modal-body{padding:28px;}
.modal-tag{font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);margin-bottom:10px;font-weight:600;}
.modal-name{font-family:'Playfair Display',serif;font-size:32px;color:var(--deep);margin-bottom:8px;}
.modal-price{font-size:24px;font-weight:700;color:var(--rose);margin-bottom:16px;}
.modal-desc{font-family:'Cormorant Garamond',serif;font-size:17px;color:var(--muted);line-height:1.7;margin-bottom:24px;}
.modal-details{display:flex;gap:20px;flex-wrap:wrap;margin-bottom:28px;padding:16px;background:white;border-left:3px solid var(--gold);border-radius:0 8px 8px 0;}
.modal-detail-item{font-size:13px;color:var(--deep);}
.modal-detail-label{font-size:11px;color:var(--muted);letter-spacing:.5px;margin-bottom:2px;}
.modal-actions{display:flex;gap:12px;flex-wrap:wrap;}
.modal-add-btn{flex:1;background:var(--deep);color:var(--ivory);border:none;padding:14px 24px;font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .25s;font-family:'DM Sans',sans-serif;border-radius:8px;}
.modal-add-btn:hover:not(:disabled){background:var(--gold);}
.modal-add-btn:disabled{background:#ccc;cursor:not-allowed;}
.modal-wa-btn{background:var(--green);color:white;border:none;padding:14px 20px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:8px;border-radius:8px;}
.modal-wa-btn:hover{background:#1ebe5d;}

.cart-page{padding:100px 48px 60px;max-width:820px;margin:0 auto;min-height:100vh;}
.cart-empty{text-align:center;padding:80px 0;}
.cart-empty-icon{font-size:64px;margin-bottom:16px;}
.cart-empty h2{font-family:'Playfair Display',serif;font-size:32px;color:var(--deep);margin-bottom:8px;}
.cart-empty p{font-size:14px;color:var(--muted);margin-bottom:28px;}
.cart-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;}
.cart-item{display:flex;align-items:center;gap:16px;padding:16px;background:white;margin-bottom:10px;box-shadow:0 2px 12px rgba(26,10,0,.05);border-radius:12px;transition:box-shadow .2s;}
.cart-item:hover{box-shadow:0 4px 20px rgba(26,10,0,.1);}
.cart-item-thumb{width:56px;height:56px;border-radius:8px;object-fit:cover;flex-shrink:0;}
.cart-item-emoji{font-size:38px;width:56px;text-align:center;flex-shrink:0;}
.cart-item-info{flex:1;min-width:0;}
.cart-item-name{font-family:'Playfair Display',serif;font-size:15px;color:var(--deep);}
.cart-item-price{font-size:13px;color:var(--rose);font-weight:600;margin-top:2px;}
.cart-qty{display:flex;align-items:center;gap:10px;}
.qty-btn{background:var(--cream);border:none;width:40px;height:40px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--deep);transition:background .2s;}
.qty-btn:hover{background:var(--blush);}
.qty-num{font-size:15px;font-weight:600;min-width:20px;text-align:center;}
.remove-btn{background:none;border:none;font-size:20px;cursor:pointer;color:var(--muted);transition:color .2s;padding:4px;}
.remove-btn:hover{color:var(--red);}
.cart-summary{background:var(--deep);padding:28px;margin-top:20px;border-radius:16px;}
.cart-total-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;}
.cart-total-label{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:rgba(253,248,243,.6);}
.cart-total-amt{font-family:'Playfair Display',serif;font-size:30px;color:var(--gold);}
.cart-note{font-size:12px;color:rgba(253,248,243,.4);margin-bottom:20px;font-style:italic;}
.wa-order-btn{width:100%;background:var(--green);color:white;border:none;padding:16px;font-size:14px;font-weight:700;letter-spacing:1px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;transition:all .2s;font-family:'DM Sans',sans-serif;border-radius:12px;}
.wa-order-btn:hover{background:#1ebe5d;transform:translateY(-2px);}

.contact-page{padding:120px 48px 80px;max-width:680px;margin:0 auto;min-height:100vh;}
.contact-info-card{display:flex;align-items:center;gap:16px;padding:20px;background:white;margin-bottom:12px;border-left:3px solid var(--gold);box-shadow:0 2px 12px rgba(26,10,0,.06);transition:transform .2s;border-radius:0 12px 12px 0;}
.contact-info-card:hover{transform:translateX(4px);}
.c-icon{font-size:22px;flex-shrink:0;}
.c-label{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:3px;}
.c-val{font-size:15px;font-weight:600;color:var(--deep);}
.wa-big-btn{width:100%;background:var(--green);color:white;border:none;padding:18px;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:12px;transition:all .2s;margin-top:24px;font-family:'DM Sans',sans-serif;border-radius:12px;}
.wa-big-btn:hover{background:#1ebe5d;transform:translateY(-2px);}
.ig-btn{width:100%;margin-top:12px;background:linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045);color:white;border:none;padding:16px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transition:opacity .2s;font-family:'DM Sans',sans-serif;border-radius:12px;}
.ig-btn:hover{opacity:.88;}

.admin-login-overlay{position:fixed;inset:0;z-index:1000;background:rgba(26,10,0,.85);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .2s ease;}
.admin-login-box{background:#0f172a;border:1px solid rgba(201,168,76,.2);border-radius:16px;padding:40px;width:100%;max-width:360px;animation:slideUp .3s ease;}
.admin-login-logo{font-family:'Playfair Display',serif;font-size:22px;color:var(--ivory);margin-bottom:4px;text-align:center;}
.admin-login-logo span{color:var(--gold);font-style:italic;}
.admin-login-sub{font-size:11px;color:rgba(255,255,255,.3);text-align:center;margin-bottom:32px;letter-spacing:1.5px;text-transform:uppercase;}
.admin-input{width:100%;padding:12px 16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:white;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;border-radius:8px;transition:border-color .2s;margin-bottom:14px;}
.admin-input:focus{border-color:rgba(201,168,76,.5);}
.admin-input::placeholder{color:rgba(255,255,255,.25);}
.admin-submit{width:100%;background:var(--gold);color:var(--deep);border:none;padding:13px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;border-radius:8px;}
.admin-submit:hover{background:#d4b05a;}
.admin-cancel{width:100%;background:none;border:none;color:rgba(255,255,255,.3);font-size:12px;cursor:pointer;margin-top:12px;font-family:'DM Sans',sans-serif;transition:color .2s;}
.admin-cancel:hover{color:rgba(255,255,255,.6);}
.admin-error{color:#ff6b6b;font-size:12px;text-align:center;margin-top:10px;}

.admin-wrap{display:flex;min-height:100vh;background:#0f172a;position:fixed;inset:0;z-index:999;overflow:hidden;}
.admin-sidebar{width:240px;background:#080f1e;border-right:1px solid rgba(255,255,255,.05);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
.admin-sidebar-logo{padding:24px 20px;border-bottom:1px solid rgba(255,255,255,.05);}
.admin-sidebar-brand{font-family:'Playfair Display',serif;font-size:16px;color:var(--ivory);}
.admin-sidebar-brand span{color:var(--gold);font-style:italic;}
.admin-sidebar-sub{font-size:10px;color:rgba(255,255,255,.25);letter-spacing:1.5px;text-transform:uppercase;margin-top:3px;}
.admin-nav{flex:1;padding:16px 12px;display:flex;flex-direction:column;gap:2px;}
.admin-nav-btn{display:flex;align-items:center;gap:12px;padding:10px 14px;background:none;border:none;color:rgba(255,255,255,.45);font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;text-align:left;border-radius:8px;font-weight:500;width:100%;}
.admin-nav-btn:hover{background:rgba(255,255,255,.05);color:rgba(255,255,255,.8);}
.admin-nav-btn.active{background:rgba(201,168,76,.1);color:var(--gold);}
.admin-nav-icon{font-size:16px;width:20px;text-align:center;flex-shrink:0;}
.admin-exit{margin:12px;padding:10px 14px;background:rgba(231,76,60,.08);border:1px solid rgba(231,76,60,.15);color:rgba(255,120,120,.6);font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .2s;border-radius:8px;font-weight:500;display:flex;align-items:center;gap:8px;justify-content:center;}
.admin-exit:hover{background:rgba(231,76,60,.18);color:#ff6b6b;}
.admin-main{flex:1;overflow-y:auto;padding:32px;}
.admin-page-title{font-family:'Playfair Display',serif;font-size:26px;color:white;margin-bottom:4px;}
.admin-page-sub{font-size:13px;color:rgba(255,255,255,.35);margin-bottom:28px;}
.admin-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:28px;}
.admin-stat-card{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:20px;}
.admin-stat-label{font-size:11px;color:rgba(255,255,255,.35);letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;}
.admin-stat-value{font-family:'Playfair Display',serif;font-size:30px;color:var(--gold);}
.admin-stat-sub{font-size:11px;color:rgba(255,255,255,.25);margin-top:4px;}
.admin-section{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);border-radius:12px;padding:24px;margin-bottom:20px;}
.admin-section-head{font-size:14px;font-weight:600;color:white;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.admin-table{width:100%;border-collapse:collapse;}
.admin-table th{text-align:left;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:1px;text-transform:uppercase;padding:0 12px 12px;}
.admin-table td{padding:12px;border-top:1px solid rgba(255,255,255,.04);font-size:13px;color:rgba(255,255,255,.7);vertical-align:middle;}
.admin-table tr:hover td{background:rgba(255,255,255,.02);}
.admin-thumb{width:44px;height:44px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:20px;overflow:hidden;}
.admin-thumb img{width:44px;height:44px;border-radius:8px;object-fit:cover;}
.admin-form{display:flex;flex-direction:column;gap:14px;}
.admin-form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.admin-label{font-size:11px;color:rgba(255,255,255,.45);letter-spacing:.5px;margin-bottom:6px;display:block;}
.admin-field{width:100%;padding:10px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:white;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;border-radius:8px;transition:border-color .2s;}
.admin-field:focus{border-color:rgba(201,168,76,.5);}
.admin-field::placeholder{color:rgba(255,255,255,.2);}
.admin-textarea{resize:vertical;min-height:80px;}
.admin-btn{background:var(--gold);color:var(--deep);border:none;padding:10px 20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif;border-radius:8px;display:flex;align-items:center;gap:8px;justify-content:center;}
.admin-btn:hover:not(:disabled){background:#d4b05a;}
.admin-btn:disabled{opacity:.5;cursor:not-allowed;}
.admin-btn-ghost{background:rgba(255,255,255,.07);color:rgba(255,255,255,.6);border:1px solid rgba(255,255,255,.1);}
.admin-btn-ghost:hover:not(:disabled){background:rgba(255,255,255,.12);color:white;}
.admin-btn-danger{background:rgba(231,76,60,.12);color:#ff6b6b;border:1px solid rgba(231,76,60,.2);}
.admin-btn-danger:hover:not(:disabled){background:rgba(231,76,60,.25);}
.admin-btn-sm{padding:7px 12px;font-size:11px;}
.admin-actions{display:flex;gap:8px;align-items:center;}
.img-upload-area{border:2px dashed rgba(255,255,255,.12);border-radius:12px;padding:24px;text-align:center;cursor:pointer;transition:all .2s;background:rgba(255,255,255,.03);}
.img-upload-area:hover{border-color:rgba(201,168,76,.4);background:rgba(201,168,76,.03);}
.img-upload-preview{width:100%;max-height:140px;object-fit:cover;border-radius:8px;margin-bottom:10px;}
.img-upload-text{font-size:12px;color:rgba(255,255,255,.3);margin-top:8px;}
.toggle{width:40px;height:22px;border-radius:11px;border:none;cursor:pointer;transition:all .3s;position:relative;display:inline-flex;align-items:center;flex-shrink:0;}
.toggle.on{background:var(--green);}
.toggle.off{background:rgba(255,255,255,.15);}
.toggle-dot{width:16px;height:16px;border-radius:50%;background:white;position:absolute;transition:transform .3s;}
.toggle.on .toggle-dot{transform:translateX(20px);}
.toggle.off .toggle-dot{transform:translateX(3px);}
.spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.2);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite;display:inline-block;}
.pill-ok{background:rgba(37,211,102,.12);color:#22c55e;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;}
.pill-low{background:rgba(245,158,11,.12);color:#f59e0b;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;}
.pill-out{background:rgba(239,68,68,.12);color:#ef4444;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;}

@media(max-width:900px){
  .product-grid,.combo-grid{grid-template-columns:repeat(2,1fr);gap:16px;}
  .footer-top{grid-template-columns:1fr 1fr;}
  .hero-pills{display:none;}
  .about-strip{gap:40px;padding:60px 32px;}
  .admin-stat-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:768px){
  .nav{padding:0 20px;}
  .nav-links{display:none;}
  .hamburger{display:flex;}
  .hero{padding:90px 24px 50px;min-height:auto;}
  .hero-bg-text{display:none;}
  .section{padding:60px 24px;}
  .about-strip{padding:50px 24px;flex-direction:column;gap:32px;text-align:center;}
  .products-page{padding:86px 20px 50px;}
  .cart-page{padding:86px 20px 50px;}
  .contact-page{padding:100px 20px 60px;}
.footer{padding:40px 24px 12px;overflow:hidden;box-sizing:border-box;}
.footer-top{grid-template-columns:1fr;gap:28px;width:100%;}
.footer-bottom{flex-direction:column;gap:8px;text-align:center;width:100%;}
.footer-copy{font-size:11px;}
.footer-dev{font-size:11px;}

.modal-img{height:260px;}
  .modal-body{padding:20px;}
  .modal-actions{flex-direction:column;}
  .cart-item{flex-wrap:wrap;}
  .wa-float{bottom:20px;right:16px;width:52px;height:52px;}
  .admin-sidebar{width:200px;}
  .admin-main{padding:20px;}
  .admin-form-row{grid-template-columns:1fr;}
}
@media(max-width:480px){
  .product-grid,.combo-grid{grid-template-columns:1fr;}
  .cat-grid{grid-template-columns:1fr;}
  .cat-card{height:280px;}
  .hero-btns{flex-direction:column;}
  .btn-dark,.btn-ghost{width:100%;text-align:center;}
  .admin-sidebar{display:none;}
  .admin-stat-grid{grid-template-columns:1fr 1fr;}
}
`;

// ─────────────────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────────────────
const WAIcon = ({ size = 26 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ width: size, height: size, display: 'block', flexShrink: 0 }}>
    <path fill="#25D366" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 10L4 44l10.3-2.7C17.1 43 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
    <path fill="#fff" d="M35.2 28.9c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.1 1.5-1.4 1.8-.3.3-.5.4-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-1 .2-.2.5-.5.7-.8.2-.3.3-.5.4-.8.2-.3 0-.6-.1-.8-.1-.2-1-2.5-1.4-3.4-.4-.9-.8-.8-1-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.8s1.7 4.4 1.9 4.7c.2.3 3.3 5 8 7 1.1.5 2 .8 2.7 1 1.1.3 2.2.3 3 .2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2-.1-2.2l-.8-.4z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
  </svg>
);
const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
let _tid = 0;
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, icon = '✓', type = 'ok') => {
    const id = ++_tid;
    setToasts(p => [...p, { id, msg, icon, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, push };
}
function ToastBox({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map(t => <div key={t.id} className={`toast${t.type === 'err' ? ' err' : ''}`}><span className="toast-icon">{t.icon}</span><span>{t.msg}</span></div>)}
    </div>
  );
}
function StockBadge({ stock }) {
  if (stock === 0) return <div className="stock-indicator stock-out">Out of Stock</div>;
  if (stock <= 4) return <div className="stock-indicator stock-low">Only {stock} left</div>;
  return <div className="stock-indicator stock-ok">In Stock</div>;
}
function getBadgeClass(tag) {
  return { Bestseller:'badge-bestseller', New:'badge-new', Limited:'badge-limited', Trending:'badge-trending', 'Sold Out':'badge-sold' }[tag] || 'badge-bestseller';
}
function Toggle({ on, onToggle }) {
  return <button className={`toggle ${on ? 'on' : 'off'}`} onClick={onToggle}><div className="toggle-dot" /></button>;
}
function SkeletonGrid() {
  return (
    <div className="product-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{ background: 'white', borderRadius: 12, overflow: 'hidden' }}>
          <div className="skeleton" style={{ height: 200 }} />
          <div style={{ padding: 18 }}>
            <div className="skeleton" style={{ height: 14, width: '70%', borderRadius: 4, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 10, width: '90%', borderRadius: 4, marginBottom: 16 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="skeleton" style={{ height: 20, width: '35%', borderRadius: 4 }} />
              <div className="skeleton" style={{ height: 32, width: '30%', borderRadius: 8 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function ImgUpload({ value, onChange, label = 'Product Image' }) {
  const [uploading, setUploading] = useState(false);
  const ref = useRef();
  const handle = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try { onChange(await uploadToCloudinary(file)); }
    catch (err) { alert('Upload failed: ' + err.message); }
    finally { setUploading(false); }
  };
  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="img-upload-area" onClick={() => ref.current.click()}>
        {value && <img src={value} className="img-upload-preview" alt="preview" />}
        <div style={{ color: 'rgba(255,255,255,.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          {uploading ? <div className="spinner" /> : <UploadIcon />}
          <span className="img-upload-text">{uploading ? 'Uploading...' : value ? 'Click to change' : 'Click to upload'}</span>
        </div>
        <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={handle} />
      </div>
      <input className="admin-field" style={{ marginTop: 8, fontSize: 11 }} value={value || ''} onChange={e => onChange(e.target.value)} placeholder="Or paste image URL" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// STORE COMPONENTS
// ─────────────────────────────────────────────────────────
function ProductModal({ product, inCart, onAdd, onClose, waNum }) {
  const sold = product.stock === 0;
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className={`modal-img ${product.type === 'fashion' ? 'img-fashion' : 'img-perfume'}`}>
          {product.image_url ? <img src={product.image_url} alt={product.name} /> : <span>{product.emoji || '✨'}</span>}
          {product.tag && <div style={{ position: 'absolute', top: 12, left: 12 }}><span className={`badge ${getBadgeClass(product.tag)}`}>{product.tag}</span></div>}
          <StockBadge stock={product.stock} />
        </div>
        <div className="modal-body">
          <div className="modal-tag">✦ {product.type === 'fashion' ? 'Fashion' : 'Fragrance'}</div>
          <div className="modal-name">{product.name}</div>
          <div className="modal-price">{fmt(product.price)}</div>
          <div className="modal-desc">{product.description}</div>
          <div className="modal-details">
            {product.ml && <div className="modal-detail-item"><div className="modal-detail-label">Size</div><strong>{product.ml}</strong></div>}
            {product.sizes && <div className="modal-detail-item"><div className="modal-detail-label">Sizes</div><strong>{product.sizes}</strong></div>}
            <div className="modal-detail-item"><div className="modal-detail-label">Stock</div><strong>{sold ? 'Out of Stock' : `${product.stock} available`}</strong></div>
            <div className="modal-detail-item"><div className="modal-detail-label">Delivery</div><strong>Available</strong></div>
          </div>
          <div className="modal-actions">
            <button className="modal-add-btn" disabled={sold} onClick={() => onAdd(product)}>{sold ? 'Out of Stock' : inCart ? 'Add More' : 'Add to Cart'}</button>
            <button className="modal-wa-btn" onClick={() => { const m = `Hello! I am interested in *${product.name}* (${fmt(product.price)}). Is it available?`; window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(m)}`, '_blank'); }}>
              <WAIcon size={18} /> Enquire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, inCart, onAdd, onView }) {
  const sold = product.stock === 0;
  return (
    <div className={`product-card${sold ? ' out-of-stock' : ''}`}>
      <div className={`product-img ${product.type === 'fashion' ? 'img-fashion' : 'img-perfume'}`} onClick={() => onView(product)}>
        {product.image_url ? <img src={product.image_url} alt={product.name} /> : <span>{product.emoji || '✨'}</span>}
        <div className="product-badges">{product.tag && <span className={`badge ${getBadgeClass(product.tag)}`}>{product.tag}</span>}</div>
        {inCart && !sold && <div className="in-cart-badge">In Cart</div>}
        <StockBadge stock={product.stock} />
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        {(product.ml || product.sizes) && <div className="product-meta">{product.ml || product.sizes}</div>}
        <div className="product-desc">{product.description}</div>
        <div className="product-footer">
          <span className="product-price">{fmt(product.price)}</span>
          <button className={`add-btn${inCart ? ' added' : ''}`} disabled={sold} onClick={() => onAdd(product)}>{sold ? 'Sold Out' : inCart ? '+ More' : 'Add'}</button>
        </div>
        <button className="view-btn" onClick={() => onView(product)}>View details</button>
      </div>
    </div>
  );
}

function Footer({ nav, settings, onShield }) {
  const wa = settings?.whatsapp || '2348119730367';
  const ig = settings?.instagram || '@DebbiesSavvyCol_';
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand">Debbie's <span>Savvy Collection</span></div>
          <p className="footer-tagline">Premium fragrances and fashion pieces, delivered to your door with love.</p>
        </div>
        <div>
          <div className="footer-col-title">Navigate</div>
          {[['home','Home'],['perfumes','Perfumes'],['fashion','Fashion'],['combos','Combos'],['cart','Cart'],['contact','Contact']].map(([p,l]) => (
            <button key={p} className="footer-link" onClick={() => nav(p)}>{l}</button>
          ))}
        </div>
        <div>
          <div className="footer-col-title">Contact</div>
          <div className="footer-contact-item">📍 Benin City, Edo State</div>
          <div className="footer-contact-item">📱 +{wa}</div>
          <div className="footer-contact-item">📸 {ig}</div>
          <div className="footer-contact-item">🚚 Delivery Available</div>
        </div>
      </div>
<div className="footer-bottom">
  <span className="footer-copy">
    <span onClick={onShield} style={{cursor:'pointer',color:'rgba(168, 168, 168, 0.8)',display:'inline-flex',alignItems:'center',marginRight:8,width:16,height:16}}><ShieldIcon /></span>
    © 2026 Debbie's Savvy Collection. All rights reserved.
  </span>
  <span className="footer-dev">Developed by <span>SHADOW GARDEN</span></span>
</div>
</footer>
  );
}
function ProductsPage({ type, products, cart, onAdd, toast, nav, settings, onShield }) {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [modal, setModal] = useState(null);
  const wa = settings?.whatsapp || '2348119730367';
  useEffect(() => { const t = setTimeout(() => setLoading(false), 700); return () => clearTimeout(t); }, [type]);
  const handleAdd = p => { onAdd(p); toast(`${p.name} added to cart`, '🛒'); };
  const filtered = products
    .filter(p => p.type === type && p.visible !== false)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'stock') return b.stock - a.stock;
      return 0;
    });
  const isPerfume = type === 'perfume';
  return (
    <div className="page-anim products-page">
      <div className="products-header">
        <p className="section-label">✦ {isPerfume ? 'Fragrances' : 'Fashion'}</p>
        <h1>{isPerfume ? <>The Scent <em>Collection</em></> : <>Style That <em>Speaks</em></>}</h1>
        <p>{isPerfume ? 'Premium fragrances for every mood and moment' : 'Crocs, Totes, Handbags, Glasses, Palm Slippers and more'}</p>
      </div>
      <div className="filter-bar">
        <div className="search-wrap">
          <span className="search-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          <input className="search-input" placeholder={`Search ${isPerfume ? 'perfumes' : 'fashion'}...`} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="stock">In Stock First</option>
        </select>
        {!loading && <span className="results-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</span>}
      </div>
      {loading ? <SkeletonGrid /> : filtered.length === 0 ? (
        <div className="product-grid"><div className="no-results">
          <div className="no-results-icon">{search ? '🔍' : '🛍️'}</div>
          <h3>{search ? 'No results found' : 'No products yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Add products via the admin panel'}</p>
        </div></div>
      ) : (
        <div className="product-grid">
          {filtered.map(p => <ProductCard key={p.id} product={p} inCart={cart.some(i => i.id === p.id)} onAdd={handleAdd} onView={setModal} />)}
        </div>
      )}
      {modal && <ProductModal product={modal} inCart={cart.some(i => i.id === modal.id)} onAdd={p => { handleAdd(p); }} onClose={() => setModal(null)} waNum={wa} />}
      <div style={{ marginTop: 60, marginLeft: '-48px', marginRight: '-48px' }}><Footer nav={nav} settings={settings} onShield={onShield} /></div>
    </div>
  );
}

function CombosPage({ combos, nav, settings, onShield }) {
  const wa = settings?.whatsapp || '2348119730367';
  const visible = combos.filter(c => c.visible !== false);
  return (
    <div className="page-anim products-page">
      <div className="products-header">
        <p className="section-label">✦ Bundle Deals</p>
        <h1>Scent <em>Combos</em></h1>
        <p>Get more for less with our curated perfume bundles</p>
      </div>
      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎁</div>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>No combos available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="combo-grid">
          {visible.map(c => {
            const save = c.original_price > c.price ? Math.round(((c.original_price - c.price) / c.original_price) * 100) : 0;
            return (
              <div key={c.id} className="combo-card" onClick={() => { const m = `Hello! I am interested in the *${c.name}* combo (${fmt(c.price)}). Is it available?`; window.open(`https://wa.me/${wa}?text=${encodeURIComponent(m)}`, '_blank'); }}>
                <div className="combo-img">{c.image_url ? <img src={c.image_url} alt={c.name} /> : <span>{c.emoji || '🎁'}</span>}</div>
                <div className="combo-info">
                  <div className="combo-name">{c.name}</div>
                  <div className="combo-desc">{c.description}</div>
                  <div className="combo-pricing">
                    <span className="combo-price">{fmt(c.price)}</span>
                    {c.original_price > c.price && <span className="combo-original">{fmt(c.original_price)}</span>}
                    {save > 0 && <span className="combo-save">Save {save}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
     <div style={{ marginTop: 60, marginLeft: '-48px', marginRight: '-48px' }}><Footer nav={nav} settings={settings} onShield={onShield} /></div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// ADMIN COMPONENTS
// ─────────────────────────────────────────────────────────
function AdminDashboard({ products, categories, combos }) {
  const low = products.filter(p => p.stock > 0 && p.stock <= 4);
  const out = products.filter(p => p.stock === 0);
  return (
    <div>
      <div className="admin-page-title">Dashboard</div>
      <div className="admin-page-sub">Overview of your store</div>
      <div className="admin-stat-grid">
        <div className="admin-stat-card"><div className="admin-stat-label">Total Products</div><div className="admin-stat-value">{products.length}</div><div className="admin-stat-sub">{products.filter(p => p.visible).length} visible</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Categories</div><div className="admin-stat-value">{categories.length}</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Combos</div><div className="admin-stat-value">{combos.length}</div><div className="admin-stat-sub">{combos.filter(c => c.visible).length} visible</div></div>
        <div className="admin-stat-card"><div className="admin-stat-label">Stock Alerts</div><div className="admin-stat-value" style={{ color: out.length > 0 ? '#ef4444' : '#f59e0b' }}>{out.length + low.length}</div><div className="admin-stat-sub">{out.length} out, {low.length} low</div></div>
      </div>
      {(low.length > 0 || out.length > 0) && (
        <div className="admin-section">
          <div className="admin-section-head">Stock Alerts</div>
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Stock</th><th>Status</th></tr></thead>
            <tbody>{[...out, ...low].map(p => <tr key={p.id}><td>{p.name}</td><td>{p.stock}</td><td>{p.stock === 0 ? <span className="pill-out">Out of Stock</span> : <span className="pill-low">Low Stock</span>}</td></tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminProducts({ products, categories, onRefresh, toast }) {
  const blank = { name:'', description:'', price:'', stock:'', type:'perfume', emoji:'✨', tag:'', ml:'', sizes:'', image_url:'', visible:true, category_id:'' };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.name || !form.price) return toast('Name and price required', '⚠️', 'err');
    setSaving(true);
    try {
      const p = { ...form, price: Number(form.price), stock: Number(form.stock) || 0, category_id: form.category_id || null };
      if (editing) { await sb.from('products').update(p).eq('id', editing); toast('Updated', '✓'); }
      else { await sb.from('products').insert(p); toast('Product added', '✓'); }
      setForm(blank); setEditing(null); setShowForm(false); onRefresh();
    } catch { toast('Error saving', '✕', 'err'); }
    finally { setSaving(false); }
  };
  const del = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await sb.from('products').delete().eq('id', id);
    toast('Deleted', '🗑️'); onRefresh();
  };
  const startEdit = (p) => {
    setForm({ ...p, price: String(p.price), stock: String(p.stock), category_id: p.category_id || '' });
    setEditing(p.id); setShowForm(true); window.scrollTo(0, 0);
  };
  return (
    <div>
      <div className="admin-page-title">Products</div>
      <div className="admin-page-sub">Manage all products</div>
      <div className="admin-section">
        <div className="admin-section-head">
          {showForm ? (editing ? 'Edit Product' : 'Add Product') : 'All Products'}
          <button className="admin-btn admin-btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(blank); }}>{showForm ? 'Cancel' : <><PlusIcon /> Add Product</>}</button>
        </div>
        {showForm && (
          <div className="admin-form">
            <div className="admin-form-row">
              <div><label className="admin-label">Name</label><input className="admin-field" placeholder="e.g. Rose Noir" value={form.name} onChange={e => set('name', e.target.value)} /></div>
              <div><label className="admin-label">Price (₦)</label><input className="admin-field" type="number" placeholder="8500" value={form.price} onChange={e => set('price', e.target.value)} /></div>
            </div>
            <div><label className="admin-label">Description</label><textarea className="admin-field admin-textarea" placeholder="Brief description" value={form.description} onChange={e => set('description', e.target.value)} /></div>
            <div className="admin-form-row">
              <div><label className="admin-label">Type</label><select className="admin-field" value={form.type} onChange={e => set('type', e.target.value)}><option value="perfume">Perfume</option><option value="fashion">Fashion</option></select></div>
              <div><label className="admin-label">Category</label><select className="admin-field" value={form.category_id} onChange={e => set('category_id', e.target.value)}><option value="">No category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            </div>
            <div className="admin-form-row">
              <div><label className="admin-label">Stock</label><input className="admin-field" type="number" placeholder="10" value={form.stock} onChange={e => set('stock', e.target.value)} /></div>
              <div><label className="admin-label">Tag</label><select className="admin-field" value={form.tag} onChange={e => set('tag', e.target.value)}><option value="">None</option><option value="New">New</option><option value="Bestseller">Bestseller</option><option value="Limited">Limited</option><option value="Trending">Trending</option><option value="Sold Out">Sold Out</option></select></div>
            </div>
            <div className="admin-form-row">
              <div><label className="admin-label">ML / Size</label><input className="admin-field" placeholder="50ml" value={form.ml} onChange={e => set('ml', e.target.value)} /></div>
              <div><label className="admin-label">Sizes (Fashion)</label><input className="admin-field" placeholder="36-42" value={form.sizes} onChange={e => set('sizes', e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div><label className="admin-label">Emoji (fallback)</label><input className="admin-field" placeholder="🌹" value={form.emoji} onChange={e => set('emoji', e.target.value)} /></div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <label className="admin-label">Visible</label>
                <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:8 }}>
                  <Toggle on={form.visible} onToggle={() => set('visible', !form.visible)} />
                  <span style={{ color:'rgba(255,255,255,.5)', fontSize:13 }}>{form.visible ? 'Visible' : 'Hidden'}</span>
                </div>
              </div>
            </div>
            <ImgUpload value={form.image_url} onChange={v => set('image_url', v)} />
            <div style={{ display:'flex', gap:10 }}>
              <button className="admin-btn" onClick={save} disabled={saving}>{saving ? <div className="spinner" /> : editing ? 'Update' : 'Add Product'}</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(blank); }}>Cancel</button>
            </div>
          </div>
        )}
        {!showForm && (
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Type</th><th>Price</th><th>Stock</th><th>Visible</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td><div className="admin-thumb">{p.image_url ? <img src={p.image_url} alt={p.name} /> : p.emoji}</div></td>
                  <td>{p.name}</td><td style={{ textTransform:'capitalize' }}>{p.type}</td><td>{fmt(p.price)}</td>
                  <td><span className={p.stock === 0 ? 'pill-out' : p.stock <= 4 ? 'pill-low' : 'pill-ok'}>{p.stock}</span></td>
                  <td><Toggle on={p.visible} onToggle={async () => { await sb.from('products').update({ visible: !p.visible }).eq('id', p.id); onRefresh(); }} /></td>
                  <td><div className="admin-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => startEdit(p)}><EditIcon /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => del(p.id, p.name)}><TrashIcon /></button>
                  </div></td>
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={7} style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,.3)' }}>No products yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminCategories({ categories, onRefresh, toast }) {
  const blank = { name:'', type:'perfume', emoji:'✨' };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.name) return toast('Name required', '⚠️', 'err');
    setSaving(true);
    try {
      if (editing) { await sb.from('categories').update(form).eq('id', editing); toast('Updated', '✓'); }
      else { await sb.from('categories').insert(form); toast('Added', '✓'); }
      setForm(blank); setEditing(null); onRefresh();
    } catch { toast('Error', '✕', 'err'); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <div className="admin-page-title">Categories</div>
      <div className="admin-page-sub">Manage product categories</div>
      <div className="admin-section">
        <div className="admin-section-head">{editing ? 'Edit Category' : 'Add Category'}</div>
        <div className="admin-form">
          <div className="admin-form-row">
            <div><label className="admin-label">Name</label><input className="admin-field" placeholder="e.g. Oud Collection" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><label className="admin-label">Type</label><select className="admin-field" value={form.type} onChange={e => set('type', e.target.value)}><option value="perfume">Perfume</option><option value="fashion">Fashion</option></select></div>
          </div>
          <div><label className="admin-label">Emoji</label><input className="admin-field" placeholder="🌹" value={form.emoji} onChange={e => set('emoji', e.target.value)} style={{ width:120 }} /></div>
          <div style={{ display:'flex', gap:10 }}>
            <button className="admin-btn" onClick={save} disabled={saving}>{saving ? <div className="spinner" /> : editing ? 'Update' : 'Add'}</button>
            {editing && <button className="admin-btn admin-btn-ghost" onClick={() => { setForm(blank); setEditing(null); }}>Cancel</button>}
          </div>
        </div>
      </div>
      <div className="admin-section">
        <div className="admin-section-head">All Categories</div>
        <table className="admin-table">
          <thead><tr><th>Emoji</th><th>Name</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontSize:24 }}>{c.emoji}</td><td>{c.name}</td><td style={{ textTransform:'capitalize' }}>{c.type}</td>
                <td><div className="admin-actions">
                  <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setForm({ name:c.name, type:c.type, emoji:c.emoji }); setEditing(c.id); }}><EditIcon /></button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { if (!window.confirm(`Delete "${c.name}"?`)) return; await sb.from('categories').delete().eq('id', c.id); toast('Deleted', '🗑️'); onRefresh(); }}><TrashIcon /></button>
                </div></td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={4} style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,.3)' }}>No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCombos({ combos, onRefresh, toast }) {
  const blank = { name:'', description:'', price:'', original_price:'', emoji:'🎁', image_url:'', visible:true };
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.name || !form.price) return toast('Name and price required', '⚠️', 'err');
    setSaving(true);
    try {
      const p = { ...form, price: Number(form.price), original_price: Number(form.original_price) || 0 };
      if (editing) { await sb.from('combos').update(p).eq('id', editing); toast('Updated', '✓'); }
      else { await sb.from('combos').insert(p); toast('Combo added', '✓'); }
      setForm(blank); setEditing(null); setShowForm(false); onRefresh();
    } catch { toast('Error', '✕', 'err'); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <div className="admin-page-title">Combos</div>
      <div className="admin-page-sub">Create and manage bundle deals</div>
      <div className="admin-section">
        <div className="admin-section-head">
          {showForm ? (editing ? 'Edit Combo' : 'New Combo') : 'All Combos'}
          <button className="admin-btn admin-btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(blank); }}>{showForm ? 'Cancel' : <><PlusIcon /> Add Combo</>}</button>
        </div>
        {showForm && (
          <div className="admin-form">
            <div><label className="admin-label">Combo Name</label><input className="admin-field" placeholder="Night Collection Bundle" value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><label className="admin-label">Description</label><textarea className="admin-field admin-textarea" placeholder="What is included" value={form.description} onChange={e => set('description', e.target.value)} /></div>
            <div className="admin-form-row">
              <div><label className="admin-label">Combo Price (₦)</label><input className="admin-field" type="number" placeholder="15000" value={form.price} onChange={e => set('price', e.target.value)} /></div>
              <div><label className="admin-label">Original Price (₦)</label><input className="admin-field" type="number" placeholder="20000" value={form.original_price} onChange={e => set('original_price', e.target.value)} /></div>
            </div>
            <div className="admin-form-row">
              <div><label className="admin-label">Emoji</label><input className="admin-field" placeholder="🎁" value={form.emoji} onChange={e => set('emoji', e.target.value)} /></div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                <label className="admin-label">Visible</label>
                <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:8 }}>
                  <Toggle on={form.visible} onToggle={() => set('visible', !form.visible)} />
                  <span style={{ color:'rgba(255,255,255,.5)', fontSize:13 }}>{form.visible ? 'Visible' : 'Hidden'}</span>
                </div>
              </div>
            </div>
            <ImgUpload value={form.image_url} onChange={v => set('image_url', v)} label="Combo Image" />
            <div style={{ display:'flex', gap:10 }}>
              <button className="admin-btn" onClick={save} disabled={saving}>{saving ? <div className="spinner" /> : editing ? 'Update' : 'Add Combo'}</button>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setShowForm(false); setEditing(null); setForm(blank); }}>Cancel</button>
            </div>
          </div>
        )}
        {!showForm && (
          <table className="admin-table">
            <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Visible</th><th>Actions</th></tr></thead>
            <tbody>
              {combos.map(c => (
                <tr key={c.id}>
                  <td><div className="admin-thumb">{c.image_url ? <img src={c.image_url} alt={c.name} /> : c.emoji}</div></td>
                  <td>{c.name}</td><td>{fmt(c.price)}</td>
                  <td><Toggle on={c.visible} onToggle={async () => { await sb.from('combos').update({ visible: !c.visible }).eq('id', c.id); onRefresh(); }} /></td>
                  <td><div className="admin-actions">
                    <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => { setForm({ ...c, price:String(c.price), original_price:String(c.original_price) }); setEditing(c.id); setShowForm(true); }}><EditIcon /></button>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={async () => { if (!window.confirm(`Delete "${c.name}"?`)) return; await sb.from('combos').delete().eq('id', c.id); toast('Deleted', '🗑️'); onRefresh(); }}><TrashIcon /></button>
                  </div></td>
                </tr>
              ))}
              {combos.length === 0 && <tr><td colSpan={5} style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,.3)' }}>No combos yet.</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminStock({ products, onRefresh, toast }) {
  const [stocks, setStocks] = useState({});
  const [saving, setSaving] = useState(null);
  useEffect(() => { const s = {}; products.forEach(p => { s[p.id] = String(p.stock); }); setStocks(s); }, [products]);
  const update = async (id, name) => {
    setSaving(id);
    try { await sb.from('products').update({ stock: Number(stocks[id]) || 0 }).eq('id', id); toast(`${name} updated`, '✓'); onRefresh(); }
    catch { toast('Error', '✕', 'err'); }
    finally { setSaving(null); }
  };
  const Row = ({ p }) => (
    <tr>
      <td>{p.name}</td><td style={{ textTransform:'capitalize' }}>{p.type}</td>
      <td><span className={p.stock === 0 ? 'pill-out' : p.stock <= 4 ? 'pill-low' : 'pill-ok'}>{p.stock}</span></td>
      <td><div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input className="admin-field" type="number" style={{ width:80 }} value={stocks[p.id] ?? ''} onChange={e => setStocks(s => ({ ...s, [p.id]: e.target.value }))} />
        <button className="admin-btn admin-btn-sm" onClick={() => update(p.id, p.name)} disabled={saving === p.id}>{saving === p.id ? <div className="spinner" /> : 'Save'}</button>
      </div></td>
    </tr>
  );
  const alerts = products.filter(p => p.stock <= 4);
  const good = products.filter(p => p.stock > 4);
  return (
    <div>
      <div className="admin-page-title">Stock Management</div>
      <div className="admin-page-sub">Update product quantities</div>
      {alerts.length > 0 && <div className="admin-section"><div className="admin-section-head" style={{ color:'#f59e0b' }}>Needs Attention ({alerts.length})</div><table className="admin-table"><thead><tr><th>Product</th><th>Type</th><th>Status</th><th>Update</th></tr></thead><tbody>{alerts.map(p => <Row key={p.id} p={p} />)}</tbody></table></div>}
      <div className="admin-section"><div className="admin-section-head">All Products</div><table className="admin-table"><thead><tr><th>Product</th><th>Type</th><th>Status</th><th>Update</th></tr></thead><tbody>{good.map(p => <Row key={p.id} p={p} />)}{good.length === 0 && <tr><td colSpan={4} style={{ textAlign:'center', padding:32, color:'rgba(255,255,255,.3)' }}>All shown in alerts above.</td></tr>}</tbody></table></div>
    </div>
  );
}

function AdminSettings({ settings, onRefresh, toast }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (settings) setForm({ ...settings }); }, [settings]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(form)) {
        await sb.from('store_settings').upsert({ key, value: String(value) }, { onConflict: 'key' });
      }
      toast('Saved', '✓'); onRefresh();
    } catch { toast('Error', '✕', 'err'); }
    finally { setSaving(false); }
  };
  return (
    <div>
      <div className="admin-page-title">Store Settings</div>
      <div className="admin-page-sub">Update store information</div>
      <div className="admin-section">
        <div className="admin-section-head">Contact Details</div>
        <div className="admin-form">
          <div><label className="admin-label">WhatsApp (without +)</label><input className="admin-field" placeholder="2348119730367" value={form.whatsapp || ''} onChange={e => set('whatsapp', e.target.value)} /></div>
          <div><label className="admin-label">Instagram Handle</label><input className="admin-field" placeholder="@DebbiesSavvyCol_" value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} /></div>
        </div>
      </div>
      <div className="admin-section">
        <div className="admin-section-head">Homepage Stats</div>
        <div className="admin-form">
          <div className="admin-form-row">
            <div><label className="admin-label">Stat 1 Number</label><input className="admin-field" placeholder="500+" value={form.stat1_number || ''} onChange={e => set('stat1_number', e.target.value)} /></div>
            <div><label className="admin-label">Stat 1 Label</label><input className="admin-field" placeholder="Happy Customers" value={form.stat1_label || ''} onChange={e => set('stat1_label', e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-label">Stat 2 Number</label><input className="admin-field" placeholder="50+" value={form.stat2_number || ''} onChange={e => set('stat2_number', e.target.value)} /></div>
            <div><label className="admin-label">Stat 2 Label</label><input className="admin-field" placeholder="Products" value={form.stat2_label || ''} onChange={e => set('stat2_label', e.target.value)} /></div>
          </div>
          <div className="admin-form-row">
            <div><label className="admin-label">Stat 3 Emoji</label><input className="admin-field" placeholder="🚀" value={form.stat3_emoji || ''} onChange={e => set('stat3_emoji', e.target.value)} style={{ width:100 }} /></div>
            <div><label className="admin-label">Stat 3 Label</label><input className="admin-field" placeholder="Fast Delivery" value={form.stat3_label || ''} onChange={e => set('stat3_label', e.target.value)} /></div>
          </div>
        </div>
      </div>
      <div className="admin-section">
        <div className="admin-section-head">Category Images</div>
        <div className="admin-form">
          <ImgUpload value={form.cat_perfume_img || ''} onChange={v => set('cat_perfume_img', v)} label="Perfumes Category Image" />
          <ImgUpload value={form.cat_fashion_img || ''} onChange={v => set('cat_fashion_img', v)} label="Fashion Category Image" />
        </div>
      </div>
      <div className="admin-section">
        <div className="admin-section-head">Admin Password</div>
        <div><label className="admin-label">New Password</label><input className="admin-field" type="password" placeholder="Enter new password" value={form.admin_password || ''} onChange={e => set('admin_password', e.target.value)} /></div>
      </div>
      <button className="admin-btn" onClick={save} disabled={saving} style={{ marginTop:8 }}>{saving ? <div className="spinner" /> : 'Save All Settings'}</button>
    </div>
  );
}

function AdminPanel({ products, categories, combos, settings, onRefresh, onExit, toast }) {
  const [tab, setTab] = useState('dashboard');
  const tabs = [['dashboard','📊','Dashboard'],['products','🛍️','Products'],['categories','📂','Categories'],['combos','🎁','Combos'],['stock','📦','Stock'],['settings','⚙️','Settings']];
  return (
    <div className="admin-wrap">
      <div className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-brand">Debbie's <span>Savvy</span></div>
          <div className="admin-sidebar-sub">Admin Panel</div>
        </div>
        <nav className="admin-nav">
          {tabs.map(([key, icon, label]) => (
            <button key={key} className={`admin-nav-btn${tab === key ? ' active' : ''}`} onClick={() => setTab(key)}>
              <span className="admin-nav-icon">{icon}</span>{label}
            </button>
          ))}
        </nav>
        <button className="admin-exit" onClick={onExit}>← Exit to Site</button>
      </div>
      <div className="admin-main">
        {tab === 'dashboard' && <AdminDashboard products={products} categories={categories} combos={combos} />}
        {tab === 'products' && <AdminProducts products={products} categories={categories} onRefresh={onRefresh} toast={toast} />}
        {tab === 'categories' && <AdminCategories categories={categories} onRefresh={onRefresh} toast={toast} />}
        {tab === 'combos' && <AdminCombos combos={combos} onRefresh={onRefresh} toast={toast} />}
        {tab === 'stock' && <AdminStock products={products} onRefresh={onRefresh} toast={toast} />}
        {tab === 'settings' && <AdminSettings settings={settings} onRefresh={onRefresh} toast={toast} />}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [combos, setCombos] = useState([]);
  const [settings, setSettings] = useState({});
  const [dataLoading, setDataLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [loginPw, setLoginPw] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const { toasts, push: toast } = useToast();

  const fetchAll = useCallback(async () => {
    try {
      const [{ data: prods }, { data: cats }, { data: cms }, { data: stgs }] = await Promise.all([
        sb.from('products').select('*').order('created_at', { ascending: false }),
        sb.from('categories').select('*').order('name'),
        sb.from('combos').select('*').order('created_at', { ascending: false }),
        sb.from('store_settings').select('*'),
      ]);
      setProducts(prods || []);
      setCategories(cats || []);
      setCombos(cms || []);
      const s = {};
      (stgs || []).forEach(r => { s[r.key] = r.value; });
      setSettings(s);
    } catch (e) { console.error('Fetch error:', e); }
    finally { setDataLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };
  const openAdmin = () => setShowLogin(true);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const changeQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const wa = settings.whatsapp || '2348119730367';
  const ig = settings.instagram || '@DebbiesSavvyCol_';

  const handleLogin = () => {
    if (loginPw === (settings.admin_password || 'debbydevkey2026')) {
      setAdminMode(true); setShowLogin(false); setLoginPw(''); setLoginErr('');
    } else { setLoginErr('Incorrect password.'); }
  };

  if (adminMode) return (
    <>
      <style>{css}</style>
      <ToastBox toasts={toasts} />
      <AdminPanel products={products} categories={categories} combos={combos} settings={settings} onRefresh={fetchAll} onExit={() => setAdminMode(false)} toast={toast} />
    </>
  );

  const visibleCombos = combos.filter(c => c.visible !== false);

  return (
    <div>
      <style>{css}</style>
      <ToastBox toasts={toasts} />

      {showLogin && (
        <div className="admin-login-overlay" onClick={e => e.target === e.currentTarget && setShowLogin(false)}>
          <div className="admin-login-box">
            <div className="admin-login-logo">Debbie's <span>Admin</span></div>
            <div className="admin-login-sub">Authorized Access Only</div>
            <input className="admin-input" type="password" placeholder="Enter admin password" value={loginPw} onChange={e => setLoginPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} autoFocus />
            {loginErr && <div className="admin-error">{loginErr}</div>}
            <button className="admin-submit" style={{ marginTop: loginErr ? 12 : 0 }} onClick={handleLogin}>Enter</button>
            <button className="admin-cancel" onClick={() => { setShowLogin(false); setLoginPw(''); setLoginErr(''); }}>Cancel</button>
          </div>
        </div>
      )}

      <nav className="nav">
        <button className="nav-logo" onClick={() => nav('home')}>Debbie's <span>Savvy Collection</span></button>
        <div className="nav-links">
          {[['home','Home'],['perfumes','Perfumes'],['fashion','Fashion'],['combos','Combos'],['contact','Contact']].map(([p,l]) => (
            <button key={p} className={`nav-btn${page === p ? ' active' : ''}`} onClick={() => nav(p)}>{l}</button>
          ))}
          <button className="nav-cart-btn" onClick={() => nav('cart')}>🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
        </div>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(o => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        {[['home','Home'],['perfumes','Perfumes'],['fashion','Fashion'],['combos','Combos'],['contact','Contact']].map(([p,l]) => (
          <button key={p} className={`mobile-nav-btn${page === p ? ' active' : ''}`} onClick={() => nav(p)}>{l}</button>
        ))}
        <button className="mobile-cart-btn" onClick={() => nav('cart')}>🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}</button>
      </div>

      <button className="wa-float" onClick={() => window.open(`https://wa.me/${wa}`, '_blank')}><WAIcon /></button>

      {page === 'home' && (
        <div className="page-anim">
          <section className="hero">
            <div className="hero-bg" />
            <div className="hero-bg-text">Savvy</div>
            <div className="hero-content">
              <div className="hero-tag">Premium Quality</div>
              <h1 className="hero-title">Your Scent.<br /><em>Your Style.</em></h1>
              <div className="hero-brand">Debbie's Savvy Collection</div>
              <p className="hero-sub">Premium fragrances, crocs, totes, handbags and more. Delivered to your door with love.</p>
              <div className="hero-btns">
                <button className="btn-dark" onClick={() => nav('perfumes')}>Shop Perfumes</button>
                <button className="btn-ghost" onClick={() => nav('fashion')}>Shop Fashion</button>
              </div>
            </div>
            <div className="hero-pills">
              <div className="hero-pill"><div className="hero-pill-icon">🌹</div><div><div className="hero-pill-text">Perfumes</div><div className="hero-pill-sub">Premium Scents</div></div></div>
              <div className="hero-pill"><div className="hero-pill-icon">👜</div><div><div className="hero-pill-text">Totes and Bags</div><div className="hero-pill-sub">Luxury Carry</div></div></div>
              <div className="hero-pill"><div className="hero-pill-icon">🥿</div><div><div className="hero-pill-text">Crocs and Slippers</div><div className="hero-pill-sub">Comfort First</div></div></div>
            </div>
          </section>

          <div className="marquee-wrap">
            <div className="marquee-track">
              {[...Array(2)].map((_, ri) => ['PERFUMES','CROCS','TOTES','HANDBAGS','GLASSES','PALM SLIPPERS','DELIVERY AVAILABLE'].map((t, i) => (
                <div key={`${ri}-${i}`} className="marquee-item">{t} <span>✦</span></div>
              )))}
            </div>
          </div>

          <section className="section">
            <p className="section-label">✦ Collections</p>
            <h2 className="section-title">What We Offer</h2>
            <div className="cat-grid">
             <div className="cat-card cat-perfume" onClick={() => nav('perfumes')}><div className="cat-bg" style={settings.cat_perfume_img ? {backgroundImage:`url(${settings.cat_perfume_img})`,backgroundSize:'cover',backgroundPosition:'center'} : {}} /><div className="cat-overlay"><div className="cat-icon">🌸</div><div className="cat-name">Perfumes</div><div className="cat-desc">Exclusive Fragrances</div><button className="cat-cta">Shop Now</button></div></div>
             <div className="cat-card cat-fashion" onClick={() => nav('fashion')}><div className="cat-bg" style={settings.cat_fashion_img ? {backgroundImage:`url(${settings.cat_fashion_img})`,backgroundSize:'cover',backgroundPosition:'center'} : {}} /><div className="cat-overlay"><div className="cat-icon">👜</div><div className="cat-name">Fashion</div><div className="cat-desc">Bags, Crocs, Glasses and More</div><button className="cat-cta">Shop Now</button></div></div>
            </div>
          </section>

          {visibleCombos.length > 0 && (
            <section className="section" style={{ background:'#F7EFE5', paddingTop:70 }}>
              <p className="section-label">✦ Bundle Deals</p>
              <h2 className="section-title">Scent Combos</h2>
              <div className="combo-grid">
                {visibleCombos.slice(0, 3).map(c => {
                  const save = c.original_price > c.price ? Math.round(((c.original_price - c.price) / c.original_price) * 100) : 0;
                  return (
                    <div key={c.id} className="combo-card" onClick={() => nav('combos')}>
                      <div className="combo-img">{c.image_url ? <img src={c.image_url} alt={c.name} /> : <span>{c.emoji}</span>}</div>
                      <div className="combo-info"><div className="combo-name">{c.name}</div><div className="combo-desc">{c.description}</div><div className="combo-pricing"><span className="combo-price">{fmt(c.price)}</span>{c.original_price > c.price && <span className="combo-original">{fmt(c.original_price)}</span>}{save > 0 && <span className="combo-save">Save {save}%</span>}</div></div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {!dataLoading && (
            <section className="about-strip">
              <div className="strip-text">
                <p className="strip-tag">✦ About Us</p>
                <h3 className="strip-title">Quality You Can Smell and Feel.</h3>
                <p className="strip-body">Debbie's Savvy Collection brings you premium perfumes and fashion pieces at accessible prices. Every product is handpicked for quality, style, and value.</p>
              </div>
              <div className="strip-stat"><div className="stat-num">{settings.stat1_number || '500+'}</div><div className="stat-label">{settings.stat1_label || 'Happy Customers'}</div></div>
              <div className="strip-stat"><div className="stat-num">{settings.stat2_number || '50+'}</div><div className="stat-label">{settings.stat2_label || 'Products'}</div></div>
              <div className="strip-stat"><div className="stat-num">{settings.stat3_emoji || '🚀'}</div><div className="stat-label">{settings.stat3_label || 'Fast Delivery'}</div></div>
            </section>
          )}

          <Footer nav={nav} settings={settings} onShield={openAdmin} />
        </div>
      )}

      {page === 'perfumes' && <ProductsPage type="perfume" products={products} cart={cart} onAdd={addToCart} toast={toast} nav={nav} settings={settings} onShield={openAdmin} />}
      {page === 'fashion' && <ProductsPage type="fashion" products={products} cart={cart} onAdd={addToCart} toast={toast} nav={nav} settings={settings} onShield={openAdmin} />}
      {page === 'combos' && <CombosPage combos={combos} nav={nav} settings={settings} onShield={openAdmin} />}

      {page === 'cart' && (
        <div className="page-anim cart-page">
          <p className="section-label" style={{ textAlign:'left' }}>✦ Your Order</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,6vw,52px)', color:'var(--deep)', marginBottom:8 }}>Shopping <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Cart</em></h1>
          <p style={{ color:'var(--muted)', marginBottom:40, fontSize:14 }}>Review your items, then order via WhatsApp in one tap.</p>
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Browse our collections and add items you love</p>
              <div className="cart-btns">
                <button className="btn-dark" onClick={() => nav('perfumes')}>Shop Perfumes</button>
                <button className="btn-ghost" onClick={() => nav('fashion')}>Shop Fashion</button>
              </div>
            </div>
          ) : (
            <>
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  {item.image_url ? <img src={item.image_url} alt={item.name} className="cart-item-thumb" /> : <div className="cart-item-emoji">{item.emoji}</div>}
                  <div className="cart-item-info"><div className="cart-item-name">{item.name}</div><div className="cart-item-price">{fmt(item.price)} each</div></div>
                  <div className="cart-qty">
                    <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>-</button>
                    <span className="qty-num">{item.qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                  <div style={{ fontWeight:700, minWidth:90, textAlign:'right', color:'var(--deep)', flexShrink:0 }}>{fmt(item.price * item.qty)}</div>
                  <button className="remove-btn" onClick={() => { changeQty(item.id, -item.qty); toast(`${item.name} removed`, '✕'); }}>×</button>
                </div>
              ))}
              <div className="cart-summary">
                <div className="cart-total-row"><span className="cart-total-label">Total ({cartCount} item{cartCount > 1 ? 's' : ''})</span><span className="cart-total-amt">{fmt(cartTotal)}</span></div>
                <p className="cart-note">Final price confirmed upon order. Delivery fee may apply.</p>
                <button className="wa-order-btn" onClick={() => window.open(buildWAMsg(cart, wa), '_blank')}><WAIcon /> Order via WhatsApp</button>
              </div>
            </>
          )}
        </div>
      )}

      {page === 'contact' && (
        <div className="page-anim">
          <div className="contact-page">
            <p className="section-label" style={{ textAlign:'left' }}>✦ Reach Us</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(36px,6vw,52px)', color:'var(--deep)', marginBottom:8 }}>Say Hello.</h1>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:19, color:'var(--muted)', marginBottom:40 }}>We are always happy to hear from you. Orders, questions, or just a hello.</p>
            {[['📍','Location','Benin City, Edo State, Nigeria'],['📱','WhatsApp',`+${wa}`],['📸','Instagram',ig],['🚚','Delivery','Available — Ask us for details'],['⏰','Response Time','Usually within 1 hour']].map(([icon,label,val]) => (
              <div key={label} className="contact-info-card"><span className="c-icon">{icon}</span><div><div className="c-label">{label}</div><div className="c-val">{val}</div></div></div>
            ))}
            <button className="wa-big-btn" onClick={() => window.open(`https://wa.me/${wa}`, '_blank')}><WAIcon /> Chat With Us on WhatsApp</button>
            <button className="ig-btn" onClick={() => window.open(`https://instagram.com/${ig.replace('@','')}`, '_blank')}>📸 Follow us on Instagram — {ig}</button>
          </div>
          <Footer nav={nav} settings={settings} onShield={openAdmin} />
        </div>
      )}
    </div>
  );
}