"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Package, Article, CheckCircle, Image as ImageIcon, Video, Check } from "@phosphor-icons/react";
import { defaultConfig, type StoreConfig } from "../page";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  mediaType: "image" | "video" | "none";
  mediaUrl: string;
  date: string;
};

export default function Admin() {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig); 
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"store" | "blogs">("store");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Blog state
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [newBlog, setNewBlog] = useState<Partial<BlogPost>>({ mediaType: "none" });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const x = localStorage.getItem("bm-store-config");
    if(x) setConfig({...defaultConfig, ...JSON.parse(x)});
    
    const b = localStorage.getItem("bm-store-blogs");
    if(b) setBlogs(JSON.parse(b));
  }, []);

  const field = (key: keyof StoreConfig, value: string) => setConfig((c: StoreConfig) => ({...c, [key]: ["price", "comparePrice", "stock"].includes(key as string) ? Number(value) : value}));
  
  const saveStore = () => {
    localStorage.setItem("bm-store-config", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const isVideo = file.type.startsWith("video/");
    setNewBlog(prev => ({ ...prev, mediaType: isVideo ? "video" : "image" }));
    setIsUploading(true);
    
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });
      const newBlob = await response.json();
      setNewBlog(prev => ({ ...prev, mediaUrl: newBlob.url }));
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file to Vercel Blob.");
    } finally {
      setIsUploading(false);
    }
  };

  const saveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newBlog.title || !newBlog.content) return;
    
    const post: BlogPost = {
      id: Date.now().toString(),
      title: newBlog.title,
      content: newBlog.content,
      mediaType: newBlog.mediaType || "none",
      mediaUrl: newBlog.mediaUrl || "",
      date: new Date().toLocaleDateString()
    };
    
    const updatedBlogs = [post, ...blogs];
    setBlogs(updatedBlogs);
    localStorage.setItem("bm-store-blogs", JSON.stringify(updatedBlogs));
    
    // Reset
    setNewBlog({ mediaType: "none", title: "", content: "", mediaUrl: "" });
    if(fileInputRef.current) fileInputRef.current.value = "";
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const deleteBlog = (id: string) => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    localStorage.setItem("bm-store-blogs", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row text-[var(--foreground)]">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--surface)] border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/bm-logo.png" alt="BM" width={32} height={32} className="rounded-lg" />
          <span className="font-extrabold text-sm tracking-tight text-[var(--accent)]">BM Green House</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-[var(--accent)] p-2 bg-[var(--surface-hover)] rounded-md">
          {isMobileMenuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[var(--surface)] border-r border-[var(--border)] p-6 shrink-0`}>
        <Link href="/" className="hidden md:flex items-center gap-3 mb-10">
          <Image src="/bm-logo.png" alt="BM" width={42} height={42} className="rounded-xl shadow-sm" />
          <span className="font-extrabold text-sm leading-tight">BM Green House<br/><span className="text-[var(--muted)] font-medium">Commerce</span></span>
        </Link>
        
        <nav className="flex flex-col gap-2 mb-10">
          <button 
            onClick={() => { setTab("store"); setIsMobileMenuOpen(false); }} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${tab === "store" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"}`}
          >
            <Package size={20} weight={tab === "store" ? "fill" : "regular"} /> Storefront
          </button>
          <button 
            onClick={() => { setTab("blogs"); setIsMobileMenuOpen(false); }} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors ${tab === "blogs" ? "bg-[var(--accent)] text-white" : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"}`}
          >
            <Article size={20} weight={tab === "blogs" ? "fill" : "regular"} /> Blogs
          </button>
        </nav>
        
        <Link href="/" className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] font-medium transition-colors">
          <ArrowLeft size={18} /> Back to store
        </Link>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-[var(--accent)] tracking-widest uppercase mb-2 block">
              {tab === "store" ? "STORE CONTROL" : "CONTENT MANAGEMENT"}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2">{tab === "store" ? "Good afternoon." : "Manage Blogs."}</h1>
            <p className="text-[var(--muted)] font-medium">{tab === "store" ? "Manage the storefront experience from one calm space." : "Post updates, recipes, and news."}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-white flex items-center justify-center font-bold shadow-md shrink-0">BM</div>
        </header>

        {tab === "store" ? (
          <div className="max-w-5xl">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Product status</span>
                <b className="text-xl text-[var(--accent)] block mb-1">Live</b>
                <small className="text-[var(--muted)] font-medium">Visible in storefront</small>
              </div>
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Available stock</span>
                <b className="text-xl block mb-1">{config.stock}</b>
                <small className="text-[var(--muted)] font-medium">100g packs</small>
              </div>
              <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] shadow-sm">
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-wider block mb-1">Orders</span>
                <b className="text-xl block mb-1">WhatsApp</b>
                <small className="text-[var(--muted)] font-medium">Direct customer checkout</small>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form onSubmit={e => { e.preventDefault(); saveStore(); }} className="lg:col-span-2 bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
                <div className="flex justify-between items-center mb-8 pb-6 border-b border-[var(--border)]">
                  <div>
                    <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">PRODUCT SETTINGS</span>
                    <h2 className="text-2xl font-bold">Original blend</h2>
                  </div>
                  {saved && <span className="flex items-center gap-1 text-[var(--accent)] font-bold text-sm bg-[var(--surface-hover)] px-3 py-1.5 rounded-full"><CheckCircle size={16} weight="fill" /> Saved</span>}
                </div>
                
                <div className="grid gap-6">
                  <label className="block">
                    <span className="block text-sm font-bold text-[var(--muted)] mb-2">Product name</span>
                    <input value={config.name} onChange={e => field("name", e.target.value)} className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-bold text-[var(--muted)] mb-2">Short description</span>
                    <input value={config.subtitle} onChange={e => field("subtitle", e.target.value)} className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="block text-sm font-bold text-[var(--muted)] mb-2">Price (₹)</span>
                      <input type="number" value={config.price} onChange={e => field("price", e.target.value)} className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-[var(--muted)] mb-2">Compare price (₹)</span>
                      <input type="number" value={config.comparePrice} onChange={e => field("comparePrice", e.target.value)} className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <label className="block">
                      <span className="block text-sm font-bold text-[var(--muted)] mb-2">Available stock</span>
                      <input type="number" value={config.stock} onChange={e => field("stock", e.target.value)} className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold text-[var(--muted)] mb-2">WhatsApp number</span>
                      <input value={config.whatsapp} onChange={e => field("whatsapp", e.target.value)} placeholder="919999999999" className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                    </label>
                  </div>
                </div>
                
                <button type="submit" className="btn-primary w-full sm:w-auto mt-8 px-8 py-3.5 rounded-xl text-sm">Save storefront</button>
              </form>
              
              <div className="bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm lg:col-span-1 h-fit">
                <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-6">LIVE PREVIEW</span>
                <div className="bg-[var(--surface-hover)] rounded-2xl p-4 flex flex-col items-center text-center border border-[var(--border)] relative overflow-hidden">
                  <div className="absolute top-3 right-3 bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm"><span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse"></span> LIVE</div>
                  <Image src="/product-png2.png" alt="Product" width={140} height={220} className="drop-shadow-xl my-4 hover:scale-105 transition-transform duration-500" />
                  <h3 className="font-extrabold text-lg mt-2">{config.name}</h3>
                  <p className="text-[var(--muted)] text-xs font-medium mt-1 mb-3 line-clamp-2">{config.subtitle}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <b className="text-xl">₹{config.price}</b> 
                    <s className="text-[var(--muted)] text-sm">₹{config.comparePrice}</s>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form onSubmit={saveBlog} className="bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-[var(--border)]">
                <div>
                  <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-1">NEW POST</span>
                  <h2 className="text-2xl font-bold">Create Blog</h2>
                </div>
                {saved && <span className="flex items-center gap-1 text-[var(--accent)] font-bold text-sm bg-[var(--surface-hover)] px-3 py-1.5 rounded-full"><CheckCircle size={16} weight="fill" /> Posted</span>}
              </div>
              
              <div className="grid gap-6">
                <label className="block">
                  <span className="block text-sm font-bold text-[var(--muted)] mb-2">Title</span>
                  <input required value={newBlog.title || ""} onChange={e => setNewBlog({...newBlog, title: e.target.value})} placeholder="e.g. 5 ways to brew date seeds" className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors" />
                </label>
                
                <label className="block">
                  <span className="block text-sm font-bold text-[var(--muted)] mb-2">Content</span>
                  <textarea 
                    required
                    rows={6}
                    value={newBlog.content || ""} 
                    onChange={e => setNewBlog({...newBlog, content: e.target.value})} 
                    placeholder="Write your article here..."
                    className="w-full bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl px-4 py-3 font-medium outline-none focus:border-[var(--accent)] transition-colors resize-y"
                  />
                </label>

                <div className="block">
                  <span className="block text-sm font-bold text-[var(--muted)] mb-2">Media Upload (Photo/Video)</span>
                  <div className="relative">
                    <input type="file" accept="image/*,video/*" ref={fileInputRef} onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" disabled={isUploading} />
                    <div className={`flex items-center gap-3 w-full bg-[var(--surface-hover)] border border-dashed border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface)] rounded-xl px-4 py-4 font-medium transition-colors text-[var(--muted)] ${isUploading ? "animate-pulse" : ""}`}>
                      <ImageIcon size={24} /> <Video size={24} />
                      <span className="text-sm">{isUploading ? "Uploading to Vercel Blob..." : "Click or drag file to upload media"}</span>
                    </div>
                  </div>
                  
                  {newBlog.mediaUrl && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-[var(--border)] bg-black max-w-[200px] shadow-sm relative">
                      {newBlog.mediaType === "video" ? (
                        <video src={newBlog.mediaUrl} autoPlay muted loop playsInline className="w-full h-auto object-cover" />
                      ) : (
                        <img src={newBlog.mediaUrl} alt="Preview" className="w-full h-auto object-cover" />
                      )}
                      <button type="button" onClick={() => setNewBlog({...newBlog, mediaUrl: "", mediaType: "none"})} className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full hover:bg-black/80 transition-colors">
                        <ArrowLeft size={12} weight="bold" className="rotate-45" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full sm:w-auto mt-8 px-8 py-3.5 rounded-xl text-sm">Publish Blog</button>
            </form>

            <div className="bg-[var(--surface)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm h-fit max-h-[800px] overflow-y-auto">
              <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider block mb-6">PUBLISHED BLOGS</span>
              
              <div className="flex flex-col gap-4">
                {blogs.length === 0 && (
                  <div className="text-center p-8 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)] text-[var(--muted)] font-medium text-sm">
                    No blogs published yet.
                  </div>
                )}
                
                {blogs.map(blog => (
                  <div key={blog.id} className="p-5 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border)] group">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-bold text-lg leading-tight">{blog.title}</h3>
                      <button onClick={() => deleteBlog(blog.id)} className="text-[var(--muted)] hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 opacity-0 group-hover:opacity-100 md:opacity-100">Delete</button>
                    </div>
                    <p className="text-[var(--accent)] text-xs font-bold mb-3">{blog.date}</p>
                    <p className="text-[var(--muted)] font-medium text-sm line-clamp-3 mb-4 leading-relaxed">{blog.content}</p>
                    
                    {blog.mediaUrl && (
                      <div className="rounded-xl overflow-hidden h-32 border border-[var(--border)] bg-black shadow-sm">
                        {blog.mediaType === "video" ? (
                          <video src={blog.mediaUrl} className="w-full h-full object-cover" />
                        ) : (
                          <img src={blog.mediaUrl} className="w-full h-full object-cover" alt="" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
