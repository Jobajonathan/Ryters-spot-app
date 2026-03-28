'use client'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

export default function WhatsAppWidget() {
  if (!WA_NUMBER) return null
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to find out more about Ryters Spot services.")}`
  return (
    <>
      <style>{`
        .wa-wrap {
          position: fixed; bottom: 24px; right: 24px; z-index: 9000;
          display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
        }
        .wa-tooltip {
          background: #1B4332; color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          padding: 0.45rem 0.85rem; border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.2);
          white-space: nowrap; opacity: 0; transform: translateY(4px);
          transition: opacity 0.2s, transform 0.2s; pointer-events: none;
        }
        .wa-wrap:hover .wa-tooltip { opacity: 1; transform: translateY(0); }
        .wa-btn {
          width: 56px; height: 56px; border-radius: 50%;
          background: #25D366; color: #fff;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 20px rgba(37,211,102,0.5);
          text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;
        }
        .wa-btn:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37,211,102,0.6); }
        @media print { .wa-wrap { display: none; } }
      `}</style>
      <div className="wa-wrap">
        <div className="wa-tooltip">Chat with us on WhatsApp</div>
        <a href={url} target="_blank" rel="noopener noreferrer" className="wa-btn" aria-label="Chat on WhatsApp">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.676 4.61 1.847 6.5L4 29l7.727-1.827A12.944 12.944 0 0016 28c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22a10.94 10.94 0 01-5.6-1.54l-.4-.24-4.133.977.994-3.914-.26-.4A10.94 10.94 0 015 15c0-6.065 4.935-11 11-11s11 4.935 11 11-4.935 11-11 11zm6.07-8.14c-.333-.167-1.967-.97-2.27-1.08-.303-.11-.524-.167-.745.167-.22.333-.854 1.08-1.047 1.3-.193.22-.387.247-.72.083-.333-.167-1.407-.517-2.68-1.647-.99-.88-1.66-1.967-1.853-2.3-.193-.333-.02-.513.145-.68.149-.148.333-.387.5-.58.167-.193.22-.333.333-.553.112-.22.056-.413-.028-.58-.083-.167-.745-1.793-1.02-2.457-.27-.643-.543-.557-.745-.567-.193-.007-.414-.01-.634-.01-.22 0-.58.083-.883.413-.303.333-1.16 1.133-1.16 2.76 0 1.627 1.187 3.2 1.353 3.42.167.22 2.337 3.567 5.66 5 .793.34 1.413.543 1.893.697.795.252 1.52.217 2.093.132.637-.093 1.967-.803 2.243-1.58.277-.777.277-1.443.193-1.58-.083-.137-.303-.22-.637-.387z"/>
          </svg>
        </a>
      </div>
    </>
  )
}
