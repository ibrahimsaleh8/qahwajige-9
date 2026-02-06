"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "ما هي المناطق التي تغطونها في الرياض؟",
    answer:
      "نغطي جميع أحياء مدينة الرياض وما حولها. سواء كانت مناسبتك في الشمال، الجنوب، الشرق، أو الغرب، فريقنا جاهز للوصول إليكم.",
  },
  {
    question: "هل توفرون جميع أدوات الضيافة؟",
    answer:
      "نعم، نقوم بتوفير كافة مستلزمات الضيافة من دلال، فناجيل، ترامس، ومباخر، بالإضافة إلى القهوة العربية الفاخرة والشاي بأنواعه.",
  },
  {
    question: "هل القهوجيين بزي موحد؟",
    answer:
      "بكل تأكيد، يلتزم طاقمنا بالزي السعودي الرسمي والمرتب لضمان مظهر يليق بمناسباتكم وضيوفكم.",
  },
  {
    question: "ما هي أنواع المشروبات التي تقدمونها؟",
    answer:
      "نقدم القهوة العربية (شقراء أو غامقة حسب الطلب)، الشاي الأحمر، الشاي الأخضر، النعناع، والزنجبيل، بالإضافة إلى التمر الفاخر.",
  },
  {
    question: "كيف يمكنني الحجز؟",
    answer:
      "يمكنك الحجز بسهولة عن طريق الاتصال بنا مباشرة أو التواصل عبر الواتساب من خلال الأزرار الموجودة في الموقع.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-main-color font-semibold mb-2">
            <HelpCircle className="w-5 h-5" />
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            أجوبة لأهم استفساراتكم
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-right hover:bg-slate-50 transition-colors">
                <span className="text-lg font-medium text-slate-800">
                  {faq.question}
                </span>
                <span className="text-main-color mr-4">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden">
                    <div className="p-4 md:p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
