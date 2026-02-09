// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight, Image as ImageIcon, CheckCircle2, X, Info, Calendar as CalendarIcon, Search, AlertCircle, Loader2, Download, Send } from 'lucide-react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { clientsApi, invoicesApi, estimatesApi, getTenantId, tenantApi, ClientData, InvoiceData, InvoiceItemData } from '../api';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { addImageToPdfMultiPage } from '../utils/pdfHelpers';

const THEME_COLORS = [
  { id: 'purple', value: '#6d28d9' },
  { id: 'red', value: '#dc2626' },
  { id: 'blue', value: '#0075dd' },
  { id: 'green', value: '#00a651' },
  { id: 'gray', value: '#4b5563' },
  { id: 'gradient', value: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)' },
];

const FONTS = [
  { id: 'Modern', value: 'Inter, sans-serif' },
  { id: 'Classic', value: 'Georgia, serif' },
];

// To use your own template images: add classic.png, modern.png, simple.png under public/templates/
// then set preview to '/templates/classic.png', '/templates/modern.png', '/templates/simple.png'
const TEMPLATES = [
  { id: 'Classic', label: 'Classic', preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi5JfQo76F8meoJCcn4DRJfC2Dg-4qMsiOVJElMKKjEO6wpCEHFZZi4gBVSqxQC4TRcpOMYJztFVQVMV6UesABEFTy7VgfpLiQ4iEtcfIQ6MP_9bKljvZVhk-MUkjrpwYF1hZiw3_qxkyVeU9ZPWrHaH5mcpJNYEEF0cKfnZAt_WZgGvVfxEJJ2gppV_pTMx9Pn3kIp2c8W02rvgw2Xj8LR4AdWFustOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN' },
  { id: 'Modern', label: 'Modern', preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtFRYrPNjBU-3qjeXLMZotapgtSrqPcItiAlRM7TKXaikAtOjZOey-eGkv7zHHAjBovuOOHmi3bmcmGrho0rkV3yL3JF4aE-eCJC97tgeN35HqGuA8udNc6NNnXtzg4OX7fsEq-FpK22Rka2aYccVijTq_1yuITy_5vdwjTNehTkhi-9zScH3-mAPVBAhNEwI74nLapGDr4b2ddjkhR-CbnkbthByOWGcOrkmEauwsBjf7rdQ-O2tKzcYs5axR7e5e5bc1tpOAxYrS' },
  { id: 'Simple', label: 'Simple', preview: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjUO2o_XfUlegnw4vREfRr_1SQzNK67ExMyBjPAGw6XeuaBtEvdFU6T-tExj3jJ4DK72-iLLYSWEeTpivDxV65dlEie951buEEW1-s23-3EIR0cFbPvKRez2UFphIF4zYad1bejrOctDryoR2rwlVDRQSZDtr5SLmSUh906P8eJpcS29HhkgNNN' }
];

export default function InvoiceCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { tenant } = useAuth();
  
  const isNew = location.pathname.includes('new');
  const isEstimate = location.pathname.includes('estimate') || location.pathname.includes('estimates');
  const documentType = isEstimate ? 'Estimate' : 'Invoice';
  
  // Customization State
  const [template, setTemplate] = useState('Classic');
  const [themeColor, setThemeColor] = useState(THEME_COLORS[2].value);
  const [fontFamily, setFontFamily] = useState(FONTS[0].value);

  // Document State
  const [docNumber, setDocNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [client, setClient] = useState<ClientData | null>(null); 
  const [clients, setClients] = useState<ClientData[]>([]);
  const [items, setItems] = useState<InvoiceItemData[]>([{ id: '1', name: '', description: '', rate: 0, qty: 1, tax: 0 }]);
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState('');
  const [discount, setDiscount] = useState(0);

  // Loading & Error
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modals / UI
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [activeTaxItem, setActiveTaxItem] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Logo upload & crop
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [showLogoCropModal, setShowLogoCropModal] = useState(false);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [cropDragStart, setCropDragStart] = useState<{ startX: number; startY: number; offsetX: number; offsetY: number } | null>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const logoCanvasRef = useRef<HTMLCanvasElement>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);
  const documentPreviewRef = useRef<HTMLDivElement>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sendToEmail, setSendToEmail] = useState('');
  const [attachPdf, setAttachPdf] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Business Info (from tenant when logged in)
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    phone: '',
    country: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postal: '',
    showPhone: true,
    showAddress: true
  });

  const clientDropdownRef = useRef(null);
  const LOGO_W = 176;
  const LOGO_H = 112;

  const handleLogoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropSource(reader.result as string);
      setCropZoom(1);
      setCropOffset({ x: 0, y: 0 });
      setShowLogoCropModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const drawCropPreview = () => {
    if (!cropSource || !logoImageRef.current || !logoCanvasRef.current) return;
    const img = logoImageRef.current;
    if (!img.complete) return;
    const canvas = logoCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = LOGO_W;
    canvas.height = LOGO_H;
    ctx.clearRect(0, 0, LOGO_W, LOGO_H);
    const scale = cropZoom;
    ctx.drawImage(img, -cropOffset.x, -cropOffset.y, img.naturalWidth * scale, img.naturalHeight * scale);
  };

  useEffect(() => {
    if (showLogoCropModal && cropSource) drawCropPreview();
  }, [showLogoCropModal, cropSource, cropZoom, cropOffset]);

  const applyLogoCrop = async () => {
    if (!logoCanvasRef.current) return;
    const dataUrl = logoCanvasRef.current.toDataURL('image/png');
    setLogoUrl(dataUrl);
    const res = await tenantApi.updateLogo(dataUrl);
    if (res.success) {
      const tid = getTenantId();
      if (tid) try { localStorage.setItem('bookflow_tenant_logo_' + tid, dataUrl); } catch (_) {}
    }
    setShowLogoCropModal(false);
    setCropSource(null);
  };

  const getCropMaxOffset = () => {
    const img = logoImageRef.current;
    if (!img || !img.complete) return { maxX: 0, maxY: 0 };
    const scaledW = img.naturalWidth * cropZoom;
    const scaledH = img.naturalHeight * cropZoom;
    return {
      maxX: Math.max(0, scaledW - LOGO_W),
      maxY: Math.max(0, scaledH - LOGO_H),
    };
  };

  const handleCropMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setCropDragStart({ startX: e.clientX, startY: e.clientY, offsetX: cropOffset.x, offsetY: cropOffset.y });
  };
  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (cropDragStart == null) return;
    const deltaX = e.clientX - cropDragStart.startX;
    const deltaY = e.clientY - cropDragStart.startY;
    const { maxX, maxY } = getCropMaxOffset();
    const newX = Math.max(0, Math.min(maxX, cropDragStart.offsetX - deltaX));
    const newY = Math.max(0, Math.min(maxY, cropDragStart.offsetY - deltaY));
    setCropOffset({ x: newX, y: newY });
  };
  const handleCropMouseUp = () => setCropDragStart(null);

  useEffect(() => {
    if (!cropDragStart) return;
    const onMove = (e: MouseEvent) => {
      const deltaX = e.clientX - cropDragStart.startX;
      const deltaY = e.clientY - cropDragStart.startY;
      const img = logoImageRef.current;
      if (!img || !img.complete) return;
      const scaledW = img.naturalWidth * cropZoom;
      const scaledH = img.naturalHeight * cropZoom;
      const maxX = Math.max(0, scaledW - LOGO_W);
      const maxY = Math.max(0, scaledH - LOGO_H);
      const newX = Math.max(0, Math.min(maxX, cropDragStart.offsetX - deltaX));
      const newY = Math.max(0, Math.min(maxY, cropDragStart.offsetY - deltaY));
      setCropOffset({ x: newX, y: newY });
    };
    const onUp = () => setCropDragStart(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [cropDragStart, cropZoom]);

  const handleDownloadPdf = async () => {
    if (!documentPreviewRef.current) return;
    setIsExportingPdf(true);
    const el = documentPreviewRef.current;
    const origWidth = el.style.width;
    const origOverflow = el.style.overflow;
    try {
      el.classList.add('pdf-export-mode');
      const captureWidth = Math.max(el.scrollWidth, 850);
      el.style.width = `${captureWidth}px`;
      el.style.overflow = 'visible';
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
      el.style.width = origWidth;
      el.style.overflow = origOverflow;
      el.classList.remove('pdf-export-mode');
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      addImageToPdfMultiPage(pdf, imgData, canvas.width, canvas.height);
      pdf.save(`${documentType}-${docNumber || 'draft'}.pdf`);
    } catch (e) {
      el.style.width = origWidth;
      el.style.overflow = origOverflow;
      el.classList.remove('pdf-export-mode');
      setError('Failed to generate PDF.');
    }
    setIsExportingPdf(false);
  };

  const handleSendEmail = async () => {
    const to = sendToEmail.trim();
    if (!to) { setError('Enter recipient email.'); return; }
    const emailErr = (await import('../utils/validation')).getEmailError(to);
    if (emailErr) { setError(emailErr); return; }
    const docId = id;
    if (!docId) { setError('Save the document first, then send.'); return; }
    setIsSendingEmail(true);
    setError(null);
    let pdfBase64: string | undefined;
    if (attachPdf && documentPreviewRef.current) {
      const el = documentPreviewRef.current;
      const origW = el.style.width;
      const origO = el.style.overflow;
      try {
        el.classList.add('pdf-export-mode');
        el.style.width = `${Math.max(el.scrollWidth, 850)}px`;
        el.style.overflow = 'visible';
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
        el.style.width = origW;
        el.style.overflow = origO;
        el.classList.remove('pdf-export-mode');
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        addImageToPdfMultiPage(pdf, imgData, canvas.width, canvas.height);
        const dataUrl = pdf.output('dataurlstring') || pdf.output('datauristring') || '';
        pdfBase64 = (dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl) || '';
      } catch (_) {
        el.style.width = origW;
        el.style.overflow = origO;
        el.classList.remove('pdf-export-mode');
      }
    }
    const api = isEstimate ? estimatesApi : invoicesApi;
    const sendRes = await api.sendEmail(docId, to, { attachPdf: !!pdfBase64, pdfBase64 });
    if (sendRes?.success) {
      setShowSendModal(false);
      setSendToEmail('');
      setShowToast(true);
    } else {
      setError(sendRes?.error || 'Failed to send email.');
    }
    setIsSendingEmail(false);
  };

  const TOAST_DURATION_MS = 4000;

  useEffect(() => {
    if (tenant) {
      setBusinessInfo(prev => ({
        ...prev,
        name: tenant.name || prev.name || 'Company',
        phone: tenant.phone || prev.phone || '',
        country: tenant.country || tenant.address || prev.country || '',
      }));
    }
  }, [tenant]);

  // Load logo from DB (syncs across devices); fallback to localStorage for older data
  useEffect(() => {
    let cancelled = false;
    const loadLogo = async () => {
      if (tenant?.logo) {
        setLogoUrl(tenant.logo);
        return;
      }
      const res = await tenantApi.getLogo();
      if (cancelled) return;
      if (res.success && res.data?.logo) {
        setLogoUrl(res.data.logo);
        return;
      }
      const tid = getTenantId();
      if (tid) {
        try {
          const saved = localStorage.getItem('bookflow_tenant_logo_' + tid);
          if (saved) setLogoUrl(saved);
        } catch (_) {}
      }
    };
    loadLogo();
    return () => { cancelled = true; };
  }, [tenant?.id, tenant?.logo]);

  useEffect(() => {
    loadInitialData();
  }, [id, isNew]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), TOAST_DURATION_MS);
    return () => clearTimeout(t);
  }, [showToast]);

  const loadInitialData = async () => {
    setIsLoading(true);
    
    // Load clients
    const clientsResponse = await clientsApi.getAll();
    if (clientsResponse.success && clientsResponse.data) {
      setClients(clientsResponse.data);
    }

    if (isNew) {
      // Get next document number
      const api = isEstimate ? estimatesApi : invoicesApi;
      const numberResponse = await api.getNextNumber();
      if (numberResponse.success && numberResponse.data) {
        setDocNumber(numberResponse.data.number);
      }
    } else if (id) {
      // Load existing document
      const api = isEstimate ? estimatesApi : invoicesApi;
      const docResponse = await api.getById(id);
      if (docResponse.success && docResponse.data) {
        const doc = docResponse.data;
        setDocNumber(doc.number || '');
        setIssueDate(doc.date || new Date().toISOString().split('T')[0]);
        setItems(doc.items || [{ id: '1', name: '', description: '', rate: 0, qty: 1, tax: 0 }]);
        setNotes(doc.notes || '');
        setTerms(doc.terms || '');
        setReference(doc.reference || '');
        setDiscount(doc.discount || 0);
        
        // Find matching client
        if (doc.client_id && clientsResponse.data) {
          const matchedClient = clientsResponse.data.find(c => c.id === doc.client_id);
          if (matchedClient) setClient(matchedClient);
        }
      }
    }

    // Handle click outside
    const handleClickOutside = (e: MouseEvent) => {
        if (clientDropdownRef.current && !clientDropdownRef.current.contains(e.target)) {
            setShowClientDropdown(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    
    setIsLoading(false);
    
    return () => document.removeEventListener("mousedown", handleClickOutside);
  };

  const subtotal = items.reduce((acc, item) => acc + ((item.rate || 0) * (item.qty || 1)), 0);
  const totalTax = items.reduce((acc, item) => acc + (((item.rate || 0) * (item.qty || 1)) * ((item.tax || 0) / 100)), 0);
  const discountAmount = (subtotal * (discount / 100));
  const total = subtotal + totalTax - discountAmount;

  const handleSave = async (status: string = 'Draft') => {
    if (!client) {
      setError(`Please select a client before saving the ${documentType.toLowerCase()}.`);
      return;
    }
    const validItems = items.filter(i => (i.name && i.name.trim()) || (i.rate != null && Number(i.rate) > 0));
    if (validItems.length === 0) {
      setError(`Add at least one line item with a name or rate before saving.`);
      return;
    }

    setIsSaving(true);
    setError(null);

    const docData = {
      client_id: client.id,
      number: docNumber,
      date: issueDate,
      items: items.filter(i => i.name || i.rate), // Filter empty items
      notes,
      terms,
      reference,
      discount,
      status
    };

    const api = isEstimate ? estimatesApi : invoicesApi;
    let response;

    if (id && !isNew) {
      response = await api.update(id, docData);
    } else {
      response = await api.create(docData);
    }

    if (response.success) {
      setShowToast(true);
      setTimeout(() => navigate(isEstimate ? '/estimates' : '/invoices'), 1000);
    } else {
      setError(response.error || `Failed to save ${documentType.toLowerCase()}`);
    }

    setIsSaving(false);
  };

  const handleCreateClient = async (newClientData: any) => {
    const response = await clientsApi.create({
      company: newClientData.company,
      first_name: newClientData.firstName || '',
      last_name: newClientData.lastName || '',
      email: newClientData.email || ''
    });

    if (response.success && response.data) {
      setClients([response.data, ...clients]);
      setClient(response.data);
      setShowNewClientModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#0075dd]" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7f9] -m-10 p-10 transition-all duration-500" style={{ fontFamily }}>
        {showToast && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] min-w-[280px] bg-fb-slate text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ring-2 ring-black/10">
                <CheckCircle2 className="text-fb-green mr-2" size={16} />
                <span className="text-sm font-bold">{documentType} saved successfully</span>
            </div>
        )}

        <div className="max-w-[1280px] mx-auto flex gap-16 items-start">
            <div className="flex-1 min-w-0 flex-shrink-0 max-w-[900px]">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-black text-fb-navy tracking-tight">{isNew ? `New ${documentType}` : `Edit ${documentType}`}</h2>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-sm font-bold text-fb-navy hover:underline px-4">Cancel</button>
                        <button onClick={handleDownloadPdf} disabled={isExportingPdf} className="text-sm font-bold text-fb-navy hover:bg-gray-100 px-4 py-2.5 rounded-lg border border-gray-200 flex items-center gap-2 disabled:opacity-50">
                            <Download size={18} /> {isExportingPdf ? 'Generating...' : 'Save as PDF'}
                        </button>
                        <button onClick={() => handleSave('Draft')} disabled={isSaving} className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md transition-all text-base disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button onClick={() => { setSendToEmail(client?.email || ''); setShowSendModal(true); setError(null); }} disabled={!client} className="bg-fb-green hover:bg-fb-darkGreen text-white px-8 py-2.5 rounded-lg font-black shadow-md transition-all text-base disabled:opacity-50 flex items-center gap-2">
                            <Send size={18} /> Send To...
                        </button>
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                        <p className="text-red-700 text-sm">{error}</p>
                        <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><X size={18} /></button>
                    </div>
                )}

                {/* Document Canvas (ref for PDF export).
                    - Elements with .no-pdf are hidden in PDF.
                    - Elements with .pdf-only are shown only in PDF (read-only text mirrors). */}
                <style>{`
                  .pdf-export-mode .no-pdf { display: none !important; }
                  .pdf-only { display: none !important; }
                  .pdf-export-mode .pdf-only { display: block !important; }
                `}</style>
                <div ref={documentPreviewRef} className={`bg-white rounded-lg shadow-xl border border-gray-200 overflow-visible relative min-h-[1000px] min-w-[800px] transition-all duration-500 ${template === 'Modern' ? 'pt-0' : 'p-16'}`}>
                    
                    {/* Modern Template Header */}
                    {template === 'Modern' && (
                        <div style={{ background: themeColor }} className="h-48 text-white p-16 flex justify-between items-end relative overflow-hidden">
                             <div className="z-10 flex-1">
                                <h3 className="text-4xl font-black mb-1">{businessInfo.name}</h3>
                                <p className="text-sm opacity-80 font-bold">{businessInfo.phone} • {businessInfo.country}</p>
                             </div>
                             <div className="z-10 no-pdf">
                                <button onClick={() => setShowBusinessModal(true)} className="text-xs font-black uppercase tracking-widest border border-white/30 px-4 py-2 rounded-lg hover:bg-white/10 transition-all">Edit Business Info</button>
                             </div>
                             <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 skew-x-[-20deg] translate-x-20"></div>
                        </div>
                    )}

                    <div className={`${template === 'Modern' ? 'px-16 py-12' : ''}`}>
                        {/* Classic/Simple Branding */}
                        {template !== 'Modern' && (
                            <div className={`flex ${template === 'Classic' ? 'justify-between' : 'flex-col'} items-start mb-16`}>
                                <div className="space-y-1">
                                    <h3 className="font-black text-fb-navy text-xl uppercase tracking-tighter">{businessInfo.name}</h3>
                                    <p className="text-gray-400 text-sm font-medium">{businessInfo.country}</p>
                                    <p className="text-gray-400 text-sm font-medium">{businessInfo.phone}</p>
                                    <button type="button" onClick={() => setShowBusinessModal(true)} className="no-pdf text-[11px] font-black text-fb-blue hover:underline uppercase tracking-widest mt-2">Edit Business Info</button>
                                </div>
                                <div className="w-44 h-28 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-300 overflow-hidden relative flex-shrink-0">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain pointer-events-none" />
                                    ) : null}
                                    <div className={`no-pdf absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-colors group ${logoUrl ? 'bg-transparent' : 'bg-white/80 hover:bg-gray-50/90'}`} onClick={() => logoFileInputRef.current?.click()}>
                                        {!logoUrl && (
                                            <>
                                                <ImageIcon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                                <p className="text-[9px] font-black uppercase tracking-widest text-center px-4">Upload Logo</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <input type="file" accept="image/*" className="hidden" ref={logoFileInputRef} onChange={handleLogoFileSelect} />
                            </div>
                        )}

                        {/* Prepared For & Meta */}
                        <div className="grid grid-cols-2 gap-20 mb-16">
                            <div className="relative" ref={clientDropdownRef}>
                                <label className="text-[10px] font-black text-red-500 uppercase block mb-4 tracking-[0.25em] no-pdf">Prepared For *</label>
                                {client ? (
                                    <div className="p-5 border border-blue-100 bg-blue-50/20 rounded-2xl group relative transition-all hover:border-fb-blue">
                                        <p className="font-black text-fb-navy text-2xl tracking-tighter mb-1">{client.company}</p>
                                        <p className="text-sm text-gray-500 font-bold">{client.name}</p>
                                        <button type="button" onClick={() => setClient(null)} className="no-pdf absolute top-4 right-4 text-gray-300 hover:text-red-500"><X size={18} /></button>
                                        <button type="button" onClick={() => setShowClientDropdown(true)} className="no-pdf text-[10px] text-fb-blue font-black hover:underline mt-6 uppercase tracking-widest block">Change Client</button>
                                    </div>
                                ) : (
                                    <div className="relative no-pdf">
                                        <div 
                                            onClick={() => setShowClientDropdown(!showClientDropdown)} 
                                            className={`border rounded-2xl px-5 py-4 text-sm font-bold transition-all flex justify-between items-center cursor-pointer ${showClientDropdown ? 'border-fb-blue ring-4 ring-blue-50' : 'border-red-300 hover:border-fb-blue bg-white'}`}
                                        >
                                            <span className="text-red-400">Select a Client (Required)</span>
                                            <ChevronDown size={20} className={`text-gray-300 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
                                        </div>
                                        <button type="button" onClick={() => setShowNewClientModal(true)} className="flex items-center text-fb-blue font-black text-[11px] uppercase tracking-widest hover:underline mt-4 ml-1">
                                            <Plus size={14} className="mr-1" /> Create a Client
                                        </button>
                                    </div>
                                )}
                                
                                {showClientDropdown && (
                                    <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 mt-1">
                                        <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                                            <Search size={14} className="text-gray-400" />
                                            <input placeholder="Search clients..." className="bg-transparent border-none text-xs font-bold outline-none flex-1 focus:ring-0" />
                                        </div>
                                        <div className="max-h-64 overflow-y-auto py-2">
                                            {clients.map(c => (
                                                <div key={c.id} onClick={() => { setClient(c); setShowClientDropdown(false); setError(null); }} className="px-5 py-3 hover:bg-fb-gray cursor-pointer border-b border-gray-50 last:border-0 group flex flex-col">
                                                    <span className="font-black text-fb-navy group-hover:text-fb-blue transition-colors">{c.company}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">{c.name}</span>
                                                </div>
                                            ))}
                                            {clients.length === 0 && (
                                                <div className="px-5 py-6 text-center text-gray-400 text-sm">No clients found. Create one first.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 pt-4 min-w-[260px]">
                                <div className="flex justify-between items-center border-b-2 border-gray-300 pb-3 gap-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">{documentType} #</label>
                                    <div className="flex-1 text-right min-w-[120px]">
                                        <span className="pdf-only text-sm font-black text-fb-navy">{docNumber}</span>
                                        <input
                                            value={docNumber}
                                            readOnly
                                            className="no-pdf text-right text-sm font-black text-fb-navy bg-transparent outline-none border-none p-0 focus:ring-0 w-full pl-2 pr-2 py-0.5"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b-2 border-gray-300 pb-3 gap-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Date Issued</label>
                                    <div className="flex-1 text-right min-w-[120px]">
                                        <span className="pdf-only text-sm font-black text-fb-navy">{issueDate}</span>
                                        <input
                                            type="date"
                                            value={issueDate}
                                            onChange={e => setIssueDate(e.target.value)}
                                            className="no-pdf text-right text-sm font-black text-fb-navy bg-transparent cursor-pointer outline-none border-none p-0 focus:ring-0 w-full pl-2 pr-2 py-0.5"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center border-b-2 border-gray-300 pb-3 gap-4">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest shrink-0">Reference</label>
                                    <div className="flex-1 text-right min-w-[120px]">
                                        <span className="pdf-only text-sm font-bold text-fb-navy break-all">{reference || '—'}</span>
                                        <input
                                            value={reference}
                                            onChange={e => setReference(e.target.value)}
                                            placeholder="e.g. PO #"
                                            className="no-pdf text-right text-sm font-bold text-fb-navy bg-transparent placeholder:text-gray-100 outline-none border-none p-0 focus:ring-0 w-full pl-2 pr-2 py-0.5"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table — visible borders for PDF */}
                        <div className="mt-16 overflow-visible">
                            <table className="w-full text-xs border-collapse table-fixed" style={{ minWidth: 520 }}>
                                <colgroup>
                                    <col style={{ width: '42%' }} />
                                    <col style={{ width: '18%' }} />
                                    <col style={{ width: '12%' }} />
                                    <col style={{ width: '18%' }} />
                                </colgroup>
                                <thead>
                                    <tr className="border-b-2 border-t-2 border-gray-400" style={{ borderColor: themeColor }}>
                                        <th className="py-4 pl-3 pr-3 text-left font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-400">Description</th>
                                        <th className="py-4 pl-3 pr-3 text-right font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-400">Rate</th>
                                        <th className="py-4 pl-3 pr-3 text-right font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-400">Qty</th>
                                        <th className="py-4 pl-3 pr-3 text-right font-black text-gray-500 uppercase tracking-widest border-b-2 border-gray-400">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr key={item.id} className="group relative border-b-2 border-gray-300 hover:bg-gray-50/50">
                                            <td className="py-5 pl-4 pr-4 border-b-2 border-gray-300 align-top leading-snug">
                                                {/* PDF view: plain text; Screen view: editable input */}
                                                <span className="pdf-only block font-black text-fb-navy text-sm">
                                                    {item.name || 'Item'}
                                                </span>
                                                <input
                                                    value={item.name}
                                                    onChange={(e) =>
                                                        setItems(items.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))
                                                    }
                                                    className="no-pdf w-full max-w-full font-black text-fb-navy bg-transparent outline-none text-sm placeholder:text-gray-100 border-none p-0 focus:ring-0 block"
                                                    placeholder="Item Name"
                                                />
                                                <span className="pdf-only block font-bold text-gray-400 text-xs mt-1">
                                                    {item.description || ''}
                                                </span>
                                                <input
                                                    value={item.description}
                                                    onChange={(e) =>
                                                        setItems(items.map(i => i.id === item.id ? { ...i, description: e.target.value } : i))
                                                    }
                                                    className="no-pdf w-full max-w-full font-bold text-gray-400 bg-transparent outline-none text-xs placeholder:text-gray-100 border-none p-0 focus:ring-0 mt-1 block"
                                                    placeholder="Add a description"
                                                />
                                            </td>
                                            <td className="py-5 pl-4 pr-4 text-right border-b-2 border-gray-300 align-top leading-snug">
                                                <span className="pdf-only block font-black text-fb-navy text-sm">
                                                    ₱{(item.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </span>
                                                <div className="no-pdf flex items-center justify-end font-black text-fb-navy text-sm">
                                                    <span className="opacity-30 mr-1">₱</span>
                                                    <input
                                                        type="number"
                                                        value={item.rate}
                                                        onChange={(e) =>
                                                            setItems(items.map(i => i.id === item.id ? { ...i, rate: parseFloat(e.target.value) || 0 } : i))
                                                        }
                                                        className="w-20 text-right bg-transparent outline-none p-0 border-none focus:ring-0 max-w-full pl-1"
                                                    />
                                                </div>
                                            </td>
                                            <td className="py-5 pl-4 pr-4 text-right border-b-2 border-gray-300 align-top leading-snug">
                                                <span className="pdf-only block font-black text-fb-navy text-sm">
                                                    {item.qty || 0}
                                                </span>
                                                <input
                                                    type="number"
                                                    value={item.qty}
                                                    onChange={(e) =>
                                                        setItems(items.map(i => i.id === item.id ? { ...i, qty: parseFloat(e.target.value) || 0 } : i))
                                                    }
                                                    className="no-pdf w-14 text-right bg-transparent outline-none p-0 border-none focus:ring-0 font-black text-fb-navy text-sm max-w-full pl-1"
                                                />
                                            </td>
                                            <td className="py-5 pl-4 pr-4 text-right font-black text-fb-navy text-sm border-b-2 border-gray-300 align-top leading-snug relative">
                                                ₱{((item.rate || 0) * (item.qty || 1)).toLocaleString()}
                                                <div className="no-pdf absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setItems(items.filter(i => i.id !== item.id))}
                                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button type="button" onClick={() => setItems([...items, {id: Date.now().toString(), name: '', description: '', rate: 0, qty: 1, tax: 0}])} className="no-pdf mt-8 flex items-center gap-3 text-fb-blue font-black text-sm uppercase tracking-widest hover:text-fb-navy transition-colors group">
                                <Plus size={18} className="text-fb-green group-hover:scale-110 transition-transform" /> Add a Line
                            </button>

                            {/* Totals Summary */}
                            <div className="mt-20 flex justify-end">
                                <div className="w-80 space-y-5">
                                    <div className="flex justify-between text-gray-500 font-bold text-sm">
                                        <span>Subtotal</span>
                                        <span className="font-black text-fb-navy">₱{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center relative">
                                        <button type="button" onClick={() => setShowDiscountModal(!showDiscountModal)} className="no-pdf text-[10px] font-black text-fb-blue hover:underline uppercase tracking-widest">
                                            {discount > 0 ? `Discount (${discount}%)` : 'Add Discount'}
                                        </button>
                                        <span className="font-black text-fb-navy">-{discountAmount.toFixed(2)}</span>
                                        
                                        {showDiscountModal && (
                                            <div className="no-pdf absolute bottom-full right-0 mb-4 bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 w-72 z-50 animate-in zoom-in-95">
                                                <h4 className="font-black text-fb-navy text-sm mb-4 uppercase tracking-widest">Set Discount</h4>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-1">
                                                        <input type="number" value={discount} onChange={e => setDiscount(parseFloat(e.target.value) || 0)} className="w-full border border-gray-200 rounded-xl px-4 py-3 font-black text-fb-navy outline-none focus:ring-4 ring-blue-50" />
                                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-300">%</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => setShowDiscountModal(false)} className="w-full mt-4 bg-fb-green text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg">Apply</button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-5 border-t border-gray-100 flex justify-between items-center" style={{ color: themeColor }}>
                                        <span className="font-black text-[11px] uppercase tracking-[0.25em]">Grand Total (PHP)</span>
                                        <span className="text-3xl font-black">₱{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Area */}
                            <div className="mt-32 grid grid-cols-2 gap-20 border-t border-gray-50 pt-16 pb-16">
                                 <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-gray-300 group-hover:text-gray-500 uppercase tracking-[0.3em] transition-colors">Notes</label>
                                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any extra information for the client..." className="w-full border-none p-0 text-sm font-bold text-gray-500 outline-none resize-none placeholder:text-gray-100 focus:ring-0 h-24" />
                                 </div>
                                 <div className="space-y-4 group">
                                    <label className="text-[10px] font-black text-gray-300 group-hover:text-gray-500 uppercase tracking-[0.3em] transition-colors">Terms & Conditions</label>
                                    <textarea value={terms} onChange={e => setTerms(e.target.value)} placeholder="Terms of payment, deadlines, etc..." className="w-full border-none p-0 text-sm font-bold text-gray-500 outline-none resize-none placeholder:text-gray-100 focus:ring-0 h-24" />
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar Customization — spaced right so it doesn't overlay the document */}
            <aside className="w-[320px] flex-shrink-0 sticky top-10 h-fit bg-white border border-gray-200 rounded-[32px] shadow-2xl p-10 flex flex-col gap-10 animate-in slide-in-from-right-5 duration-500 ml-2">
                <div className="space-y-12">
                    <div>
                        <h3 className="text-xl font-black text-fb-navy mb-8 tracking-tighter">Document Settings</h3>
                        
                        <div className="space-y-8">
                            {/* Template Carousel */}
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-5">Template Style</label>
                                <div className="flex items-center justify-between gap-4">
                                    <button 
                                        onClick={() => setTemplate(prev => TEMPLATES[(TEMPLATES.findIndex(t => t.id === prev) + 2) % TEMPLATES.length].id)}
                                        className="p-3 bg-gray-50 rounded-full hover:bg-fb-blue hover:text-white transition-colors"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <div className="flex-1 text-center">
                                        <div className="w-full aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
                                            <img src={TEMPLATES.find(t => t.id === template)?.preview} className="w-full h-full object-cover" alt={template} />
                                        </div>
                                        <span className="font-black text-xs uppercase tracking-widest text-fb-navy">{template}</span>
                                    </div>
                                    <button 
                                        onClick={() => setTemplate(prev => TEMPLATES[(TEMPLATES.findIndex(t => t.id === prev) + 1) % TEMPLATES.length].id)}
                                        className="p-3 bg-gray-50 rounded-full hover:bg-fb-blue hover:text-white transition-colors"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Theme Color */}
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-5">Theme Color</label>
                                <div className="flex flex-wrap gap-4">
                                    {THEME_COLORS.map(c => (
                                        <button 
                                            key={c.id} 
                                            onClick={() => setThemeColor(c.value)}
                                            style={{ background: c.value }}
                                            className={`w-9 h-9 rounded-xl shadow-lg transition-all transform hover:scale-110 border-2 ${themeColor === c.value ? 'border-fb-navy scale-110' : 'border-white'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Font Choice */}
                            <div>
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.25em] block mb-5">Typography</label>
                                <div className="relative">
                                    <select 
                                        value={FONTS.find(f => f.value === fontFamily)?.id} 
                                        onChange={e => setFontFamily(FONTS.find(f => f.id === e.target.value).value)} 
                                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 font-black text-fb-navy text-sm appearance-none cursor-pointer pr-12"
                                    >
                                        {FONTS.map(f => <option key={f.id} value={f.id}>{f.id} Serif</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-gray-100 space-y-6">
                    <button onClick={() => handleSave('Draft')} disabled={isSaving} className="w-full bg-fb-navy text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-fb-navy/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
                        {isSaving ? 'Saving...' : `Save ${documentType}`}
                    </button>
                </div>
            </aside>
        </div>

        {/* Edit Business Info Modal */}
        {showBusinessModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-fb-navy/70 backdrop-blur-md p-4 animate-in fade-in">
                <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[640px] overflow-hidden">
                    <div className="p-16">
                        <div className="flex justify-between items-start mb-12">
                            <h2 className="text-4xl font-black text-fb-navy tracking-tighter">Business Identity</h2>
                            <button onClick={() => setShowBusinessModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={32} className="text-gray-300 hover:text-fb-navy" /></button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Company Name</label>
                                <input value={businessInfo.name} onChange={e => setBusinessInfo({...businessInfo, name: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-black text-fb-navy text-xl focus:ring-4 ring-blue-50 transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Phone</label>
                                    <input value={businessInfo.phone} onChange={e => setBusinessInfo({...businessInfo, phone: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Location</label>
                                    <input value={businessInfo.country} onChange={e => setBusinessInfo({...businessInfo, country: e.target.value})} className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50 transition-all" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-10 mt-16 pt-10 border-t border-gray-100">
                             <button onClick={() => setShowBusinessModal(false)} className="text-xs font-black text-gray-400 hover:text-fb-navy uppercase tracking-[0.2em]">Cancel</button>
                             <button onClick={() => setShowBusinessModal(false)} className="bg-fb-green text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-fb-green/20 hover:brightness-110 transition-all">Apply Changes</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Send to Email Modal */}
        {showSendModal && (
            <div className="fixed inset-0 z-[305] flex items-center justify-center bg-fb-navy/70 backdrop-blur-md p-4 animate-in fade-in">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-fb-navy">Send {documentType}</h2>
                            <button onClick={() => { setShowSendModal(false); setSendToEmail(''); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-600 mb-2">To (email)</label>
                            <input type="email" value={sendToEmail} onChange={e => setSendToEmail(e.target.value)} placeholder="client@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 font-medium focus:ring-2 ring-fb-blue outline-none" />
                        </div>
                        <div className="mb-6 flex items-center gap-3">
                            <input type="checkbox" id="attach-pdf" checked={attachPdf} onChange={e => setAttachPdf(e.target.checked)} className="rounded border-gray-300 text-fb-blue focus:ring-fb-blue" />
                            <label htmlFor="attach-pdf" className="text-sm font-medium text-gray-700">Attach PDF to email</label>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setShowSendModal(false); setSendToEmail(''); }} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleSendEmail} disabled={isSendingEmail} className="px-6 py-2 bg-fb-green text-white font-black rounded-lg hover:brightness-110 disabled:opacity-50 flex items-center gap-2">
                                {isSendingEmail ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Logo Crop Modal */}
        {showLogoCropModal && cropSource && (
            <div className="fixed inset-0 z-[310] flex items-center justify-center bg-fb-navy/80 backdrop-blur-md p-4 animate-in fade-in">
                <img ref={logoImageRef} src={cropSource} alt="" className="hidden" onLoad={drawCropPreview} />
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-black text-fb-navy">Adjust logo</h2>
                            <button onClick={() => { setShowLogoCropModal(false); setCropSource(null); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Drag to position, use zoom to fit. Then click Apply.</p>
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 cursor-move select-none mx-auto"
                            style={{ width: LOGO_W, height: LOGO_H }}
                            onMouseDown={handleCropMouseDown}
                            onMouseMove={handleCropMouseMove}
                            onMouseUp={handleCropMouseUp}
                            onMouseLeave={handleCropMouseUp}
                        >
                            <canvas ref={logoCanvasRef} width={LOGO_W} height={LOGO_H} className="block w-full h-full" />
                        </div>
                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-500 mb-2">Zoom</label>
                            <input type="range" min="0.3" max="3" step="0.1" value={cropZoom} onChange={e => setCropZoom(parseFloat(e.target.value))} className="w-full accent-fb-blue" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => { setShowLogoCropModal(false); setCropSource(null); }} className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={applyLogoCrop} className="px-6 py-2 bg-fb-green text-white font-black rounded-lg hover:brightness-110">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* New Client Modal */}
        {showNewClientModal && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center bg-fb-navy/70 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-[640px] overflow-hidden">
                    <div className="p-16">
                        <div className="flex justify-between items-start mb-12">
                            <h2 className="text-4xl font-black text-fb-navy tracking-tighter">New Client</h2>
                            <button onClick={() => setShowNewClientModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={32} className="text-gray-300 hover:text-fb-navy" /></button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Organization Name <span className="text-red-500">*</span></label>
                                <input id="new-client-company" className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-black text-fb-navy text-xl focus:ring-4 ring-blue-50 transition-all" placeholder="Acme Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">First Name</label>
                                    <input id="new-client-firstname" className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">Last Name</label>
                                    <input id="new-client-lastname" className="w-full border border-gray-200 rounded-2xl px-6 py-4 font-bold text-fb-navy focus:ring-4 ring-blue-50" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-10 mt-16 pt-10 border-t border-gray-100">
                             <button onClick={() => setShowNewClientModal(false)} className="text-xs font-black text-gray-400 hover:text-fb-navy uppercase tracking-[0.2em]">Discard</button>
                             <button onClick={() => {
                                 const comp = (document.getElementById('new-client-company') as HTMLInputElement)?.value;
                                 const firstName = (document.getElementById('new-client-firstname') as HTMLInputElement)?.value;
                                 const lastName = (document.getElementById('new-client-lastname') as HTMLInputElement)?.value;
                                 if (comp) handleCreateClient({ company: comp, firstName, lastName });
                             }} className="bg-fb-green text-white px-12 py-4 rounded-2xl font-black shadow-xl shadow-fb-green/20 hover:brightness-110 transition-all">Create Record</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}
