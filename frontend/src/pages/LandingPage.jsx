import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';

export default function ExecutiveSlateLanding() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-[#f7f9fb] font-['Inter',sans-serif] text-[14px] leading-[20px] font-normal text-[#191c1e] min-h-screen flex flex-col antialiased">

      {/* ─── GOOGLE FONTS & MATERIAL ICONS INJECTION ─── */}
      <CustomAssetInjector />

      {/* ─── STICKY HEADER ─── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full top-0 sticky z-50 transition-all duration-300 bg-white border-b ${scrolled ? 'shadow-sm border-gray-200' : 'border-[#E2E8F0]'
          }`}>
        <nav className="flex justify-between items-center w-full px-4 md:px-16 py-4 max-w-[1200px] mx-auto">
          <div className="font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold text-black tracking-tight">
            ATS Resume
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[14px] leading-[20px] uppercase font-bold tracking-wider text-[#45464d] hover:text-black transition-colors">
              Features
            </a>
            <a href="#templates" className="text-[14px] leading-[20px] uppercase font-bold tracking-wider text-[#45464d] hover:text-black transition-colors">
              Templates
            </a>
            <a href="#pricing" className="text-[14px] leading-[20px] uppercase font-bold tracking-wider text-[#45464d] hover:text-black transition-colors">
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/login')} className="text-[14px] leading-[20px] uppercase font-bold tracking-wider text-[#45464d] hover:text-black transition-colors cursor-pointer">
              Login
            </button>
            <button onClick={() => navigate('/login')} className="bg-black text-white px-6 py-2 rounded text-[14px] leading-[20px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all">
              Get Access Free
            </button>
          </div>
        </nav>
      </motion.header>

      <main className="flex-grow">

        {/* ─── HERO SECTION ─── */}
        <ScrollReveal>
          <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden px-4 md:px-16 max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-col items-start gap-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e6e8ea] rounded-full">
                  <span className="material-symbols-outlined text-[16px] text-[#0051d5]">auto_awesome</span>
                  <span className="text-[12px] leading-[16px] letter-spacing-[0.05em] font-get font-semibold uppercase tracking-wider text-[#45464d]">
                    AI-Powered Resume Builder - Free
                  </span>
                </div>

                <h1 className="font-['Source_Serif_4',serif] text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-black">
                  Build Your <span className="text-[#0051d5]">Job-Winning Resume</span> in Minutes
                </h1>

                <p className="text-[16px] leading-[24px] font-normal text-[#45464d] max-w-[500px]">
                  Generate professional, ATS-friendly resumes using AI with world-class templates. Tailored for precision and authority.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button className="bg-[#0F172A] text-white px-8 py-4 rounded-lg text-[18px] leading-[28px] font-semibold hover:bg-black transition-colors active:scale-95">
                    Build Your Resume Now
                  </button>
                  <button className="border border-[#0F172A] text-[#0F172A] px-8 py-4 rounded-lg text-[18px] leading-[28px] font-semibold hover:bg-[#f2f4f6] transition-colors active:scale-95">
                    View Templates
                  </button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div>
                    <div className="font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold">50,000+</div>
                    <div className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">
                      Active Users
                    </div>
                  </div>
                  <div className="w-px h-8 bg-[#E2E8F0]"></div>
                  <div>
                    <div className="font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold">120,000+</div>
                    <div className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">
                      Resumes Generated
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 2 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative flex justify-center"
              >
                <div className="bg-white p-4 rounded-lg border border-[#E2E8F0] w-full max-w-[450px] transform rotate-2 shadow-[0px_4px_20px_rgba(15,23,42,0.05)]">
                  <img
                    alt="Resume Template Preview"
                    className="w-full rounded-sm"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZ_mrpKqVQCDqpLqKhpkdrjwp8ZHyNvs5vF9uu3LX13GClL0ztHjaCch-IxODoNYQsjb30YOtRpzW9K9f9Y1ReUfHnn1Mf7MPCVvBipzTQb-wcSOtbGgkdgXDaMLtlWm7P1AYsEkqCkjBeclgWVJKbCLZR-HE5b-r1qn9etdKNJ_am1TV3gO4gaKOmCRHE8FyZq20duQdXBHuy1f9ayvDFiiR_iAQl4oIFFU1qWHqC5TmUeNHWYiocUdVXmLM2yUlOPn4eshajhcg"
                  />
                  <div className="absolute -top-4 -left-4 bg-[#0051d5] text-white px-4 py-2 rounded-lg text-[12px] leading-[16px] font-semibold tracking-[0.05em] uppercase shadow-lg">
                    ATS Friendly
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── HOW IT WORKS SECTION ─── */}
        <ScrollReveal>
          <section className="py-24 bg-[#f2f4f6] px-4 md:px-16">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <span className="text-[12px] leading-[16px] font-semibold tracking-widest text-[#0051d5] uppercase block mb-4">
                  The Process
                </span>
                <h2 className="font-['Source_Serif_4',serif] text-[32px] leading-[40px] font-bold text-black">
                  Resume Ready in 3 Easy Steps
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-[#E2E8F0] z-0"></div>

                {/* Step 1 */}
                <StaggeredCard index={0}>
                  <div className="flex flex-col items-center text-center gap-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold"
                    >
                      01
                    </motion.div>
                    <div>
                      <h3 className="text-[18px] leading-[28px] font-semibold text-black mb-2">Fill Your Details</h3>
                      <p className="text-[14px] leading-[20px] text-[#45464d]">
                        Enter your experience, education, and skills into our intuitive, focused builder.
                      </p>
                    </div>
                  </div>
                </StaggeredCard>

                {/* Step 2 */}
                <StaggeredCard index={1}>
                  <div className="flex flex-col items-center text-center gap-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="w-16 h-16 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold"
                    >
                      02
                    </motion.div>
                    <div>
                      <h3 className="text-[18px] leading-[28px] font-semibold text-black mb-2">AI Generation</h3>
                      <p className="text-[14px] leading-[20px] text-[#45464d]">
                        Our executive AI enhances your descriptions to match high-level industry standards.
                      </p>
                    </div>
                  </div>
                </StaggeredCard>

                {/* Step 3 */}
                <StaggeredCard index={2}>
                  <div className="flex flex-col items-center text-center gap-6 relative z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="w-16 h-16 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold"
                    >
                      03
                    </motion.div>
                    <div>
                      <h3 className="text-[18px] leading-[28px] font-semibold text-black mb-2">Download PDF</h3>
                      <p className="text-[14px] leading-[20px] text-[#45464d]">
                        Choose your template and export a professional, pixel-perfect PDF in one click.
                      </p>
                    </div>
                  </div>
                </StaggeredCard>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── FEATURES BENTO GRID ─── */}
        <ScrollReveal>
          <section className="py-24 px-4 md:px-16 max-w-[1200px] mx-auto" id="features">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="text-[12px] leading-[16px] font-semibold tracking-widest text-[#0051d5] uppercase block mb-4">
                Precision Tools
              </span>
              <h2 className="font-['Source_Serif_4',serif] text-[32px] leading-[40px] font-bold text-black">
                Everything You Need to Get Hired
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <StaggeredCard index={0}>
                <div className="border border-[#E2E8F0] p-8 rounded-lg hover:border-black transition-colors group">
                  <span className="material-symbols-outlined text-[#0051d5] mb-4 text-[32px]">edit_note</span>
                  <h3 className="text-[18px] leading-[28px] font-semibold mb-2 text-black">AI-Powered Writing</h3>
                  <p className="text-[14px] leading-[20px] text-[#45464d]">
                    Smart bullet points and professional summaries generated in seconds using enterprise-grade LLMs.
                  </p>
                </div>
              </StaggeredCard>

              {/* Feature 2 */}
              <StaggeredCard index={1}>
                <div className="border border-[#E2E8F0] p-8 rounded-lg hover:border-black transition-colors group">
                  <span className="material-symbols-outlined text-[#0051d5] mb-4 text-[32px]">style</span>
                  <h3 className="text-[18px] leading-[28px] font-semibold mb-2 text-black">Premium Templates</h3>
                  <p className="text-[14px] leading-[20px] text-[#45464d]">
                    Modern, classic, and creative designs crafted by senior recruitment experts.
                  </p>
                </div>
              </StaggeredCard>

              {/* Feature 3 */}
              <StaggeredCard index={2}>
                <div className="border border-[#E2E8F0] p-8 rounded-lg hover:border-black transition-colors group">
                  <span className="material-symbols-outlined text-[#0051d5] mb-4 text-[32px]">analytics</span>
                  <h3 className="text-[18px] leading-[28px] font-semibold mb-2 text-black">ATS Score Checker</h3>
                  <p className="text-[14px] leading-[20px] text-[#45464d]">
                    Instantly verify if your resume will pass through automated screening systems.
                  </p>
                </div>
              </StaggeredCard>

              {/* Feature 4 */}
              <StaggeredCard index={3}>
                <div className="border border-[#E2E8F0] p-8 rounded-lg hover:border-black transition-colors group">
                  <span className="material-symbols-outlined text-[#0051d5] mb-4 text-[32px]">visibility</span>
                  <h3 className="text-[18px] leading-[28px] font-semibold mb-2 text-black">Live Preview</h3>
                  <p className="text-[14px] leading-[20px] text-[#45464d]">
                    See your changes reflected on the document canvas in real-time as you type.
                  </p>
                </div>
              </StaggeredCard>

              {/* Feature 5 */}
              <StaggeredCard index={4}>
                <div className="border border-[#E2E8F0] p-8 rounded-lg hover:border-black transition-colors group">
                  <span className="material-symbols-outlined text-[#0051d5] mb-4 text-[32px]">devices</span>
                  <h3 className="text-[18px] leading-[28px] font-semibold mb-2 text-black">Mobile Friendly</h3>
                  <p className="text-[14px] leading-[20px] text-[#45464d]">
                    Craft your career story on the go with our fully responsive web application.
                  </p>
                </div>
              </StaggeredCard>

              {/* Feature 6 */}
              <StaggeredCard index={5}>
                <div className="border border-[#E2E8F0] p-8 rounded-lg hover:border-black transition-colors group">
                  <span className="material-symbols-outlined text-[#0051d5] mb-4 text-[32px]">download</span>
                  <h3 className="text-[18px] leading-[28px] font-semibold mb-2 text-black">One-Click PDF</h3>
                  <p className="text-[14px] leading-[20px] text-[#45464d]">
                    Standardized A4 and Letter formats ready for upload or direct email attachment.
                  </p>
                </div>
              </StaggeredCard>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── WORLD-CLASS TEMPLATES SECTION ─── */}
        <ScrollReveal>
          <section className="py-24 bg-white px-4 md:px-16" id="templates">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <span className="text-[12px] leading-[16px] font-semibold tracking-widest text-[#0051d5] uppercase block mb-4">
                  Classic View
                </span>
                <h2 className="font-['Source_Serif_4',serif] text-[32px] leading-[40px] font-bold text-black">
                  10 World-Class Professional Designs
                </h2>
                <p className="text-[14px] leading-[20px] text-[#45464d] mt-4">
                  Curated layouts for executives, software engineers, and creative professionals.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Template Card 1 */}
                <StaggeredCard index={0}>
                  <div className="group cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] mb-4 group-hover:border-[#0051d5] transition-all"
                    >
                      <img
                        alt="The Executive Template"
                        className="w-full h-80 object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzWgaGrSw8iCY1LytqSG2kJNH6cXaayqb5UoyrI7FlC2cGCYtPUCaRclqosLmm3jrLNW4RZa8f1p0e4D-oJQR9ElFL_pmYfXbx4SZSDoKDxFM_asOatrhNdTTXBRBigYZN_66cPjljtZ84BzS4ftiDXg62NC_euWhu7k1HEa0tY09Hc46VtFvm1p8KXFQHNGaN1U_x4gHcOEyFbJG-xIS5RJPhSQPxDzKFLV6-05PSge2HRf3XH4TAdwbi7AAcWP0hVMoIHTA3Dlk"
                      />
                    </motion.div>
                    <h4 className="text-[18px] leading-[28px] font-semibold text-black">The Executive</h4>
                    <p className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">Minimalist • Corporate</p>
                  </div>
                </StaggeredCard>

                {/* Template Card 2 */}
                <StaggeredCard index={1}>
                  <div className="group cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] mb-4 group-hover:border-[#0051d5] transition-all"
                    >
                      <img
                        alt="The Modernist Template"
                        className="w-full h-80 object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnPN6hebardFmHmvamL3S4K1Ty_a5xhDwmMkLIbrhl59x8GMubpYleJBc9JfMeQOFJWcCKhmWTFV3BDebJ9l6gNCx3KOj3_5bYnIckRjQoY_LrFnVM2Psax0QLnsYs-z_Q7UK2fRPdCAd0Dae_03IU3qVemdrfYBtyJu2qHfSOjsOVEntVYnR3DcOzv6ZiuNFcHyaG_leDishPy-XLNl8Z3JnIqJuxqBCTvQW76ObJPk0E2WT-PkustegUXVds6mU-aoD3dUcv9ys"
                      />
                    </motion.div>
                    <h4 className="text-[18px] leading-[28px] font-semibold text-black">The Modernist</h4>
                    <p className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">Clean • Tech-Ready</p>
                  </div>
                </StaggeredCard>

                {/* Template Card 3 */}
                <StaggeredCard index={2}>
                  <div className="group cursor-pointer">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-[0px_4px_20px_rgba(15,23,42,0.05)] mb-4 group-hover:border-[#0051d5] transition-all"
                    >
                      <img
                        alt="The Cambridge Template"
                        className="w-full h-80 object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG2mRl6lnbqV_ncj9MMc-dNXPpBgFvy7FupAh0oCNYGuG5tw3aQk3QjJtC36ovHS9yVnR-bHn-gqtmmN7vzfFgXTBlCFgg6cX-CcHitDY5gv3yXONdwsRpFAbRpHqfZG0jw1OHHhFcB5BTPCuxbwXnbqmdLVgY8m6LOWxz0y-pmJxnRUmCR6DzBSz5CRTzBrsdgISgtVw2U0FxBaaQRHdLtS-hDizvVCXgBvpNqBqj50NpjsG-b2A93Aj7y9fjuXFbmHQvEBvtNH0"
                      />
                    </motion.div>
                    <h4 className="text-[18px] leading-[28px] font-semibold text-black">The Cambridge</h4>
                    <p className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">Traditional • Academic</p>
                  </div>
                </StaggeredCard>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12 text-center"
              >
                <button className="bg-[#0051d5] text-white px-8 py-3 rounded-lg text-[18px] leading-[28px] font-semibold hover:bg-[#2563EB] transition-colors inline-flex items-center gap-2">
                  Browse All Templates <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </motion.div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── TESTIMONIALS SECTION ─── */}
        <ScrollReveal>
          <section className="py-24 px-4 md:px-16 max-w-[1200px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <span className="text-[12px] leading-[16px] font-semibold tracking-widest text-[#0051d5] uppercase block mb-4">
                Success Stories
              </span>
              <h2 className="font-['Source_Serif_4',serif] text-[32px] leading-[40px] font-bold text-black">
                What Our Users Are Saying
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <StaggeredCard index={0}>
                <div className="bg-[#f7f9fb] p-8 border border-[#E2E8F0] rounded-lg flex flex-col gap-6 h-full">
                  <div className="flex text-[#0051d5]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-[16px] leading-[24px] font-normal italic text-[#191c1e]">
                    "The AI builder transformed my messy career history into a professional narrative. I secured three interviews within the first week of using my new resume."
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-[#e6e8ea] flex items-center justify-center font-bold text-black">JD</div>
                    <div>
                      <div className="text-[18px] leading-[28px] font-semibold text-black">James Davidson</div>
                      <div className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">Product Manager at Meta</div>
                    </div>
                  </div>
                </div>
              </StaggeredCard>

              {/* Testimonial 2 */}
              <StaggeredCard index={1}>
                <div className="bg-[#f7f9fb] p-8 border border-[#E2E8F0] rounded-lg flex flex-col gap-6 h-full">
                  <div className="flex text-[#0051d5]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-[16px] leading-[24px] font-normal italic text-[#191c1e]">
                    "Finally, a resume builder that doesn't feel like a toy. The 'Executive Slate' design language is sophisticated and actually looks like high-end stationery."
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-[#e6e8ea] flex items-center justify-center font-bold text-black">SC</div>
                    <div>
                      <div className="text-[18px] leading-[28px] font-semibold text-black">Sarah Chen</div>
                      <div className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">Senior Design Lead</div>
                    </div>
                  </div>
                </div>
              </StaggeredCard>

              {/* Testimonial 3 */}
              <StaggeredCard index={2}>
                <div className="bg-[#f7f9fb] p-8 border border-[#E2E8F0] rounded-lg flex flex-col gap-6 h-full">
                  <div className="flex text-[#0051d5]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="text-[16px] leading-[24px] font-normal italic text-[#191c1e]">
                    "The ATS Score Checker is a game changer. I realized my previous resume was completely invisible to automated systems. This fixed it instantly."
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-[#e6e8ea] flex items-center justify-center font-bold text-black">MR</div>
                    <div>
                      <div className="text-[18px] leading-[28px] font-semibold text-black">Marcus Reed</div>
                      <div className="text-[12px] leading-[16px] font-semibold tracking-[0.05em] text-[#45464d] uppercase">Full-Stack Engineer</div>
                    </div>
                  </div>
                </div>
              </StaggeredCard>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── PRICING SECTION ─── */}
        <ScrollReveal>
          <section className="py-24 bg-white px-4 md:px-16" id="pricing">
            <div className="max-w-[1200px] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-16"
              >
                <span className="text-[12px] leading-[16px] font-semibold tracking-widest text-[#0051d5] uppercase block mb-4">
                  Investment
                </span>
                <h2 className="font-['Source_Serif_4',serif] text-[32px] leading-[40px] font-bold text-black">
                  Transparent Pricing
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
                {/* Free Plan */}
                <StaggeredCard index={0}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="border border-[#E2E8F0] rounded-lg p-8 flex flex-col bg-[#f7f9fb] h-full"
                  >
                    <div className="mb-8">
                      <h3 className="font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold text-black mb-2">Free</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Source_Serif_4',serif] text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-black">₹0</span>
                        <span className="text-[14px] leading-[20px] text-[#45464d]">/forever</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">1 Resume Download</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">3 Basic Templates</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">AI Content Support</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">PDF Export</span>
                      </li>
                    </ul>
                    <button className="w-full border border-black text-black py-3 rounded-lg text-[18px] leading-[28px] font-semibold hover:bg-[#f2f4f6] transition-colors">
                      Get Started Free
                    </button>
                  </motion.div>
                </StaggeredCard>

                {/* Pro Plan */}
                <StaggeredCard index={1}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="border-2 border-[#0051d5] rounded-lg p-8 flex flex-col relative bg-[#f7f9fb] shadow-lg h-full"
                  >
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0051d5] text-white px-4 py-1 rounded-full text-[12px] leading-[16px] font-semibold tracking-[0.05em] uppercase">
                      Most Popular
                    </div>
                    <div className="mb-8">
                      <h3 className="font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold text-black mb-2">Pro</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="font-['Source_Serif_4',serif] text-[48px] leading-[56px] font-bold tracking-[-0.02em] text-black">₹199</span>
                        <span className="text-[14px] leading-[20px] text-[#45464d]">/month</span>
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px] font-bold">Unlimited Resumes</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">All 10+ Premium Templates</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">Advanced AI Assistant</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">ATS Score &amp; Optimization</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0051d5] text-[20px]">check</span>
                        <span className="text-[14px] leading-[20px]">Priority Customer Support</span>
                      </li>
                    </ul>
                    <button className="w-full bg-[#0F172A] text-white py-3 rounded-lg text-[18px] leading-[28px] font-semibold hover:bg-black transition-colors">
                      Start Pro Journey
                    </button>
                  </motion.div>
                </StaggeredCard>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ─── FINAL CTA SECTION ─── */}
        <ScrollReveal>
          <section className="py-24 px-4 md:px-16 bg-[#0F172A] text-white text-center">
            <div className="max-w-[800px] mx-auto flex flex-col items-center gap-8">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="font-['Source_Serif_4',serif] text-[48px] leading-[56px] font-bold tracking-[-0.02em]"
              >
                Build Your Future Career Today
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-[16px] leading-[24px] text-white/80"
              >
                Join 50,000+ professionals who have landed their dream jobs using Executive Slate. Start your professional journey now.
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#0F172A] px-10 py-4 rounded-lg font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold hover:bg-[#e6e8ea] transition-colors flex items-center gap-3"
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                Build My Resume Now
              </motion.button>
            </div>
          </section>
        </ScrollReveal>

      </main>

      {/* ─── FOOTER ─── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-black text-white w-full mt-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 md:px-16 py-12 max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-4">
            <div className="font-['Source_Serif_4',serif] text-[24px] leading-[32px] font-bold text-white">
              Executive Slate
            </div>
            <p className="text-[14px] leading-[20px] text-white/80 max-w-[350px]">
              The premium AI resume builder for ambitious professionals seeking clarity, authority, and success.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-start md:justify-end">
            <a className="text-[14px] leading-[20px] text-white/80 hover:text-white hover:underline transition-all cursor-pointer" href="#">About Us</a>
            <a className="text-[14px] leading-[20px] text-white/80 hover:text-white hover:underline transition-all cursor-pointer" href="#">Privacy Policy</a>
            <a className="text-[14px] leading-[20px] text-white/80 hover:text-white hover:underline transition-all cursor-pointer" href="#">Terms of Service</a>
            <a className="text-[14px] leading-[20px] text-white/80 hover:text-white hover:underline transition-all cursor-pointer" href="#">Help Center</a>
            <a className="text-[14px] leading-[20px] text-white/80 hover:text-white hover:underline transition-all cursor-pointer" href="#">Contact</a>
          </div>
        </div>

        <div className="border-t border-white/10 py-6 px-4 md:px-16 text-center">
          <p className="text-[14px] leading-[20px] text-white/60">© 2024 Executive Slate. All rights reserved.</p>
        </div>
      </motion.footer>

    </div>
  );
}

// ScrollReveal Component - Triggers animation when component comes into view
function ScrollReveal({ children }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.5 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 50 }
      }}
    >
      {children}
    </motion.div>
  );
}

// StaggeredCard Component - Creates staggered animation for grid items
function StaggeredCard({ children, index }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      custom={index}
      variants={{
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut"
          }
        }),
        hidden: { opacity: 0, y: 30 }
      }}
    >
      {children}
    </motion.div>
  );
}

// Sub-component wrapper for modern layout design elements
function ResumeSection({ title, children }) {
  return (
    <div className="mb-2.5">
      <div className="text-[8px] font-bold uppercase tracking-wider text-[#0051d5] border-b border-gray-200 pb-0.75 mb-1.5">
        {title}
      </div>
      {children}
    </div>
  );
}

// Internal Asset Pipeline Module to handle asset headers safely inside standard single file React deployments
function CustomAssetInjector() {
  useEffect(() => {
    const linkId = "executive-slate-fonts-and-icons";
    if (!document.getElementById(linkId)) {
      const linkElement = document.createElement("link");
      linkElement.id = linkId;
      linkElement.rel = "stylesheet";
      linkElement.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+4:wght@600;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
      document.head.appendChild(linkElement);
    }
  }, []);
  return null;
}