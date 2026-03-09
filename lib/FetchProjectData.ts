import { APP_URL, CurrentProjectId } from "@/lib/ProjectId";
import { ProjectContentResponse } from "@/lib/responseType";

export const FetchProjectData = async () => {
  let data;

  try {
    const res = await fetch(
      `${APP_URL}/api/project/${CurrentProjectId}/main-data`,
    );
    data = (await res.json()) as ProjectContentResponse;
  } catch (error) {
    console.error("Failed to fetch project content:", error);
    data = {
      header: { brandName: "قهوجى الرياض" },
      hero: {
        headline: "قهوجى الرياض — خدمة القهوة العربية والضيافة في الرياض",
        subheadline:
          "نقدم لكم تجربة ضيافة عربية أصيلة مع صبّابين محترفين ومستلزمات راقية لمناسباتكم في الرياض وما حولها. أعراس، اجتماعات، مناسبات عائلية وفعاليات خاصة.",
        whatsApp: "",
      },
      about: {
        label: "من نحن",
        title: "قهوجى الرياض — أصالة الضيافة في قلب العاصمة",
        description1:
          "قهوجى الرياض فريق متخصص في تقديم خدمة القهوة العربية والضيافة في الرياض والمناطق المجاورة. نحرص على الأصالة والجودة في كل تفصيلة، من اختيار البن إلى أسلوب التقديم، لنُضفي على مناسبتكم طابعاً لا يُنسى.",
        image: "",
      },
      services: {
        label: "خدماتنا",
        title: "ما نقدمه لكم",
        description:
          "نوفر حزمة متكاملة من خدمات الضيافة والقهوة العربية مصممة لتناسب مختلف المناسبات في الرياض.",
        items: [
          {
            id: "1",
            icon: "Coffee",
            title: "تقديم القهوة العربية",
            description:
              "تقديم راقٍ للقهوة العربية بالدلة والفناجيل مع صبّابين ذوي خبرة وأسلوب يليق بمناسبتكم.",
          },
          {
            id: "2",
            icon: "Users",
            title: "صبّابون محترفون",
            description:
              "فريق من الصبّابين المدربين على أعلى معايير الضيافة والسلوك لخدمة ضيوفكم بأفضل صورة.",
          },
          {
            id: "3",
            icon: "Heart",
            title: "مستلزمات الضيافة",
            description:
              "توفير الدلال، الفناجيل، الصواني وكل ما يلزم لتقديم ضيافة عربية كاملة دون عناء منكم.",
          },
          {
            id: "4",
            icon: "Building2",
            title: "جميع أنواع المناسبات",
            description:
              "نخدم الأعراس، الاجتماعات الرسمية، المناسبات العائلية، حفلات الشركات والفعاليات الخاصة في الرياض.",
          },
        ],
      },
      whyUs: {
        label: "لماذا نحن",
        title: "لماذا قهوجى الرياض؟",
        description:
          "نحن نؤمن بأن الضيافة العربية جزء من هويتنا؛ لذلك نقدمها باحترافية وأصالة تستحقها مناسبتكم.",
        features: [
          {
            icon: "Award",
            title: "جودة عالية",
            description:
              "بن وعُدة وتقديم بمعايير عالية لضمان رضاكم ورضا ضيوفكم في كل مناسبة.",
          },
          {
            icon: "Clock",
            title: "التزام بالمواعيد",
            description:
              "وصول في الوقت المحدد وإعداد سريع ومنظم لضمان سير مناسبتكم بسلاسة.",
          },
          {
            icon: "Shield",
            title: "موثوقية",
            description:
              "التزام بالاتفاقات والشفافية في الأسعار والخدمة لبناء ثقة دائمة مع عملائنا.",
          },
          {
            icon: "Sparkles",
            title: "تجربة مميزة",
            description:
              "اهتمام بالتفاصيل من الزي إلى أسلوب التقديم لترك انطباع راقٍ في مناسبتكم.",
          },
        ],
      },
      gallery: [],
      packages: [],
      rating: { averageRating: 0, totalRatings: 0 },
      footer: {
        brandName: "قهوجى الرياض",
        phone: "",
        email: "",
        address: "الرياض، المملكة العربية السعودية",
      },
    };
  }
  return { data };
};
